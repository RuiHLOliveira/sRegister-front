
import Login from "./../ScreenComponents/Login.js";
import Home from "./../ScreenComponents/Home.js";

const NotFound = { template: '<p>Page not found</p>' };
const page = '?page=';
export default {
    'screenComponents': [
        {
            route: '',
            name: 'Login',
            component: Login
        },
        {
            route: '/',
            name: 'Login',
            component: Login
        },
        {
            route: `${page}home`,
            name: 'Home',
            component: Home
        },
    ],
    'NotFoundScreenComponent': {
        route: undefined,
        name: 'NotFound',
        component: NotFound
    }
};