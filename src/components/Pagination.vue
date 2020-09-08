<template>
  <el-row type="flex" justify="end" id="pagination-containers">
    <el-pagination
      background
      :current-page.sync="pageNum"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      
    />
  </el-row>
</template>

<script>
// import { setInterval, clearInterval } from "timers";
// import { scrollTo } from '@/plugin/scrollTo'

export default {
  name: "Pagination",
  props: {
    total: {
      required: true,
      type: Number,
      default: 0
    },
    pageNum: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50];
      }
    },
    layout: {
      type: String,
      default: "total, prev, pager, next,sizes, jumper"
    }
  },
  methods: {
    scroll(){
      //点击分页返回顶部
      
       let time = null;
      let main = document.getElementsByClassName("public-main")[0];
      if (main.scrollTop > 0) {
        time = setInterval(() => {
          if (main.scrollTop <= 0) {
            clearInterval(time);
          };
          main.scrollTop -= 5;
        }, 0);
      }
    },
    handleSizeChange(val) {
      //点击每页条数触发
      this.$emit("pagination", { pageNum: this.pageNum, pageSize: val });
      // if(Math.ceil(this.total/val)>=this.pageNum||this.pageNum==1){
      //   // 如果点击页码小或等于当前的总条数除以每页条数才执行 因为会出现执行两次的情况
      //   this.$emit("pagination", { pageNum: this.pageNum, pageSize: val });
      // }
    },
    handleCurrentChange(val) {
      // 点击页码触发
      this.$emit("pagination", { pageNum: val, pageSize: this.pageSize });
      if(this.pageSize>10){
        this.scroll();
      };
    }
  }
};
</script>

<style lang='scss'>
#pagination-containers {
  background: #fff;
  padding: 40px 0px 0px;
  .el-input{
    display: inline-block;
    width: 100px;
  }
  .el-input.el-pagination__editor.is-in-pagination {
    width: 60px;
    padding: 0 5px;
  }
  .el-pagination__jump {
    margin-left: -5px;
  }
  .pagination-container.hidden {
    display: none;
  }
  .el-pagination__sizes {
    margin-left: 5px;
  }

  .el-pagination__sizes .el-input .el-input__inner:hover {
    border-color: #3c62d0;
  }
  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #3c62d0;
    &:hover {
      color: #fff !important;
    }
    color: #fff;
  }
  .el-pagination.is-background .el-pager li {
    background: white;
    border: 1px solid rgba(217, 217, 217, 1);
    &:hover {
      border-color: #3c62d0 !important;
    }
  }
  .el-pagination.is-background .btn-next,
  .el-pagination.is-background .btn-prev,
  .el-pagination.is-background .el-pager li {
    border-radius: 4px;
    width: 32px;
    height: 32px;
  }
  .el-pagination.is-background .el-pager li:not(.disabled):hover {
    color: #3c62d0;
  }
  .pagination-containers {
    .btn-next,
    .btn-prev {
      &:hover {
        border-color: #3c62d0 !important;
        color: #3c62d0 !important;
      }
      background: white !important;
      border: 1px solid rgba(217, 217, 217, 1);
    }
    .el-pager {
      .number.active {
        &:hover {
          color: white !important;
        }
        border: 1px solid #3c62d0 !important;
        background-color: #3c62d0 !important;
      }
    }
  }
}
</style>
