<template>
    <el-container class="public-box" id="chart-box">
        <el-header height="70px" class="public-header header-title-button">
        <el-row type="flex" align="center" justify="space-between">
            <div class="public-header-title">环境监测</div>
        </el-row>
        </el-header>
        <!-- 主体容器 -->
        <!-- 四个维度 -->
        <div class="dimension">
            <ul>
                <li>
                    <span class="fl">
                        <i class="txt title">{{environment.temperature == null ? '--' : environment.temperature}}</i>
                        <i class="txt">当前温度</i>
                    </span>
                    <span class="fr">
                        <i class="iconfont icon-wendu"></i>
                    </span>
                </li>
                <li>
                    <span class="fl">
                        <i class="txt title">{{environment.pm == null ? '--' : environment.pm}}</i>
                        <i class="txt">当前环境中PM2.5</i>
                    </span>
                    <span class="fr">
                        <i class="iconfont icon-app_icons--"></i>
                    </span>
                </li>
                <li>
                    <span class="fl">
                        <i class="txt title">{{environment.windDirection == null ? '--' : environment.windDirection}}</i>
                        <i class="txt">当前风向</i>
                    </span>
                    <span class="fr">
                        <i class="iconfont icon-fengxiang" style="font-size:64px"></i>
                    </span>
                </li>
                <li>
                    <span class="fl">
                        <i class="txt title">{{environment.noise == null ? '--' : environment.noise}}</i>
                        <i class="txt">当前噪音</i>
                    </span>
                    <span class="fr">
                        <i class="iconfont icon-zaoyin" style="font-size:64px"></i>
                    </span>
                </li>                                
            </ul>
        </div>        
        <el-main class="public-main">
            <div class="public-main-content radius public-padding" >
                <!-- 图表 -->
                <div class="chart-box">
                    <div id="main" style="width: 100%;height:600px;overflow:hidden"></div>
                </div>
            </div>
        </el-main>
    </el-container>
</template>

