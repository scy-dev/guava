import axios from 'axios'

// 工人信息列表
export const workersList = params => {return axios.post(`${process.env.API_ROOT}person/selectPage`,params).then(res=>res.data).catch(error=>{console.log(error);})}
// 添加工人信息
export const addWorker = params =>{ return axios.post(`${process.env.API_ROOT}person/add`,params).then(res=>res.data).catch(error=>{console.log(error);})}
// 员工出入记录
export const recordList = params =>{ return axios.post(`${process.env.API_ROOT}personRecord/selectPage`,params).then(res=>res.data).catch(error=>{console.log(error)})}
// 设备列表
export const deviceList = params =>{ return axios.post(`${process.env.API_ROOT}device/list`,params).then(res=>res.data).catch(error=>{console.log(error)})}
// 设备信息编辑
export const editDevice = params =>{ return axios.post(`${process.env.API_ROOT}device/update`,params).then(res=>res.data).catch(error=>{console.log(error)})}
// 人员区域分布统计
export const staffDistribution = params =>{return axios.get(`${process.env.API_ROOT}person/getProvinceCount`).then(res=>res.data).catch(error=>{console.log(error)})}
// 工人男女比例分析
export const workerAnalysis = params=>{return axios.post(`${process.env.API_ROOT}report/getPeopleNumber`).then(res=>res.data).catch(error=>{console.log(error)})}
// 位置列表
export const locationList = params =>{return axios.post(`${process.env.API_ROOT}location/list`,params).then(res=>res.data).catch(error=>{console.log(error)})}
// 添加位置
export const addLocation = params =>{ return axios.post(`${process.env.API_ROOT}location/add`,params).then(res=>res.data).catch(error=>{console.log(error)})}
// 编辑位置信息
export const editLocation = params =>{ return axios.post(`${process.env.API_ROOT}location/update`,params).then(res=>res.data).catch(error=>{console.log(error)})}