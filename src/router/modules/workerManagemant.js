let workerManagemant = [
    {
        path: '/workerlist',
        component: () => import('./../../views/workerManagement/workerList.vue'),
        name: '工人列表',
        meta: {
            breadcrumb:['工人管理','工人列表'],
            parent:'工人管理'
        },

    },
    {
        path: '/workercontract',
        component: () => import('./../../views/workerManagement/workerContract.vue'),
        name: '工人合同',
        meta: {
            breadcrumb:['工人管理','工人合同'],
            parent:'工人管理'
        }
    },
    {
        path: '/workercontract/setupcontract',
        component: () => import('./../../views/workerManagement/setUpContract.vue'),
        name: '设置合同',
        meta: {
            breadcrumb:['工人管理','工人合同','设置合同'],
            parent:'工人管理'
        }
    },
    { 
        path: '/workerlist/detail',
        component: () => import('./../../views/workerManagement/workerDetail.vue'),
        name: '工人列表',
        meta: {
            breadcrumb:['工人管理','工人列表'],
            parent:'工人管理'
        },
    }, 
]
export default workerManagemant;