<template>
  <div class="margin-center max-width-400 m-1 p-1">
    <form @submit.prevent="login" class="flex-column">
      <h1>Please sign in</h1>

      <label class="mt-2" for="inputEmail">Email</label>
      <input
        class="form-input mt-2"
        :disabled="busy"
        v-model="email"
        type="email"
        name="email"
        id="inputEmail"
        required
        autofocus
      />

      <label class="mt-2" for="inputPassword">Password</label>
      <input
        class="form-input mt-2"
        :disabled="busy"
        v-model="password"
        type="password"
        name="password"
        id="inputPassword"
        required
      />

      <button class="mt-2 btn" :disabled="busy" type="submit">Sign in</button>

      <div class="loader" v-if="busy"></div>
    </form>
  </div>
</template>

<script>
import EventBus from "../core/EventBus";
import config from "../core/config";
import request from "../core/request";
import notify from "../core/notify";
import auth from "../core/Auth";

export default {
  name: "Login",
  data() {
    return {
      isLoggedIn: auth.isLoggedIn(),
      busy: false,
      email: "",
      password: "",
    };
  },
  created() {
    console.log('isLoggedIn',this.isLoggedIn)
    if(this.isLoggedIn == true) {
        this.$router.push("/notebooks");
    }
  },
  methods: {
    login() {
      this.busy = true;
      let requestData = {};
      const headers = new Headers();
      requestData["url"] = config.serverUrl + "/auth/login";
      requestData["method"] = "POST";
      requestData["headers"] = headers;
      requestData["data"] = {
        email: this.email,
        password: this.password,
      };

      request
      .fetch(requestData)
      .then(([response, json]) => {
        this.busy = false;
        auth.storeCredentials(json.token,json.refresh_token);
        notify.notify(json.message, "success");
        EventBus.$emit('LOGIN',{});
        this.$router.push("/notebooks");
      })
      .catch((error) => {
        console.error(error);
        this.busy = false;
        notify.notify(error, "error");
      });
    },
  },
};
</script>

<style>
</style>