
<style>

@import url('./css/reset.css');
@import url('./css/form.css');
@import url('./css/borders.css');
@import url('./css/colors.css');
@import url('./css/animations.css');
@import url('./css/flexbox.css');
@import url('./css/modal.css');
@import url('./css/marginPadding.css');

.margin-center {
    margin: 0 auto;
}

.min-width-700 {
    min-width: 700px;
}

.min-width-400 {
    min-width: 400px;
}

.max-width-1366 {
    max-width: 1366px;
}

.max-width-700 {
    max-width: 700px;
}

.max-width-400 {
    max-width: 400px;
}

* {
    font-family: 'Trebuchet MS';
}

.loader {
    border: 5px solid #f3f3f3; /* Light grey */
    border-top: 5px solid #60b4ec; /* Blue */
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
    margin: 30px auto;
}
</style>

<template>
  <div id="app" class="border-dev p-3 max-width-1366 margin-center">
    <h1>Notebook Manager</h1>
    <main-menu></main-menu>
    <router-view></router-view>
    <notice-box></notice-box>
  </div>
</template>

<script>
import MainMenu from "./components/MainMenu.vue";
import EventBus from "./core/EventBus.js";
import NoticeBox from "./components/NoticeBox.vue";

export default {
  name: "App",
  components: {
    MainMenu,
    NoticeBox
  },
  created() {
    // EventBus.$on("route", (data) => {
    //   alert('event bus! route');
    //   console.log(data);
    //   // this.routeTo(data);
    // });
    // EventBus.$on("action", (data) => {
    //   alert('event bus! action');
    //   console.log(data);
    //   // this.runAction(data);
    // });
  },
};
</script>

