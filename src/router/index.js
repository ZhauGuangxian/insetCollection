import Vue from "vue";
import Router from "vue-router";

const Home = () => import(/* webpackChunkName: "Home" */ "@/views/Home");
const NotFound = () => import(/* webpackChunkName: "NotFound" */ "@/views/404");
const ThreeLab = () =>
  import(
    /* webpackChunkName: "ThreeLab" */ "@/views/lab/children/three/threehome.vue"
  );
const CanvasLabHome = () =>
  import(
    /* webpackChunkName: "CanvasLabHome" */ "@/views/lab/children/canvas/canvasHome.vue"
  );
const LabHome = () =>
  import(/* webpackChunkName: "LabHome" */ "@/views/lab/labHome");
Vue.use(Router);

export default new Router({
  base: "/insection/",
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home
    },
    {
      path: "*",
      name: "notFound",
      component: NotFound
    },
    {
      path: "/lab",
      name: "lab",
      component: LabHome,
      children: [
        {
          path: "",
          component: ThreeLab
        },
        {
          path: "threelab",
          name: "threelab",
          component: ThreeLab
        },
        {
          path: "canvaslab",
          name: "canvaslab",
          component: CanvasLabHome
        }
      ]
    }
  ]
});
