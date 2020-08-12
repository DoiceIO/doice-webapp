import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import Home from "@/routes/Home";
import Room from "@/routes/Room";

export default new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home
    },
    {
      path: "/:roomId",
      name: "Room",
      component: Room
    }
  ]
});
