<template>
    <div style="width:100%;height:300px;" ref="chartContainer"></div>
</template>

<script>
import _ from 'lodash';
import $ from 'jquery';
import echarts from 'echarts';
export default{
    name: "ChartView",
    props:{
        model:Object
    },
    data(){
        return {
            chart: null,
            option: {
                tooltip: {
                    trigger: 'axis'
                },
                toolbox: {
                    right: 10,
                    top: 0,
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        restore: {},
                        saveAsImage: {}
                    }
                },
                grid: {
                    top: '15%',
                    left: '3%',
                    right: '4%',
                    bottom: '35%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: []
                },
                yAxis: {
                    type: 'value'
                },
                series: []
            }                            
        }
    },
    watch: {
        model:{
            handler(){
                this.initData();
            },
            deep:true
        }
    },
    created(){
        
        // 初始化数据
        this.initData();

        // 接收窗体RESIZE事件
        this.eventHub.$on("WINDOW-RESIZE-EVENT", this.checkChart);
    },
    mounted() {
        this.init();

        // 监听窗口发生变化，resize组件
        window.addEventListener('resize', this.checkChart)
        
        // 通过hook监听组件销毁钩子函数，并取消监听事件
        this.$once('hook:beforeDestroy', () => {
            window.removeEventListener('resize', this.checkChart)
        })
    },
    methods: {
        init(){
            _.delay(()=>{
                this.chart = echarts.init(this.$el);
                this.chart.setOption(this.option);
            },3000)
        },
        initData(){
            try{

                let param = encodeURIComponent( JSON.stringify(this.model) );
                this.m3.callFS("/matrix/m3event/diagnosis/tsdb/searchPerformanceByTerm.js",param).then( val=>{
                    let rtn = val.message.result.reverse();

                    //取实时数据的time作为xAxis
                    this.option.xAxis.data = _.map(rtn,(v)=>{
                        return this.moment(v[0]).format('YY-MM-DD HH:mm');
                    });
                    
                    this.option.series = [{
                        name: `${this.model.bucket} ${this.model.key}`,
                        data: _.map(rtn,(v)=>{ return v[1];}),
                        type: 'line',
                        smooth:true,
                        color: 'rgba(108, 212, 11, 1)',
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgba(108, 212, 11, .5)'
                                }, {
                                    offset: 1,
                                    color: 'rgba(108, 212, 11, .1)'
                                }])
                            }
                        }
                    }];

                    if(this.$refs.chartContainer){
                        this.chart.setOption(this.option);
                    }
                } );
                
            } catch(err){
                console.error(err);
            }
        },
        checkChart(){
            
            try{
                this.chart.resize();
            } catch(err){
                console.error(err)
            }
        },
        destroyed(){
            $(this.$el).off();
        }
    }    
}
</script>

<style scoped>

</style>
