<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class App extends Vue {}
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}
html,body,#app {
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
}

/* 用於 rem 排版 */
html {
  font-size: 10px !important;
}

a {
  text-decoration:none;
}
</style>
