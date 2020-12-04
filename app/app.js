import EventBus from "./EventBus.js";
import routing from "./routing.js";
import ApplicationMenu from './../SpecificComponents/Nav.js';
import noticeBox from "./../Components/NoticeBox.js";

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
            if(fullScreenComponent === undefined) fullScreenComponent = NotFoundScreenComponent
            return fullScreenComponent;
        },
        findFullScreenComponent (screenComponentName) {
            let fullScreenComponent = routing.screenComponents.find( component => {
                return component.name === screenComponentName
            });
            if(fullScreenComponent === undefined) fullScreenComponent = NotFoundScreenComponent
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
                this.routeTo(screenComponent.name);
            } else {
                this.routeTo('Login');
            }
        },
        showNotice(notice, noticeType, time){
            let vue = this;
            vue.notice = notice;
            vue.noticeType = noticeType;
            setTimeout(function () {
                vue.notice = '';
                vue.noticeType = '';
            }, time);
        }
    },
    created () {
        EventBus.$on('AUTH_CHECK',(data) => {
            if(!data.response.ok &&
                data.response.status == 401){
                this.runAction('logout');
                this.showNotice('Session expired, please login again', 'error');
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