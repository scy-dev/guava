<template>
    <el-container class="public-box">
        <el-header height="54px" class="public-header header-title-button">
            <el-row type="flex" align='center' justify='space-between'>
                <div class="public-header-title">角色管理</div>
            </el-row>
        </el-header>

            <el-main class="public-main">
            <div class="public-main-content radius public-padding">
                <div class="role-main">
                    <span>角色名称：</span> <el-input v-model="roleName" placeholder="请输入姓名"></el-input>

                    <el-button type="primary" style="margin-left: 64px;" @click="query">查询</el-button>
                    <el-button @click="empty">重置</el-button>
                    
                    <div>
                        <el-button type="primary" style="margin-top:40px;" @click="AddWorker">新增角色</el-button>
                    </div>
                
                    <div class="contentTable">
                        <el-table :data="tableData" v-loading="loading" style="width: 100%">
                            <el-table-column label="序号" >
                                <template slot-scope="scope">{{serialNumber(scope.$index,page.pageIndex,page.pageSize)}}</template>
                            </el-table-column>
                            <el-table-column prop="roleName" label="角色名称" ></el-table-column>
                            <el-table-column prop="createAt" label="创建时间" >
                                <template slot-scope="scope">{{scope.row.createAt | filterTime}}</template>
                            </el-table-column>
                            <el-table-column prop="updateAt" label="修改时间" >
                                 <template slot-scope="scope">{{scope.row.updateAt | filterTime}}</template>
                            </el-table-column>
                            <el-table-column prop="time" label="操作">
                                <template slot-scope="scope">
                                    <el-button @click="handleClick(scope.row.id)" type="text" size="small">编辑</el-button>
                                    <span style="color:#E9E9E9">|</span>
                                    <el-button type="text" size="small" style="color:red;" @click="cancel(scope.row.id)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <Pagination :total='total' @pagination='pagination' :pageSize='page.pageSize' :pageNum='page.pageIndex' />
                    </div>

                    <el-dialog :visible.sync="dialogFormVisible">
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="dialogFormVisible = false">取 消</el-button>
                            <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
                        </div>
                    </el-dialog>
                </div>
            </div>
        </el-main>
    </el-container>
</template>

<script>
import {serialNumber} from '@/views/AttendanceManagement/mixins';
import { throttle } from "@/plugin/throttle";
export default {
    mixins:[serialNumber],
    data(){
        return{
            total:0,
            dialogFormVisible:false,
            loading: false,
            tableData:[],
            total: 0,
            roleName: "", //用户姓名
            page: {
                username:sessionStorage.getItem('username'),
                roleName:null,
                pageIndex:1,
                pageSize:10
            },
        }
    },
    created(){
        this.getter()
    },
    methods:{
        //获取列表
        getter(){
            axios({
                url: `${this.tong}/role/query`,
                method:'post',
                headers:{
                    Authorization: 'Bearer' + sessionStorage.getItem('accessToken'),
                },
                params:this.page
            }).then(res=>{
                if(res.data.code == 1){
                    this.tableData = res.data.data.list;
                    this.total = res.data.data.total;
                }
            })
        },
        //查询
        query:throttle(function(){
            this.page.roleName = this.roleName;
            this.page.pageIndex = 1;
            this.getter();
        },2000,1000),
        //重置
        empty(){
           this.roleName = ''
           this.page = this.$options.data().page
           this.getter()
        },
        //新增角色
        AddWorker(){
            this.$router.push({ path: "/role/addwork"});
        },
        //编辑
        handleClick(id){
            this.$router.push({path:'/role/editwork',query:{roleId:id}})
        },
        //删除
        cancel(id){
            this.$confirm('是否确定删除该角色?', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    axios({
                        url: `${this.tong}/role/deleteRole`,
                        method:'post',
                        headers:{Authorization: 'Bearer'+ sessionStorage.getItem('accessToken')},
                        params:{roleId:id}
                    }).then(res=>{
                        if(res.data.code == 1){
                            this.$message({type: 'success',message: '删除成功'});
                                //删除后的计算页码请求
                                    if (this.tableData.length - 1 == 0) {
                                        if (this.page.pageNum > 1) {
                                        this.page.pageNum -= 1;
                                        }
                                    }
                                    this.getter();
                        }else if(res.data.code == 1021){
                            // //无法删除
                            this.$confirm('该角色已有账户在使用，您无法删除。', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                                }).then(() => {

                                }).catch(() => {
                                    
                            });
                        }
                    })
                }).catch(() => {
                           
            });   
        },
        pagination(val){
            this.page.pageIndex = val.pageNum;
            this.page.pageSize = val.pageSize;
            this.getter();
        },
    },
    filters: {
        filterTime(val) {
            if (val) {
                return moment(val).format("YYYY/MM/DD");
            }
        }
    }
}
</script>


<style scoped lang="scss">
@import '~@/styles/public.scss';
.role-main{
    span {
        font-size: 16px;
        color: #333333;
    }
    .el-input {
        width: 280px;
    }
    .contentTable{
        margin-top: 40px;
    }
}
    
</style>