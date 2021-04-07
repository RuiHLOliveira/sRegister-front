import notify from "../../app/notify.js";
import config from "../../app/config.js";
import EventBus from "../../app/EventBus.js";
import request from "../../app/request.js";

export default {
    data: function () {
      return {
            busy: true,
            notebookName: null,
            newNotebook: null,
        }
    },
    props: ['createFormActive', 'createdNotebook'],
    computed: {
    },
    methods: {
        closeModal () {
            this.$emit('update:createFormActive', false)
            this.newNotebook = null;
            this.notebookName = null;
        },
        assignCreatedNotebook(){
            this.$emit('update:createdNotebook', this.newNotebook)
        },
        createdNotebookSuccess (object) {
            this.busy = false;
            this.newNotebook = object.notebook;
            this.assignCreatedNotebook();
            this.closeModal();
            if(object.message == undefined) object.message = "Created a new notebook successfully!";
            notify.notify(object.message,'success');
        },
        createNotebook() {
            this.busy = true;
            let requestData = {};
            const headers = new Headers();
            requestData['url'] = config.serverUrl + "/api/notebooks";
            requestData['method'] = "POST";
            requestData['headers'] = headers;
            requestData ['data'] = {
                'name': this.notebookName,
            };
            request.fetch(requestData)
            .then( ([response, dados]) => {
                this.busy = false;
                notify.notify(dados.message,'success');
                this.createdNotebookSuccess(dados);
            })
            .catch((error) => {
                this.busy = false;
                notify.notify(error,'error');
            });
        },
    },
    created () {
        // this.loadInbox();
        this.busy = false;
    },
    template: `
    <div class="flexWrapper editForm modal padding20px" v-if="createFormActive">
        <div class="modal_container lg form-group">
            <div class="row">
                <div class="col">
                    <h2 class="notebookInfo">New Notebook</h2>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <input class="form-control" type="text" placeholder="name" id="notebookName" v-model="notebookName" v-focus @keyup.enter="createNotebook()"/>
                </div>
            </div>

            <button class="btn btn-danger" @click="closeModal()">Cancel</button>
            <button class="btn btn-success" @click="createNotebook()">Save</button>

            <div class="loader" v-if="busy"></div>
        </div>
    </div>
    `
};