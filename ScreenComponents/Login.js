import config from "./../app/config.js";

export default {
    data: function () {
      return {
        email: '',
        password: '',
        notice: '',
        noticeType: ''
        }
    },
    methods: {
        login(){
            var form = new FormData();
            form.set('email', this.email);
            form.set('password', this.password);

            fetch(config.serverUrl + "/auth/login",{
                method: "POST",
                body: form
            })
            .then(response => {
                response.json().then(object => {
                    if(response.ok) {
                        window.localStorage.sRegisterToken = object.token;
                        this.showNotice(object.message,'success');
                        this.$emit('route','Home');
                    } else {
                        this.showNotice(object.message, 'error');
                    }
                });
            });
        },

        showNotice(notice, type) {
            this.notice = notice;
            this.noticeType = type;
            let vue = this;
            setTimeout(function () {
                vue.notice = '';
                vue.noticeType = '';
            }, 2000, this);
        }
    },
    template: `

    <div>
        <form @submit.prevent="login">
            <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>

            <!-- mostrar error aqui -->
            <!-- <div class="alert alert-danger">{{ error.messageKey|trans(error.messageData, 'security') }}</div> -->

            <label for="inputEmail">Email</label>
            <input type="email" v-model="email" name="email" id="inputEmail" class="form-control" required autofocus>
            <label for="inputPassword">Password</label>
            <input type="password" v-model="password" name="password" id="inputPassword" class="form-control" required>

            <button class="btn btn-lg btn-primary" type="submit">Sign in</button>

            <br><br>

            <div class="noticeBoxContainer" 
                :class="{ ativo: notice != '' }">
                <div class="noticeBox" :class="{
                        error: noticeType == 'error',
                        success: noticeType == 'success'
                    }">{{notice}}</div>
            </div>
        </form>
    </div>
    `
};