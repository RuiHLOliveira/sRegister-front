import EventBus from "./../../app/EventBus.js";
import config from "./../../app/config.js";

export default {
    data: function () {
      return {
            busy: true,
            tasks: [],
            situations: [],
            editForm: false,
        }
    },
    computed: {
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
            this.editForm = true;
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

            <h1>Inbox</h1>
            
            <div class="taskContainer" v-for="task in tasks" :key="task.id">
                <p>{{task.id}} - {{task.description}}</p>
                <p>belongs to {{task.user.username}}</p>

                <button @click="showEditForm(task)">edit</button>
            </div>

            <div class="editForm" v-if="editForm">
                <h2>edit form</h2>

                <button @click="editForm = false">cancelar</button>
                <button>salvar</button>
            </div>

            <div class="loader" v-if="busy"></div>
            <notice-box></notice-box>
        </div>
    </div>
    `
};