export const beforeAvatarUpload = (file, types,num) => {//[1,2,3]
    // let is10M = null;
    // let is10M = num?file.size / 1024 / 1024 <= 20:file.size / 1024 / 1024 <= 10;
    let is10M = true;
    let isType = types.filter(e => e === file.type);
    if (isType.length > 0 && is10M) {
        return {type:true}
    } else {
        if(isType.length===0){
            return {type:false,message:'上传格式不正确'}
        }else{
            if(num){
                return {type:false,message:'请上传20MB以内的文件'}
            }else{
                return {type:false,message:'请上传10MB以内的文件'}
            }
        }
    }
}