let SalaryManagement = [
    {
        path: '/salaryManagement',
        component: () => import('@/views/salaryManagement'),
        name: '薪资管理',
        meta: {
            breadcrumb:['薪资管理'],
            parent:'薪资管理'
        }
    }
]
export default SalaryManagement