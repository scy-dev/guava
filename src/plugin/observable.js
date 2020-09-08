import Vue from 'vue';
export const store = Vue.observable({
    count: sessionStorage.role ? JSON.stringify(JSON.parse(sessionStorage.role).models) : null,
    token:sessionStorage.accessToken,
    projectId:sessionStorage.projectId?parseInt(sessionStorage.projectId):null,
    workerId:sessionStorage.workerId?parseInt(sessionStorage.workerId):null,
});
export const mutations = {
    setCount(count) {
        store.count = count
    },
    setId(obj){
        store.workerId  = obj.workerId ;
        store.projectId  = obj.projectId ;
        store.token  = obj.accessToken ;
    }
};