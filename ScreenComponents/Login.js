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
                        this.showNotice(object.message,'success');
                        EventBus.$emit('route','Home');
                    } else {
                        this.busy = false;
                        this.showNotice(object.message, 'error');
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
                <input :disabled="busy" type="email" v-model="email" name="email" id="inputEmail" class="form-control" required autofocus>
                <label for="inputPassword">Password</label>
                <input :disabled="busy" type="password" v-model="password" name="password" id="inputPassword" class="form-control" required>

                <button 
                    :disabled="busy" type="submit"
                    class="btn btn-lg btn-primary" 
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