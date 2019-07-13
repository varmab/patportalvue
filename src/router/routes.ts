import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/PatPortalLayout.vue'),
    children: [
      { path: ':connection/:PatId', component: () => import('pages/PatientAptPage.vue') },
      { path: 'schedule', component: () => import('pages/ScheduleAptPage.vue') },
    ],
  },
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue'),
  });
}

export default routes;
