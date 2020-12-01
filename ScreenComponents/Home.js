export default {
    data: function () {
      return {
            userName: 'man'
        }
    },
    computed: {
        userGuest () {
            if(window.localStorage.sRegisterToken === '' ||
            window.localStorage.sRegisterToken === undefined){
                return true;
            }
            return false;
        },
        userAuth () {
            return !this.userGuest;
        }
    },
    methods: {
        logout(){
            window.localStorage.sRegisterToken = '';
            this.$emit('route','Login');
        },
    },
    template: `
    <div class="flexWrapper">
        <application-menu></application-menu>
        <div class="container">
            Welcome, {{userName}}
        </div>
    </div>
    `
};