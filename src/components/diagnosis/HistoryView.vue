<template>
    <el-container>
        <el-main>  
            <EventList ref="eventList" 
                :model="dt" 
                :global="global" 
                :options="dt.options" 
                @onDiagnosis="onDiagnosis">
            </EventList> 
        </el-main>
    </el-container>
</template>

<script>
import _ from 'lodash';
import EventList from '../EventList';

export default {
    name: "HistoryView",
    props: {
        model: Object
    },
        data(){
            return {
                dt: {
                    rows: [],
                    columns: [],
                    selected: [],
                    options: {
                        header: false,
                        dtContainerHeight: '220px',
                        severityBar: false
                    }
                }
            }
    },
    components:{
        EventList
    },
    created(){  
        this.initData();  
    },
    methods:{
        initData(){
            let term = encodeURIComponent(JSON.stringify(this.model));
            this.m3.callFS("/matrix/eventConsole/diagnosis/smartGroup.js", term).then((rtn)=>{
                let rt = rtn.message;
                _.extend(this.dt, {columns: _.map(rt.template, (v)=>{
                    
                    if(_.isUndefined(v.visible)){
                        _.extend(v, { visible: true });
                    }

                    if(!v.render){
                        return v;
                    } else {
                        return _.extend(v, { render: eval(v.render) });
                    }
                    
                })});
                
                _.extend(this.dt, { rows: rt.rows });

            })
        },
        onDiagnosis(data){
            this.eventHub.$emit("event-diagnosis", data);
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .el-container{
        height: calc(100vh - 220px);
        background: #f2f2f2;
        border:unset!important;
    }

    .el-main{
        padding: 0px;
        overflow: hidden;
    }

    .el-table .cell {
        white-space: nowrap!important;
        line-height: 18px!important;
    }
</style>
