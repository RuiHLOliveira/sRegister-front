import Vue from 'vue';
import Router from 'vue-router';

import Login from './views/Login.vue';
import Home from './views/Home.vue';
import NotebookIndex from './views/notebooks/NotebookIndex.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: "/",
            component: Login
        },
        {
            path: "/home",
            component: Home
        },
        {
            path: "/notebooks",
            component: NotebookIndex
        }
    ]
});