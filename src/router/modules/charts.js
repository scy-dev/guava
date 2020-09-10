let dataCharts = [
    {
        path: '/workerAnalysis',
        component: () => import('./../../views/DataAnalysis/workerChart.vue'),
        name: '劳务分析',
        meta: {
            breadcrumb:['报表分析','劳务分析'],
            parent:'报表分析'
        },

    },
    {
        path: '/environmentAnalysis',
        component: () => import('./../../views/DataAnalysis/environmentChart.vue'),
        name: '环境监测',
        meta: {
            breadcrumb:['报表分析','环境监测'],
            parent:'报表分析'
        }
    }
];
export default dataCharts;