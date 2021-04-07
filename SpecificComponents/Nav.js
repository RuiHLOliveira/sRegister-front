import EventBus from "./../app/EventBus.js";
export default {
    data: function () {
      return {
            userName: "guy"
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
        route(name){
            EventBus.$emit('route',name);
        },
        action(name){
            EventBus.$emit('action',name)
        },
    },
    template: /*jsx*/`
    <div>
        <link rel="stylesheet" href="/SpecificComponents/nav.css">
        <nav id="sidebar">
            <div class="sidebar-header">
                <span>
                    <i class="fas fa-2x fa-tasks"></i>
                    <br>sRegister
                </span>
            </div>

            <div v-if="userAuth" class="sidebarUserWelcome">
                <span>Hey, {{userName}}!</span>
            </div>
            
            <ul id="nav-menu">
                <li v-if="userGuest">
                    <button @click="route('Login')">
                        <i class="fas fa-user-check"></i>
                        Login
                    </button>
                </li>
                <li v-if="userGuest">
                    <button @click="route('Register')">
                        <i class="fas fa-user-plus"></i>
                        Register
                    </button>
                </li>
                <li v-if="userAuth">
                    <button class="mb-4" @click="action('logout')">
                        <i class="fas fa-user-times"></i>
                        Logout
                    </button>
                </li>
                <li v-if="userAuth">
                    <button @click="route('notebooksIndex')">
                        <i class="fas fa-plus"></i>
                        Notebooks
                    </button>
                </li>
                <li v-if="userAuth">
                    <button 
                        @click="route('InvitationsIndex')"
                    >
                        <i class="fas fa-envelope-open-text"></i>
                        Invitations
                    </button>
                </li>
            </ul>
        </nav>
    </div>

    `
};