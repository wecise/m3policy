<template>
  <el-container>
    <el-main style="overflow:hidden;">
        <Split :direction="vertical">
            <SplitArea :size="30" :minSize="0" style="overflow:hidden;">
                <el-container>
                    <el-main style="padding:0 20px 0 0;overflow:hidden;">
                        <el-table
                            :data="smartGroup.dt.rows"
                            :highlight-current-row="true"
                            :row-class-name="rowClassName"                
                            ref="groupedTable"
                            style="width:100%;"
                            class="smartGroup-list"
                            @row-click="onSmartGroupSelectionChange">
                            <template v-for="item in smartGroup.dt.columns">
                                <el-table-column 
                                    :prop="item.field"
                                    sortable 
                                    show-overflow-tooltip
                                    :key="item.id"
                                    :label="item ? item.title : ''"
                                    :width="item.width"
                                    v-if="item.visible">
                                    <template slot-scope="scope">
                                        <div v-html='item.render(scope.row, scope.column, scope.row[item.field], scope.$index)' 
                                            v-if="typeof item.render === 'function'">
                                        </div>
                                        <div v-else>
                                            {{scope.row[item.field]}}
                                        </div>
                                    </template>
                                </el-table-column>
                            </template>
                        </el-table>
                    </el-main>
                </el-container>
            </SplitArea>
            <SplitArea :size="70" :minSize="0" style="overflow:hidden;">
                <el-container>
                    <el-main style="padding:0 0px 0 20px;overflow:hidden;">  
                        <el-tabs value="list" type="border-card">
                            <el-tab-pane name="list">
                                <span slot="label">表</span>
                                <EventList ref="eventList" 
                                    :model="dt" 
                                    :global="global" 
                                    :options="dt.options" 
                                    @onDiagnosis="onDiagnosis">
                                </EventList> 
                            </el-tab-pane>
                            <el-tab-pane name="graph">
                                <span slot="label">图</span>
                                <GraphView :model="graph.model"></GraphView>
                            </el-tab-pane>
                        </el-tabs>
                    </el-main>
                </el-container>
            </SplitArea>
        </Split>
    </el-main>
  </el-container>
</template>

<script>
import _ from "lodash";
import EventList from '../EventList.vue';
import GraphView from './GraphView.vue'


export default {
  name: "SmartGroupView",
  props: {
    model: Array,
    global: Object
  },
  components:{
    EventList,
    GraphView
  },
  data() {
    return {
        smartGroup:{
            dt: {
                rows: [],
                columns: [],
                selected: []
            }
        },
        dt: {
            rows: [],
            columns: [],
            selected: [],
            options:{
                header:false,
                dtContainerHeight: '320px',
                severityBar: false
            }
        },
        graph: {
            model: null
        }
    };
  },
  watch:{
      'smartGroup.dt.selected':{
          handler(val){
              this.loadEventListByGroup(val);
          }
      },
      'dt.rows':{
          handler(val){
              this.graph.model = _.compact(_.map(val,'entity'));
          }
      }
  },
  created(){
      
        this.initData();  
      
  },
  mounted(){
        
        this.$refs.groupedTable.setCurrentRow(this.smartGroup.dt.rows[0]);
        this.smartGroup.dt.selected = this.smartGroup.dt.rows[0].ids.split(";");
      
  },
  methods: {
    rowClassName({rowIndex}){
        return `row-${rowIndex}`;
    },
    initData(){
        let term = encodeURIComponent(JSON.stringify(this.model));
        this.m3.callFS("/matrix/eventConsole/diagnosis/smartGroup.js", term).then((rtn)=>{
            let rt = rtn.message;
            _.extend(this.smartGroup.dt, {columns: _.map(rt.template, (v)=>{
                
                if(_.isUndefined(v.visible)){
                    _.extend(v, { visible: true });
                }

                if(!v.render){
                    return v;
                } else {
                    return _.extend(v, { render: eval(v.render) });
                }
                
            })});
            
            _.extend(this.smartGroup.dt, { rows: rt.rows });

        })
    },
    onSmartGroupSelectionChange(row){
        this.smartGroup.dt.selected = row.ids.split(";");
    },
    loadEventListByGroup(val){

        let term = encodeURIComponent(JSON.stringify(val));

        this.m3.callFS("/matrix/eventConsole/diagnosis/eventListBySmartGroup.js", term).then( (rtn) =>{
            
            let rt = rtn.message;

            _.extend(this.dt, {columns: _.map(rt.columns, (v)=>{
                
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

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .el-container{
        height: calc(100vh - 115px);
        background: #f2f2f2;
        border:unset!important;
    }

    .smartGroup-list .el-table .cell {
        white-space: nowrap!important;
        line-height: 18px!important;
    }
    
</style>
