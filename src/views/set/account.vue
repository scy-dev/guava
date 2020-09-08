<template>
  <el-container class="public-box">
    <el-header height="54px" class="public-header header-title-button">
      <el-row type="flex" align="center" justify="space-between">
        <div class="public-header-title">账号管理</div>
        <el-row type="flex" align="center" style="height:100%"></el-row>
      </el-row>
    </el-header>

    <el-main class="public-main">
      <div class="public-main-content radius public-padding">
        <div class="role-content">
          <span>员工姓名：</span>
          <el-input v-model="workerName" style="width:280px;" placeholder="请输入姓名"></el-input>

          <el-button type="primary" style="margin-left: 64px;" @click="query">查询</el-button>
          <el-button @click="empty">重置</el-button>

          <div>
            <el-button type="primary" style="margin-top:40px;" @click="AddWorker">新增账号</el-button>
          </div>

          <div class="contentTable">
            <el-table :data="tableData" style="width: 100%">
              <el-table-column  label="序号">
                <template slot-scope="scope">{{serialNumber(scope.$index,page.pageIndex,page.pageSize)}}</template>
              </el-table-column>
              <el-table-column prop="userName" label="账号"></el-table-column>
              <el-table-column prop="workerName" label="员工姓名"></el-table-column>
              <el-table-column prop="roleName" label="角色名称"></el-table-column>
              <el-table-column prop="createAt" label="创建时间">
                <template slot-scope="scope">{{scope.row.createAt | filterTime}}</template>
              </el-table-column>
              <el-table-column prop="updateAt" label="修改时间">
                <template slot-scope="scope">{{scope.row.updateAt | filterTime}}</template>
              </el-table-column>
              <el-table-column prop="option" label="操作">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="handleClick(scope.row.id)">编辑</el-button>
                  <span style="color:#E9E9E9">|</span>
                  <el-button type="text" size="small" @click="passwords(scope.row.id)">重置密码</el-button>
                  <span style="color:#E9E9E9">|</span>
                  <el-button type="text" size="small" @click="cancel(scope.row.id)" style="color:red;">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <Pagination
              :total="total"
              @pagination="handlePage"
              :pageSize="page.pageSize"
              :pageNum="page.pageIndex"
            />
          </div>

          <el-dialog :title=title :visible.sync="dialogVisible" width="30.36%" @closed='$refs.formLabelAlign.resetFields()'>
            <div class="dialong-content">
              <el-form
                :label-position="labelPosition"
                :model="formLabelAlign"
                :rules="rules"
                ref="formLabelAlign"
                class="dialong-form"
              >
                <el-form-item label="账号：" prop="userName">
                  <el-input v-model="formLabelAlign.userName" placeholder="请输入账号" v-bind:disabled="disabledInput"></el-input>
                </el-form-item>
                <el-form-item label="员工姓名：" prop="name">
                  <el-input v-model="formLabelAlign.name" placeholder="请输入员工姓名"></el-input>
                </el-form-item>
                <el-form-item label="手机号码：" prop="phoneNumber">
                  <el-input v-model="formLabelAlign.phoneNumber" placeholder="请输入手机号码"></el-input>
                </el-form-item>
                <el-form-item label="角色名称：" prop="roleId">
                  <el-select v-model="formLabelAlign.roleId" placeholder="请选择"  style="width:525px" @change="changeLocationValue">
                    <el-option
                      v-for="item in options"
                      :key="item.id"
                      :label="item.roleName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="no('formLabelAlign')">取 消</el-button>
              <el-button type="primary" @click="yes('formLabelAlign')">确 定</el-button>
            </span>
          </el-dialog>

            <!-- 重置密码成功 -->
            <el-dialog
              :visible.sync="centerDialogVisible1"
              top="center"
              width="22.55%"
              :show-close="false"
              custom-class="centerDialog"
            >
              <div>
                <i class="el-icon-success"></i>
                <span class="centerDialog-span">密码重置成功</span>
                <p class="centerDialog-p">新密码：{{newpass}}</p>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="ok">确 定</el-button>
              </span>
            </el-dialog>

            <!-- 新增账号成功 -->
            <el-dialog
              :visible.sync="centerDialogadd"
              top="center"
              width="22.55%"
              :show-close="false"
              custom-class="centerDialog"
            >
              <div>
                <i class="el-icon-success"></i>
                <span class="centerDialogadd-span">账号激活成功</span>
                <p class="centerDialogadd-p">项目账号:{{ addnumber }}</p>
                <p class="centerDialogadd-p">项目密码:{{ addpass }}</p>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="add">确 定</el-button>
              </span>
            </el-dialog>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { Mobile } from "@/plugin/formRules";
