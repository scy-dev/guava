
// 防抖函数
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }
    return result
  }
};


// 节流函数
export function throttle(method , duration ,delay ){
  var timer = null, 
      // 记录下开始执行函数的时间
      begin = new Date();

  return function(){
      var context = this, 
          args = arguments, 
          // 记录下当前时间
          current = new Date();
      // 函数节流里的思路
      clearTimeout(timer);

      // 记录下的两个时间相减再与duration进行比较
      if(current-begin >= duration){
           method.apply(context , args);
           begin = current;
      }else{  
          timer = setTimeout(function(){
              method.apply(context , args);
          } , delay);
      }
  }
};
