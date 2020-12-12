import EventBus from "./../../app/EventBus.js";
import config from "./../../app/config.js";
import EditForm from "./Edit.js";

export default {
    data: function () {
      return {
            busy: true,
            tasks: [],
            situations: [],
            editFormActive: false,
            taskForEditing: {},
        }
    },
    computed: {
    },
    components: {
        'EditForm': EditForm,
    },
    methods: {
        showNotice(notice, noticeType, time) {
            if(time == null) time = 5000;
            EventBus.$emit('notice', {
                'notice': notice,
                'noticeType': noticeType,
                'time': time
            });
        },
        showEditForm(task){
            this.editFormActive = true;
            this.taskForEditing = task;
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
                        console.log(this.tasks);
                        // this.showNotice(object.message,'success');
                    } else {
                        this.busy = false;
                        this.showNotice(object.message, 'error');
                        EventBus.$emit('AUTH_CHECK', {response, object});
                    }
                });
            })
            .catch(error => {
                this.busy = false;
                this.showNotice('Your request failed. Please try again in a few seconds.', 'error');
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

            <edit-form 
                :editFormActive.sync="editFormActive"
                :task.sync="taskForEditing"
            ></edit-form>

            <div class="loader" v-if="busy"></div>
            <notice-box></notice-box>
        </div>
    </div>
    `
};