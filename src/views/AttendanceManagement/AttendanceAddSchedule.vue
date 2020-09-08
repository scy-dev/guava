<template>
  <el-container class="public-box" id="AttendanceAddSchedule">
    <!-- 这里是头部-->
    <el-header height="54px" class="public-header header-title-button">
      <el-row type="flex" align="center" justify="space-between">
        <div class="public-header-title">{{title}}</div>
        <el-row type="flex" align="center" style="height:100%">
          <el-button type="primary" @click="sure('submitForm')">确定</el-button>
          <el-button>取消</el-button>
        </el-row>
      </el-row>
    </el-header>
    <el-main class="public-main">
      <!-- 整体表单范围 -->
      <el-form
      style="width:100%"
        :inline="true"
        :model="submitForm"
        ref="submitForm"
        label-width="100px"
        class="demo-ruleForm"
        label-position="top"
      >
        <!-- 这里是顶部两个input -->
        <div class="public-main-content radius public-padding first">
          <el-form-item
            label="班次名称（最多可输入6字支持中英文或数）"
            prop="shiftsName"
            class="addSchedule-form-margin"
            :rules="rules.shiftsName"
          >
            <el-input v-model="submitForm.shiftsName"></el-input>
          </el-form-item>
          <el-form-item
            label="加班规则"
            prop="overTime"
            class="active-name"
            :rules="{ required: true, message:'请选择加班规则', trigger: 'blur' }"
          >
            <el-checkbox v-model="checked">允许加班</el-checkbox>
            <el-select v-model="submitForm.overTime" placeholder="请选择">
              <el-option label="按半小时加班" :value="30"></el-option>
              <el-option label="按小时加班" :value="60"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <!-- 这里是中间的几次打卡 -->
        <div class="public-main-content radius public-padding secend" :key="active">
          <div class="schedule-title">打卡时间:</div>
          <el-row type="flex" class="bottom-border">
            <!-- 循环tab切换的盒子 -->
            <div
              v-for="(value,index) of punchCardCheck"
              :key="index"
              :class="active==index?'active-tab':''"
            >
              <el-checkbox
                class="label"
                :label="value.title"
                v-model="value.checked"
                @change="handleClick(index,'active',punchCardCheck)"
              ></el-checkbox>
            </div>
          </el-row>
          <!-- 循环tab切换每一项的表单 -->
          <div :key="keyss">
            <el-form-item
              :label="item.label"
              :prop="item.value"
              class="addSchedule-form-margin"
              v-for="(item,index) of ruleForm.scheduling.slice(0,(active+1)*2)"
              :key="index"
              :rules="[
                { 
                  validator: (rule, value, callback)=>{checkTime(rule, value, callback,index,(active+1))}, 
                  trigger: 'change'
                }
            ]"
            >
              <el-time-picker
                v-model="submitForm[item.value]"
                :editable="false"
                placeholder="选择时间"
                value-format="HH:mm"
                format="HH:mm"
              ></el-time-picker>
            </el-form-item>
          </div>
          <!-- 下面休息时间和工作时长特殊所以没循环 休息时间只有2次打卡的时候才会出现 -->
          <el-form-item
            label="休息时间"
            class="addSchedule-form-margin"
            v-if="active==0"
            prop="restTime"
            :rules="rules.restTime"
          >
            <el-input v-model.number="submitForm.restTime" placeholder="请输入休息时长"></el-input>
          </el-form-item>
          <el-form-item label="工作时长" class="addSchedule-form-margin" prop="workTime">
            {{submitForm.workTime | minute}}
            <!-- <el-time-picker v-model="submitForm.workTime" :editable="false" placeholder="选择时间" value-format="HH:mm" format="HH:mm"></el-time-picker> -->
          </el-form-item>
        </div>
        <!-- 这里是人性化设置 -->
        <div class="public-main-content radius public-padding three" :key="bottomActive">
          <div class="schedule-title">人性化设置:</div>
          <el-row type="flex" class="bottom-border">
            <div
              v-for="(value,index) of hommization"
              :key="index"
              :class="bottomActive==index?'active-tab':''"
            >
              <el-checkbox
                class="label"
                :label="value.title"
                v-model="value.checked"
                @change="handleClick(index,'bottomActive',hommization)"
              ></el-checkbox>
            </div>
          </el-row>
          <div v-if="ruleForm.humanized[bottomTabShowIndex].length>0" :key="bottomActive">
            <el-form-item
              :label="item.label"
              :prop="item.value"
              :rules="item.rule"
              class="addSchedule-form-margin"
              v-for="(item,index) in ruleForm.humanized[bottomTabShowIndex]"
              :key="index"
            >
              <el-select v-model="submitForm[item.value]" placeholder="请选择" :editable="false">
                <el-option
                  v-for="(items,indexs) in minuteOption"
                  :key="indexs"
                  :label="`${items}分钟`"
                  :value="items"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="no-message" style="text-align:center;padding-bottom:" v-else>无可分配信息</div>
        </div>
      </el-form>
    </el-main>
  </el-container>
