

import moment from 'moment'
// 过滤工作日
export function weekdayFilter(val) {
    var arr = val.split(',');
    var arr2 = [];
    let str = '日一二三四五六';
    arr.forEach(res => {
        if(res){
            arr2.push('周'+str.substr(res,1))
        }
        
    });
    return arr2.join(' , ')
}
// 过滤是否在职状态
export function statusFilter(val) {
    if(val == '0'){
        return '在职'
    }else if(val == "1"){
        return '离职'
    }
  
}
// 过滤合同是否有效
export function contractFilter(val) {
    if(val == '0'){
        return '有效'
    }else if(val == "1"){
        return '无效'
    }
  
}
// 过滤班次时间
export function attendanceShiftsTime(val){
        if(!val.morningCommute){
            return  val.morningWork+'-'+val.afternoonCommute
        };
    //考勤时间的过滤
    let arr = ['morning','afternoon','night','lateNight'];
    let newarr=[];
   arr.forEach(e=>{
     newarr.push(`${val[e+'Work']}-${val[e+'Commute']}`  )
   })
   return newarr.filter(e=>{return !e.includes('null')&&e!=='-'}).join(' , ')
  }
// 过滤合同类型
export function contractTypeFilter(val){
    if(val == '0'){
        return '固定期限'
    }else if(val == '1'){
        return '完成一定工作'
    }
}
// 过滤时间
export function arrivalDateFilter(val) {
    return moment(val).format("YYYY/MM/DD");
  }
// 过滤计薪方式
export function payTypeFilter(val){
    if(val == '0'){
        return '按天'
    }else if(val == '1'){
        return '按小时'
    }else if (val == "2"){
        return '按月'
    }
}
// 过滤设备类型
export function equipmentType(val){
    if(val == 1){
        return '人脸考勤机K系列'
    }else if(val == 2){
        return '人脸考勤机S系列'
    }
}

export function discriCard(UUserCard){
    UUserCard.substring(6,10)+"-"+UUserCard.substring(10,12)+"-"+UUserCard.substring(12,14); 
    var myDate = new Date(); 
    var month = myDate.getMonth() + 1; 
    var day = myDate.getDate(); 
    var age = myDate.getFullYear()-UUserCard.substring(6, 10) - 1; 
    if (UUserCard.substring(10,12)<month||UUserCard.substring(10,12)==month&&UUserCard.substring(12,14)<=day) 
    { 
        age++; 
    }     
    return age;
}