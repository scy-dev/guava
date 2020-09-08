let routeHome = [
            {
                path: '/home',
                component: () => import('@/views/Home'),
                name: '迭代规划',
                meta: {
                    breadcrumb:['迭代规划'],
                    parent:'迭代规划'
                }
            }
        ]
export default routeHome