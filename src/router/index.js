import routeHome from './modules/Home'
import routeProjectManagement from './modules/ProjectManagement'
import AttendanceManagement from './modules/AttendanceManagement'
import workerManagemant from './modules/workerManagemant'
import salaryManagement from './modules/salaryManagement'
import set from './modules/set'
import register from './modules/register'
import chart from './modules/charts'
import safety from './modules/safety'

let routes = [
    {
        path: '/menu',
        component: () => import('@/views/Menu'),
        name: '导航',
        redirect: '/home',
        children: [
            ...routeHome,
            ...routeProjectManagement,
            ...AttendanceManagement,
            ...workerManagemant,
            ...salaryManagement,
            ...set,
            ...chart,
            ...safety
        ]
    },
    {
        path: '/',
        component: () => import('@/views/Login'),
        name: 'login'
    },
    {
        path: '*',
        redirect: '/'
    },
    ...register

];

export default routes;