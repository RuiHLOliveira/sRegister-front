<style>
</style>

<template>
  <nav class="flex-row mt-3 border-bottom-gray pb-3">
    <router-link class="btn mr-1" to="/">Login</router-link>
    <router-link class="btn mr-1" v-if="isLoggedIn" to="/home">Home</router-link>
    <router-link class="btn mr-1" v-if="isLoggedIn" to="/notebooks">Notebooks</router-link>
    <a href="#" class="btn mr-1" v-if="isLoggedIn" @click="exportData()">Export Data</a>
    <a href="#" class="btn mr-1" v-if="isLoggedIn" @click="logout()">Logout</a>
  </nav>
</template>

<script>
import EventBus from "../core/EventBus";
import config from "../core/config";
import request from "../core/request";
import notify from "../core/notify";
import auth from "../core/Auth";

export default {
  name: "MainMenu",
  components: {
  },
  data() {
    return {
      isLoggedIn: auth.isLoggedIn(),
      busy: false,
    };
  },
  created () {
    EventBus.$on('LOGIN', (data) => {
      this.isLoggedIn = true;
    })
    EventBus.$on('LOGOUT', (data) => {
      this.isLoggedIn = false;
      auth.invalidateSession();
      this.$router.go("/login");
    })
  },
  methods: {
    finishLogout(){
        this.busy = false;
        EventBus.$emit('LOGOUT',{});
    },
    exportData() {
      this.busy = true;
      const headers = new Headers();
      let requestData = {};
      requestData["url"] = config.serverUrl + "/api/backup/export";
      requestData["method"] = "GET";
      requestData["headers"] = headers;
      request.fetch(requestData)
      .then(([response, json]) => {
        console.log('response',response);
        console.log('json',json);
        notify.notify('Arquivo Exportado para download', "success");

        const blob = new Blob([JSON.stringify(json)], { type: 'application/json' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = 'export.json'
        link.click()
        URL.revokeObjectURL(link.href)
        
      })
      .catch((error) => {
        console.error(error);
        notify.notify(error, "error");
      });

    },
    logout() {
      this.busy = true;

      const headers = new Headers();
      let requestData = {};

      headers.append("Authorization", auth.getCredentials().token);
      headers.append("Content-Type", "application/json");

      requestData["url"] = config.serverUrl + "/auth/logout";
      requestData["method"] = "POST";
      requestData["headers"] = headers;
      requestData["data"] = {
        refresh_token: auth.getCredentials().token,
        token: auth.getCredentials().refreshToken,
      };

      request
      .fetch(requestData)
      .then(([response, json]) => {
        this.finishLogout();
      })
      .catch((error) => {
        this.finishLogout();
        notify.notify(error, "error");
      });
    },
  },
};
</script>
