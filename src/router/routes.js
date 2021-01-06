
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ]
  },
  {
    path: '/doctor/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/ViewDoctor') }
    ]
  },
    {
        path: '/appointment/new',
        component: () => import('layouts/MainLayout.vue'),
        children: [
            { path: '', component: () => import('pages/NewAppointment') }
        ]
    },
    {
        path: '/office/:id',
        component: () => import('layouts/MainLayout.vue'),
        children: [
            { path: '', component: () => import('pages/ViewOffice') }
        ]
    },
    {
        path: '/appointment/:id',
        component: () => import('layouts/MainLayout.vue'),
        children: [
            { path: '', component: () => import('pages/ViewAppointment') }
        ]
    },
    {
        path: '/medication/:id',
        component: () => import('layouts/MainLayout.vue'),
        children: [
            { path: '', component: () => import('pages/ViewMedication') }
        ]
    },
    {
        path: '/lab-result/:id',
        component: () => import('layouts/MainLayout.vue'),
        children: [
            { path: '', component: () => import('pages/ViewLabResult') }
        ]
    },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
