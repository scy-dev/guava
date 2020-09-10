<template>
  <div id="public-table">
    <el-table :key="key" :data="column" style="width: 100%;margin-top:40px">
      <!--v-loading="loading"-->
      <!-- <el-table-column fixed :prop="address" label="hehe" ></el-table-column> -->
      <el-table-column
       align="center"
        fixed
        :prop="item.prop"
        :label="item.label"
        v-for="(item,index) in left"
        :key="index"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
      <template v-if="popover">
        <!-- 霞灰用这个 -->
        <el-table-column
          :prop="item.prop"
          :label="item.label"
           align="center"
          v-for="(item,index) in center"
          :key="index"
          width="105"
        >
          <template slot-scope="scope">
            <el-popover trigger="click">
              <div style="max-height:160px;overflow:hidden;">
                <el-scrollbar class="popover-wrapper-scrollbar" style="border-radius:0">
                  <div
                    class="every"
                    :style="{paddingRight:popoverList.length<6?'20px':0}"
                    @click="popoverClick(scope.row,scope.$index,items)"
                    v-for="(items,indexs) in popoverList"
                    :key="indexs"
                  >
                    <span>{{ items.name }}</span>
                    <i
                      class="el-icon-check"
                      v-show="scope.row[item.prop]==items.name"
                      style="height:40px;line-height:40px;color:#3c62d0"
                    ></i>
                  </div>
                </el-scrollbar>
              </div>
              <div slot="reference" class="name-wrapper" style="cursor: pointer;">
                <span size="medium">{{ scope.row[item.prop]}}</span>
              </div>
            </el-popover>
          </template>
        </el-table-column>
      </template>
      <template v-else>
        <el-table-column
         align="center"
          :prop="item.prop"
          :label="item.label"
          v-for="(item,index) in center"
          :key="index"
          show-overflow-tooltip
        ></el-table-column>
      </template>
      <el-table-column fixed="right"  align="center" width="700px" label="排版视图">
        <el-table-column
          align="center"
          :prop="item.prop"
          :label="item.label"
          :class="item.prop"
          v-for="(item,index) in right"
          :key="index"
          width="100"
          show-overflow-tooltip
        >
        <template slot-scope="scope">
          <i v-if="(index / 2 == 1)" class="iconfont icon-xiuxiqu"></i>
          <i v-else class="iconfont icon-shangban"></i>
        </template>

        </el-table-column>        
      </el-table-column>

    </el-table>
    <div class="none-list" v-show="column.length<1">暂无数据</div>
  </div>
</template>
<script>
export default {
  props: {
    column: {
      //表格数据
      type: Array,
      default: []
    },
    left: {
      //左侧的表格头
      type: Array,
      default: []
    },
    center: {
      //中间的表格头
      type: Array,
      default: []
    },
    right: {
      //右侧的表格头
      type: Array,
      default: []
    },
    month: {
      type: String,
      default: ""
    },
    loading: {
      type: Boolean,
      default: true
    },
    popover: {
      type: Boolean,
      default: false
    },
    popoverList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      key: 0,
      situation: [1, 2, 3, 4, 5, 6, 7]
    };
  },
  watch: {
    //表格数据变化就重新渲染
    column() {
      this.key += 1;
    },
    left() {
      this.key += 1;
    },
    month(newvalue) {
      let arr = [];
      let excelCenterHeader = [];
      let excelCenterProp = [];
      //中间循环的表头数组
      let days = 0;
      //天数
      if (newvalue === moment().format("YYYY-MM")) {
        //如果newvalue等于现在的年月 days就赋值为今天的天数
        days = moment().format("D");
      } else {
        days = moment(newvalue).daysInMonth();
        //否则就是之前的月份 获取那个月的整月天数
      }
      //获取这个月有多少天
      for (let i = 1; i <= days; i++) {
        //循环加表头字段
        let obj = {};
        let everyday = i < 10 ? `0${i}` : i;
        //小于10前面加个0
        let prop = newvalue + "-" + everyday;
        //定义字段名
        obj.label =
          everyday + "/周" + "日一二三四五六".substr(moment(prop).day(), 1);
        //判断是周几
        obj.prop = prop;
        excelCenterHeader.push(obj.label);
        excelCenterProp.push(obj.prop);
        arr.push(obj);
      }
      this.center = arr;
      this.key += 1;
      //循环结束后表格重新渲染
      this.$emit("excelCenter", {
        excelCenterHeader: excelCenterHeader,
        excelCenterProp: excelCenterProp
      });
      //excel表格中心部分不固定的要传回父组件导出时候用
    }
  },
  methods: {
    popoverClick(row, index, value) {
      axios({
        url: "/Projectmanager/project/modityShift",
        method: "post",
        transformRequest: this.transformRequest, //axios请求需求，main.js中改变了
        data: {
          punchTime: value.name,
          createTime: row.createTime.substr(0, 10),
          userIds: row.userId,
          ruleId: row.scheduRuleId,
          gas_id: value.id
        }
      }).then(res => {
        if (res.data.code == 200) {
          console.log(8);
          this.$emit("hehe");
        }
      });
    }
  }
};
</script>
<style lang="scss">
.el-popover {
  min-width: 125px !important;
  padding: 0;
  border-radius: 4px;
  .popover-wrapper-scrollbar {
    flex: 1;
    height: 100%;
    background: white;
    border-radius: 0;
    .el-scrollbar__thumb {
      background: rgba(0, 0, 0, 0.45) !important;
    }
    .el-scrollbar__wrap {
      padding: 0 !important;
      margin-bottom: 0 !important;
      // margin: 0 !important;
      .el-scrollbar__view{
        max-height:160px;
      }
      .every {
        width: 100%;
        box-sizing: border-box;
        // display: flex;
        padding: 0 10px;

        // justify-content: space-between;
        // align-items: center;
        height: 32px;
        line-height: 32px;
        cursor: pointer;
        &:hover {
          background: rgba(0, 0, 0, 0.15);
        }
      }
      overflow: auto;
      overflow-x: hidden;
      background: white;
      // padding: 0 10px;
      box-sizing: border-box;
    }
  }
}
#public-table{
  .iconfont{
    font-size: 30px;
  }
  .icon-xiuxiqu{
    color: #44dd6d;
  }
  .icon-shangban{
    color:#977deb;
  }
}
</style>