import notify from "../../app/notify.js";
import config from "../../app/config.js";
import EventBus from "../../app/EventBus.js";
import request from "../../app/request.js";
import NoteEdit from "./Edit.js";

export default {
    data: function () {
      return {
            busy: false,
            notes: [],
            noteEditActive: false,
            noteForEditing: {},
        }
    },
    props: ['activeNotebook'],
    computed: {
    },
    watch: {
        //adds the new notebook to the notebooks array when the old createdNotebook value was null and the new value isnt null
        activeNotebook: function (newValue, oldValue) {
            if(newValue.id != null && oldValue.id != newValue.id) {
                // this.notebooks.unshift(newValue);//adds the new notebook to the notebooklist
                this.loadNotes(this.activeNotebook.id);
            }
        }
    },
    components: {
        'NoteEdit': NoteEdit,
    },
    methods: {
        loadNotes(notebookId){
            this.busy = true;
            const headers = new Headers();
            let requestData = {};
            let result = [];
            requestData['url'] = config.serverUrl + `/api/${notebookId}/notes`;
            requestData['headers'] = headers;
            request.fetch(requestData)
            .then(([response,data]) => {
                this.notes = data.notes;
                this.busy = false;
            })
            .catch((error) => {
                this.busy = false;
                notify.notify(error,'error');
            });
        },
        editNote(note){
            this.noteEditActive = true;
            this.noteForEditing = note;
            console.log(this.noteEditActive );
            console.log(this.noteForEditing );
        },
        assignUpdatedNote(updatedNote) {
            window.alert('please asign updated note')
        },
    },
    created () {
    },
    template: /*jsx*/`
    <div class="notesListing">
        <div class="loader" v-if="busy"></div>
        <div v-else>
            <div class="noteBox" 
                v-for="note in notes" :key="note.id"
            >
                <div @click="editNote(note)">
                    <b>{{note.name}}</b>
                    <br>
                    {{note.content}}
                </div>
                <div class="note-actionbar">
                    <span 
                        @click="dosomething()"
                        class="note-btn"
                    ><i class="fas fa-user-check"></i></span>
                </div>
            </div>

            <note-edit
                :noteEditActive.sync="noteEditActive"
                :note="noteForEditing"
                v-on:update:note="assignUpdatedNote($event)"
            ></note-edit>
            
        </div>
    </div>
    `
};