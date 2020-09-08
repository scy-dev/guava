let AttendanceManagement = [
    {
        path: '/report',
        component: () => import('@/views/AttendanceManagement/AttendanceReport'),
        name: '考勤报表',
        meta: {
            breadcrumb:['考勤管理','考勤报表'],
            parent:'考勤管理'
        }
    },
    {
        path: '/records',
        component: () => import('@/views/AttendanceManagement/AttendanceRecords'),
        name: '考勤记录',
        meta: {
            breadcrumb:['考勤管理','考勤记录'],
            parent:'考勤管理'
        }
    },
    {
        path: '/view',
        component: () => import('@/views/AttendanceManagement/AttendanceView'),
        name: '排班视图',
        meta: {
            breadcrumb:['考勤管理','排班视图'],
            parent:'考勤管理'
        }
    },
    {
        path: '/schedule',
        component: () => import('@/views/AttendanceManagement/AttendanceSchedule'),
        name: '班次设置',
        meta: {
            breadcrumb:['考勤管理','班次设置'],
            parent:'考勤管理'
        }
    },
    {
        path: '/schedule/addSchedule',
        component: () => import('@/views/AttendanceManagement/AttendanceAddSchedule'),
        name: '新增班次',
        meta: {
            breadcrumb:['考勤管理','班次设置','新增班次'],
            parent:'考勤管理'
        }
    },
    {
        path: '/schedule/editSchedule',
        component: () => import('@/views/AttendanceManagement/AttendanceAddSchedule'),
        name: '修改班次',
        meta: {
            breadcrumb:['考勤管理','班次设置','修改班次'],
            parent:'考勤管理'
        }
    },
    {
        path: '/rule',
        component: () => import('@/views/AttendanceManagement/AttendanceRule'),
        name: '排班规则',
        meta: {
            breadcrumb:['考勤管理','排班规则'],
            parent:'考勤管理'
        }
    },
    {
        path: '/rule/newrule',
        component: () => import('@/views/AttendanceManagement/NewRule'),
        name: '新增排班',
        meta: {
            breadcrumb:['考勤管理','排班规则','新增排班'],
            parent:'考勤管理'
        }
    },
    {
        path: '/rule/editrule',
        component: () => import('@/views/AttendanceManagement/NewRule'),
        name: '编辑排班',
        meta: {
            breadcrumb:['考勤管理','排班规则','编辑排班'],
            parent:'考勤管理'
        }
    },
    {
        path: '/rule/ruledetail',
        component: () => import('@/views/AttendanceManagement/RuleDetail'),
        name: '班次人员',
        meta: {
            breadcrumb:['考勤管理','排班规则','班次人员'],
            parent:'考勤管理'
        }
    },
    {
        path: '/device/list',
        component: () => import('@/views/AttendanceManagement/AttendanceDevice'),
        name: '设备信息',
        meta: {
            breadcrumb:['设备管理','设备信息'],
            parent:'设备管理'
        }
    },
    {
        path:'/device/location',
        component: () => import('@/views/deviceManagement/location-manage.vue'),
        name: '位置管理',
        meta:{
            breadcrumb: ['设备管理','位置管理'],
            parent: '设备管理'
        }
    },
    {
        path: '/device/location/add',
        component: () => import('@/views/deviceManagement/location/add-location.vue'),
        name: '位置信息',
        meta:{
            breadcrumb: ['设备管理','位置管理','位置信息'],
            parent: '设备管理'
        }
    },
    {
        path: '/device/newequipment',
        component: () => import('@/views/AttendanceManagement/NewEquipment'),
        name: '新增设备',
        meta: {
            breadcrumb:['设备管理','设备信息','新增设备'],
            parent:'设备管理'
        }
    },
    {
        path: '/device/editequipment',
        component: () => import('@/views/AttendanceManagement/NewEquipment'),
        name: '编辑设备',
        meta: {
            breadcrumb:['设备管理','设备信息','编辑设备'],
            parent:'设备管理'
        }
    },
    {
        path: '/device/equipmentdetail',
        component: () => import('@/views/AttendanceManagement/EquipmentDetail'),
        name: '查看工人',
        meta: {
            breadcrumb:['考勤管理','设备管理','查看工人'],
            parent:'设备管理'
        }
    },

    
]
export default AttendanceManagement;
