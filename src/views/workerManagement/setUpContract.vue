<template>
  <el-container class="public-box" id="setUpContract">
    <el-header height="70px" class="public-header header-title-button">
      <el-row type="flex" align="center" justify="space-between">
        <div class="public-header-title">设置合同</div>
        <el-row type="flex" align="center" style="height:100%">
          <el-button type="primary" @click="SureSet">确定</el-button>
          <el-button @click="Cancel">取消</el-button>
        </el-row>
      </el-row>
    </el-header>
    <el-main class="public-main">
      <div class="public-main-content radius public-padding">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
          <div class="basic">
            <el-row :gutter="20" style="border-bottom:1px solid #E8E8E8;padding-bottom:24px;">
              <el-col :span="7">
                <div class="grid-content bg-purple">
                  <span style="color:#333333">姓名：</span>
                  <span style="color:#666666">{{ruleForm.name}}</span>
                </div>
              </el-col>
              <el-col :span="7" :offset="1">
                <div class="grid-content bg-purple">
                  <span style="color:#333333">身份证号码：</span>
                  <span style="color:#666666">{{ruleForm.idcard}}</span>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20" style="margin-top:30px;">
              <el-col :span="7">
                <div class="grid-content bg-purple">
                  <el-form-item label="合同期限类型：" prop="type">
                    <el-select v-model="ruleForm.type" placeholder="请选择合同期限类型" @change="SelectType">
                      <el-option label="固定期限" :value="0"></el-option>
                      <el-option label="完成一定工作" :value="1"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="7" :offset="1">
                <div class="grid-content bg-purple">
                  <el-form-item label="合同期限：" prop="startDate">
                    <el-date-picker
                      v-model="time"
                      type="daterange"
                      range-separator="~"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      format="yyyy/MM/dd"
                      @change="SelectTime"
                    ></el-date-picker>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="type">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
              <el-tab-pane label="按天" name="first">
                <el-row :gutter="60">
                  <el-col :span="7.5">
                    <div class="grid-content bg-purple">
                      <el-form-item label="基础日薪：（元/天）" prop="basicSalary">
                        <el-input v-model="ruleForm.basicSalary" placeholder="请输入金额"></el-input>
                      </el-form-item>
                      <el-form-item label="节假日班：" prop="holidayHourly" style="margin-top:40px;">
                        <div class="dayBox">
                          <span>加班</span>
                          <el-select v-model="ruleForm.holidayHourly" placeholder="请选择">
                            <el-option :label="item" :value="item" v-for="item in 6" :key="item"></el-option>
                          </el-select>
                          <span>小时按半工日计算</span>
                        </div>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="7.5" :offset="1">
                    <div class="grid-content bg-purple">
                      <el-form-item label="工作日加班：" prop="normalHourly">
                        <div class="dayBox">
                          <span>加班</span>
                          <el-select v-model="ruleForm.normalHourly" placeholder="请选择">
                            <el-option :label="item" :value="item" v-for="item in 6" :key="item"></el-option>
                          </el-select>
                          <span>小时按半工日计算</span>
                        </div>
                      </el-form-item>
                      <el-form-item label="合同状态：" prop="status" style="margin-top:40px;">
                        <el-select v-model="ruleForm.status" placeholder="请选择合同状态">
                          <el-option label="有效" :value="0"></el-option>
                          <el-option label="无效" :value="1"></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="7.5" :offset="1">
                    <div class="grid-content bg-purple">
                      <el-form-item label="周末加班：" prop="weekendHourly">
                        <div class="dayBox">
                          <span>加班</span>
                          <el-select v-model="ruleForm.weekendHourly" placeholder="请选择">
                            <el-option :label="item" :value="item" v-for="item in 6" :key="item"></el-option>
                          </el-select>
                          <span>小时按半工日计算</span>
                        </div>
                      </el-form-item>
                    </div>
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="按小时" name="second">
                <el-row :gutter="60">
                  <el-col :span="7.5">
                    <div class="grid-content bg-purple">
                      <el-form-item label="正常上班：（元/小时）" prop="basicSalary">
                        <el-input v-model="ruleForm.basicSalary" placeholder="请输入金额"></el-input>
                      </el-form-item>
                      <el-form-item
                        label="节假日班：（元/小时）"
                        prop="holidayHourly"
                        style="margin-top:40px;"
                      >
                        <el-input v-model="ruleForm.holidayHourly" placeholder="请输入金额"></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="7.5" :offset="1">
                    <div class="grid-content bg-purple">
                      <el-form-item label="工作日加班：（元/小时）" prop="normalHourly">
                        <el-input v-model="ruleForm.normalHourly" placeholder="请输入金额"></el-input>
                      </el-form-item>
                      <el-form-item label="合同状态：" prop="status" style="margin-top:40px;">
                        <el-select v-model="ruleForm.status" placeholder="请选择合同状态">
                          <el-option label="有效" :value="0"></el-option>
                          <el-option label="无效" :value="1"></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="7.5" :offset="1">
                    <div class="grid-content bg-purple">
                      <el-form-item label="周末加班：（元/小时）" prop="weekendHourly">
                        <el-input v-model="ruleForm.weekendHourly" placeholder="请输入金额"></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="按月" name="third">
                <el-row :gutter="60">
                  <el-col :span="7.5">
                    <div class="grid-content bg-purple">
                      <el-form-item label="基础月薪：（元）" prop="basicSalary">
                        <el-input v-model="ruleForm.basicSalary" placeholder="请输入金额"></el-input>
                      </el-form-item>
                      <el-form-item
                        label="节假日班：（元/小时）"
                        prop="holidayHourly"
                        style="margin-top:40px;"
                      >
                        <el-input v-model="ruleForm.holidayHourly" placeholder="请输入金额"></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="7.5" :offset="1">
                    <div class="grid-content bg-purple">
                      <el-form-item label="工作日加班：（元/小时）" prop="normalHourly">
                        <el-input v-model="ruleForm.normalHourly" placeholder="请输入金额"></el-input>
                      </el-form-item>
                      <el-form-item label="合同状态：" prop="status" style="margin-top:40px;">
                        <el-select v-model="ruleForm.status" placeholder="请选择合同状态">
                          <el-option label="有效" :value="0"></el-option>
                          <el-option label="无效" :value="1"></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                  </el-col>
                  <el-col :span="7.5" :offset="1">
                    <div class="grid-content bg-purple">
                      <el-form-item label="周末加班：（元/小时）" prop="weekendHourly">
                        <el-input v-model="ruleForm.weekendHourly"></el-input>
                      </el-form-item>
                    </div>
                  </el-col>
                </el-row>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-form>
      </div>
    </el-main>
  </el-container>
