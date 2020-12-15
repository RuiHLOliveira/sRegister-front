import EventBus from "./../app/EventBus.js";
import config from "./../app/config.js";

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
            this.busy = true;
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            const data = JSON.stringify({
                'email': this.email,
                'password': this.password
            });

            fetch(config.serverUrl + "/auth/login",{
                headers: headers,
                method: "POST",
                body: data
            })
            .then(response => {
                response.json().then(object => {
                    if(response.ok) {
                        this.busy = false;
                        window.localStorage.sRegisterToken = object.token;
                        window.localStorage.sRegisterRefreshToken = object.refresh_token;
                        console.log(window.localStorage.sRegisterRefreshToken);
                        this.showNotice(object.message,'success');
                        EventBus.$emit('route','Home');
                    } else {
                        this.busy = false;
                        EventBus.$emit('HANDLE_REQUEST_ERROR', {response, object});
                        // this.showNotice(object.message, 'error');
                    }
                });
            })
            .catch(error => {
                this.busy = false;
                this.showNotice('Your request failed. Please try again in a few seconds.', 'error');
            });
            this.busy = false;
        },
        showNotice(notice, noticeType, time) {
            if(time == null) time = 5000;
            EventBus.$emit('notice', {
                'notice': notice,
                'noticeType': noticeType,
                'time': time
            });
        }
    },
    template: `
    <div class="flexWrapper">

        <application-menu></application-menu>

        <div class="container">
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