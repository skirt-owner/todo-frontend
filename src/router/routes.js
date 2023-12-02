const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/TodosPage.vue"),
      },
      {
        path: ":id",
        component: () => import("pages/TodoPage.vue"),
        props: true,
      },
      {
        path: "create",
        component: () => import("pages/CreateTodoPage.vue"),
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