</template>

<script type="text/ecmascript-6">
import { Money, MoneyOr } from "@/plugin/formRules";
export default {
  name: "",
  data() {
    return {
      ruleForm: {
        idcard: "",
        name: "",
        type: "",
        startDate: "",
        finishDate: "",
        basicSalary: "",
        normalHourly: "",
        weekendHourly: "",
        holidayHourly: "",
        status: "",
        payableType: "0"
      },
      time: [],
      rules: {
        basicSalary: [{ required: true, validator: Money, trigger: "blur" }],
        status: [
          { required: true, message: "请选择合同状态", trigger: "change" }
        ],
        type: [
          { required: true, message: "请选择合同期限类型", trigger: "change" }
        ],
        startDate: [
          { required: true, message: "请选择合同期限", trigger: "change" }
        ],
        normalHourly: [{ validator: MoneyOr, trigger: "blur" }],
        weekendHourly: [{ validator: MoneyOr, trigger: "blur" }],
        holidayHourly: [{ validator: MoneyOr, trigger: "blur" }]
      },
      activeName: "first"
    };
  },
  components: {},
  created() {
    this.$set(this.ruleForm, "idcard", this.$route.query.id);
    this.$set(this.ruleForm, "name", this.$route.query.name);
    axios({
      url: "Personnel/person/queryContractInfoByidcard",
      method: "post",
      transformRequest: this.transformRequest,
      data: {
        idcard: this.$route.query.id,
        name: this.$route.query.name
      }
    }).then(res => {
      console.log(res);
      if (res.data.data.length != 0) {
        this.ruleForm = res.data.data[0];
        this.ruleForm.normalHourly == null
          ? (this.ruleForm.normalHourly = "")
          : null;
        this.ruleForm.weekendHourly == null
          ? (this.ruleForm.weekendHourly = "")
          : null;
        this.ruleForm.holidayHourly == null
          ? (this.ruleForm.holidayHourly = "")
          : null;
        if (this.ruleForm.startDate) {
          var startDate = moment(this.ruleForm.startDate).toDate();
          var finishDate = moment(this.ruleForm.finishDate).toDate();
          this.time.push(startDate);
          this.time.push(finishDate);
        }
        if (this.ruleForm.payableType == 0) {
          this.activeName = "first";
        } else if (this.ruleForm.payableType == 1) {
          this.activeName = "second";
        } else {
          this.activeName = "third";
        }
      }
    })
    .then(res=>{
        this.$refs['ruleForm'].clearValidate();
      });
  },
  methods: {
    SelectType(val) {
      this.$set(this.ruleForm, "type", val);
    },
    SelectTime(val) {
      var str1 = this.time[0].toString();
      var str2 = this.time[1].toString();
      this.$set(this.ruleForm, "startDate", str1.substring(0, str1.length - 9));
      this.$set(
        this.ruleForm,
        "finishDate",
        str2.substring(0, str2.length - 9)
      );
    },
    handleClick(tab, event) {
      var type = this.ruleForm.type;
      var startDate = this.ruleForm.startDate;
      this.$refs["ruleForm"].resetFields();
      this.$set(this.ruleForm, "type", type);
      this.$set(this.ruleForm, "startDate", startDate);
      if (tab.label == "按天") {
        this.$set(this.ruleForm, "payableType", "0");
      } else if (tab.label == "按小时") {
        this.$set(this.ruleForm, "payableType", "1");
      } else {
        this.$set(this.ruleForm, "payableType", "2");
      }
    },
    SureSet() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.SelectTime()
          axios({
            url: "Personnel/person/contractSetting",
            method: "post",
            transformRequest: this.transformRequest,
            data: this.ruleForm
          }).then(res => {
            if (res.data.message == "成功") {
              this.$message({
                message: "设置成功",
                type: "success",
                onClose: () => {
                  this.$router.push({
                    path: "/workercontract"
                  });
                }
              });
            }
            console.log(res);
          });
        } else {
          return false;
        }
      });
    },
    Cancel() {
      this.$router.push({
        path: "/workercontract"
      });
    }
  }
};
</script>