import { throttle } from "@/plugin/throttle";
import {serialNumber} from '@/views/AttendanceManagement/mixins';
export default {
  mixins:[serialNumber],
  data() {
    return {
      centerDialogadd:false,
      addnumber:'',
      addpass:'',
      disabledInput:false,
      workerName: "",
      newpass:'',
      title:'',
      dialogVisible: false, //新增账号弹出框
      centerDialogVisible1: false, //重置密码确认弹出框
      labelPosition: "top",
      formLabelAlign: {
        //新增弹出框form
        userName: "",
        name: "",
        phoneNumber: "",
        roleId: ""
      },
      total: 0,
      page: {
        pageIndex: 1,
        pageSize: 10
      },
      rules: {
        userName: [{ required: true, message: "请输入账号", trigger: "blur" }],
        name: [{ required: true, message: "请输入员工姓名", trigger: "blur" }],
        phoneNumber: [{ required: true, validator: Mobile, trigger: "blur" }],
        roleId: [{ required: true, message: "请输入角色名称", trigger: "blur" }]
      },
      options: [],
      value: "",
      tableData: []
    };
  },
  created() {
    this.getter();
    this.upList();
  },
  methods: {
    //表格列表
    getter() {
      let obj = Object.assign({}, this.page);
      obj.projectId = sessionStorage.getItem("projectId");
      obj.companyId = sessionStorage.getItem("companyId");
        axios({
          url: `${this.tong}/workerAccount/query`,
          method: "post",
          headers: {
            Authorization: "Bearer" + sessionStorage.getItem("accessToken")
          },
          params: obj
        }).then(res => {
          if (res.data.code == 1) {
            this.tableData = res.data.data.list;
            this.total = res.data.data.total;
          } else {
            this.$message.error("获取信息失败");
          }
        });
    },
    //分页多条书
    handlePage(page) {
      this.page.pageIndex = page.pageNum;
      this.page.pageSize = page.pageSize;
      this.getter();
    },
    //查询
    query: throttle(function() {
       this.page.workerName = this.workerName;
       this.page.pageIndex = 1;
       this.getter()
    }, 2000, 1000),
     //重置
    empty: throttle(function() {
        this.workerName = '';
        this.page = this.$options.data().page
        this.getter()
    }, 2000, 1000),
    //新增账号
    AddWorker() {
      this.dialogVisible = true;
      this.disabledInput = false
      this.title = "新增账号"
    },
    //编辑
    handleClick(id) {
      this.roleidvalue = id
      this.dialogVisible = true;
      this.title = "编辑账号"
      this.disabledInput = true
      axios({
            url: `${this.tong}/workerAccount/getWorkerInfo`,
            method:'post',
            headers: {
              Authorization: "Bearer" + sessionStorage.getItem("accessToken")
            },
            params:{
              workerId:id,
            }
          }).then(res=>{
            if(res.data.code == 1){
              this.formLabelAlign = res.data.data
            }else{
              this.$message.error('操作失败')
            }
          })
    },
    //设置重置密码
    passwords(id) {
      this.$confirm("你确定重置该帐号的密码？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
            axios({
                url: `${this.tong}/workerAccount/resetPassword`,
                method:'post',
                headers: {
                    Authorization: "Bearer" + sessionStorage.getItem("accessToken")
                },
                params:{workerId:id}
            }).then(res=>{
                if(res.data.code == 1){
                    this.centerDialogVisible1 = true
                    this.newpass = res.data.data
                    this.getter()
                }else{
                    this.$message({type: "success",message: "重置失败!"});
                }
            })
        })
        .catch(() => {
        });
    },
    //下拉框
    upList() {
      axios({
        url: `${this.tong}/role/getRoleName`,
        method: "post",
        headers: {
          Authorization: "Bearer" + sessionStorage.getItem("accessToken")
        },
        params: {
          projectId: sessionStorage.getItem("projectId"),
          companyId: sessionStorage.getItem("companyId")
        }
      }).then(res => {
        if (res.data.code == 1) {
          this.options = res.data.data;
        }
      });
    },
    ok() {
      this.centerDialogVisible1 = false;
    },
    add(){
      this.centerDialogadd = false;
    },
    //新增编辑账号方法
    addedit(address,obj){
      axios({
        url: `${this.tong}`+address,
        method:'post',
        headers: {
          Authorization: "Bearer" + sessionStorage.getItem("accessToken")
        },
        params:obj
      }).then(res=>{
        if (res.data.code == 1) {
          this.$message({ message: `${this.title}成功`,type: 'success'});
          if(this.title == "新增账号"){
            this.centerDialogadd = true
            this.addnumber = res.data.data.userName
            this.addpass = res.data.data.password
          }
          this.getter()
        }else{
         this.$message({ message: `${this.title}失败`,type: 'error'});
        }
      })
      this.dialogVisible = false;
      this.formLabelAlign = this.$options.data().formLabelAlign;
    },
    //新增账号确定
    yes(formLabelAlign) {
      //确定验证
      this.$refs[formLabelAlign].validate(valid => {
        if (valid) {
          if(this.title == '新增账号'){
            let obj = {
              createUsername:sessionStorage.getItem("username"),
              roleName:this.uplistId.roleName
            }
            Object.assign(obj, this.formLabelAlign)
            this.addedit('/workerAccount/insert',obj)
          }else {
            let obj = {
              workerId:this.roleidvalue,
              roleId:this.formLabelAlign.roleId,
              name:this.formLabelAlign.name,
              phoneNumber:this.formLabelAlign.phoneNumber,
            }
            this.addedit('/workerAccount/update',obj)
          } 
        }else {

        }
      });
    },
    //下拉选中的值
    changeLocationValue(val) {
      let obj = {};
      obj = this.options.find(item => {
        return item.id === val;
      });
      this.uplistId = obj;
    },
    no(formLabelAlign) {
      this.$refs[formLabelAlign].resetFields();
      this.dialogVisible = false;
    },
    //删除
    cancel(id) {
        this.$confirm("你确定删除该帐号吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
            axios({
                url: `${this.tong}/workerAccount/delete`,
                method:'post',
                headers: {
                    Authorization: "Bearer" + sessionStorage.getItem("accessToken")
                },
                params:{workerId:id}
            }).then(res=>{
                if(res.data.code == 1){
                    this.$message({ message: '删除成',type: 'success'});
                     if (this.tableData.length - 1 == 0) {
                      if (this.page.pageIndex > 1) {
                        this.page.pageIndex -= 1;
                      }
                    }
                    this.getter()
                }else{
                    this.$message({type: "success",message: "删除失败!"});
                }
            })
        })
        .catch(() => {
        });
    },
  },
  filters: {
    filterTime(val) {
      if (val) {
        return moment(val).format("YYYY/MM/DD");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~@/styles/public.scss';
.contentTable {
  margin-top: 40px;
  .dialong-form {
    width: 503px;
    height: 475px;
  }
}
</style>

<style lang="scss">
#dg {
  .el-dialog__header {
    padding: 0;
    border: 0;
  }
  .el-dialog__footer {
    padding: 30px 20px 20px;
  }
  .el-dialog {
    border-radius: 10px;
  }
}
  .el-dialog__body {
    padding: 30px 20px 10px;
  }
.el-dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: 0 !important;
  transform: translate(-50%, -50%);
  max-height: calc(100% - 30px);
  max-width: calc(100% - 30px);
  display: flex;
  flex-direction: column;
  > .el-dialog__body {
    margin-top: -17px;
    overflow: auto;
    color: #666666;
  }
}
.public-main{
  .el-icon-success{
    font-size:20px;
    color:rgba(82,196,26,1);
  }
}
.centerDialogadd-p{
  font-size:14px;
  font-family:PingFangSC-Regular;
  font-weight:400;
  color:rgba(0,0,0,0.65);
  margin-top:8px;
  padding-left:35px;
}
.centerDialogadd-span{
  font-size:16px;
  font-weight:600;
  color:rgba(0,0,0,0.85);
  line-height:24px;
  padding-left:10px;
  font-family:PingFangSC-Medium;
}
</style>

<style  lang="scss">
.contentTable
  .el-form-item.is-required:not(.is-no-asterisk)
  .el-form-item__label-wrap
  > .el-form-item__label:before,
.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
  margin-right: -10px;
  margin-top: 9px;
}
.el-dialog__body{
  border-bottom: 1px solid #E8E8E8;
}
.centerDialog{
  .centerDialog-span{
    font-size:16px;
    font-weight:500;
    color:rgba(0,0,0,0.85);
    line-height:24px;
    padding-left:10px;
    font-family:PingFangSC-Medium;
  }
  .centerDialog-p{
    font-size:14px;
    font-family:PingFangSC-Regular;
    font-weight:400;
    color:rgba(0,0,0,0.65);
    margin-top:8px;
    padding-left:35px;
  }
  .el-dialog__header{
    border-bottom: 0px;
  }
  .el-dialog__body {
    border-bottom: 0px;
  }
}
</style>
