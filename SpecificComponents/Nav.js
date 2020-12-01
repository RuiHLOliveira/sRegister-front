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
        logout(){
            window.localStorage.sRegisterToken = '';
            this.$emit('route','Login');
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
                <a href="#" @click="$emit('route','Login')">
                    <i class="fas fa-user-check"></i>
                    Login
                </a>
            </li>
            <li v-if="userGuest">
                <a href="#" @click="$emit('route','Register')">
                    <i class="fas fa-user-plus"></i>
                    Register
                </a>
            </li>
            <li v-if="userAuth">
                <button @click="logout">
                    <i class="fas fa-user-times"></i>
                    Logout
                </button>
            </li>
            <li v-if="userAuth">
                <button @click="$emit('route','Register')">
                    <i class="fas fa-plus"></i>
                    Inbox
                </button>
            </li>
            <li v-if="userAuth">
                <button>
                    <i class="fas fa-align-justify"></i>
                    Situations
                </button>
            </li>
            <li v-if="userAuth">
                <button>
                    <i class="fas fa-envelope-open-text"></i>
                    Invitations
                </button>
            </li>
        </ul>
    </nav>
    `
};