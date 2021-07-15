<template>
    
    <v-chart :options="options" class="chart" 
        :autoresize="true"
        :loading="true">
    </v-chart>
    
    
</template>

<script>
import echarts from "echarts";
import ECharts  from "vue-echarts";
import _ from 'lodash';

export default {
    name: 'ChartView',
    props:{
        model: Object
    },
    components: {
        "v-chart": ECharts
    },
    data() {
        return {
            options: {
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
                    bottom: '45%',
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
    watch:{
        model:{
            handler: _.throttle(function(){
                const self = this;
                self.initData();
            },50)
        }
    },
    mounted(){
        this.$nextTick(()=>{
            this.initData();
        })
    },
    methods: {
        initData(){
            try{

                let param = encodeURIComponent( JSON.stringify(this.model) );
                this.m3.callFS("/matrix/m3event/diagnosis/tsdb/searchPerformanceByTerm.js",param).then( val=>{
                    let rtn = val.message.result.reverse();

                    //取实时数据的time作为xAxis
                    this.options.xAxis.data = _.map(rtn,(v)=>{
                        return this.moment(v[0]).format('YY-MM-DD HH:mm');
                    });
                    
                    this.options.series = [{
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
                } );
                
            } catch(err){
                console.error(err);
            }
        },
        destroyed(){
            $(this.$el).off();
        }
    }
};
</script>

<style >
    .chart{
        width:100%;
        height:100%;
    }
</style>