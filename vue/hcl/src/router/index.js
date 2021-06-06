import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

const routerDefault = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});
setTimeout(() => {
  router.addRoutes([
    {
      path: "/about",
      name: "About",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "../views/About.vue")
    }
  ]);
  // setTimeout(() => {
  //   console.log("routerDefault.match", routerDefault.match);
  //   router.matcher = routerDefault.matcher;
  // }, 3000);
  console.log("routerDefault.match", router, routerDefault);
  console.log("router match", router.currentRoute);
  console.log("router match resolve", router.resolve({ path: "about" }));
}, 5000);

export default router;
