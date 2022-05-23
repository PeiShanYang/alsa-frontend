import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import DialogMessageData from '@/io/dialogMessageData';

@Component
export default class DialogMessage extends Vue {
  @Prop() private dialogOpen!: boolean;
  @Prop() private messageData!: DialogMessageData;

  @Emit("cancel-action")
  handleCancelAction(): void {
    return;
  }

  @Emit("confrim-action")
  handleConfrimAction(): { inputName: string, inputContent: string }[]{

    if (!this.messageData.content) return []

    return this.messageData.content;
  }

  get typeIcon(): string {

    let iconClass = ''

    switch (this.messageData.type) {
      case 'warning':
        iconClass = 'el-icon-warning';
        break;
      case 'info':
        iconClass = 'el-icon-info';
        break;
      case 'success':
        iconClass = 'el-icon-success';
        break;
      case 'error':
        iconClass = 'el-icon-error';
        break;
      default:
        iconClass = '';
    }

    return iconClass
  }

  get typeColor(): string {

    let iconColor = ''

    switch (this.messageData.type) {
      case 'warning':
        iconColor = 'color:#DE1743';
        break;
      case 'info':
        iconColor = 'color:#DCE0EC';
        break;
      case 'success':
        iconColor = 'color:#DCE0EC';
        break;
      case 'error':
        iconColor = 'color:#DE1743';
        break;
      default:
        iconColor = '';
    }

    return iconColor
  }


}