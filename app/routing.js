
import Login from "./../ScreenComponents/Login.js";
import NotebooksIndex from "./../ScreenComponents/Notebooks/Index.js";
import NotesIndex from "./../ScreenComponents/Inbox/Index.js";

const page = '?page=';
const NotFound = { template: '<p>404 Page not found</p>' };
const HomeScreenComponent = {
    route: `/${page}notebooksIndex`,
    hash: '#notebooksIndex',
    name: 'notebooksIndex',
    component: NotebooksIndex
};

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
            route: `/${page}notebooksIndex`,
            hash: '#notebooksIndex',
            name: 'notebooksIndex',
            component: NotebooksIndex
        },
        {
            route: `/${page}notesIndex`,
            hash: '#notesIndex',
            name: 'notesIndex',
            component: NotesIndex
        },
        HomeScreenComponent
    ],
    'NotFoundScreenComponent': {
        route: undefined,
        hash: '',
        name: 'NotFound',
        component: NotFound
    },
    'HomeScreenComponent': HomeScreenComponent 
};