<template>
    <div id="public-table" style="margin-top: 40px;">
      <el-table :data="tableData" style="width: 100%" :key="key" @selection-change='selectionChange'>
        <el-table-column fixed type="selection"  min-width="60"></el-table-column>
        <el-table-column fixed type="index" label="序号" width="80"></el-table-column>
        <el-table-column fixed :prop="item.prop" :label="item.label" v-for="(item,index) in left" :key="index" :width="right.length>0?item.label.length*16+32:'auto'"></el-table-column>
        <el-table-column :prop="item.prop" :label="item.label" v-for="(item,index) in right" :key="index" :width="item.label.length*16+32"></el-table-column>
      </el-table>
      <div class="none-list" v-show="tableData.length==0">暂无数据</div>
    </div>
</template>

<script>
import {downloadExcel} from '@/plugin/downloadExcel'
export default {
    props: {
      tableData: {
        //表格数据
        type: Array,
        default: []
      },
      left: {
        //左侧的表格头
        type: Array,
        default: []
      },
      right: {
        //右侧的表格头
        type: Array,
        default: []
      },
    },
    data(){
      
      return{
        key:0,
      }
    },
   watch:{
     tableData(){
       this.key+=1;
     }
   },
    methods:{
      selectionChange(val){
        this.$emit('selectionChange',val)
      },
    }
}
</script>

<style scoped lang="scss">
  .is-leaf{
    background:#EEF1FB;
  }

</style>
