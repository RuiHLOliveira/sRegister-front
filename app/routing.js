
import Login from "./../ScreenComponents/Login.js";
import Home from "./../ScreenComponents/Home.js";
import InboxIndex from "./../ScreenComponents/Inbox/Index.js";

const NotFound = { template: '<p>404 Page not found</p>' };
const page = '?page=';
export default {
    'screenComponents': [
        {
            route: '',
            hash: '#Login',
            name: 'Login',
            component: Login
        },
        {
            route: '/',
            hash: '#Login',
            name: 'Login',
            component: Login
        },
        {
            route: `/${page}home`,
            hash: '#Home',
            name: 'Home',
            component: Home
        },
        {
            route: `/${page}inboxIndex`,
            hash: '#InboxIndex',
            name: 'InboxIndex',
            component: InboxIndex
        },
    ],
    'NotFoundScreenComponent': {
        route: undefined,
        hash: '',
        name: 'NotFound',
        component: NotFound
    }
};