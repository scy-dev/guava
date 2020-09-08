<template>
  <div :class="className" id="LineChart" :style="{height:height,width:width}"/>
</template>

<script>
// import echarts from "echarts";
// import resize from './mixins/resize'
import { debounce } from "@/plugin/throttle";

export default {
  // mixins: [resize],
  
  props: {
    className: {
      type: String,
      default: "chart"
    },
    id: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "100%"
    },
    lineChartObject:Object,
    date:String
  },
  data() {
    return {
      chart: null,
      datexAxis:[],
      yAxis:[]
    };
  },
  mounted() {
    let daysInMonth = moment(this.date).daysInMonth();
     for(let i=1;i<=daysInMonth;i++){
        this.datexAxis.push(i);
        this.yAxis.push(0)
      };
      let all = this.lineChartObject.count;
    this.lineChartObject.list.forEach(element => {
        let num = (element.eachDayCount/all*100).toFixed(1);
        this.yAxis[moment(element.eachDayTime).format('D')-1] = isNaN(num)?0:num;
    });
    this.initChart();
    this.__resizeHandler = debounce(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 100);
    window.addEventListener("resize", this.__resizeHandler);
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById("LineChart"));
      this.chart.setOption({
        backgroundColor: "white", //全局背景色
        title: {
          //标题的样式
          show:false,
          top: 20,
          text: "当月出勤人数统计",
          textStyle: {
            fontWeight: "900",
            fontSize: 18,
            color: "black",
            fontFamily:'Microsoft YaHei'
          },
          left: "1%"
        },

        tooltip: {
          trigger: "axis",
          position: (point, params, dom, rect, size) => {
            //根据鼠标移动位置的绝对定位
            return [point[0] - 40, point[1]+25];
          },
          // position: ['20px', '20px'],
          formatter: (val,index) => {
            return (val[0].marker = `  
                                    <div style="position:relative;">
                                    <span class="arrow arrow-up" style="left:50%;margin-left:-8px;top:-10px;position:absolute;display: inline-block; width: 0px; height: 0px; border: 8px solid transparent; overflow: hidden;  border-top: none; border-bottom-color: #333;"></span>
                                    <div style="text-align:center;padding:0 10px">${this.datexAxis[val[0].dataIndex]}日<br>出勤率${val[0].value}%</div>
                                    </div>
                                  `);
          },
          borderColor: "#333",
          backgroundColor: "#333",
          textStyle: { color: "white" },
          extraCssText: "box-shadow:0 0 18px #999",
          axisPointer: {
            lineStyle: {
              color: "rgba(51,51,51,0.2)"
            }
          }
        },
        // legend: {
          //图例（分区展示块的样式）
          // top: 20,
          // icon: "rect",
          // itemWidth: 14,
          // itemHeight: 5,
          // itemGap: 13,
          // data: ["CTCC"],
          // right: "4%",
          // textStyle: {
          //   fontSize: 12,
          //   color: "blue",
          // }
        // },
        grid: {
          top: 100,
          left: 20,
          right: 40,
          bottom: "10%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
               axisTick:{       //y轴刻度线
                  show:false
        },
            axisLine: {
              lineStyle: {
                color: "#999", //x轴边框颜色
                width: 0,
              }
            },
            axisLabel: {
              margin: 20,
              // formatter: (a,b)=>{if(b<=this.lineChartCar.length-1){return a} },
              textStyle: {
                fontSize: 14,
              }
            },
            data:this.datexAxis
          }
        ],
        yAxis: [
         
          {
              max:100,
            //Y轴线的样式和单位
            type: "value",
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: "#999", //y轴边框颜色
                width: 0
              }
            },
            axisLabel: {
              margin: 20,
              interval: 'auto',
              formatter: '{value}%',
              textStyle: {
                fontSize: 14
              }
            },
            splitLine: {
              lineStyle: {
                color: "#eee",
                type: "dotted" //折线图表格行边框样式
              }
            }
          }
        ],
        series: [
          {
            name: "CTCC",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 4, //波形图波浪的边框
                borderWidth: 4,
                color:'#255CBF'
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      //波形图渐变色样式
                      offset: 0,
                      color: "rgba(60, 98, 208, 0.4)"
                    },
                    {
                      offset: 0.8,
                      color: "rgba(60, 98, 208, 0.2)"
                    }
                  ],
                  false
                ),
                shadowColor: "rgba(0, 0, 0, 0.1)",
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {
                color: "rgba(0,136,212,1)",
                borderColor: "rgba(0,136,212,0.2)", //鼠标移动时的原点的样式
                borderWidth: 40
              }
            },
            data: this.yAxis
          }
        ]
      });
    }
  }
};
</script>
<style scoped>
#LineChart {
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
}
</style>
