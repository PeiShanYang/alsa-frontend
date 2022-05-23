export default class DialogMessageData {
  type = '';
  title = '';
  content?: { inputName: string, inputContent: string }[];
  cancelBtnName = '取消';
  confirmBtnName = "確定";
}