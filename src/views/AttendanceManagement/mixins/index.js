import { store } from "@/plugin/observable";
 const index = {
  data() {
    return {
      total: 0,
      formInline: {
        teamId: "", //班组id
        subcontractId: "", //分包单位id
        attendanceMonth: '', //查询的月份
        userName: "", //用户姓名
        pageSize: 10,
        pageNum: 1,
        projectId:store.projectId
      },
      load: false,
      loading: true,
      total: 0,
      tableData: [],
      teamOption:false,
      subcontractOption: []
    }
  },
  methods: {
    //搜索函数
    search(val) {
      if (val) {
        Object.assign(this.formInline, val);
      } else {
        this.formInline = this.$options.data().formInline;
        this.formInline.attendanceMonth = moment().format("YYYY-MM");
        this.teamOption = false;
      };
      this.formInline.pageNum = 1;
      this.getList();
    },
    //分页
    pagination(val) {
      Object.assign(this.formInline, val);
      this.getList();
    },
    teamOptionEmit(val){
      this.teamOption = val;
    }
  }
};

 const scrollTable = {
  methods: {
    handle(val, view) {
      let data = view ? val.schedulingViewToList : val;
      let special = view ? val.projectMangerList : null;
      if (!Array.isArray(data) || data.length === 0){
        //如果没有数据 进行拦截
        this.tableData = [];
        return false;
      };
      //数据处理函数
      let arr = [];
      data.forEach(e => {
        if (arr.indexOf(e.userId) == -1) {
          //返回数据的userId去重放到新数组中
          arr.push(e.userId);
        };
      });
      arr.sort((n1, n2) => n1 - n2); //userId排序
      view ? this.view(arr, special, data) : this.report(arr, data);
    },
    view(arr,special, data) {
      //排班视图的表格处理
      let newarr = [];
      arr.forEach(element => {
        let specialcopy = special.filter(e => e.userId == element); //过滤出当前id的请假的数组
        let arrcopy = data.filter(e => e.userId == element); //过滤出当前id的用户的当月的信息列表
        let obj = Object.assign({}, arrcopy[0]); //将字段拷贝进去
        arrcopy.forEach(e => {
          obj[e.createTime.substr(0,10)] = this.time(e.createTime.substr(0,10), specialcopy, obj); //判断当天的具体情况
          newarr.push(obj);
        });
      });
      this.tableData = newarr;
    },
    report(arr, data) {
      //考勤报表的表格处理
      let newarr = [];
      arr.forEach(element => {
        let arrcopy = data.filter(e => e.userId == element);
        //过滤出返回数据中和arr每一项的userId相等的数组
        let obj = Object.assign({}, arrcopy[0]); //将字段拷贝进去
        let missTime = 0;
        let cumulative = 0;
        //定义漏卡次数
        arrcopy.forEach(ele => {
          //时间字段名和字段值一致是因为和表格的prop对应
          if (ele.status == 1) {
            //状态1对应漏卡次数
            missTime += 1;
          };
          if (typeof ele.countMinutes === "number") {
            //累积时长的结算
            cumulative += ele.countMinutes;
          };
          obj[ele.createTime] = this.vacation(ele.status); //状态switch因为excel
        });
        obj['missTime'] = missTime;
        obj['cumulative'] = cumulative;
        newarr.push(obj);
        //表格显示数据的格式
      });
      this.tableData = newarr;
      
    },
    time(val, specialcopy, obj) {
      //排班视图过滤
      let filter = specialcopy.filter(e => e.workTime == val);
      if (filter.length > 0){
        let name = filter[0].shiftsName
        return name?name:'请假';
      } else {
        if (obj.weekday_time.includes(moment(val).day())) {
          return obj.attendanceShiftsName;
        } else {
          return '休息'
        };
      };
    }
  }
};

const serialNumber = {
  methods: {
    serialNumber(val,pageNum,pageSize){
      //val是传过来的index ,pageNum页码,pageSize每页条数
     return (pageNum-1)*pageSize + val+1;
    }
  }
};

