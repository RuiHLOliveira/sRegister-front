import EventBus from "./../app/EventBus.js";
import config from "./../app/config.js";
import request from "./../app/request.js";
import notify from "./../app/notify.js";

export default {
    data: function () {
      return {
            email: '',
            password: '',
            notice: '',
            noticeType: '',
            busy: true,
        }
    },
    created () {
        this.busy =  false;
    },
    methods: {
        login(){

            // const exception = (error) => {
            //     console.error(error);
            //     this.busy = false;
            //     notify.notify('Your request failed. Please try again in a few seconds.', 'error');
            // };

            this.busy = true;

            const failFunction = (response, json) => {
                this.busy = false;
                EventBus.$emit('HANDLE_REQUEST_ERROR', {response, json});
            };

            let requestData = {};
            const headers = new Headers();
            requestData['url'] = config.serverUrl + "/auth/login";
            requestData['method'] = "POST";
            requestData['headers'] = headers;
            requestData['data'] = {
                'email': this.email,
                'password': this.password
            };

            request.fetch(requestData)
            .then(([response,json]) => {
                this.busy = false;
                window.localStorage.sRegisterToken = json.token;
                window.localStorage.sRegisterRefreshToken = json.refresh_token;
                notify.notify(json.message,'success');
                EventBus.$emit('route','notebooksIndex');
            })
            .catch((error) => {
                console.error(error);
                this.busy = false;
                notify.notify(error,'erro');
                // EventBus.$emit('HANDLE_REQUEST_ERROR', {response, json});
            });
        },
    },
    template: `
    <div class="flexWrapper">

        <application-menu></application-menu>

        <div class="mainContainer">
            <form @submit.prevent="login">
                <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>

                <label for="inputEmail">Email</label>
                <input 
                    :disabled="busy"
                    v-model="email"
                    class="form-control"
                    type="email" name="email" id="inputEmail"
                    required autofocus
                >

                <label class="mt-3" for="inputPassword">Password</label>
                <input 
                    :disabled="busy"
                    v-model="password" 
                    class="form-control"
                    type="password" name="password" id="inputPassword"
                    required
                >

                <button 
                    :disabled="busy" type="submit"
                    class="mt-3 btn btn-primary" 
                >
                    Sign in
                </button>

                <div class="loader" v-if="busy"></div>
                <notice-box></notice-box>

            </form>
        </div>
    </div>
    `
};