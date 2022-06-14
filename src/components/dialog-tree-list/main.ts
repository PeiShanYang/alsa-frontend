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

  private setFolderNameDialog = false;
  private setFolderNameDialogData: DialogMessageData = new DialogMessageData()
  private modelToName = null;
  private modelToNameAction = '';


  private rootPath = '.'
  private baseNode = new nodeAttr
  private baseChildren: nodeAttr[] = []
  private baseTree = {
    ...this.baseNode,
    name: this.rootPath,
    id: this.rootPath,
    pid: '0',
  }
  private treeData = new Tree([this.baseTree])


  mounted(): void {
    this.waitGetTreeList()
  }

  private async waitGetTreeList(): Promise<void> {

    const response = await Api.listFolder(this.messageData.rootPath)

    if(response.children?.length === 0) return
  
    this.treeDataSetting(response)

  }

  private createNodeInstance(folderName: string, folderFullPath: string): nodeAttr {

    const nodeName = folderName
    const nodeId = folderFullPath

    const splitPath = nodeId.split('/') ?? '0'
    splitPath.pop()

    let nodePid = ''

    if (nodeName === this.rootPath) {
      nodePid = '0'
    } else if (splitPath.length === 0) {
      nodePid = this.rootPath
    } else {
      nodePid = splitPath.join('/')
    }

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
      const currentNode = this.createNodeInstance(folderData.name, folderData.fullpath)
      childCollection.push(currentNode)
    }

    const childNodes = folderData.children.map(item => this.createNodeInstance(item.name, item.fullpath))
    childCollection.push(...childNodes)

    folderData.children.forEach(item => this.initialAllNodes(item, childCollection))

  }

  private wrapChildNode(childCollection: nodeAttr[]): nodeAttr[] {

    const mainChidren: nodeAttr[] = []

    const pidCollection = [...new Set(childCollection.map(item => item.pid))]

    pidCollection.forEach(pid => {

      const childNodes = childCollection.filter(element => element.pid === pid)

      const parentNode = childCollection.find(element => element.id === pid)

      if (parentNode) parentNode.children = childNodes

    })

    return childCollection.filter(element => element.pid === '0')

  }


  private treeDataSetting(folderData: ListFolderResData): void {

    const childCollection: nodeAttr[] = []

    this.initialAllNodes(folderData, childCollection)

    this.baseTree.children = this.wrapChildNode(childCollection)

    this.treeData = new Tree(this.wrapChildNode(childCollection))

  }


  private handlePickFolder(targetModel: any): void {

    // console.log("target", targetModel)

    this.messageData.content = targetModel.id

  }

  private async handleCreateFolder(parentModel: any, folderName: string): Promise<void> {

    // const childName = `new folder-${new Date().valueOf()}`
    const childName = folderName

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


  private async handleDeleteFolder(nodeModel: any): Promise<void> {

    const splitPath = nodeModel.id.split('/')
    splitPath.pop()
    const root = splitPath.join('/')

    const response = await Api.removeFolder(this.messageData.rootPath, root, nodeModel.name)
    if (!response) return

    nodeModel.remove()

  }

  private async handleRenameFolder(nodeModel: any, folderName: string): Promise<void> {

    nodeModel.editable = false

    const splitPath = nodeModel.id.split('/')
    splitPath.pop()
    const root = splitPath.join('/')

    const oldFolderName = nodeModel.id.split('/').pop()
    const newFolderName = folderName
    // const newFolderName = nodeModel.name

    const response = await Api.renameFolder(this.messageData.rootPath, root, oldFolderName, newFolderName)
    if (!response) return

    this.waitGetTreeList()

    // nodeModel.changeName(newFolderName)
    // splitPath.push(newFolderName)
    // nodeModel.id = splitPath.join('/')

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
    await this.handleDeleteFolder(this.modelToDelete)

    this.modelToDelete = null
    this.deleteFolderDialog = false
  }

  private askFolderName(nodeModel: any, action: string): void {

    this.setFolderNameDialogData = {
      ...this.setFolderNameDialogData,
      content: [{ inputName: "請輸入資料夾名稱", inputContent: "" }],
    }

    this.modelToName = nodeModel
    this.modelToNameAction = action
    this.setFolderNameDialog = true
  }

  private async confirmFolderName(content: { inputName: string, inputContent: string }[]): Promise<void> {

    const folderName = content.find(item => item.inputName === "請輸入資料夾名稱")?.inputContent

    if (!folderName || folderName === "") return

    if (this.modelToNameAction === '' && this.modelToName === null) return

    if (this.modelToNameAction === 'createFolder') await this.handleCreateFolder(this.modelToName, folderName)
    if (this.modelToNameAction === 'renameFolder') await this.handleRenameFolder(this.modelToName, folderName)

    this.modelToName = null
    this.modelToNameAction = ''
    this.setFolderNameDialog = false

  }

}