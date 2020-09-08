let safety = [
    {
        path: '/safety',
        component: () => import('@/views/safetyManagement/index'),
        name: '安全管理',
        meta: {
            breadcrumb: ['安全管理', '视频监控'],
            parent:'安全管理'
        }
    }
];

export default safety;