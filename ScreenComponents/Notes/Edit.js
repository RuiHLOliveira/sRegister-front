import notify from "../../app/notify.js";
import config from "./../../app/config.js";
import EventBus from "./../../app/EventBus.js";
import request from "../../app/request.js";

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
        }
    },
    props: ['noteEditActive', 'note'],
    computed: {
    },
    methods: {
        successIcon(){
            this.success = true;
            let thisinstance = this;
            setTimeout(function () {
                thisinstance.success = false;
            }, 2000);
        },
        closeModal () {
            this.$emit('update:noteEditActive', false);
            this.localNote = null
        },
        assignUpdatedNote(){
            this.$emit('update:note', this.localNote);
        },
        createNoteSuccess (object) {
            this.busy = false;
            this.successIcon();
            this.assignUpdatedNote();
            // this.closeModal();
            // notify.notify(object.message,'success');
        },
        updateNoteSuccess (object) {
            this.busy = false;
            this.successIcon();
            this.assignUpdatedNote();
            // this.closeModal();
            // notify.notify(object.message,'success');
        },
        deletedNoteSuccess (object) {
            this.busy = false;
            this.assignUpdatedNote();
            this.closeModal();
            notify.notify(object.message,'success');
        },
        saveNote(){
            if(this.localNote.id == null) {
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
            console.log('note',this.localNote)
            let requestData = {};
            const data = {
                'name': this.localNote.name,
                'content': this.localNote.content,
            };
            requestData['url'] = config.serverUrl + `/api/${this.localNote.notebook.id}/notes`;
            requestData['headers'] = headers;
            requestData['method'] = 'POST';
            requestData['data'] = data;

            console.log('sending new')
            request.fetch(requestData)
            .then(([response,json]) => {
                this.createNoteSuccess({'message':'Note created!'});
            })
            .catch((error) => {
                console.error(error);
                this.busy = false;
                notify.notify(error,'error');
            });
        },
        updateNote() {
            this.busy = true;
            this.localNote.name = this.localNoteName;
            this.localNote.content = this.localNoteContent;
            const headers = new Headers();
            
            let requestData = {};
            const data = {
                'name': this.localNote.name,
                'content': this.localNote.content,
            };
            requestData['url'] = config.serverUrl + `/api/${this.localNote.notebook.id}/notes/${this.localNote.id}`;
            requestData['headers'] = headers;
            requestData['method'] = 'PUT';
            requestData['data'] = data;

            console.log('sending new')
            request.fetch(requestData)
            .then(([response,json]) => {
                this.updateNoteSuccess({'message':'Note updated!'});
            })
            .catch((error) => {
                console.error(error);
                this.busy = false;
                notify.notify(error,'error');
            });
        },
        deleteNote() {
            this.busy = true;
            const headers = new Headers();
            
            let requestData = {};
            const postData = {};

            requestData['url'] = config.serverUrl + `/api/notes/${this.localNote.id}/`;
            requestData['headers'] = headers;
            requestData['method'] = 'DELETE';
            requestData['data'] = postData;

            request.fetch(requestData)
            .then(([response,json]) => {
                this.localNote.completed = true;
                this.localNote['message'] = object.message;
                this.deletedNoteSuccess(this.localNote);
            })
            .catch((error) => {
                this.busy = false;
                notify.notify(error,'error');
            });
        },
        autoGrow(event){
            let element = event.target;
            element.style.height = "5px";
            element.style.height = (element.scrollHeight)+"px";
        },
        debouncer (vueInstance, fn, waitTime = 1000) {
            // let vue = this;
            let time = null;
            if(this.debounceTimer[fn] != null || this.debounceTimer[fn] != undefined){
                time = this.debounceTimer[fn];
            }
            clearTimeout(time);
            time = setTimeout(() => {
                vueInstance[fn]() //runs the function after the time
                this.debounceTimer[fn] = null; //clear the timer of this request
            }, waitTime);
            this.debounceTimer[fn] = time;
        }
    },
    watch: {
        // whenever noteEditActive changes, this function will run
        noteEditActive: function (newProp, oldProp) {
            if(newProp && !oldProp) {
                this.localNote = Object.assign({},this.note);
                this.localNoteName = this.localNote.name
                this.localNoteContent = this.localNote.content
            }
        },
        localNoteName: function (newProp, oldProp) {
            if(oldProp !== null){
                this.localNote.name = newProp;
                this.debouncer(this, 'saveNote');
            }
        },
        localNoteContent: function (newProp, oldProp) {
            if(oldProp !== null){
                this.localNote.content = newProp;
                this.debouncer(this, 'saveNote');
            }
        }
    },
    created () {
        this.busy = false;
    },
    template: /*jsx*/`
    <div>
        <link rel="stylesheet" href="/ScreenComponents/Notes/edit.css">
        <div class="edit-modal" v-if="noteEditActive">
            <div class="edit-modal-container note_modal">
                <div class=" form-group">
                    <div class="row">
                        <div class="col">
                            <input 
                                name="name" class="form-control name_edit" 
                                type="text" placeholder="name" 
                                v-model="localNoteName"
                            />
                        </div>
                    </div>

                    <div class="row">
                        <div class="col">
                            <textarea 
                                name="content"
                                class="form-control content_edit" 
                                v-model="localNoteContent" 
                                @input="autoGrow($event)"
                            ></textarea>
                        </div>
                    </div>

                    <div class="flex-row f-alignitems-center">
                        <div class="">
                            <button 
                                class="btn btn-secondary"
                                @click="closeModal()"
                            >close</button>
                        </div>
                        <div class="ml-2">
                            <div class="newLoader" v-if="busy"><i class="fas fa-spinner"></i></div>
                        </div>
                        <div class="ml-2">
                            <div class="successIcon" v-if="success"><i class="fas fa-check"></i></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
    `
};