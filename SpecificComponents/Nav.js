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
    template: `
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
                <button @click="action('logout')">
                    <i class="fas fa-user-times"></i>
                    Logout
                </button>
            </li>
            <li v-if="userAuth">
                <button @click="route('Home')">
                    <i class="fas fa-home"></i>
                    Home
                </button>
            </li>
            <li v-if="userAuth">
                <button @click="route('InboxIndex')">
                    <i class="fas fa-plus"></i>
                    Inbox
                </button>
            </li>
            <li v-if="userAuth">
                <button @click="route('ProjectsIndex')">
                    <i class="fas fa-plus"></i>
                    Projects
                </button>
            </li>
            <li v-if="userAuth">
                <button @click="route('SituationsIndex')">
                    <i class="fas fa-align-justify"></i>
                    Situations
                </button>
            </li>
            <li v-if="userAuth">
                <button @click="route('InvitationsIndex')">
                    <i class="fas fa-envelope-open-text"></i>
                    Invitations
                </button>
            </li>
        </ul>
    </nav>
    `
};