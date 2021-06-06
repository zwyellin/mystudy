import Vue from "vue";

import router from "./router";
// import store from "./store";

import App from "./App.vue";

Vue.config.productionTip = false;
console.log("start", App);
new Vue({
  router,
  // store,
  hcl: "hcl",
  data() {
    return {
      app1: "app1"
    };
  },
  render: h => h(App)
}).$mount("#app");
// new Vue()
