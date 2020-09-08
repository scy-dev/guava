<template>
    <el-container class="public-box" id="xiangmu">
        <!-- 有标题和按钮的用这种 -->
        <el-header height="54px" class="public-header header-title-button">
            <el-row type="flex" align="center" justify="space-between">
                <div class="public-header-title">劳务分析</div>
                <el-row type="flex" align="center" style="height:100%">
                <!-- <el-button @click="tk" type="primary">编辑项目信息</el-button>
                
                <el-button style="margin-left:20px" @click="tb">同步管理平台</el-button> -->
               
                </el-row>
            </el-row>
        </el-header>
        <!-- 这里是主体内容容器-->
        <el-main class="public-main" >
        <div id="chart-main" class="public-main-content radius public-padding">
            <div class="biao">
                <ul>
                    <li>
                        <div class="title">男女工人数量</div>
                        <div class="con" id="workerCount"></div>
                    </li>
                    <li>
                        <div class="title">学历分布</div>
                        <div class="con" id="sexCount">
                        </div>                        
                    </li>
                </ul>
            </div>
            <div class="biao">
                <ul>
                    <li>
                        <div class="title">工人地域分布</div>
                        <div class="con" id="area">
                           
                        </div>                        
                    </li>
                </ul>
            </div>            
        </div>
        </el-main>
    </el-container>
