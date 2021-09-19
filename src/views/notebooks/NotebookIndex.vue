<style>

.notebookItem {
  cursor: pointer;
  background: #aaccff55;
}

.notebookItem:hover {
  background: #aaccff88;
}

.border-black {
  border: 1px solid black;
}
.leftbar {
  background-color: #aaccff55;
}

.notebookTitle {
  font-size: 2rem;
}

.subsession-title {
  font-size: 1.5rem;
}

.min-width-300 {
  min-width: 300px;
}
</style>

<template>
  <div class="flex-row mt-5 border-dev">

    <div class="min-width-300 mr-5">
      <div class="subsession-title">
        <span class="mr-2">Notebooks</span>
        <button class="btn" @click="showCreateForm()"> + New notebook</button>
      </div>
      
      <div class="mt-3">
        <div class="loader" v-if="busy"></div>
        <div v-else>
          <div v-if="notebooks.length == 0">
            There are no notebooks!
          </div>
          <div v-else>
            <div
              v-for="notebook in notebooks"
              :key="notebook.id"
              @click="openNotebook(notebook)"
              class="notebookItem mt-1 p-2 round-1">
              <div>{{ notebook.name }}</div>
            </div>
          </div>
        </div>
      </div>

      <create-form 
        :createFormActive.sync="createFormActive"
        :createdNotebook.sync="createdNotebook">
      </create-form>
    </div>

    <!-- notes listing -->
    <NotesIndex :activeNotebook="activeNotebook"></NotesIndex>
    
    <!-- <edit-form 
    :editFormActive.sync="editFormActive"
    :notebook="notebookForEditing"
    v-on:update:notebook="assignUpdatedNotebook($event)"
    ></edit-form> -->

  </div>
</template>


<script>
import EventBus from "../../core/EventBus";
import config from "../../core/config";
import notify from "../../core/notify";
import request from "../../core/request";
import auth from "../../core/Auth";

import CreateForm from "./NotebookCreate";
import NotesIndex from "../notes/NotesIndex";
// import EditForm from "./NotebookEdit";

export default {
  name: 'NotebookIndex',
  data() {
    return {
      busy: true,
      notebooks: [],
      createdNotebook: null,
      editFormActive: false,
      createFormActive: false,
      notebookForEditing: {},
      showCompletedNotebooks: false,
      activeNotebook: {},
    };
  },

  watch: {
    //adds the new notebook to the notebooks array when the old createdNotebook value was null and the new value isnt null
    createdNotebook: function (newValue, oldValue) {
      if (newValue != null && oldValue == null) {
        this.loadNotebooks();
        // this.notebooks.unshift(newValue); //adds the new notebook to the notebooklist
      }
    },
  },
  computed: {},
  components: {
    'CreateForm': CreateForm,
    // 'EditForm': EditForm,
    'NotesIndex':NotesIndex,
  },
  methods: {
    security() {
      if (!auth.isLoggedIn()) this.$router.push("/login");
    },
    assignUpdatedNotebook(updatedNotebook) {
      this.notebooks.forEach((notebook, index) => {
        if (notebook.id == updatedNotebook.id) {
          if (updatedNotebook.transformedInNotebook) {
            this.notebooks.splice(index, 1); //removes the notebook from list
          } else {
            updatedNotebook = this.fillReadableDuedate(updatedNotebook);
            this.notebooks[index] = Object.assign({}, updatedNotebook);
          }
        }
      });
    },
    fillReadableDuedate(notebook) {
      if (notebook.duedate != null) {
        let date = new Date(notebook.duedate);
        notebook.readableDuedate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
      }
      return notebook;
    },
    fillReadableDuedateArray(notebookArray) {
      for (let index = 0; index < notebookArray.length; index++) {
        notebookArray[index] = this.fillReadableDuedate(notebookArray[index]);
      }
      return notebookArray;
    },
    showEditForm(notebook) {
      this.editFormActive = true;
      this.notebookForEditing = notebook;
    },
    showCreateForm() {
      this.createFormActive = true;
    },
    loadNotebooks() {
      this.busy = true;
      const headers = new Headers();
      let requestData = {};

      requestData["url"] = config.serverUrl + "/api/notebooks";
      requestData["headers"] = headers;
      request
        .fetch(requestData)
        .then(([response, data]) => {
          console.log(data);
          data.notebooks = this.fillReadableDuedateArray(data.notebooks);
          this.notebooks = data.notebooks;
          this.busy = false;
        })
        .catch((error) => {
          this.busy = false;
          notify.notify(error, "error");
        });
    },
    openNotebook(notebook) {
      this.activeNotebook = notebook;
    },
  },
  created() {
    this.security();
    this.loadNotebooks();
  },
};
</script>

