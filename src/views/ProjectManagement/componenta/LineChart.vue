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
    lineChartCar:{
      type:Array,
      default:()=>{
        return [20,40,0,0,0,90,0,0]
      }
    }
  },
  data() {
    return {
      chart: null,
      timeSlot:['昨天至00:00','00:00至03:00','03:00至06:00','06:00至09:00','09:00至12:00','12:00至15:00','15:00至18:00','18:00至21:00','21:00至24:00']
    };
  },
  mounted() {
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
          top: 20,
          text: "每日各时段累计车次",
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
                                    <div style="position:relative">
                                    <span class="arrow arrow-up" style="left:50%;margin-left:-8px;top:-10px;position:absolute;display: inline-block; width: 0px; height: 0px; border: 8px solid transparent; overflow: hidden;  border-top: none; border-bottom-color: white;"></span>
                                    <div style="text-align:center;padding:0 10px">${this.timeSlot[val[0].dataIndex]}<br>累计车次${val[0].value}</div>
                                    </div>
                                  `);
          },
          borderColor: "red",
          backgroundColor: "white",
          textStyle: { color: "rgba(51,51,51,1)" },
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
               "axisTick":{       //y轴刻度线
          "show":false
        },
            axisLine: {
              lineStyle: {
                color: "#999", //x轴边框颜色
                width: 0,
              }
            },
            axisLabel: {
              margin: 20,
              textStyle: {
                fontSize: 14,
              }
            },
            data:['00:00','03:00','06:00','09:00','12:00','15:00','18:00','21:00','24:00']
          }
        ],
        yAxis: [
          {
            //Y轴线的样式和单位
            type: "value",
            name: "(辆)",
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
    //    dataZoom: [{
    //     type: 'inside',
    //     start: 0,
    //     end: 100
    // }, {
    //     start: 0,
    //     end: 10,
    //     handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
    //     handleSize: '80%',
    //     handleStyle: {
    //         color: '#fff',
    //         shadowBlur: 3,
    //         shadowColor: 'rgba(0, 0, 0, 0.6)',
    //         shadowOffsetX: 2,
    //         shadowOffsetY: 2
    //     }
    // }],
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
                width: 0, //波形图波浪的边框
                borderWidth: 0
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
                      color: "rgba(0, 136, 255, 1)"
                    },
                    {
                      offset: 0.8,
                      color: "rgba(0, 136, 200, 0.2)"
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
            data: this.lineChartCar
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
