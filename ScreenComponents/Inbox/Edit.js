import config from "./../../app/config.js";
import EventBus from "./../../app/EventBus.js";

export default {
    data: function () {
      return {
            busy: true,
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
        closeModal () {
            this.$emit('update:editFormActive', false)
            this.$emit('update:task', null)
        },
        updateTaskSuccess (object) {
            this.busy = false;
            this.tasks = object.tasks;
            this.situations = object.situations;
            this.closeModal();
            this.showNotice(object.message,'success');
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
                        this.updateTaskSuccess(object);
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
    <div class="flexWrapper editForm modal" v-if="editFormActive">

            <div class="modal_container lg form-group">
                <h2 class="taskInfo">edit form</h2>

                <div class="taskInfo">{{task.situation.situation}}</div>

                acoes transformar em projeto<br>
                acoes completar tarefa<br><br>

                <input class="form-control" type="text" placeholder="name" v-model="task.name" /><br>
                <input class="form-control" type="date" placeholder="duedate" v-model="task.duedate" /><br>
                <textarea class="form-control" rows="6" name="description" v-model="task.description"></textarea><br>

                situacao<br>
                colocar em projeto<br>

                <button class="btn btn-danger" @click="closeModal()">cancelar</button>
                <button class="btn btn-success" @click="updateTask()">salvar</button>

                <div class="loader" v-if="busy"></div>
            </div>

    </div>
    `
};