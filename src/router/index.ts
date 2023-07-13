// Composables
import { createRouter, createWebHistory, routerKey } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/default/Default.vue"),
    children: [
      {
        path: "",
        name: "Home",
        meta: {
          title: "Azure OpenAI ChatGPT Web",
        },
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/Home.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from) => {
  if (to.meta.title) {
    document.title = to.meta.title as string;
  }
});

export default router;
