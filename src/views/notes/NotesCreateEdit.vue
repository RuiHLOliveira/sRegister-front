<style>
.newLoader {
    color: #60b4ec; /* Blue */
    animation: spin 1s linear infinite;
    margin: 0px auto;
    font-size: 1.5rem;
}

.successIcon {
    color: #60b4ec;/*#60ec7e;*/ /* Blue */
    animation: fadeOut 1s linear infinite;
    animation-delay: 1s;
    margin: 0px auto;
    font-size: 1.5rem;
}
</style>

<template>
  <div class="modal" v-if="noteEditActive">
    <div class="modal_container fullscreen flex-column">
      <div class="mb-3">
        <h2>Note</h2>
      </div>

      <div class="mb-3 flex-column">
        <input name="name" class="form-input" 
          type="text" placeholder="name" 
          v-model="localNoteName">
      </div>

      <div class="mb-3 flex-column">
        <textarea 
          name="content" id="content" class="textarea"
          v-model="localNoteContent" 
          
          > <!-- @input="autoGrow($event)" -->
        </textarea>
      </div>

      <div class="mb-3">
        <button class="btn" @click="closeModal()">close</button>
      </div>
      
      <div class="flex-row">
        <div class="ml-2">
            <div class="newLoader" v-if="busy"><i class="fas fa-spinner"></i></div>
        </div>
        <div class="ml-2">
            <div class="successIcon" v-if="success"><i class="fas fa-check"></i></div>
        </div>
      </div>

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
  data: function () {
    return {
      busy: true,
      success: false,
      localNote: null,
      localNoteName: null,
      localNoteContent: null,
      abortController: null,
      debounceTimer: [],
    };
  },
  props: ["noteEditActive", "note"],
  computed: {},
  methods: {
    successIcon() {
      this.success = true;
      let thisinstance = this;
      setTimeout(function () {
        thisinstance.success = false;
      }, 2000);
    },
    closeModal() {
      this.$emit("update:noteEditActive", false);
      this.localNote = null;
    },
    createdUpdatedEvent() {
      this.$emit("update:note", {});//this.localNote);
    },
    createNoteSuccess(object) {
      this.localNote.id = object.id;
      this.busy = false;
      this.successIcon();
      this.createdUpdatedEvent();
      // this.closeModal();
      // notify.notify(object.message,'success');
    },
    updateNoteSuccess(object) {
      this.busy = false;
      this.successIcon();
      this.createdUpdatedEvent();
      // this.closeModal();
      // notify.notify(object.message,'success');
    },
    deletedNoteSuccess(object) {
      this.busy = false;
      this.createdUpdatedEvent();
      this.closeModal();
      notify.notify(object.message, "success");
    },
    saveNote() {
      if (this.localNote.id == null) {
        this.createNote();
      } else {
        this.updateNote();
      }
    },
    createNote() {
      this.busy = true;
      this.localNote.name = this.localNoteName;
      this.localNote.content = this.localNoteContent;
      const headers = new Headers();
      let requestData = {};
      const data = {
        name: this.localNote.name,
        content: this.localNote.content,
      };
      requestData["url"] =
        config.serverUrl + `/api/${this.localNote.notebook.id}/notes`;
      requestData["headers"] = headers;
      requestData["method"] = "POST";
      requestData["data"] = data;

      request
        .fetch(requestData)
        .then(([response, json]) => {
          this.createNoteSuccess({ message: "Note created!", id: json.note.id });
        })
        .catch((error) => {
          console.error(error);
          this.busy = false;
          notify.notify(error, "error");
        });
    },
    updateNote() {
      this.busy = true;
      this.localNote.name = this.localNoteName;
      this.localNote.content = this.localNoteContent;
      const headers = new Headers();

      let requestData = {};
      const data = {
        name: this.localNote.name,
        content: this.localNote.content,
      };
      requestData["url"] =
        config.serverUrl +
        `/api/${this.localNote.notebook.id}/notes/${this.localNote.id}`;
      requestData["headers"] = headers;
      requestData["method"] = "PUT";
      requestData["data"] = data;

      request
        .fetch(requestData)
        .then(([response, json]) => {
          this.updateNoteSuccess({ message: "Note updated!" });
        })
        .catch((error) => {
          console.error(error);
          this.busy = false;
          notify.notify(error, "error");
        });
    },
    deleteNote() {
      this.busy = true;
      const headers = new Headers();

      let requestData = {};
      const postData = {};

      requestData["url"] =
        config.serverUrl + `/api/notes/${this.localNote.id}/`;
      requestData["headers"] = headers;
      requestData["method"] = "DELETE";
      requestData["data"] = postData;

      request
        .fetch(requestData)
        .then(([response, json]) => {
          this.localNote.completed = true;
          this.localNote["message"] = json.message;
          this.deletedNoteSuccess(this.localNote);
        })
        .catch((error) => {
          this.busy = false;
          notify.notify(error, "error");
        });
    },
    // autoGrow(event) {
    //   let element = event.target;
    //   element.style.height = "5px";
    //   element.style.height = element.scrollHeight + "px";
    // },
    defineTextareaSize(){
        let contentTextArea = document.getElementById('content');
        if(contentTextArea != null) {
          contentTextArea.style.height = "5px";
          contentTextArea.style.height = contentTextArea.scrollHeight + "px";
        }
    },
    debouncer(vueInstance, fn, waitTime = 1000) {
      // let vue = this;
      let time = null;
      if (
        this.debounceTimer[fn] != null ||
        this.debounceTimer[fn] != undefined
      ) {
        time = this.debounceTimer[fn];
      }
      clearTimeout(time);
      time = setTimeout(() => {
        vueInstance[fn](); //runs the function after the time
        this.debounceTimer[fn] = null; //clear the timer of this request
      }, waitTime);
      this.debounceTimer[fn] = time;
    },
  },
  watch: {
    // whenever noteEditActive changes, this function will run
    noteEditActive: function (newProp, oldProp) {
      if (newProp && !oldProp) {
        this.localNote = Object.assign({}, this.note);
        this.localNoteName = this.localNote.name;
        this.localNoteContent = this.localNote.content;
      }
    },
    localNoteName: function (newProp, oldProp) {
      if (oldProp !== null) {
        this.localNote.name = newProp;
        this.debouncer(this, "saveNote");
      }
    },
    localNoteContent: function (newProp, oldProp) {
      // this.defineTextareaSize();
      if (oldProp !== null) {
        this.localNote.content = newProp;
        this.debouncer(this, "saveNote");
      }
    },
  },
  created() {
    this.busy = false;
  },
  updated() {
    this.defineTextareaSize();
  }
};
</script>