</template>
<script>
import {staffDistribution,workerAnalysis} from '@/api/api';
import echart from 'echarts'
import "../../../node_modules/echarts/map/js/china.js"; // 引入中国地图数据
export default{
    data(){
        return{
            sexData: { '0': 0, '1': 0, count: 0 },
            width:'100%',
            height: '360px', 
            inRange:{color: ["#6FCF6A", "#FFFD64", "#FF5000"]},
            data:[{name: "内蒙古",value: 1},{name: "黑龙江",value: 2},{name: "吉林",value: 3},{name: "辽宁",value: 4},{name: "北京",value: 5},{name: "天津",value: 6},{name: "河北",value: 7},{name: "河南",value: 8},{name: "山西",value: 9},{name: "山东",value: 10},{name: "江苏",value: 11},{name: "安徽",value: 12},{name: "上海",value: 13},{name: "湖北",value: 14},{name: "湖南",value: 15},{name: "江西",value: 16},{name: "浙江",value: 17},{name: "福建",value: 18},{name: "台湾",value: 19},{name: "广东",value: 20},{name: "香港",value: 21},{name: "澳门",value: 22},{name: "海南",value: 23},{name: "广西",value: 24},{name: "贵州",value: 25},{name: "云南",value: 26},{name: "重庆",value: 27},{name: "四川",value: 28},{name: "甘肃",value: 29},{name: "陕西",value: 30},{name: "宁夏",value: 31},{name: "青海",value: 32},{name: "西藏",value: 33},{name: "新疆",value: 34}],
            areaData:[{
                    name: '江苏省',
                    value: 53
                },
                {
                    name: '北京市',
                    value: 38
                },
                {
                    name: '上海',
                    value: 46
                },
                {
                    name: '重庆',
                    value: 36
                },
                {
                    name: '河北',
                    value: 34
                },
                {
                    name: '河南',
                    value: 32
                },
                {
                    name: '云南',
                    value: 16
                },
                {
                    name: '辽宁',
                    value: 43
                },
                {
                    name: '黑龙江',
                    value: 41
                },
                {
                    name: '湖南',
                    value: 24
                },
                {
                    name: '安徽',
                    value: 33
                },
                {
                    name: '山东',
                    value: 3
                },
                {
                    name: '新疆',
                    value: 1
                },
                {
                    name: '江苏',
                    value: 39
                },
                {
                    name: '浙江',
                    value: 3
                },
                {
                    name: '江西',
                    value: 20
                },
                {
                    name: '湖北',
                    value: 21
                },
                {
                    name: '广西',
                    value: 30
                },
                {
                    name: '甘肃',
                    value: 12
                },
                {
                    name: '山西',
                    value: 32
                },
                {
                    name: '内蒙古',
                    value: 35
                },
                {
                    name: '陕西',
                    value: 25
                },
                {
                    name: '吉林',
                    value: 45
                },
                {
                    name: '福建',
                    value: 28
                },
            ],
            dateTime:['2020/08/10','2020/08/11','2020/08/12','2020/08/13','2020/08/14','2020/08/15','2020/08/16','2020/08/17','2020/08/18','2020/08/19','2020/08/20','2020/08/21','2020/08/22','2020/08/23','2020/08/24','2020/08/25'],
            manList:[26, 59, 90, 264, 287, 707, 176, 182, 487, 188, 60, 23,111,130,170,180],
            womenList:[39, 59, 111, 187, 483, 692, 231, 4.6, 554, 184, 103, 7,134,89,90,12]
        }
    },
    methods:{
        areaChart(data){
            /**
             * @description 地域及年龄分布
             */
            var yData = [];
            var barData = [];

            for (var i = 0; i < data.length; i++) {
                if(i<6){
                    barData.push(data[i]);
                    yData.push(i + data[i].name);
                }
            }

            var option = {
                title: [{
                    show: true,
                    textStyle: {
                        color: '#2D3E53',
                        fontSize: 18
                    },
                    right: 180,
                    top: 100
                }],
                tooltip: {
                    show: true,
                    formatter: function(params) {
                        if(params.componentSubType == "bar"){
                            return params.data.name + '：' + (params.data['value']) + '人'
                        }else{
                            if(params.data['value'] > 0){
                                return params.name + '：' + (params.data['value']) + '人'
                            }
                            
                        }
                        console.log(params);
                        
                    },
                },
                visualMap: {
                    type: 'continuous',
                    orient: 'horizontal',
                    itemWidth: 10,
                    itemHeight: 80,
                    text: ['高', '低'],
                    showLabel: true,
                    seriesIndex: [0],
                    min: 0,
                    max: 70,
                    inRange: {
                        color: ['#4add71', '#f8d27f', '#977deb'],
                    },
                    textStyle: {
                        color: '#7B93A7'
                    },
                    bottom: 30,
                    left: 'left',
                },
                grid: {
                    right: 10,
                    top: 15,
                    bottom: 10,
                    width: '30%'
                },
                xAxis: {
                    show: false
                },
                yAxis: {
                    type: 'category',
                    inverse: true,
                    nameGap: 16,
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: '#ddd'
                        }
                    },
                    axisTick: {
                        show: false,
                        lineStyle: {
                            color: '#ddd'
                        }
                    },
                    axisLabel: {
                        interval: 0,
                        margin: 85,
                        textStyle: {
                            color: '#455A74',
                            align: 'left',
                            fontSize: 14
                        },
                        rich: {
                            a: {
                                color: '#fff',
                                backgroundColor: '#977deb',
                                width: 20,
                                height: 20,
                                align: 'center',
                                borderRadius: 2
                            },
                            b: {
                                color: '#fff',
                                backgroundColor: '#fbc759',
                                width: 20,
                                height: 20,
                                align: 'center',
                                borderRadius: 2
                            },
                            c: {
                                color: '#fff',
                                backgroundColor: '#4add71',
                                width: 20,
                                height: 20,
                                align: 'center',
                                borderRadius: 2                                
                            }
                        },
                        formatter: function(params) {
                            if (parseInt(params.slice(0, 1)) <= 3) {
                                return [
                                    '{a|' + (parseInt(params.slice(0, 1)) + 1) + '}' + '  ' + params.slice(1)
                                ].join('\n')
                            }else if( parseInt(params.slice(0, 1)) > 3 && parseInt(params.slice(0,1)) <= 4){
                               return [
                                    '{b|' + (parseInt(params.slice(0, 1)) + 1) + '}' + '  ' + params.slice(1)
                                ].join('\n')
                            } else {
                                return [
                                    '{c|' + (parseInt(params.slice(0, 1)) + 1) + '}' + '  ' + params.slice(1)
                                ].join('\n')
                            }
                        }
                    },
                    data: yData
                },
                geo: {
                    roam: true,
                    map: 'china',
                    left: 'left',
                    right: '300',
                    zoom: 0.3,
                    label: {
                        emphasis: {
                            show: false
                        }
                    },
                    itemStyle: {
                        emphasis: {
                            areaColor: '#fff464'
                        }
                    }
                },
                series: [{
                    name: 'mapSer',
                    type: 'map',
                    map: 'china',
                    zoom: 1,
                    roam: false,
                    geoIndex: 0,
                    label: {
                        show: false,
                    },
                    data: data
                }, {
                    name: 'barSer',
                    type: 'bar',
                    roam: false,
                    visualMap: false,
                    zlevel: 2,
                    barMaxWidth: 8,
                    barGap: '30%',
                    barCategoryGap: '20%',
                    itemStyle: {
                        normal: {
                            color: function(params) {
                                // build a color map as your need.
                                var colorList = [{
                                        colorStops: [{
                                            offset: 0,
                                            color: '#c59fe8' // 0% 处的颜色
                                        }, {
                                            offset: 1,
                                            color: '#a051ea' // 100% 处的颜色
                                        }]
                                    },
                                    {
                                        colorStops: [{
                                            offset: 0,
                                            color: '#fce8bf' // 0% 处的颜色
                                        }, {
                                            offset: 1,
                                            color: '#fbc759' // 100% 处的颜色
                                        }]
                                    },
                                    {
                                        colorStops: [{
                                            offset: 0,
                                            color: '#a9e1b8' // 0% 处的颜色
                                        }, {
                                            offset: 1,
                                            color: '#45dd6d' // 100% 处的颜色
                                        }]
                                    }
                                ];
                                if (params.dataIndex <= 3) {
                                    return colorList[0]
                                }else if(params.dataIndex > 3 && params.dataIndex <= 4){
                                     return colorList[1]
                                } else {
                                    return colorList[2]
                                }
                            },
                            barBorderRadius: 15
                        }
                    },
                    data: barData
                }]
            };
            echart.init(document.getElementById('area')).setOption(option);   
        },
        countChart(){
            /**
             * @description 统计男女工人数量
             */
            let option = {
                color:["#2ec7c9", "#b6a2de"],
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    right:'right',
                    data: ['男性', '女性']
                },
                toolbox: {
                    show: false,
                    feature: {
                        dataView: {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '男性',
                        type: 'line',
                        smooth: true,
                        data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
                        areaStyle:{
                            normal:{
                                opacity: 0.9
                            }
                        }
                    },
                    {
                        name: '女性',
                        type: 'line',
                        smooth: true,
                        data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
                        areaStyle:{
                            normal:{
                                opacity: 0.9
                            }
                        }                        
                    }
                ]
            };
            echart.init(document.getElementById('workerCount')).setOption(option);         
        },
        sexChart(){
            /**
             * @description 学历分布统计
             */
            let option = {
                color:[
                    "#2ec7c9",
                    "#b6a2de",
                    "#5ab1ef",
                    "#ffb980",
                    "#d87a80",
                    "#8d98b3",
                    "#e5cf0d",
                    "#97b552",
                    "#95706d",
                    "#dc69aa",
                    "#07a2a4",
                    "#9a7fd1",
                    "#588dd5",
                    "#f5994e",
                    "#c05050",
                    "#59678c",
                    "#c9ab00",
                    "#7eb00a",
                    "#6f5553",
                    "#c14089"                    
                ],
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    right: 'right',
                    top: 'top',
                    data: ['小学', '初中', '高中', '大专', '本科', '硕士', '博士', '其他']
                },
                toolbox: {
                    show: false,
                    feature: {
                        mark: {show: true},
                        dataView: {show: true, readOnly: false},
                        magicType: {
                            show: true,
                            type: ['pie', 'funnel']
                        },
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                series: [
                    {
                        name: '半径模式',
                        type: 'pie',
                        radius: [20, 110],
                        // center: ['25%', '50%'],
                        roseType: 'radius',
                        label: {
                            show: false
                        },
                        emphasis: {
                            label: {
                                show: true
                            }
                        },
                        data: [
                            {value: 10, name: '小学'},
                            {value: 5, name: '初中'},
                            {value: 15, name: '高中'},
                            {value: 25, name: '大专'},
                            {value: 20, name: '本科'},
                            {value: 35, name: '硕士'},
                            {value: 30, name: '博士'},
                            {value: 40, name: '其他'}
                        ]
                    }
                ]
            };
            echart.init(document.getElementById('sexCount')).setOption(option);            
        },
        handleArea(){
            this.areaChart(this.areaData)
            // staffDistribution().then(res=>{
            //     if(res.err_CODE === 0){
            //         res.data.length > 0 ? this.areaChart(res.data) : this.areaChart(this.areaData)
            //     }
            // })
        },
        lineChart(myChart,dateArr,womenArr,manArr){
            /**
             * @description 近一周工人男女比例增长趋势统计分析
             */
            let option = {
                color:["#2ec7c9", "#b6a2de"],
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    right:'right',
                    data: ['男性', '女性']
                },
                toolbox: {
                    show: false,
                    feature: {
                        dataView: {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        data: dateArr,
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '男性',
                        type: 'line',
                        smooth: true,
                        data: manArr,
                        areaStyle:{
                            normal:{
                                opacity: 0.9
                            }
                        }
                    },
                    {
                        name: '女性',
                        type: 'line',
                        smooth: true,
                        data: womenArr,
                        areaStyle:{
                            normal:{
                                opacity: 0.9
                            }
                        }                        
                    }
                ]
            }; 
            myChart.setOption(option);
            myChart.hideLoading();
            myChart.resize();           
        },
        lineInit(){
            let myChart = echart.init(document.getElementById("workerCount"));
            myChart.showLoading();
            this.lineChart(myChart,this.dateTime,this.womenList,this.manList);
            // let p = new Promise((resolve,reject)=>{
            //     myChart.showLoading();
            //     workerAnalysis().then(res=>{
            //         res.err_CODE === 0 ? resolve(res.data) : reject(res)
            //     })
            // })
            // p.then(value=>{
            //     let dateArr = [], womenArr = [], manArr = [];
            //     value.forEach(item=>{
            //         let times = item.time;
            //         dateArr.push(times.split(' ')[0]);
            //         womenArr.push(item.womanNumber);
            //         manArr.push(item.manNumber);
            //     })
            //     this.$nextTick(()=>{
            //         this.lineChart(myChart,dateArr,womenArr,manArr);
            //     })
            // },reason=>{
            //     this.$message.error(reason.err_MESSAGE);
            // })
        }
    },
    mounted(){
        // this.countChart();
        this.lineInit();
        this.sexChart();
        this.areaChart(this.areaData);
    },
    created(){
        this.handleArea();
    }
}
</script>
<style lang="scss" scoped>
.biao{
    height: 400px;
    ul{
        display: flex;
        flex-direction: row;
        li{
            width: 100%;
        background: white;
        height: 380px;  
        border-radius: 4px;   
        margin-right: 20px;  
        box-shadow: 2px 2px 4px 0px rgba(0, 21, 41, 0.04);    
            div.title{
                width: 100%;
                height: 50px;
                line-height: 50px;
                border-bottom: 1px solid #eee;
                padding-left: 15px;
                box-sizing: border-box;
                font-weight: bold;
                font-size: 16px;
                color: #333;
            }

            div.con{
                height: 330px;
            }
        }
    }

    ul>li:last-child{
        margin-right: 0;
    }
}
.biao:first-child{
    ul>li:first-child{
        flex: 1;
    }
    ul>li:last-child{
        width: 600px;
    }
}
#chart-main{
    background: #f0f2f5;
    padding: 20px 0px;
}
</style>
<style lang="scss">
   #xiangmu .bj .el-form-item .el-form-item__content .el-input--suffix  .el-input__inner{width:492.83px}
   #xiangmu .zhuagt .el-input--suffix .el-input__inner{width:492.83px}
   #xiangmu .bj .el-dialog__footer{border-top: 1px solid #e8e8e8;}
   #xiangmu .address .el-input__inner {text-align: center;background-color: #D9D9D9;}
   #xiangmu .tb .el-dialog__footer{text-align: center;}
   #xiangmu .tb .el-dialog__header .el-dialog__title{margin-left: -20px;}
</style>
