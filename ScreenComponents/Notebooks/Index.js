import EventBus from "./../../app/EventBus.js";
import config from "./../../app/config.js";
import EditForm from "./Edit.js";
import notify from "../../app/notify.js";
import request from "../../app/request.js";
import CreateForm from "./Create.js";
import NotesListing from "../Notes/Listing.js";

export default {
    data: function () {
      return {
            busy: true,
            notebooks: [],
            createdNotebook: null,
            editFormActive: false,
            createFormActive: false,
            notebookForEditing: {},
            showCompletedNotebooks: false,
            activeNotebook: {}
        }
    },
    watch: {
        //adds the new notebook to the notebooks array when the old createdNotebook value was null and the new value isnt null
        createdNotebook: function (newValue, oldValue) {
            if(newValue != null && oldValue == null) {
                this.notebooks.unshift(newValue);//adds the new notebook to the notebooklist
            }
        }
    },
    computed: {
    },
    components: {
        'CreateForm': CreateForm,
        'EditForm': EditForm,
        'NotesListing':NotesListing,
    },
    methods: {
        assignUpdatedNotebook(updatedNotebook) {
            this.notebooks.forEach((notebook, index) => {
                if(notebook.id == updatedNotebook.id) {
                    if(updatedNotebook.transformedInNotebook) {
                        this.notebooks.splice(index,1); //removes the notebook from list
                    } else {
                        updatedNotebook = this.fillReadableDuedate(updatedNotebook);
                        this.notebooks[index] = Object.assign({},updatedNotebook);
                    }
                }
            });
        },
        fillReadableDuedate(notebook){
                if(notebook.duedate !== null) {
                    notebook.readableDuedate = moment(new Date(notebook.duedate)).format('ddd, MMM Mo YYYY');
                }
                return notebook;
        },
        fillReadableDuedateArray(notebookArray){
            for (let index = 0; index < notebookArray.length; index++) {
                notebookArray[index] = this.fillReadableDuedate(notebookArray[index]);
            }
            return notebookArray;
        },
        showEditForm(notebook){
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

            requestData['url'] = config.serverUrl + "/api/notebooks";
            requestData['headers'] = headers;
            request.fetch(requestData)
            .then(([response,data]) => {
                console.log(data);
                this.busy = false;
                data.notebooks = this.fillReadableDuedateArray(data.notebooks);
                this.notebooks = data.notebooks;
            })
            .catch((error) => {
                this.busy = false;
                notify.notify(error,'error');
                // EventBus.$emit('HANDLE_REQUEST_ERROR', {response, json});
            });
        },
        openNotebook(notebook){
            this.activeNotebook = notebook;
            console.log(this.activeNotebook)
        }
    },
    created () {
        this.loadNotebooks();
    },
    template: /*jsx*/`
    <div>
        <application-menu v-on:action="$emit('action',$event)"></application-menu>
        <div class="mainContainer">
            
            <div class="flex-row alignitems-center mb-2 ">
                <h1 class="notebookInfo">Notebooks</h1>
                <button 
                    @click="showCreateForm()"
                    class="ml-2 mt-1 btn btn-primary btn-small"
                >New notebook</button>
            </div>

            <div class="flex-row"> <!-- container -->
                <div> <!-- notebooks -->
                    <div class="loader" v-if="busy"></div>
                    <div v-else class="notebookSidebar">
                        <div class="notebook" 
                            v-for="notebook in notebooks" :key="notebook.id"
                            @click="openNotebook(notebook)"
                        >
                            <div>{{notebook.name}}</div>
                            <!-- <button 
                                @click="showEditForm(notebook)"
                                class="mt-2 btn btn-primary"
                            >edit</button> -->
                        </div>
                        <div v-if="notebooks.length == 0">There are no notebooks!</div>
                    </div>
                </div>

                <div> <!-- notes -->
                    <notes-listing
                        :activeNotebook="activeNotebook"
                    ></notes-listing>
                </div>
            </div>

            <create-form 
                :createFormActive.sync="createFormActive"
                :createdNotebook.sync="createdNotebook"
            ></create-form>

            <edit-form 
                :editFormActive.sync="editFormActive"
                :notebook="notebookForEditing"
                v-on:update:notebook="assignUpdatedNotebook($event)"
            ></edit-form>

            <notice-box></notice-box>
        </div>
    </div>
    `
};