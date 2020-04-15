import Vue from 'vue';
import { userService } from "@/services/dataService";
import { Credentials } from '@/types/credentials';
import { User } from '@/types/user';

const store = Vue.observable({
  user: {} as User
});

export const getters = {
  user: () => store.user,
}

export const mutations = {
  async register(credentials: Credentials) {
    // send register request
    let result = await userService.register({
      username: credentials.username.trim(),
      password: credentials.password.trim()
    });
    if (!result.success) throw result.error;
  },

  async login(credentials: Credentials) {
    // send login request
    let result = await userService.login({
      username: credentials.username.trim(),
      password: credentials.password.trim()
    });
    if (!result.success) throw result.error;
    // send request for user details
    let currentUser = await userService.getCurrent();
    if (!currentUser.success) throw currentUser.error;
    // commit user to state
    const user = currentUser.data;
    store.user = user;
  },

  async logout() {
    const result = await userService.logout();
    if (!result.success) throw result;
    store.user = {} as User;
  },

  async checkAuth() {
    if (store.user && store.user.id) {
      return true;
    }
    // if state.user is not set
    const result = await userService.getCurrent();
    if (!result.success) {
      if (result.status === 401) return false;
      else {
        throw result.error;
      }
    }
    // if user was logged in
    else {
      const user = result.data;
      store.user = user;
      return true;
    }
  }
}

export default {
  store,
  getters,
  mutations
}