import EventBus from "./EventBus.js";
import routing from "./routing.js";
import ApplicationMenu from './../SpecificComponents/Nav.js';
import noticeBox from "./../Components/NoticeBox.js";
import config from "./../../app/config.js";
import notify from "./notify.js";

Vue.component('application-menu', ApplicationMenu);
Vue.component('notice-box', noticeBox);

const vm = new Vue({
    el: "#app",
    data: {
        currentScreenComponent: routing.NotFoundScreenComponent
    },
    computed: {
        ViewComponent () {
            return this.currentScreenComponent;
        }
    },
    methods: {
        runAction (actionName) {
            if(actionName == 'logout') {
                this.logout();
            } else {
                console.log('unsuported action: ', actionName);
            }
        },
        logout () {
            window.localStorage.sRegisterToken = '';
            this.routeTo('Login');
        },
        findFullScreenComponentByHash(hash){
            let fullScreenComponent = routing.screenComponents.find( component => {
                return component.hash === hash
            });
            if(fullScreenComponent === undefined) fullScreenComponent = routing.NotFoundScreenComponent
            return fullScreenComponent;
        },
        findFullScreenComponent (screenComponentName) {
            let fullScreenComponent = routing.screenComponents.find( component => {
                return component.name === screenComponentName;
            });
            
            if(fullScreenComponent === undefined) fullScreenComponent = routing.NotFoundScreenComponent
            return fullScreenComponent;
        },
        routeTo (screenComponentName){
            const fullScreenComponent = this.findFullScreenComponent(screenComponentName);
            this.currentScreenComponent = fullScreenComponent.component;
            // history.pushState({}, fullScreenComponent.name, fullScreenComponent.route);
            location.hash = fullScreenComponent.name;
        },
        defineStartScreen () {
            if(window.localStorage.sRegisterToken !== ''){
                let screenComponent = this.findFullScreenComponentByHash(location.hash);
                this.routeTo(screenComponent.name == 'NotFound' ? routing.HomeScreenComponent.name : screenComponent.name);
            } else {
                this.routeTo('Login');
            }
        },
        refreshToken(){
            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            const data = JSON.stringify({
                'refresh_token': window.localStorage.sRegisterRefreshToken
            });
            fetch(config.serverUrl + "/auth/refreshToken",{
                headers: headers,
                method: "POST",
                body: data
            })
            .then(response => {
                response.json().then(object => {
                    if(response.ok) {
                        window.localStorage.sRegisterToken = object.token;
                        window.localStorage.sRegisterRefreshToken = object.refresh_token;
                        alert('recebi o refresh token')
                        // EventBus.$emit('route','Home');
                    } else {
                        this.runAction('logout');
                        setTimeout(function () {
                            notify.notify('Session expired, please login again', 'error');
                        }, 200);
                    }
                });
            })
            .catch(error => {
                notify.notify('Your request failed. Please try again in a few seconds.', 'error');
            });
        },
    },
    created () {
        EventBus.$on('HANDLE_REQUEST_ERROR',(data) => {
            if(!data.response.ok &&
            data.response.status == 401){
                this.refreshToken();
            } else {
                notify.notify(data.object.message, 'error');
            }
        });
        EventBus.$on('route',(data) => {
            this.routeTo(data);
        });
        EventBus.$on('action',(data) => {
            this.runAction(data);
        });
        this.defineStartScreen();
    },
    render: function (createElement) {
        return createElement(this.ViewComponent);
    }
});