export default class DialogMessageData {
  type = '';
  title = '';
  subtitle?:string;
  content?: { inputName: string, inputContent: string }[];
  cancelBtnName = '取消';
  confirmBtnName = "確定";
}