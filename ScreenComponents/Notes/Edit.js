import notify from "../../app/notify.js";
import config from "./../../app/config.js";
import EventBus from "./../../app/EventBus.js";
import request from "../../app/request.js";

export default {
    data: function () {
      return {
            busy: true,
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
        closeModal () {
            this.$emit('update:noteEditActive', false);
            this.localNote = null
        },
        assignUpdatedNote(){
            this.$emit('update:note', this.localNote);
        },
        updateNoteSuccess (object) {
            this.busy = false;
            this.assignUpdatedNote();
            this.closeModal();
            notify.notify(object.message,'success');
        },
        updateNote() {
            this.busy = true;
            const headers = new Headers();
            
            let requestData = {};
            const data = {
                'name': this.localNote.name,
                'content': this.localNote.content,
            };

            requestData['url'] = config.serverUrl + `/api/notes/${this.localNote.id}`;
            requestData['headers'] = headers;
            requestData['method'] = 'PUT';
            requestData['data'] = data;

            console.log('sending new')
            request.fetch(requestData)
            .then(([response,json]) => {
                this.updateNoteSuccess({'message':'Note updated!'});
                this.invalidateSignalAbortController();
            })
            .catch((error) => {
                console.error(error);
                this.busy = false;
                notify.notify(error,'error');
                this.invalidateSignalAbortController();
            });
        },
        deleteNote() {
            this.busy = true;
            const headers = new Headers();
            
            let requestData = {};
            const data = {};

            requestData['url'] = config.serverUrl + `/api/notes/${this.localNote.id}/`;
            requestData['headers'] = headers;
            requestData['method'] = 'DELETE';
            requestData['data'] = data;

            request.fetch(requestData)
            .then(([response,json]) => {
                this.localNote.completed = true;
                this.localNote['message'] = object.message;
                this.updateNoteSuccess(this.localNote);
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
                vueInstance[fn]()
                this.debounceTimer[fn] = null;
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
                this.debouncer(this, 'updateNote');
            }
        },
        localNoteContent: function (newProp, oldProp) {
            if(oldProp !== null){
                this.localNote.content = newProp;
                this.debouncer(this, 'updateNote');
            }
        }
    },
    created () {
        this.busy = false;
    },
    template: /*jsx*/`
    <div>
        <link rel="stylesheet" href="/ScreenComponents/Notes/edit.css">
        <div class="modal" v-if="noteEditActive">
            <div class="modal_container note_modal">
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

                    <div class="flex-row alignitems-center">
                        <div class="">
                            <button 
                                class="btn btn-secondary"
                                @click="closeModal()"
                            >close</button>
                        </div>
                        <div class="ml-2">
                            <div class="loader inline" v-if="busy"></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
    `
};