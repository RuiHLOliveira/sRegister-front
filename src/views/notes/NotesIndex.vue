<style>
.noteName {
  font-size: 1.1rem;
  font-weight: bold;
}
.noteContent {
  font-style: italic;
  max-height: 75px;
  overflow: hidden;
}

.gb-color-lightblue-hover {
    background: #aaccff55;
}
.gb-color-lightblue-hover:hover {
    background: #aaccff88;
}

</style>

<template>
  <div class="border-dev flex-column">

    <div class="subsession-title">Notes</div>
    
    <div class="mt-3">
      
      <div class="loader" v-if="busy"></div>

      <div v-else-if="active">
        <span class="bold">
          {{ this.activeNotebook.name }}
        </span>

        <button class="btn" @click="newNote()">Nova Nota</button>

        <div class="notelisting-zero-notes" v-if="notes.length == 0">
          There are not any notes here
        </div>
      </div>

      <div class="flex-column">
        <div class="border-dev round-1 mt-1 p-2 gb-color-lightblue-hover"
          @click="editNote(note)"
          v-for="note in notes" :key="note.id">
            <!-- <div>{{note.id}}</div> -->
            <div class="noteName" v-if="note.name">{{ note.name }}</div>
            <div class="noteContent">{{ note.content }}</div>

          <!-- <div>
            <span @click="dosomething()" class="note-btn">
              <i class="fas fa-user-check"></i>
            </span>
          </div> -->
        </div>
      </div>

    </div>

    <NotesCreateEdit
          :noteEditActive.sync="noteEditActive"
          :note="noteForEditing"
          v-on:update:note="assignUpdatedNote($event)" />
  </div>
</template>

<script>
import EventBus from "../../core/EventBus";
import config from "../../core/config";
import notify from "../../core/notify";
import request from "../../core/request";
import auth from "../../core/Auth";
import NotesCreateEdit from "./NotesCreateEdit";

// import NoteEdit from "./Edit.js";

export default {
  name: "NotesIndex",
  data() {
    return {
      busy: false,
      active: false,
      notebookId: null,
      notes: [],
      noteEditActive: false,
      noteForEditing: {},
      noteCreateActive: false,
      createdNote: {},
      defaultNewNote: {
        id: null,
        // 'name':'',
        // 'content':'',
        notebook: {},
      },
    };
  },
  props: ["activeNotebook"],
  computed: {},
  watch: {
    //loads the notes once there is an active notebook
    activeNotebook: function (newValue, oldValue) {
      this.active = false;
      if (newValue.id != null && oldValue.id != newValue.id) {
        // this.notebooks.unshift(newValue);//adds the new notebook to the notebooklist
        this.active = true;
        this.defaultNewNote.notebook = newValue;
        this.loadNotes(newValue.id);
      }
    },
    //adds the new note to the notes array when the old createdNote value was null and the new value isnt null
    createdNote: function (newValue, oldValue) {
      if (newValue != null && oldValue == null) {
        this.notes.unshift(newValue); //adds the new notebook to the notebooklist
      }
    },
  },
  components: {
    // NoteEdit: NoteEdit,
    NotesCreateEdit: NotesCreateEdit,
  },
  methods: {
    loadNotes(notebookId) {
      if(notebookId == null) {
        console.error('Notebook not informed;');
        return;
      }
      this.busy = true;
      this.notebookId = notebookId;
      const headers = new Headers();
      let requestData = {};
      let result = [];
      requestData["url"] = config.serverUrl + `/api/${notebookId}/notes`;
      requestData["headers"] = headers;
      request
        .fetch(requestData)
        .then(([response, data]) => {
          this.notes = data.notes;
          this.busy = false;
        })
        .catch((error) => {
          this.busy = false;
          notify.notify(error, "error");
        });
    },
    newNote() {
      this.noteEditActive = true;
      this.noteForEditing = this.defaultNewNote;
    },
    editNote(note) {
      this.noteEditActive = true;
      this.noteForEditing = note;
    },
    assignUpdatedNote(updatedNote) {
      this.loadNotes(this.notebookId);
      // let found = false;
      // this.notes.forEach((note, index) => {
      //   if (note.id == updatedNote.id) {
      //     // if(updatedNote.transformedInNotebook) {
      //     //     this.notes.splice(index,1); //removes the notebook from list
      //     // } else {
      //     // updatedNote = this.fillReadableDuedate(updatedNote);
      //     this.notes[index] = Object.assign({}, updatedNote);
      //     found = true;
      //     // }
      //   }
      // });
      // if (!found) {
      //   this.notes.push(Object.assign({}, updatedNote));
      // }
    },
    dosomething(e) {
      alert("implementar");
      this.stopPropagation();
    },
    stopPropagation() {
      let e = window.event;
      e.cancelBubble = true;
      if (e.stopPropagation) e.stopPropagation();
    },
  },
  created() {},
};
</script>