</template>
<script>
export default {
  beforeRouteEnter(to, from, next) {
    to.params.status == 1 ||to.params.status == 2 ||sessionStorage.getItem("schedule")?next(): next({ path: "/" });
  },
  data() {
    const shiftsName = (rule, value, callback) => {
      if (value) {
        let reg = /^[\u4e00-\u9fa5|A-z|\d]{1,6}$/g;
        if (reg.test(value)) {
          return callback();
        } else {
          return callback(new Error("请输入正确班组姓名"));
        }
      } else {
        return callback(new Error("请输入班组姓名"));
      }
    };
    const restTime = (rule, value, callback) => {
      if (value) {
        let reg = /^[\d]{1,}$/g;
        if (reg.test(value)) {
          if (value <= 999) {
            return callback();
          } else {
            return callback(new Error("时间不能大于999"));
          }
        } else {
          return callback(new Error("休息时间格式不正确"));
        }
      } else {
        return callback(new Error("请输入休息时间"));
      }
    };
    return {
      title: "新增班次",
      submitForm: {
        status: 1, //新增1 修改2
        shiftsName: "", //班次设置名称
        punchTime: null, //打卡时间 1.一天2次打卡 2.一天4次打卡 3.一天6次打卡 4.一天8次打卡
        restTime: "", //休息时间
        workTime: "-", //工作时长
        humanizedSettings: "", //1.铁纪律2.弹性3.最晚上班
        notLate: "", //不算迟到
        notLeave: "", //不算早退
        latestWork: "", //最晚上班
        overFlag: 2, //是否允许加班1.允许2.不允许
        overTime: "", //加班时长
        morningWork: null, //上午上班时间
        morningCommute: null, //上午下班时间
        afternoonWork: null, //下午上班时间
        afternoonCommute: null, //下午下班时间
        nightWork: null, //晚上上班
        nightCommute: null, //晚上下班
        lateNightWork: null, //深夜上班
        lateNightCommute: null //深夜下班
      },
      submitFormCopy: {},
      ruleForm: {
        name: "",
        restTime: "",
        workTime: "",
        // scheduling: [active==0?'上班':'上午下班' ,active==0?'下班':'上午下班',"下午下班","晚上上班","晚上下班", "夜晚上班","夜晚下班"],

        scheduling: [
          { label: "上午下班", value: "morningWork" },
          { label: "上午下班", value: "morningCommute" },
          { label: "下午上班", value: "afternoonWork" },
          { label: "下午下班", value: "afternoonCommute" },
          { label: "晚上上班", value: "nightWork" },
          { label: "晚上下班", value: "nightCommute" },
          { label: "夜晚上班", value: "lateNightWork" },
          { label: "夜晚下班", value: "lateNightCommute" }
        ],
        humanized: [
          //人性化的循环数组
          [],
          [
            {
              label: "允许时间内（设置时间段）打卡不算迟到",
              value: "notLeave",
              rule: [{ required: true, message: "请输入时间", trigger: "blur" }]
            },
            {
              label: "允许时间内（设置时间段）打卡不算早退",
              value: "notLate",
              rule: [{ required: true, message: "请输入时间", trigger: "blur" }]
            }
          ],
          [
            {
              label: "最晚上班时间（但需要满工作时长）",
              value: "latestWork",
              rule: [
                {
                  required: true,
                  message: "请选择最晚上班时间",
                  trigger: "blur"
                }
              ]
            }
          ]
        ]
      },
      rules: {
        shiftsName: [
          { required: true, validator: shiftsName, trigger: "blur" }
        ],
        restTime: [{ required: true, validator: restTime, trigger: "blur" }],
        ordinary: [{ required: true, trigger: "blur" }]
      },
      active: 0,
      editActive: 0,
      editBottomActive: 0,
      bottomActive: 0,
      bottomTabShowIndex: 0,
      hommization: [
        { checked: false, title: "铁纪律" },
        { checked: false, title: "上班时间/下班时间" },
        { checked: false, title: "弹性工作时间" }
      ],
      punchCardCheck: [
        { checked: false, title: "一天2次打卡" },
        { checked: false, title: "一天4次打卡" },
        { checked: false, title: "一天6次打卡" },
        { checked: false, title: "一天8次打卡" }
      ],
      checked: false,
      minuteOption: [1, 3, 5, 10, 15, 30, 60],
      keyss: 0 //打卡表单重新渲染的key
    };
  },
  watch: {
    active(newvalue, oldvalue) {
      //active变化证明中间打卡时间的要重新渲染才能清空表单验证
      this.ruleForm.scheduling.forEach(e => (this.submitForm[e.value] = ""));
      this.submitForm.restTime = "";
      this.submitForm.workTime = "-";
      if (this.submitForm.status == 2) {
        //修改
        if (newvalue == this.editActive) {
          //如果tab按钮是回显的那个 就赋值上去
          this.ruleForm.scheduling.slice(0, (newvalue + 1) * 2).forEach(e => {
            this.submitForm[e.value] = this.submitFormCopy[e.value];
          });
          this.submitForm.workTime = this.submitFormCopy.workTime;
          if (newvalue == 0) {
            this.submitForm.restTime = this.submitFormCopy.restTime;
          }
        }
      }
      // this.ruleForm.scheduling = [...this.$options.data().ruleForm.scheduling]; 重置 ruleForm.scheduling
    },
    bottomActive(newvalue, oldvalue) {
      //bottomActive变化证明人性化设置的要重新渲染才能清空表单验证
      // if(oldvalue!==0){
      this.ruleForm.humanized[oldvalue].forEach(
        e => (this.submitForm[e.value] = "")
      );
      if (this.submitForm.status == 2) {
        if (newvalue == this.editBottomActive) {
          //如果tab按钮是回显的那个 就赋值上去
          this.ruleForm.humanized[newvalue].forEach(e => {
            this.submitForm[e.value] = this.submitFormCopy[e.value];
          });
        }
      }
      // };
      if (this.submitForm.status == 1 && oldvalue !== 0) {
        //新增状态底部切换清空数据
        this.ruleForm.humanized[oldvalue].forEach(
          e => (this.submitForm[e.value] = "")
        );
      }
    }
  },
  methods: {
    checkTime(rule, values, callback, index, active) {
      let ruleForm = this.ruleForm.scheduling;
      if (values) {
        if (index == 0) {
          this.countTime(active, index);
          return callback();
        } else {
          for (let i of ruleForm.filter((e, i) => i < index)) {
            let before = this.submitForm[i.value];
            let now = this.submitForm[ruleForm[index].value];
            if (before) {
              if (difference(now) - difference(before) <= 0) {
                this.countTime();
                return callback(
                  new Error(
                    `${ruleForm[index].label}必须晚于更早时间点的日期选择`
                  )
                );
              }
            }
          }
          this.countTime(active, index);
          return callback();
        }
      } else {
        this.countTime();
        return callback(new Error("请选择时间"));
      }
      function difference(value) {
        return value.replace(/:/g, "").substr(0, 4);
      }
    },

    countTime(active, index) {
      //计算打卡时间时长
      function difference(value) {
        return value.replace(/:/g, "").substr(0, 4);
      }
      //时间结算
      if (active) {
        let arr = this.ruleForm.scheduling.slice(0, (this.active + 1) * 2); //当前显示的上下班打卡的数组
        let sure = true;
        for (let i of arr) {
          if (!this.submitForm[i.value]) {
            sure = false;
            return (this.submitForm.workTime = "-");
          }
        }
        for (let [item, i] of new Map(arr.map((item, i) => [item, i]))) {
          let now = this.submitForm[this.ruleForm.scheduling[index].value];
          let obj = this.submitForm[item.value];
          if (i < index) {
            if (difference(obj) - difference(now) > 0) {
              return (this.submitForm.workTime = "-");
            }
          } else if (i > index) {
            if (difference(obj) - difference(now) < 0) {
              return (this.submitForm.workTime = "-");
            }
          }
        }
        if (sure) {
          var num = 0;
          let name = ["morning", "afternoon", "night", "lateNight"];
          name.slice(0, active).forEach(e => {
            let t1 = moment("2019-05-28 " + this.submitForm[`${e}Work`]);
            let t2 = moment("2019-05-28 " + this.submitForm[`${e}Commute`]);
            num += t2.diff(t1, "minute"); //算出时间差
          });
          this.submitForm.workTime = num;
        } else {
          this.submitForm.workTime = "-";
        }
      } else {
        this.submitForm.workTime = "-";
        //否则有未填表单
      }
    },
    sure(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {})
            .then(() => {
              let obj = Object.assign({}, this.submitForm);
              obj.punchTime = this.active + 1;
              obj.humanizedSettings = this.bottomActive + 1;
              obj.overFlag = this.checked ? 1 : 2;
              if (this.active == 0) {
                obj.afternoonCommute = obj.morningCommute;
                obj.morningCommute = "";
              }
              axios({
                url: "/AttendanceShifts/saveAttendanceShifts",
                method: "post",
                data: obj
              }).then(res => {
                if (res.data.code == 200) {
                  this.$message.success(`${this.title}成功`);
                  this.$router.go(-1);
                } else {
                  this.$message.error(`${this.title}失败`);
                };
                
              });
            })
            .catch(() => {});
        }
      });
    },
    handleClick(index, active, checkOnlyOne) {
      this[active] = index; //active配合class进行高亮显示
      checkOnlyOne.forEach((e, i) => {
        //全选框循环检测
        e.checked = i !== index?false:true;//不等于索引就为false,选中就为true
      });
      if (active == "bottomActive") {
        //如果active为底部的人性化执行这个
        this.bottomTabShowIndex = index;
      } else {
        this.activeChange(index);
      }
    },
    activeChange(index) {
      let title = index===0?'':'上午'
      this.ruleForm.scheduling[0].label = `${title}上班`;
        this.ruleForm.scheduling[1].label = `${title}下班`;
    },
    getDetail() {
      axios({
        url: "/AttendanceShifts/findAttendanceShifts",
        method: "get",
        params: { id: JSON.parse(sessionStorage.getItem("schedule")).id }
      }).then(res => {
        let {attendanceShiftsTime,attendanceShifts} = res.data.data; //打卡时间版块的数据
        let obj = Object.assign({}, attendanceShiftsTime); //数据拷贝
        delete obj.id; //删除id 因为我要判断时间数组的长度
        this.active = this.editActive =
          Object.values(obj).filter(e => e).length / 2 - 1; //获取active的值
        if (this.active == 0) {
          attendanceShiftsTime.morningCommute = obj.afternoonCommute;
          attendanceShiftsTime.afternoonCommute = null;
        };
        this.activeChange(this.active);
        this.bottomTabShowIndex = this.bottomActive = this.editBottomActive =
          attendanceShifts.humanizedSettings - 1;
        this.punchCardCheck[this.active].checked = this.hommization[
          this.bottomActive
        ].checked = true;
        this.checked = attendanceShifts.overFlag == 1 ? true : false;
        Object.keys(obj).forEach(e => {
          if (attendanceShiftsTime[e]) {
            attendanceShiftsTime[e] = attendanceShiftsTime[e].substr(0, 5);
          }
        });
        Object.assign(this.submitForm, attendanceShiftsTime, attendanceShifts);
        Object.assign(this.submitFormCopy, this.submitForm);
      });
    }
  },
  filters: {
    minute(val) {
      if (typeof val == "number") {
        let h = parseInt(val / 60);
        let m = val % 60;
        return `${h}小时${m}分`;
      } else {
        return "-";
      }
    }
  },
  beforeDestroy() {
    sessionStorage.removeItem("schedule");
  },
  mounted() {
    let schedule = !this.$route.params.status
      ? JSON.parse(sessionStorage.getItem("schedule"))
      : this.$route.params; //获取路由参数
    //第一次进来要存一下session
    if (!sessionStorage.getItem("schedule")) {
      sessionStorage.setItem("schedule", JSON.stringify(this.$route.params));
    }
    this.title = this.$route.name;
    this.submitForm.status = schedule.status;
    if (schedule.status == 2) {
      //syatus==2说明是修改
      this.getDetail();
    } else {
      //status==1说明是新增
      this.hommization[0].checked = true;
      this.punchCardCheck[0].checked = true;
      this.activeChange(0);
    }
  }
};
</script>
<style lang="scss">
@import "~@/styles/public.scss";
#AttendanceAddSchedule {
  .el-select {
    width: 100%;
  }
  .schedule-title {
    color: #333;
    margin-top: -10px;
    margin-bottom: 24px;
  }
  .first,
  .secend {
    margin-bottom: 40px;
  }
  .secend,
  .three {
    padding-bottom: 20px;
    .no-message {
      height: 112px;
      line-height: 112px;
    }
  }
  .el-date-editor {
    width: 100%;
  }
  .bottom-border {
    border-bottom: 1px solid #d9d9d9;
    margin-bottom: 25px;
    flex-wrap: wrap;
    .label {
      width: 100%;
      box-sizing: border-box;
      display: inline-block;
    }
    .active-tab {
      border-bottom-color: white;
      background: white;
      .el-checkbox__label{
        color:#2E61D7;
      }
      
    }
  }
  .bottom-border > div {
    margin-bottom: -1px;
    width: 180px;
    height: 40px;
    background: #fafafa;
    border-radius: 4px 4px 0 0;
    border: 1px solid #d9d9d9;
    line-height: 40px;
    margin-right: 3px;
    text-align: center;
    .el-checkbox {
      padding: 0 20px;
    }
  }

  .first {
    .el-form-item {
      margin-bottom: 0;
    }
  }
  .active-name {
    position: relative;
    .el-form-item__error {
      right: 89px;
    }
    .el-checkbox {
      position: absolute;
      right: 0;
      top: -50px;
      margin-right: 0;
    }
  }
  .el-form {
    .addSchedule-form-margin {
      margin-right: 8%;
    }
    .el-form-item {
      width: 26.6%;
    }
  }
  .el-form-item .el-form-item__label::before {
    top: 0px;
    right: -16px;
  }
}
</style>
