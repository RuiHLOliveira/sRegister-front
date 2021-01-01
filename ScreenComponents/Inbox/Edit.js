import notify from "../../app/notify.js";
import config from "./../../app/config.js";
import EventBus from "./../../app/EventBus.js";

export default {
    data: function () {
      return {
            busy: true,
            localTask: null,
        }
    },
    props: ['editFormActive','task', 'situations'],
    computed: {
    },
    methods: {
        closeModal () {
            this.$emit('update:editFormActive', false);
            this.localTask = null
        },
        assignUpdatedTask(){
            this.$emit('update:task', this.localTask);
        },
        updateTaskSuccess (object) {
            this.busy = false;
            //set new situation as defined by this.localTask.situation.id
            let newSituation = this.situations.find( situation => {
                return situation.id === this.localTask.situation.id
            },this);
            this.localTask.situation = newSituation;
            this.assignUpdatedTask();
            this.closeModal();
            notify.notify(object.message,'success');
        },
        updateTask() {
            this.busy = true;
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", window.localStorage.sRegisterToken);
            const data = JSON.stringify({
                'name': this.localTask.name,
                'duedate': this.localTask.duedate,
                'description': this.localTask.description,
                'targetSituation': this.localTask.situation.id
            });
            fetch(config.serverUrl + `/api/tasks/${this.localTask.id}`, {
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
                        // notify.notify(object.message, 'error');
                        EventBus.$emit('HANDLE_REQUEST_ERROR', {response, object});
                    }
                });
            })
            .catch(error => {
                this.busy = false;
                notify.notify('Your request failed. Please try again in a few seconds.', 'error');
            });
        },
        transformInProject(){
            this.busy = true;
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", window.localStorage.sRegisterToken);
            const data = JSON.stringify({
            });
            fetch(config.serverUrl + `/api/tasks/${this.localTask.id}/taskToProject`, {
                headers: headers,
                method: "POST",
                body: data
            })
            .then(response => {
                response.json().then(object => {
                    if(response.ok) {
                        // this.updateTaskSuccess(object);
                        notify.notify(object.message, 'success');
                        console.log('sucesso', object);
                    } else {
                        this.busy = false;
                        // notify.notify(object.message, 'error');
                        EventBus.$emit('HANDLE_REQUEST_ERROR', {response, object});
                    }
                });
            })
            .catch(error => {
                this.busy = false;
                console.error(error);
                notify.notify('Your request failed. Please try again in a few seconds.', 'error');
            });
        },
        setTaskFormData(){
            // this.targetSituation = this.task.situation.id;
            this.localTask = Object.assign({},this.task);
        }
    },
    watch: {
        // whenever editFormActive changes, this function will run
        editFormActive: function (newProp, oldProp) {
            if(newProp && !oldProp) {
                this.setTaskFormData();
            }
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
                        <div class="taskInfo">{{localTask.situation.situation}}</div>
                    </div>
                </div>

                <div class="row">
                    <div class="col">
                        <button class="btn btn-info" @click="transformInProject()">Transform in project</button>
                        <button class="btn btn-success" @click="alert('implementar')">Complete task</button>
                    </div>
                </div>

                <div class="row">
                    <div class="col">
                        <input class="form-control" type="text" placeholder="name" v-model="localTask.name" />
                    </div>
                </div>

                <div class="row">
                    <div class="col">
                        <input class="form-control" type="date" placeholder="duedate" v-model="localTask.duedate" />
                    </div>
                </div>

                <div class="row">
                    <div class="col">
                        <textarea class="form-control" rows="3" name="description" v-model="localTask.description"></textarea>
                    </div>
                </div>

                <div class="row">
                    <div class="col">
                        <label for="situation">Situation</label>
                        <select v-model="localTask.situation.id" class="form-control" name="targetSituation" id="situation">
                            <option disabled selected value="">--</option>
                            <option 
                                v-for="situation in situations"
                                :key="situation.id"
                                :value="situation.id"
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