import config from "./../../app/config.js";
import EventBus from "./../../app/EventBus.js";

export default {
    data: function () {
      return {
            busy: true,
            tasks: [],
            situations: [],
        }
    },
    props: ['editFormActive','task'],
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
        close () {
            this.editFormActive = false;
            this.$emit('update:editFormActive', editFormActive)
        },
        updateTask() {
            this.busy = true;
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", window.localStorage.sRegisterToken);
            const data = JSON.stringify({
                'name': this.task.name,
                'duedate': this.task.duedate,
                'description': this.task.description,
            });
            fetch(config.serverUrl + `/api/tasks/${this.task.id}`, {
                headers: headers,
                method: "PUT",
                body: data
            })
            .then(response => {
                response.json().then(object => {
                    if(response.ok) {
                        this.busy = false;
                        this.tasks = object.tasks;
                        this.situations = object.situations;
                        this.showNotice(object.message,'success');
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
        // this.loadInbox();
        this.busy = false;
    },
    template: `
    <div class="flexWrapper editForm" v-if="editFormActive">

            <div >
                <h2>edit form</h2>

                status atual da tarefa<br>
                acoes transformar em projeto<br>
                acoes completar tarefa<br><br>

                <input type="text" placeholder="name" v-model="task.name" /><br>
                {{task.name}}<br><br>
                <input type="date" placeholder="duedate" v-model="task.duedate" /><br>
                {{task.duedate}}<br><br>
                <textarea rows="6" name="description" v-model="task.description"></textarea><br>
                {{task.description}}<br><br>

                situacao<br>
                colocar em projeto<br>

                <button @click="editFormActive = false">cancelar</button>
                <button @click="updateTask()">salvar</button>
            </div>

            <div class="loader" v-if="busy"></div>
    </div>
    `
};