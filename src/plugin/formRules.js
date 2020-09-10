import moment from 'moment'
//正则规则---------------------------------------------------------------------------------------------------------------
    const IDCardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;                           //身份证验证规则
    const MobileReg = /^1[3456789]\d{9}$/;                                                  //手机号验证
    const BankCardReg = /^([1-9]{1})([0-9]{15}|[0-9]{18})$/;                                //银行卡号验证
    const MoneyReg = /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/;                        //金额验证
    const TelephoneReg = /0\d{2,3}\d{7,8}/;                                                 //固定电话验证
    const BritydayReg = /^(19|20)\d{2}-(1[0-2]|0?[1-9])-(0?[1-9]|[1-2][0-9]|3[0-1])$/;      //生日验证
    const companyReg = /^[1-9A-GY]{1}[1239]{1}[1-5]{1}[0-9]{5}[0-9A-Z]{10}$/;               //企业信用代码验证
//-----------------------------------------------------------------------------------------------------------------------
    //公用正则校检
    const PublicReg = (value,callback,message,reg)=>{
        if(reg.test(value)){
            callback()
          }else{
            return callback(new Error(message));
          }
    }
//-----------------------------------------------------------------------------------------------------------------------
//身份证的验证必选
export  const IDCard =(rule,value,callback)=>{
    if(!value){
        return callback(new Error('请输入身份证号码'));
    }else{
        return PublicReg(value,callback,'身份证号码格式错误',IDCardReg);
    }
  };
//身份证的验证非必选
export  const IDCardOr =(rule,value,callback)=>{
    if(!value){
        return callback();
    }else{
        return PublicReg(value,callback,'身份证号码格式错误',IDCardReg);
    }
  };  
//---------------------------------------------------------------------------------------------------  
//手机号验证必选
export  const Mobile =(rule,value,callback)=>{
    if(!value){
        return callback(new Error('请输入手机号码'));
    }else{
        return PublicReg(value,callback,'请输入合法的手机号码',MobileReg);
    }
  };
//手机号验证非必选
export  const MobileOr =(rule,value,callback)=>{
    if(!value){
        return callback();
    }else{
        return PublicReg(value,callback,'请输入合法的手机号码',MobileReg);
    }
  };  
//固定电话验证必选
export  const Telephone =(rule,value,callback)=>{
    if(!value){
        return callback(new Error('请输入固定号码'));
    }else{
        return PublicReg(value,callback,'请输入合法的固定号码',TelephoneReg);
    }
};
//--------------------------------------------------------------------------------------------------- 
  //银行账号验证必选
export  const BankCard =(rule,value,callback)=>{
    if(!value){
        return callback(new Error('请输入银行卡号'));
    }else{
        return  PublicReg(value,callback,'请输入合法的银行账号',BankCardReg);
    }
  };
 //银行账号验证非必选
 export  const BankCardOr =(rule,value,callback)=>{
    if(!value){
        return callback();
    }else{
        return PublicReg(value,callback,'请输入合法的银行账号',BankCardReg);
    }
  };  
//--------------------------------------------------------------------------------------------------- 
    //金额验证必选
export  const Money =(rule,value,callback)=>{
    if(value===''){
        return callback(new Error('请输入金额'));
    }else{
        return PublicReg(value,callback,'请输入合法的金额数字',MoneyReg);
    }
  };
//金额验证非必选
  export  const MoneyOr =(rule,value,callback)=>{
    if(value===''|| value===null){
        return callback();
    }else{
        return PublicReg(value,callback,'请输入合法的金额数字',MoneyReg);
    }
  };
//--------------------------------------------------------------------------------------------------- 
//手机号验证必选
export  const Brityday =(rule,value,callback)=>{
    if(!value){
        return callback(new Error('请输入生日日期'));
    }else{
        return PublicReg(value,callback,'请输入合法的日期',BritydayReg);
    }
};
//-----------------------------------------------------------------------------------------------------------------------
//企业的验证必选
export  const companyCard =(rule,value,callback)=>{
    if(!value){
        return callback(new Error('请输入企业信用代码'));
    }else{
        return PublicReg(value,callback,'企业信用代码格式错误',companyReg);
    }
};
//--------------------------------------------------------------------------------------------------- 
// 日期格式化
export const formatDate = time=>{
    if(time == null){
        return '--'
    }else{
        let date = moment(time).format('YYYY-MM-DD');
        return date;
    }
}
// 日期格式化2
export const formatTime = time=>{
    if(time == null){
        return "--";
    }else{
        let times = moment(time).format('YYYY-MM-DD hh:mm:ss');
        return times;
    }
}

