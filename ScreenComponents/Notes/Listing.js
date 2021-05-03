import notify from "../../app/notify.js";
import config from "../../app/config.js";
import EventBus from "../../app/EventBus.js";
import request from "../../app/request.js";
import NoteEdit from "./Edit.js";
import NoteCreate from "./Create.js";

export default {
    data: function () {
      return {
            busy: false,
            active: false,
            notes: [],
            noteEditActive: false,
            noteForEditing: {},
            noteCreateActive: false,
            createdNote: {},
            defaultNewNote: {
                'id' : null,
                // 'name':'',
                // 'content':'',
                'notebook': {}
            }
        }
    },
    props: ['activeNotebook'],
    computed: {
    },
    watch: {
        //loads the notes once there is an active notebook
        activeNotebook: function (newValue, oldValue) {
            this.active = false;
            if(newValue.id != null && oldValue.id != newValue.id) {
                // this.notebooks.unshift(newValue);//adds the new notebook to the notebooklist
                this.active = true;
                this.defaultNewNote.notebook = newValue;
                this.loadNotes(newValue.id);
            }
        },
        //adds the new note to the notes array when the old createdNote value was null and the new value isnt null
        createdNote: function (newValue, oldValue) {
            if(newValue != null && oldValue == null) {
                this.notes.unshift(newValue);//adds the new notebook to the notebooklist
            }
        }
    },
    components: {
        'NoteEdit': NoteEdit,
        'NoteCreate': NoteCreate,
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
        newNote() {
            this.noteEditActive = true;
            this.noteForEditing = this.defaultNewNote;
            console.log('note for create', this.defaultNewNote);
        },
        editNote(note){
            this.noteEditActive = true;
            this.noteForEditing = note;
            console.log('note for editing',note);
        },
        assignUpdatedNote(updatedNote) {
            let found = false;
            this.notes.forEach((note, index) => {
                if(note.id == updatedNote.id) {
                    // if(updatedNote.transformedInNotebook) {
                    //     this.notes.splice(index,1); //removes the notebook from list
                    // } else {
                    // updatedNote = this.fillReadableDuedate(updatedNote);
                    this.notes[index] = Object.assign({},updatedNote);
                    found = true;
                    // }
                }
                if(!found){
                    this.notes.push(Object.assign({},updatedNote));
                }
            });
        },
        dosomething(e){
            alert('implementar');
            this.stopPropagation()
        },
        stopPropagation(){
            let e = window.event;
            e.cancelBubble = true;
            if (e.stopPropagation) e.stopPropagation();
        }
    },
    created () {
    },
    template: /*jsx*/`
    <div>
        <link rel="stylesheet" href="/ScreenComponents/Notes/listing.css">
        <div class="notesListing">
            <div class="loader" v-if="busy"></div>
            <div v-else-if="active">
                <div class="notelisting-notebook-title">
                    <span class="bold">{{this.activeNotebook.name}}</span>
                    <button 
                        @click="newNote()"
                        class="ml-2 mt-1 btn btn-primary btn-small"
                    >New note</button>
                </div>
                <div class="notelisting-zero-notes"
                    v-if="notes.length == 0"
                >
                    nothing here
                </div>
                <div class="flex-row flex-wrap-wrap">
                    <div class="noteBox" 
                        v-for="note in notes" :key="note.id" @click="editNote(note)"
                    >
                        <div class="note-content overflow-hidden">
                            <b>{{note.name}}</b><br>
                            {{note.content}}
                        </div>
                        <div class="note-actionbar">
                            <span 
                                @click="dosomething()"
                                class="note-btn"
                            ><i class="fas fa-user-check"></i></span>
                        </div>
                    </div>
                </div>
                
                <!--<note-create
                    :noteCreateActive.sync="noteCreateActive"
                    :createdNote.sync="createdNote"
                ></note-create>-->

                <note-edit
                    :noteEditActive.sync="noteEditActive"
                    :note="noteForEditing"
                    v-on:update:note="assignUpdatedNote($event)"
                ></note-edit>
                
            </div>
        </div>
    </div>
    `
};