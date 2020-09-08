let register = [
    {
        path: '/resetpassword',
        component: () => import('@/views/register/resetpassword'),
    },
    {
        path: '/registerproject',
        component: () => import('@/views/register/registerproject'),
    },
    {
        path: '/verification',
        component: () => import('@/views/register/verification'),
    }
]
export default register