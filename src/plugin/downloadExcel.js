export default function downloadExcel(header, body, title, name){
  //参数介绍  header:表格头的字段数组  body:表格主体内容（后端返回的） title：这是表格后端返回的对应字段名数组, name:你要给表格起的名字
  return import('@/plugin/Export2Excel').then( excel => {
    const tHeader = header; //这是表格头部的字段名
    const filterVal = title; //这是表格后端返回的对应字段名
    const list = body; //表格主体内容（后端返回的）
    const data = formatJson(filterVal, list) //这个用来转换时间
    excel.export_json_to_excel({
      header: tHeader, //导出的表格头
      data, //导出的表格主体
      filename: name, //导出的文件名
      autoWidth: true, //是否自动宽度
      bookType: 'xlsx' //导出的文件格式
    });
    return false ;
  })  
};
function formatJson(filterVal, jsonData) {
  // filterVal:后端对应字段名    jsonData:表格主体数组  
  return jsonData.map(v => filterVal.map(j => {
    if (j === 'timestamp') { //如果字段是这个就是时间戳要转换时间(moment.js)
      return moment(v[j] * 1000).format('YYYY-MM-DD HH:mm:ss');
    } else {
      return v[j] //否则直接输出
    }
  }))
};