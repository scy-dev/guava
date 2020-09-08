let routeProjectManagement = [
    {
        path: '/information',
        component: () => import('@/views/ProjectManagement/information'),
        name: '项目信息',
        meta: {
            breadcrumb:['项目管理','项目信息'],
            parent:'项目管理'
        }
    },
    //编辑企业
    {
        path: '/information/bjcompany',
        component: () => import('@/views/ProjectManagement/bjcompany'),
        name: '编辑企业信息',
        meta: {
            breadcrumb:['项目管理','项目信息','编辑企业信息'],
            parent:'项目管理'
        }
    },
    {
        path: '/subcontract',
        component: () => import('@/views/ProjectManagement/subcontract'),
        name: '分包管理',
        meta: {
            breadcrumb:['项目管理','分包管理'],
            parent:'项目管理'
        }
    },
    //分包新增
    {
        path: '/subcontract/subcontractAdd',
        component: () => import('@/views/ProjectManagement/subcontractAdd'),
        name: '新增分包信息',
        meta: {
            breadcrumb:['项目管理','分包管理','新增分包信息'],
            parent:'项目管理'
        }
    } ,
    {
        path: '/team',
        component: () => import('@/views/ProjectManagement/team'),
        name: '班组管理',
        meta: {
            breadcrumb:['项目管理','班组管理'],
            parent:'项目管理'
        }
    } ,
    //班组查看
    {
        path: '/team/teamQuery',
        component: () => import('@/views/ProjectManagement/teamQuery'),
        name: '班组详情',
        meta: {
            breadcrumb:['项目管理','班组管理','班组详情'],
            parent:'项目管理'
        }
    },
    //班组查看之后查询
    /* {
        path: '/team/detail',
        component: () => import('@/views/ProjectManagement/teamQuery'),
        name: '班组管理',
        meta: {
            breadcrumb:['项目信息','班组管理','班组详情']
        }
    }  */
]
export default routeProjectManagement