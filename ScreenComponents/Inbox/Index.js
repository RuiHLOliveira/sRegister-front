import EventBus from "./../../app/EventBus.js";
import config from "./../../app/config.js";
import EditForm from "./Edit.js";
import CreateForm from "./Create.js";
import notify from "../../app/notify.js";

export default {
    data: function () {
      return {
            busy: true,
            tasks: [],
            createdTask: null,
            situations: [],
            editFormActive: false,
            createFormActive: false,
            taskForEditing: {},
        }
    },
    watch: {
        createdTask: function (newValue, oldValue) {
            console.log(newValue,oldValue);
            if(newValue != null && oldValue == null) {
                this.tasks.unshift(newValue);
            }
        }
    },
    computed: {
    },
    components: {
        'EditForm': EditForm,
        'CreateForm': CreateForm
    },
    methods: {
        assignUpdatedTask(updatedTask) {
            this.tasks.forEach((task, index) => {
                if(task.id == updatedTask.id) {
                    this.tasks[index] = Object.assign({},updatedTask);
                }
            });
        },
        showEditForm(task){
            this.editFormActive = true;
            this.taskForEditing = task;
        },
        showCreateForm() {
            this.createFormActive = true;
        },
        loadInbox() {
            this.busy = true;
            const headers = new Headers();
            headers.append("Authorization", window.localStorage.sRegisterToken);
            // const data = JSON.stringify({
            //     'email': this.email,
            //     'password': this.password
            // });
            fetch(config.serverUrl + "/api/tasks",{
                headers: headers,
                // method: "GET",
                // body: data
            })
            .then(response => {
                response.json().then(object => {
                    if(response.ok) {
                        this.busy = false;
                        this.tasks = object.tasks;
                        this.situations = object.situations;
                    } else {
                        this.busy = false;
                        // notify.notify(object.message, 'error');
                        EventBus.$emit('HANDLE_REQUEST_ERROR', {response, object});
                    }
                });
            })
            .catch(error => {
                this.busy = false;
                notify.notify('Your request failed. Please try again in a few seconds.', 'error');
            });
        }
    },
    created () {
        this.loadInbox();
    },
    template: `
    <div class="flexWrapper">
        <application-menu v-on:action="$emit('action',$event)"></application-menu>
        <div class="container">

            <h1 class="taskInfo">Inbox</h1>
            <button 
                @click="showCreateForm()"
                class="mt-2 btn btn-primary"
            >New</button>
            
            <div class="loader" v-if="busy"></div>

            <div v-else>
                <div class="taskContainer" v-for="task in tasks" :key="task.id">
                    <div class="taskInfo">{{task.name}}</div>
                    <div class="taskInfo">{{task.situation.situation}}</div>
                    <div class="taskInfo">{{task.readableDuedate}}</div>
                    <div class="taskInfo">{{task.description}}</div>
                    <div class="taskInfo small">belongs to {{task.user.username}}</div>

                    <button 
                        @click="showEditForm(task)"
                        class="mt-2 btn btn-primary"
                    >edit</button>
                </div>

                <div v-if="tasks.length == 0">There is no tasks!</div>

                <create-form 
                    :createFormActive.sync="createFormActive"
                    :createdTask.sync="createdTask"
                ></create-form>

                <edit-form 
                    :editFormActive.sync="editFormActive"
                    :task="taskForEditing"
                    v-on:update:task="assignUpdatedTask($event)"
                    :situations="situations"
                ></edit-form>
            </div>

            <notice-box></notice-box>
        </div>
    </div>
    `
};