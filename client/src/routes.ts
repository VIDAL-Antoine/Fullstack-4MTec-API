import ListeAppareils from './components/ListeAppareils.vue';
import LoginPage from './components/LoginPage.vue';
import NotFound from './components/NotFound.vue';
import SignUp from './components/SignUpPage.vue';

export default [
    { path: '/', redirect: '/login' },
    { path: '/appareils', component: ListeAppareils },
    { path: '/signup', component: SignUp },
    { path: '/login', component: LoginPage },
    { path: '*', component: NotFound },
];