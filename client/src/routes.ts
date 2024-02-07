import ListeAppareils from './components/ListeAppareils.vue';
import NotFound from './components/NotFound.vue';

export default [
    { path: '/', component: ListeAppareils },
    { path: '*', component: NotFound },
];