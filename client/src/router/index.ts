import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import { userStore } from "@/store";
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
    path: "/register",
    name: "Register",
    component: () => import(/* webpackChunkName: "register" */ "@/views/Register.vue")
  },
  {
    path: "/about",
    name: "About",
    component: () => import(/* webpackChunkName: "about" */ "@/views/About.vue")
  },
  {
    path: "/forbidden",
    name: "Forbidden",
    component: () => import(/* webpackChunkName: "forbidden" */ "@/views/Forbidden.vue")
  },
  {
    path: "/workspace/create",
    name: "WorkspaceCreate",
    props: () => ({ editMode: false }),
    component: () => import(/* webpackChunkName: "createWorkspace" */ "@/views/CreateWorkspace.vue")
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
        name: "Items",
        alias: "items",
        props: {
          search: true
        },
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
      },
      {
        path: "item/:itemId",
        name: "Item",
        props: route => ({
          id: parseInt(route.params.itemId)
        }),
        component: () =>
          import(
            /* webpackChunkName: "item" */
    
            "@/components/item/Item.vue"
          )
      },
      {
        name: "Connections",
        path: "connections",
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
        path: "graph",
        name: "Graph",
        meta: {
          graph: true
        },
        component: () =>
          import(
            /* webpackChunkName: "graphView" */

            "@/components/graph/GraphView.vue"
          ),
        props: route => ({
          all: "all" in route.query,
          itemId: parseInt(route.query.itemId as string)
        })
      },
      {
        path: "settings",
        name: "WorkspaceSettings",
        meta: { requiresAuth: true },
        props: route => ({
          workspaceId: parseInt(route.params.workspaceId)
        }),
        component: () =>
          import(
            /* webpackChunkName: "workspaceSettings" */

            "@/components/workspace/WorkspaceSettings.vue"
          )
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(async (to, _from, next) => {
  if (to.meta?.requiresAuth && !userStore.getters.isAuthenticated()) {
    // the user still might be authenticated
    // since the store is reset on page refresh
    try {
      const result = await userService.getCurrent();
      if ("success" in result) {
        // set the user in store
        userStore.mutations.setUser(result.data);
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
