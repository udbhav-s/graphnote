import Vue from "vue";
import { userService, workspaceService } from "@/services/dataService";
import { User, Credentials, Workspace } from "@/types";

const store = Vue.observable({
  user: {} as User,
  workspace: {} as Workspace
});

export const userStore = {
  getters: {
    user: () => store.user,
    isAuthenticated: () => !!(store.user && store.user.id)
  },

  mutations: {
    async register(credentials: Credentials) {
      // send register request
      const result = await userService.register({
        username: credentials.username.trim(),
        password: credentials.password.trim()
      });
      if (!("success" in result)) throw result;
    },

    setUser(user: User) {
      store.user = user;
    },

    async login(credentials: Credentials) {
      // send login request
      const result = await userService.login({
        username: credentials.username.trim(),
        password: credentials.password.trim()
      });
      if (!("success" in result)) throw result;

      // send request for user details
      const currentUser = await userService.getCurrent();
      if (!("success" in currentUser)) throw currentUser;

      // commit user to state
      this.setUser(currentUser.data);
    },

    async logout() {
      const result = await userService.logout();
      if (!result.success) throw result;
      store.user = {} as User;
    }
  }
};

export const workspaceStore = {
  getters: {
    workspace: () => store.workspace
  },

  mutations: {
    setId(id: number) {
      store.workspace.id = id;
    },

    setWorkspace(workspace: Workspace) {
      store.workspace = workspace;
    },

    async loadWorkspace(id: number) {
      // set id so the other things can reference before workspace is loaded
      this.setId(id);
      // load the workspace
      const result = await workspaceService.getById(id);
      if ("success" in result) this.setWorkspace(result.data);
      else throw result;
    },

    async reloadWorkspace() {
      return await this.loadWorkspace(store.workspace.id);
    }
  }
};

export default {
  store,
  userStore,
  workspaceStore
};
