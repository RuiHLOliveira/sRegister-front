<style>
</style>

<template>
  <div class="modal flex-column" v-if="createFormActive">
    <div class="modal_container md flex-column">
      <div class="mb-3">
          <h2>New Notebook</h2>
      </div>

      <div class="mb-3">
          <input id="notebookName" class=""
            type="text" placeholder="name"
            v-model="notebookName" v-focus
            @keyup.enter="createNotebook()"
          />
      </div>

      <div class="mb-3">
        <button class="mr-1 btn red" @click="closeModal()">Cancel</button>
        <button class="mr-1 btn green" @click="createNotebook()">Save</button>
      </div>

      <div class="loader" v-if="busy"></div>
    </div>
  </div>
</template>

<script>
import EventBus from "../../core/EventBus";
import config from "../../core/config";
import notify from "../../core/notify";
import request from "../../core/request";
import auth from "../../core/Auth";

export default {
  data () {
    return {
      busy: true,
      notebookName: null,
      newNotebook: null,
    };
  },
  props: ["createFormActive", "createdNotebook"],
  computed: {},
  methods: {
    closeModal() {
      this.$emit("update:createFormActive", false);
      this.newNotebook = null;
      this.notebookName = null;
    },
    createdEvent() {
      this.$emit("update:createdNotebook", {});//this.newNotebook);
    },
    createdNotebookSuccess(object) {
      this.busy = false;
      // this.newNotebook = object.notebook;
      this.createdEvent();
      this.closeModal();
      if (object.message == undefined)
        object.message = "Created a new notebook successfully!";
      notify.notify(object.message, "success");
    },
    createNotebook() {
      this.busy = true;
      let requestData = {};
      const headers = new Headers();
      requestData["url"] = config.serverUrl + "/api/notebooks";
      requestData["method"] = "POST";
      requestData["headers"] = headers;
      requestData["data"] = {
        name: this.notebookName,
      };
      request
        .fetch(requestData)
        .then(([response, dados]) => {
          this.busy = false;
          notify.notify(dados.message, "success");
          this.createdNotebookSuccess(dados);
        })
        .catch((error) => {
          this.busy = false;
          notify.notify(error, "error");
        });
    },
  },
  created() {
    this.busy = false;
  },
};
</script>