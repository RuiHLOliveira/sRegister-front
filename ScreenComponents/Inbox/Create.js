import notify from "../../app/notify.js";
import config from "../../app/config.js";
import EventBus from "../../app/EventBus.js";

export default {
    data: function () {
      return {
            busy: true,
            taskName: null,
            newTask: null,
            // targetSituation: null,
        }
    },
    props: ['createFormActive', 'createdTask'],
    computed: {
    },
    methods: {
        closeModal () {
            this.$emit('update:createFormActive', false)
            this.$emit('update:createdTask', this.newTask)
            // this.$emit('update:task', null)
        },
        createdTaskSuccess (object) {
            this.busy = false;
            this.newTask = object.task;
            this.closeModal();
            notify.notify(object.message,'success');
        },
        createTask() {
            this.busy = true;
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", window.localStorage.sRegisterToken);
            const data = JSON.stringify({
                'name': this.taskName,
            });
            fetch(config.serverUrl + `/api/tasks`, {
                headers: headers,
                method: "POST",
                body: data
            })
            .then(response => {
                response.json().then(object => {
                    if(response.ok) {
                        this.createdTaskSuccess(object);
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
        // transformInProject(){
        //     this.busy = true;
        //     const headers = new Headers();
        //     headers.append("Content-Type", "application/json");
        //     headers.append("Authorization", window.localStorage.sRegisterToken);
        //     const data = JSON.stringify({
        //     });
        //     fetch(config.serverUrl + `/api/tasks/${this.task.id}/taskToProject`, {
        //         headers: headers,
        //         method: "POST",
        //         body: data
        //     })
        //     .then(response => {
        //         response.json().then(object => {
        //             if(response.ok) {
        //                 // this.updateTaskSuccess(object);
        //                 notify.notify(object.message, 'success');
        //                 console.log('sucesso', object);
        //             } else {
        //                 this.busy = false;
        //                 // notify.notify(object.message, 'error');
        //                 EventBus.$emit('HANDLE_REQUEST_ERROR', {response, object});
        //             }
        //         });
        //     })
        //     .catch(error => {
        //         this.busy = false;
        //         console.error(error);
        //         notify.notify('Your request failed. Please try again in a few seconds.', 'error');
        //     });
        // }
    },
    watch: {
        // whenever createFormActive changes, this function will run
        // createFormActive: function (newProp, oldProp) {
        //     if(newProp && !oldProp) {
        //         this.targetSituation = this.task.situation.id;
        //     }
        // }
    },
    created () {
        // this.loadInbox();
        this.busy = false;
    },
    template: `
    <div class="flexWrapper editForm modal" v-if="createFormActive">

            <div class="modal_container lg form-group">
                <div class="row">
                    <div class="col">
                        <h2 class="taskInfo">New Task</h2>
                    </div>
                </div>

                <div class="row">
                    <div class="col">
                        <input class="form-control" type="text" placeholder="name" v-model="taskName" />
                    </div>
                </div>

                <button class="btn btn-danger" @click="closeModal()">Cancel</button>
                <button class="btn btn-success" @click="createTask()">Save</button>

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