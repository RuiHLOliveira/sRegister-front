import config from "./../../app/config.js";
import EventBus from "./../../app/EventBus.js";

export default {
    data: function () {
      return {
            busy: true,
            selected: null,
        }
    },
    props: ['editFormActive','task', 'situations'],
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
                        // this.showNotice(object.message, 'error');
                        EventBus.$emit('HANDLE_REQUEST_ERROR', {response, object});
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
                <div class="row">
                    <div class="col">
                        <h2 class="taskInfo">edit form</h2>
                    </div>
                </div>

                <div class="row">
                    <div class="col">
                        <div class="taskInfo">{{task.situation.situation}}</div>
                    </div>
                </div>

                <div class="row">
                    <div class="col">
                        <button class="btn btn-info" @click="alert('implementar')">Transform in project</button>
                        <button class="btn btn-success" @click="alert('implementar')">Complete task</button>
                    </div>
                </div>

                <div class="row">
                    <div class="col">
                        <input class="form-control" type="text" placeholder="name" v-model="task.name" />
                    </div>
                </div>

                <div class="row">
                    <div class="col">
                        <input class="form-control" type="date" placeholder="duedate" v-model="task.duedate" />
                    </div>
                </div>

                <div class="row">
                    <div class="col">
                        <textarea class="form-control" rows="3" name="description" v-model="task.description"></textarea>
                    </div>
                </div>

                <div class="row">
                    <div class="col">
                        <label for="situation">Situation</label>
                        <span>{{selected}}</span>
                        <select class="form-control" name="targetSituation" id="situation">
                            <option disabled selected value="">--</option>
                            <option 
                                v-for="situation in situations"
                                :key="situation.id"
                                :value="situation.id"
                                :selected="true"
                            >{{situation.situation}}</option>
                        </select>
                    </div>
                </div>

                colocar em projeto

                <button class="btn btn-danger" @click="closeModal()">Cancel</button>
                <button class="btn btn-success" @click="updateTask()">Save</button>

                <div class="loader" v-if="busy"></div>
            </div>

    </div>
    `
};
/*
{% if not task.situation == null and situation.id == task.situation.id %}

                            <option selected value="{{ situation.id }}">{{ situation.situation}}</option>
                        
                        {% else %}
                            <option value="{{ situation.id }}">
                                {% if situation.user is null  %}
                                    [default]
                                {% endif %}
                                {{ situation.situation }}
                            </option>
                        {% endif %}
                    {% endfor %}*/