<style scoped lang="scss">
#setUpContract {
  .public-main-content {
    background: none;
    padding: 0;
  }
  .basic,
  .type {
    background-color: #fff;
    padding: 40px;
    border-radius: 10px;
  }
  .type {
    margin-top: 40px;
    .dayBox {
      display: flex;
      justify-content: start;
      span:nth-of-type(1) {
        margin-right: 8px;
      }
      span:nth-of-type(2) {
        margin-left: 8px;
      }
    }
  }
}
</style>
<style lang="scss">
#setUpContract {
  .el-select {
    width: 95%;
  }
  .dayBox {
    .el-select {
      width: 58%;
    }
  }
  .type {
    .el-tabs__nav {
      border: none;
      div {
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
      }
    }
    #tab-first {
      border-left: 1px solid #e4e7ed;
      border-top: 1px solid #e4e7ed;
      border-right: 1px solid #e4e7ed;
    }
    #tab-second {
      border-top: 1px solid #e4e7ed;
    }
    #tab-third {
      border-top: 1px solid #e4e7ed;
      border-right: 1px solid #e4e7ed;
    }
    #pane-second,
    #pane-third {
      .el-col {
        width: 30%;
        .el-select {
          width: 100%;
        }
      }
      .el-input {
        width: 95%;
      }
    }
  }
  .el-range-editor.el-input__inner {
    width: 95%;
    position: relative;
    .el-icon-date {
      position: absolute;
      right: 10px;
      top: 2px;
    }
    .el-range-input {
      width: 30%;
    }
    .el-range__close-icon {
      display: none;
    }
  }
  .el-tabs--card > .el-tabs__header {
    margin: 0 0 30px;
    .el-tabs__item {
      background-color: #fafafa;
      border-bottom-color: #d9d9d9;
      width: 100px;
      text-align: center;
    }
    .el-tabs__item.is-active {
      background: white;
      border-bottom-color: transparent;
      color: #3c62d0;
    }
  }
  .el-form-item .el-form-item__label {
    color: #333333;
  }
}
</style>
