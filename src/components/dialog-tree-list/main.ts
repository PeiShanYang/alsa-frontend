import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import { VueTreeList, Tree, TreeNode } from 'vue-tree-list';
import Api from '@/services/api.service';
import { ListFolderResData } from '@/io/rest/listFolder';
import DialogMessage from '@/components/dialog-message/DialogMessage.vue';
import DialogMessageData from '@/io/dialogMessageData';

class nodeAttr {
  name = '';
  id = '';
  pid = '';
  isLeaf = false;
  dragDisabled = true;
  addTreeNodeDisabled = true;
  addLeafNodeDisabled = true;
  editNodeDisabled = true;
  delNodeDisabled = true;
  children: nodeAttr[] = [];
  editable = false;
}


@Component({
  components: {
    "vue-tree-list": VueTreeList,
    "dialog-message": DialogMessage,
  }
})
export default class DialogTreeList extends Vue {
  @Prop() private dialogOpen!: boolean;
  @Prop() private messageData!: { rootPath: string, title: string, content: string };

  @Emit("cancel-action")
  handleCancelAction(): void {
    return;
  }

  @Emit("confrim-action")
  handleConfrimAction(): string {
    return this.messageData.content
  }

  private deleteFolderDialog = false;
  private deleteFolderDialogData: DialogMessageData = new DialogMessageData()
  private modelToDelete = null;


  private baseNode = new nodeAttr
  private baseChildren: nodeAttr[] = []
  private baseTree = {
    ...this.baseNode,
    name: this.messageData.rootPath,
    id: this.messageData.rootPath,
    pid: '0',
    editNodeDisabled: true,
    delNodeDisabled: true,
    children: this.baseChildren

  }
  private treeData = new Tree([this.baseTree])


  mounted(): void {
    this.waitGetTreeList()
  }

  private async waitGetTreeList(): Promise<void> {

    const response = await Api.listFolder(this.messageData.rootPath)

    response.forEach(item => {
      this.treeDataSetting(item)
    })

  }

  private createNodeInstance(folderName: string, folderFullPath: string, rootPath: string): nodeAttr {

    const nodeName = folderName
    const nodeId = folderFullPath

    const splitPath = nodeId.split('/')
    splitPath.pop()
    const nodePid = splitPath.join('/') === '' ? rootPath : splitPath.join('/')

    return {
      ...this.baseNode,
      name: nodeName,
      id: nodeId,
      pid: nodePid
    }

  }

  private initialAllNodes(folderData: ListFolderResData, childCollection: nodeAttr[]): void {

    if (!folderData.children) return

    const nodeNameCollation = childCollection.map(item => item.name)
    if (nodeNameCollation.indexOf(folderData.name) === -1) {
      const currentNode = this.createNodeInstance(folderData.name, folderData.fullpath, this.messageData.rootPath)
      childCollection.push(currentNode)
    }

    const childNodes = folderData.children.map(item => this.createNodeInstance(item.name, item.fullpath, this.messageData.rootPath))
    childCollection.push(...childNodes)

    folderData.children.forEach(item => this.initialAllNodes(item, childCollection))

  }

  private wrapChildNode(childCollection: nodeAttr[], rootPath: string): nodeAttr[] {

    // childCollection.forEach(item => console.log('id:',item.id,'name:',item.name,'pid:',item.pid))

    const mainChidren: nodeAttr[] = []

    const pidCollection = [...new Set(childCollection.map(item => item.pid))]

    pidCollection.forEach(pid => {

      const childNodes = childCollection.filter(element => element.pid === pid)

      const parentNode = childCollection.find(element => element.id === pid)

      if (parentNode) parentNode.children = childNodes

    })

    return childCollection.filter(element => element.pid === rootPath)

  }


  private treeDataSetting(folderData: ListFolderResData): void {

    const childCollection: nodeAttr[] = []

    this.initialAllNodes(folderData, childCollection)

    this.baseTree.children = this.wrapChildNode(childCollection, this.messageData.rootPath)

    this.treeData = new Tree([this.baseTree])

  }


  private handleCeckFolder(targetModel: any): void {

    console.log("target", targetModel)

    if(targetModel.id !== this.messageData.rootPath){
      this.messageData.content = this.messageData.rootPath + '/' + targetModel.id
    }else{
      this.messageData.content = this.messageData.rootPath
    }

  }

  private async addNewFolder(parentModel: any): Promise<void> {

    const childName = `new folder-${new Date().valueOf()}`


    const response = await Api.createFolder(this.messageData.rootPath, parentModel.id, childName)
    if (!response) return

    let childId = ''
    if (parentModel.id !== this.messageData.rootPath) {
      childId = parentModel.id + '/' + childName
    } else {
      childId = childName
    }

    const child = {
      ...this.baseNode,
      name: childName,
      id: childId,
      pid: parentModel.id,
      children: this.baseChildren
    }

    const node = new TreeNode(child)

    parentModel.addChildren(node)
  }

  private askDeleteFolder(nodeModel: any): void {

    const title = `確定刪除資料夾 ${nodeModel.name} ?`

    this.deleteFolderDialogData = {
      ...this.deleteFolderDialogData,
      type: 'warning',
      title,
    }

    this.modelToDelete = nodeModel
    this.deleteFolderDialog = true
  }
  private async confirmDelete(): Promise<void> {

    if (this.modelToDelete === null) return
    await this.deleteFolder(this.modelToDelete)

    this.modelToDelete = null
    this.deleteFolderDialog = false
  }

  private async deleteFolder(nodeModel: any): Promise<void> {

    const splitPath = nodeModel.id.split('/')
    splitPath.pop()
    const root = splitPath.join('/')

    const response = await Api.removeFolder(this.messageData.rootPath, root, nodeModel.name)
    if (!response) return

    nodeModel.remove()

  }

  private async setUnEditable(nodeModel: any): Promise<void> {

    nodeModel.editable = false

    const splitPath = nodeModel.id.split('/')
    splitPath.pop()
    const root = splitPath.join('/')

    const oldFolderName = nodeModel.id.split('/').pop()
    const newFolderName = nodeModel.name

    const response = await Api.renameFolder(this.messageData.rootPath, root, oldFolderName, newFolderName)
    if (!response) return

    this.waitGetTreeList()

    // nodeModel.changeName(newFolderName)
    // splitPath.push(newFolderName)
    // nodeModel.id = splitPath.join('/')

  }


}