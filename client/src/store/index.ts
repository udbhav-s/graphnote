import Vue from "vue";
import { userService } from "@/services/dataService";
import { Credentials } from "@/types/credentials";
import { User } from "@/types/user";
import { Workspace } from "@/types/workspace";

const store = Vue.observable({
  user: {} as User,
  workspace: {} as Workspace
});

export const user = {
  getters: {
    user: () => store.user,
    isAuthenticated: () => store.user && store.user.id
  },

  mutations: {
    async register(credentials: Credentials) {
      // send register request
      const result = await userService.register({
        username: credentials.username.trim(),
        password: credentials.password.trim()
      });
      if (!result.success) throw result.error;
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
      if (!result.success) throw result.error;
      // send request for user details
      const currentUser = await userService.getCurrent();
      if (!currentUser.success) throw currentUser.error;
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

export const workspace = {
  getters: {
    workspace: () => store.workspace
  },

  mutations: {
    setWorkspace(workspace: Workspace) {
      store.workspace = workspace;
    }
  }
};

export default {
  store,
  user,
  workspace
};
