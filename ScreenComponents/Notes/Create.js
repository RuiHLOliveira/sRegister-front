import notify from "../../app/notify.js";
import config from "../../app/config.js";
import EventBus from "../../app/EventBus.js";
import request from "../../app/request.js";

export default {
    data: function () {
      return {
            busy: true,
            noteName: null,
            newNote: null,
            localNote: null,
            localNoteName: null,
            localNoteContent: null,
            abortController: null,
            debounceTimer: [],
        }
    },
    props: ['noteCreateActive', 'createdNote'],
    computed: {
    },
    methods: {
        closeModal () {
            this.$emit('update:noteCreateActive', false)
            this.newNote = null;
            this.noteName = null;
        },
        assignCreatedNote(){
            this.$emit('update:createdNote', this.newNote)
        },
        createdNoteSuccess (object) {
            this.busy = false;
            this.newNote = object.note;
            this.assignCreatedNote();
            this.closeModal();
            if(object.message == undefined) object.message = "Created a new note successfully!";
            notify.notify(object.message,'success');
        },
        createNote() {
            console.log(this)
            this.busy = true;
            let requestData = {};
            const headers = new Headers();
            requestData['url'] = config.serverUrl + `/api/${notebook}/notes`;
            requestData['method'] = "POST";
            requestData['headers'] = headers;
            requestData ['data'] = {
                'name': this.noteName,
            };
            request.fetch(requestData)
            .then( ([response, dados]) => {
                this.busy = false;
                notify.notify(dados.message,'success');
                this.createdNoteSuccess(dados);
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
        // whenever noteCreateActive changes, this function will run
        noteCreateActive: function (newProp, oldProp) {
            if(newProp && !oldProp) {
                this.localNote = Object.assign({},this.note);
                this.localNoteName = this.localNote.name
                this.localNoteContent = this.localNote.content
            }
        },
        localNoteName: function (newProp, oldProp) {
            if(oldProp !== null){
                this.localNote.name = newProp;
                this.debouncer(this, 'createNote');
            }
        },
        localNoteContent: function (newProp, oldProp) {
            if(oldProp !== null){
                this.localNote.content = newProp;
                this.debouncer(this, 'createNote');
            }
        }
    },
    created () {
        // this.loadInbox();
        this.busy = false;
    },
    template: /*jsx */`
    <div>
        <link rel="stylesheet" href="/ScreenComponents/Notes/create.css">
        <div class="modal" v-if="noteCreateActive">
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