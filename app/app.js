import routing from "./routing.js";
import ApplicationMenu from './../SpecificComponents/Nav.js';

Vue.component('application-menu', ApplicationMenu);

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
                this.routeTo('Home');
            } else {
                this.routeTo('Login');
            }
        }
    },
    created () {
        this.defineStartScreen();
    },
    render: function (createElement) {
        const vue = this;
        return createElement(
            this.ViewComponent,
            {
                on: {
                    route: function (event) {
                        vue.routeTo(event);
                    }
                },
            }
        );
    }
});