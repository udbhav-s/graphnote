<template>
  <section class="hero is-fullheight">
    <div class="hero-body">
      <div class="container has-text-centered">
        <div class="column is-4 is-offset-4">
          <h2 class="title">Register</h2>
          <div class="box">
            <div class="field">
              <div class="control">
                <input
                  class="input"
                  type="text"
                  name="username"
                  v-model="form.username"
                  placeholder="Username"
                />
              </div>
            </div>
            <div class="field">
              <div class="control">
                <input
                  class="input"
                  type="password"
                  name="password"
                  v-model="form.password"
                  placeholder="Password"
                />
              </div>
            </div>
            <button
              @click="register"
              class="button is-block is-fullwidth is-primary"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { reactive, defineComponent } from "@vue/composition-api";
import { userStore } from "@/store";

export default defineComponent({
  name: "Login",

  setup(props, { root }) {
    const form = reactive({
      username: "",
      password: ""
    });

    function register() {
      userStore.mutations
        .register(form)
        .then(() => root.$router.push({ name: "Login" }))
        .catch(err => {
          root.$toasted.error("Error registering: " + err.message);
        });
    }

    return {
      form,
      register
    };
  }
});
</script>