const teamListOrSubcontract = {
  methods: {
    // searchOption() {
      //请求下拉列表
      // this.teamListOrSubcontract(
      //   "queryTeamName", {
      //     subcontractId: 1
      //   },
      //   "teamOption"
      // ); //获取班组下拉列表
      // this.teamListOrSubcontract(
      //   "querySubContractCorpname", {
      //     projectId: sessionStorage.projectId
      //   },
      //   "subcontractOption"
      // ); //获取分包下拉列表
    // },
    //请求分包下拉和班组下拉下拉菜单的公共函数
    teamListOrSubcontract(url, data, value,emit) {
      //请求地址，
      axios({
        url: `${this.liuxiancai}/Projectmanager/project/${url}`,
        method: "post",
        transformRequest: this.transformRequest,
        data: data
      }).then(res => {
        this[value] = res.data.data;
        if(emit){
          this.$emit('teamOptionEmit',res.data.data)
        }
      });
    }
  }
};

const district = {
  methods: {
    district(val){
      //   this.areaarr1 = this.formLabelAlign.area1
      let special=['北京市','天津市','上海市','重庆市'];

      function fn(val) {return JSON.parse(JSON.stringify(val));}//深拷贝
      function difference(a,b){return a.concat(b).filter(v => !a.includes(v) || !b.includes(v))}//取过滤后的值和data的差集
      axios({
          url: `${this.tong}/projectAccount/getArea`,
          method:'get'
      }).then(res=>{
          var data=res.data.data;
          let province = data.filter(e=>e.pid==0);//过滤出省
          data = difference(province,data);//用过的从data中清除
          province.forEach(e=>{//省循环
          if(special.indexOf(e.name)==-1){
              let city = data.filter(el=>e.id==el.pid);//过滤出城市
              e.city = fn(city);//深拷贝
              data = difference(city,data);//用过的从data中清除
          }else{//如果是特殊城市 省和市是一个
              e.city = fn([e]);
          };
              e.city.forEach(element=>{//市循环
              let area = data.filter(el=>element.id==el.pid);//市辖区的判断
              let newarea = fn(area);//深拷贝
              newarea.forEach(es=>{
                  let copy = data.filter(el=>es.id==el.pid);
                  area.push(...copy);//和市同级
                  difference(copy,data)//用过的从data中清除
              });
              data = difference(area,data);//用过的从data中清除
              element.area = fn(area)//深拷贝
              })
          });
          this.area1 = province;
          if(this.model=='bjcompany'){
            this.huixian();
          };
      })
  }
  }
};
const attendanceShiftsTime = {
  filters: {
    attendanceShiftsTime(val) {
      //考勤时间的过滤
      // let obj = Object.assign({}, val);
      // delete obj.id;
      // let filter = Object.values(obj).filter(e => e);
      // if (filter.length == 2) {
         if (!val.morningCommute) {
        //长度是二的特殊判断
        return `${val.morningWork}-${val.afternoonCommute}`;
      } else {
        let arr = ["morning", "afternoon", "night", "lateNight"];
        let newarr = [];
        arr.forEach(e => {
          newarr.push(`${val[e + "Work"]}-${val[e + "Commute"]}`);
        });
        return newarr.filter(e =>{return !e.includes("null")&&e!=='-'}).join(" , ");
      }
    }
  }
}

const listAllAttendanceShifts = {
  methods:{
        //班次说明
        listAllAttendanceShifts(){
          axios({
            url:'http://192.168.0.110:7710/AttendanceShifts/listAllAttendanceShifts',
            method:'post'
          }).then(res=>{
            
            let data = res.data.data;
            let arr = [];
            let popoverListCopy = [];
            let timeSlot = ["morning", "afternoon", "night", "lateNight"];
            data.forEach(e=>{
              let str = '';
              let name = e.attendanceShifts.shiftsName;
              if(this.model=='teamView'){
                let obj = {
                  name:name,
                  id:e.attendanceShifts.id
                }
                popoverListCopy.push(obj)
              }
              
              let time = e.attendanceShiftsTime;
              if(!time.morningCommute){
    
               str= `${name}\t${time.morningWork}-${time.afternoonCommute}`;
              }else{
                let newarr = [];
                timeSlot.forEach(element => {
                   
                  newarr.push(`${time[element + "Work"]}-${time[element + "Commute"]}`);
                });
                let newstr = newarr.filter(e =>{return !e.includes("null")&&e!=='-'}).join(" , ");
                str  = `${name}\t${newstr}`
              }
              arr.push(str);
            })
            this.explain = arr.join(' / ');
            if(this.model=='teamView'){
              this.popoverList = [...popoverListCopy,{name:'休息',id:0},{name:'请假',id:0}];
            }
          })
        }
  }
}



export {index,scrollTable,serialNumber,teamListOrSubcontract,district,attendanceShiftsTime,listAllAttendanceShifts};