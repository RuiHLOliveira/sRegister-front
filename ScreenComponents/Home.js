import config from "./../app/config.js";
export default {
    data: function () {
      return {
        }
    },
    methods: {
        logout(){
            window.localStorage.sRegisterToken = '';
            this.$emit('route','Login');
        },
    },
    template: `
    <div>
        <button @click="logout">Logout</button>
    </div>
    `
};