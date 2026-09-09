import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import PlayView from '../views/PlayView.vue';
import ResultsView from '../views/ResultsView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/play/:id', name: 'play', component: PlayView },
    { path: '/results', name: 'results', component: ResultsView },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;