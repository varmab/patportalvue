import { RouteConfig } from 'vue-router';

// tslint:disable-next-line:max-line-length
// const connection = 'connection%3D%7Buser%3A%20%22sa%22%2Cpassword%3A%20%22Hangten%2316%22%2Cserver%3A%20%2218.208.153.181%22%2Cinstance%3A%20%22SQLExpress%22%2Cdatabase%3A%20%22calmed%22%7D';

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
