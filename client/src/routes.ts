import ListeAppareils from './components/ListeAppareils.vue';
import NotFound from './components/NotFound.vue';

export default [
    { path: '/liste', component: ListeAppareils },
    { path: '/', redirect: '/liste' },
    { path: '*', component: NotFound },
];