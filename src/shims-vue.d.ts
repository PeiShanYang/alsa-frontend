declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

// 宣告全域的 window，不然使用 window.xx 會報錯
declare let window: Window;
declare let document: Document;

declare module 'element-ui/lib/locale/lang/en'

declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'
declare module 'vue-tree-list'