<script>
import echarts from 'echarts'
import rawData from '../../utils/datas.json'
import { mqttConfig } from '../../../static/mqtt-config.js'
var mqtt = require('mqtt')
export default {
    data(){
        return{
            client: mqtt.connect(mqttConfig.url,{
                username: mqttConfig.userName,
                password: mqttConfig.password
            }),
            environment:{
                temperature: null,
                pm: null,  
                windDirection: null,
                noise: null,
            }
        }
    },
    methods:{
        weatherChart(){
            let weatherChart = echarts.init(document.getElementById('main'));
            var weatherIcons = {
                'Showers': 'https://echarts-www.cdn.bcebos.com/examples/data/asset/img/weather/showers_128.png',
                'Sunny': 'https://echarts-www.cdn.bcebos.com/examples/data/asset/img/weather/sunny_128.png',
                'Cloudy': 'https://echarts-www.cdn.bcebos.com/examples/data/asset/img/weather/cloudy_128.png'
            };

            var directionMap = {};
            echarts.util.each(
                ['W', 'WSW', 'SW', 'SSW', 'S', 'SSE', 'SE', 'ESE', 'E', 'ENE', 'NE', 'NNE', 'N', 'NNW', 'NW', 'WNW'],
                function (name, index) {
                    directionMap[name] = Math.PI / 8 * index;
                }
            );

            var data = echarts.util.map(rawData.data, function (entry) {
                return [entry.time, entry.windSpeed, entry.R, entry.waveHeight];
            });
        
            var weatherData = echarts.util.map(rawData.forecast, function (entry) {
                return [entry.localDate, 0, weatherIcons[entry.skyIcon], entry.minTemp, entry.maxTemp];
            });

            var dims = {
                time: 0,
                windSpeed: 1,
                R: 2,
                waveHeight: 3,
                weatherIcon: 2,
                minTemp: 3,
                maxTemp: 4
            };
            var arrowSize = 18;
            var weatherIconSize = 45;

            function renderArrow(param, api) {
                var point = api.coord([
                    api.value(dims.time),
                    api.value(dims.windSpeed)
                ]);

                return {
                    type: 'path',
                    shape: {
                        pathData: 'M31 16l-15-15v9h-26v12h26v9z',
                        x: -arrowSize / 2,
                        y: -arrowSize / 2,
                        width: arrowSize,
                        height: arrowSize
                    },
                    rotation: directionMap[api.value(dims.R)],
                    position: point,
                    style: api.style({
                        stroke: '#555',
                        lineWidth: 0
                    })
                };
            }

            function renderWeather(param, api) {
                var point = api.coord([
                    api.value(dims.time) + 3600 * 24 * 1000 / 2,
                    0
                ]);

                return {
                    type: 'group',
                    children: [{
                        type: 'image',
                        style: {
                            image: api.value(dims.weatherIcon),
                            x: -weatherIconSize / 2,
                            y: -weatherIconSize / 2,
                            width: weatherIconSize,
                            height: weatherIconSize
                        },
                        position: [point[0], 110]
                    }, {
                        type: 'text',
                        style: {
                            text: api.value(dims.minTemp) + ' - ' + api.value(dims.maxTemp) + '°',
                            textFont: api.font({fontSize: 14}),
                            textAlign: 'center',
                            textVerticalAlign: 'bottom'
                        },
                        position: [point[0], 80]
                    }]
                };
            }

            let option = {
                backgroundColor: '#fff',
                title: {
                    text: '天气情况分析',
                    subtext: '',
                    left: 'left'
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        return [
                            echarts.format.formatTime('yyyy-MM-dd', params[0].value[dims.time])
                            + ' ' + echarts.format.formatTime('hh:mm', params[0].value[dims.time]),
                            '风速：' + params[0].value[dims.windSpeed],
                            '风向：' + params[0].value[dims.R],
                            '温度：' + params[0].value[dims.waveHeight]
                        ].join('<br>');
                    }
                },
                grid: {
                    top: 90,
                    left:'5%',
                    bottom: 125,
                },
                xAxis: {
                    type: 'time',
                    maxInterval: 3600 * 1000 * 24,
                    splitLine: {
                        lineStyle: {
                            color: '#ddd'
                        }
                    }
                },
                yAxis: [{
                    name: '风速（节）',
                    nameLocation: 'middle',
                    nameGap: 35,
                    axisLine: {
                        lineStyle: {
                            color: '#666'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#ddd'
                        }
                    }
                }, {
                    name: '温度（ °C）',
                    nameLocation: 'middle',
                    nameGap: 35,
                    max: 6,
                    axisLine: {
                        lineStyle: {
                            color: '#015DD5'
                        }
                    },
                    splitLine: {show: false}
                }, {
                    axisLine: {show: false},
                    axisTick: {show: false},
                    axisLabel: {show: false},
                    splitLine: {show: false}
                }],
                visualMap: {
                    type: 'piecewise',
                    // show: false,
                    orient: 'vertical',
                    right: 'right',
                    
                    bottom: 70,
                    pieces: [{
                        gte: 17,
                        color: '#f97187',
                        label: '大风（>=17节）'
                    }, {
                        gte: 11,
                        lt: 17,
                        color: '#a051ea',
                        label: '中风（11  ~ 17 节）'
                    }, {
                        lt: 11,
                        color: '#73f094',
                        label: '微风（小于 11 节）'
                    }],
                    seriesIndex: 1,
                    dimension: 1
                },
                dataZoom: [{
                    type: 'inside',
                    xAxisIndex: 0,
                    minSpan: 5
                }, {
                    type: 'slider',
                    xAxisIndex: 0,
                    minSpan: 5,
                    height: 20,
                    bottom: 70,
                    handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                    handleSize: '120%'
                }],
                series: [{
                    type: 'line',
                    yAxisIndex: 1,
                    showSymbol: false,
                    hoverAnimation: false,
                    symbolSize: 10,
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: 'rgba(88,160,253,1)'
                            }, {
                                offset: 0.5, color: 'rgba(88,160,253,0.7)'
                            }, {
                                offset: 1, color: 'rgba(88,160,253,0)'
                            }]
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: 'rgba(88,160,253,1)'
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: 'rgba(88,160,253,1)'
                        }
                    },
                    encode: {
                        x: dims.time,
                        y: dims.waveHeight
                    },
                    data: data,
                    z: 2
                }, {
                    type: 'custom',
                    renderItem: renderArrow,
                    encode: {
                        x: dims.time,
                        y: dims.windSpeed
                    },
                    data: data,
                    z: 10
                }, {
                    type: 'line',
                    symbol: 'none',
                    encode: {
                        x: dims.time,
                        y: dims.windSpeed
                    },
                    lineStyle: {
                        normal: {
                            color: '#aaa',
                            type: 'dotted'
                        }
                    },
                    data: data,
                    z: 1
                },{
                    type: 'custom',
                    renderItem: renderWeather,
                    data: weatherData,
                    tooltip: {
                        trigger: 'item',
                        formatter: function (param) {
                            return param.value[dims.time] + ': '
                                + param.value[dims.minTemp] + ' - ' + param.value[dims.maxTemp] + '°';
                        }
                    },
                    yAxisIndex: 2,
                    z: 11
                }]
            };
            
            weatherChart.setOption(option);
            window.addEventListener('resize',()=>{
                weatherChart.resize();
            })           
        },         
    },
    created(){
        this.environment.temperature = window.localStorage.getItem('temperature');
        this.environment.windDirection = window.localStorage.getItem('windDirection');
        this.environment.noise = window.localStorage.getItem('noise');
        this.environment.pm = window.localStorage.getItem('pm');
    },
    mounted(){     
        this.weatherChart();
        this.client.subscribe(mqttConfig.subTopic,err=>{
            console.log("订阅主题")
        })
        this.client.on('message',(topic,message)=>{
            if(topic == mqttConfig.subTopic){
                if(message.toString().length > 0){
                    if(JSON.parse(message.toString()).node == 1){
                        this.environment.windDirection = JSON.parse(message.toString()).value;
                        window.localStorage.setItem("windDirection",JSON.parse(message.toString()).value)
                    }else if(JSON.parse(message.toString()).node == 2 && JSON.parse(message.toString()).text == "温度"){
                        this.environment.temperature = JSON.parse(message.toString()).value;
                        window.localStorage.setItem("temperature",JSON.parse(message.toString()).value)
                    }else if(JSON.parse(message.toString()).node == 3){
                        this.environment.noise = JSON.parse(message.toString()).value;
                        window.localStorage.setItem("noise",JSON.parse(message.toString()).value)
                    }else if(JSON.parse(message.toString()).node == 4){
                        this.environment.pm = JSON.parse(message.toString()).value;
                        window.localStorage.setItem("pm",JSON.parse(message.toString()).value)
                    }
                    console.log(message.toString());
                }
            }
        });
    }
}
</script>
    <!-- node = 1 : 风向
    node = 2 : 温度
    node = 3 : 噪音
    node = 4 : PM2.5 -->
<style lang="scss" scoped>
    #chart-box{
        .public-padding{
            height:630px;
        }
        .dimension ul{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            padding: 20px;
            box-sizing: border-box;
            li{
                height: 150px;
                border-radius: 6px;
                box-shadow: 2px 2px 5px 2px rgba(0, 0, 0, 0.08);
                width:24%;
                min-width: 200px;
                background: white;
                display: flex;
                flex-direction: row;
                span{
                    height: 150px;
                }
                span.fl{
                    width: 280px;
                    display: flex;
                    flex-direction: column;
                    // align-items: center;
                    i{
                        font-style: normal;
                        font-size: 14px;
                        color: #000;
                        margin-left: 35px;
                    }

                    i.title{
                        font-size: 32px;
                        margin-top: 40px;
                        margin-bottom: 6px;
                    }
                }
                span.fr{
                    flex: 1;
                    display: flex;
                    align-items: center;
                    i{
                        font-size: 54px;
                        color: #5f77ff;
                        text-shadow: 5px 3px 5px #dbaef1;
                    }
                }
            }

            li:last-child{
                border-right: none;
            }
        }
    }
</style>