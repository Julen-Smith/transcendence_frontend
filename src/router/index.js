import { createRouter, createWebHistory } from 'vue-router';
import RegisterView from '../views/RegisterView.vue';
import LoginView from '../views/LoginView.vue';
import LandingPage from '@/views/LandingPage.vue';
import MainDashboard from '@/views/MainDashboard.vue';
import ProfileView from '@/views/ProfileView.vue';
import GamesView from '@/views/GamesView.vue';
import SettingsView from '@/views/SettingsView.vue';
import SocialView from '@/views/SocialView.vue';
import MonitoringView from '@/views/MonitoringView.vue';
import NotFindView from '@/components/NotFoundView.vue';

/* Common routes , sin auth */
const routes = [
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component:  NotFindView
  },
  {
    path: '/',
    name: 'LandingPage',
    component: LandingPage,
    
  },
  {
    path: '/register:pathMatch(.*)*',
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/Login',
    name: 'LoginView',
    component: LoginView,
  },
/* Meter apartir de aqui paginas que requieran el bearer pls*/
  {
    path: '/dashboard',
    name: 'MainDashboard',
    component: MainDashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/game.html',
    component: { template: '<div></div>' },
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'ProfileView',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/games',
    name: 'GamesView',
    component: GamesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/social',
    name: 'SocialView',
    component: SocialView,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'SettingsView',
    component: SettingsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/monitoring',
    name: 'MonitoringView',
    component: MonitoringView,
    meta: { requiresAuth: true }
  },

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
