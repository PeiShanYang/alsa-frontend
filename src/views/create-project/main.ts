import { Component, Vue } from 'vue-property-decorator';
import DialogImportKey from '@/components/dialog-import-key/DialogImportKey.vue';



@Component({
    components: {
        "dialog-import-key": DialogImportKey,
    }
})
export default class HelloWorld extends Vue {
    private openDialogImportKey = false;

    private closeDialogImportKey(): void {
        this.openDialogImportKey = false;
    }
    private createProjectByKey(): void{
        this.openDialogImportKey = false;
    }
}