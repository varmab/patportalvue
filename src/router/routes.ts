import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/PatPortalLayout.vue'),
    children: [
      { path: 'list/:connection/:PatId', component: () => import('pages/AppointmentsList.vue') },
      { path: 'schedule', component: () => import('pages/ScheduleAppointment.vue')},
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
