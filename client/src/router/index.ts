import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import { user } from "@/store";
import { userService } from "@/services/dataService";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: "/login",
    name: "Login",
    component: () => import(/* webpackChunkName: "login" */ "@/views/Login.vue")
  },
  {
    path: "/about",
    name: "About",
    component: () => import(/* webpackChunkName: "about" */ "@/views/About.vue")
  },
  {
    path: "/workspace/:workspaceId",
    meta: { requiresAuth: true },
    component: () =>
      import(/* webpackChunkName: "workspace" */ "@/views/Workspace.vue"),
    props: route => ({
      id: parseInt(route.params.workspaceId)
    }),
    children: [
      {
        path: "/",
        name: "Connections",
        alias: "connections",
        component: () =>
          import(
            /* webpackChunkName: "connectionList" */

            "@/components/connection/ConnectionList.vue"
          )
      },
      {
        path: "connection/create",
        name: "CreateConnection",
        component: () =>
          import(
            /* webpackChunkName: "connectionEditor" */

            "@/components/connection/ConnectionEditor.vue"
          ),
        props: () => ({ redirect: true })
      },
      {
        path: "connection/edit/:id",
        name: "EditConnection",
        component: () =>
          import(
            /* webpackChunkName: "connectionEditor" */

            "@/components/connection/ConnectionEditor.vue"
          ),
        props: route => ({
          editId: parseInt(route.params.id),
          redirect: true
        })
      },
      {
        path: "items",
        name: "Items",
        component: () =>
          import(
            /* webpackChunkName: "itemList" */

            "@/components/item/ItemList.vue"
          )
      },
      {
        path: "item/create",
        name: "CreateItem",
        component: () =>
          import(
            /* webpackChunkName: "itemEditor" */

            "@/components/item/ItemEditor.vue"
          ),
        props: () => ({ redirect: true })
      },
      {
        path: "item/edit/:id",
        name: "EditItem",
        component: () =>
          import(
            /* webpackChunkName: "itemEditor" */

            "@/components/item/ItemEditor.vue"
          ),
        props: route => ({
          editId: parseInt(route.params.id),
          redirect: true
        })
      }
    ]
  },
  {
    path: "/item/:id",
    name: "Item",
    meta: { requiresAuth: true },
    props: route => ({
      id: parseInt(route.params.id)
    }),
    component: () =>
      import(
        /* webpackChunkName: "item" */

        "@/components/item/Item.vue"
      )
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(async (to, _from, next) => {
  if (to.meta?.requiresAuth && !user.getters.isAuthenticated()) {
    // the user still might be authenticated
    // since the store is reset on page refresh
    try {
      const result = await userService.getCurrent();
      if (result.success) {
        // set the user in store
        user.mutations.setUser(result.data);
        // continute to route
        return next();
      } else return next({ name: "Login" });
    } catch (error) {
      // if not authenticated redirect to login
      return next({ name: "Login" });
    }
  } else return next();
});

export default router;
