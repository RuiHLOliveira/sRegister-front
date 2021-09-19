import Vue from 'vue'
import App from './App.vue'
import router from './router.js';

Vue.config.productionTip = false

Vue.directive('focus', {
  // Quando o elemento vinculado é inserido no DOM...
  inserted: function (el) {
    // Coloque o foco no elemento
    el.focus()
  }
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
