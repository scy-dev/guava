let set = [
    {
        path: '/role',
        component: () => import('@/views/set/role'),
        name: '角色管理',
        meta: {
            breadcrumb: ['设置', '角色管理'],
            parent:'设置'
        }
    },
    {
        path: '/account',
        component: () => import('@/views/set/account'),
        name: '账户管理',
        meta: {
            breadcrumb: ['设置', '账户管理'],
            parent:'设置'
        }
    },
    {
        path: '/changePassword',
        component: () => import('@/views/set/changePassword'),
        name: '修改密码',
        meta: {
            breadcrumb: ['设置', '修改密码'],
            parent:'设置'
        }
    },
    {
        path: '/log',
        component: () => import('@/views/set/log'),
        name: '操作日志',
        meta: {
            breadcrumb: ['设置', '操作日志'],
            parent:'设置'
        }
    },
    {
        path: '/role/addwork',
        component: () => import('@/views/set/addwork'),
        name: '新增角色',
        meta: {
            breadcrumb: ['设置', '角色管理','新增角色'],
            parent:'设置'
        }
    },
    {
        path: '/role/editwork',
        component: () => import('@/views/set/addwork'),
        name: '编辑角色',
        meta: {
            breadcrumb: ['设置', '角色管理','编辑角色'],
            parent:'设置'
        }
    },

]
export default set