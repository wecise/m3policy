<template>
    <el-container>
        <el-header>
            <el-tooltip content="$t('event.actions.runningMode')" :open-delay="800" placement="top">
                <el-button type="text" @click="onToggle" icon="el-icon-notebook-2"></el-button>
            </el-tooltip>
            <el-tooltip content="$t('event.actions.refresh')" :open-delay="800" placement="top">
                <!--el-button type="text" @click="$root.$refs.searchRef.search" icon="el-icon-refresh"></el-button-->
            </el-tooltip>
            <!--el-tooltip :content="mx.global.register.event.status[item][1]" open-delay="500" placement="top" :key="item[1]" v-for="item in model.actions">
                <el-button type="text" @click="onAction(item)" :icon="mx.global.register.event.status[item][2]" v-if="!_.isEmpty(model.actions)"></el-button>
            </el-tooltip-->
            <el-tooltip content="$t('event.actions.export')" placement="top" delay-time="500">
                <el-dropdown @command="onExport" style="margin-left:5px;">
                    <span class="el-dropdown-link">
                        <i class="el-icon-download el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="csv">CSV</el-dropdown-item>
                        <el-dropdown-item command="json">JSON</el-dropdown-item>
                        <!--el-dropdown-item command="pdf">PDF</el-dropdown-item-->
                        <el-dropdown-item command="png">PNG</el-dropdown-item>
                        <!--el-dropdown-item command="sql">SQL</el-dropdown-item-->
                        <el-dropdown-item command="xls">XLS (Excel 2000 HTML format)</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-tooltip>
            
            <!--el-tooltip :content="$t('event.actions.runningMode')" placement="top" open-delay="500">
                <el-dropdown @command="$root.toggleView" style="margin-left:5px;">
                    <span class="el-dropdown-link">
                        <el-button type="text" icon="el-icon-s-platform"></el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="m">#{ $t('event.actions.monitorModel') }#</el-dropdown-item>
                        <el-dropdown-item command="o">#{ $t('event.actions.operationModel') }#</el-dropdown-item>
                        <el-dropdown-item command="f" divided>#{ $t('event.actions.fullscreenModel') }#</el-dropdown-item>
                        <el-dropdown-item command="e">#{ $t('event.actions.exitFullscreenModel') }#</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-tooltip-->
            <el-tooltip :content="control.ifRefresh==1?'自动刷新启用中':'自动刷新关闭中'" placement="top" open-delay="800">
                <el-dropdown style="float:right;">
                    <span class="el-dropdown-link">
                        <div>
                            {{ control.ifRefresh==1 ? '自动刷新' : '刷新关闭' }}
                            <el-switch
                                v-model="control.ifRefresh"
                                active-color="#13ce66"
                                inactive-color="#dddddd"
                                active-value="1"
                                inactive-value="0"
                                @change="toggleSummaryByRefresh">
                            </el-switch>
                        </div>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>15s</el-dropdown-item>
                        <el-dropdown-item>30s</el-dropdown-item>
                        <el-dropdown-item>60s</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-tooltip>
            <el-dropdown style="padding-right:10px;float: right;">
                <span class="el-dropdown-link">
                    <i class="el-icon-menu el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                        <el-tooltip :content="control.ifSmart==1?'智能分析启用中':'智能分析关闭中'" placement="top" open-delay="500">
                            <div>
                                {{control.ifSmart==1?'智能分析':'智能分析'}}
                                <el-switch
                                    v-model="control.ifSmart"
                                    active-color="#13ce66"
                                    inactive-color="#dddddd"
                                    active-value="1"
                                    inactive-value="0"
                                    @change="toggleSummaryBySmart">
                                </el-switch>
                            </div>
                        </el-tooltip>
                    </el-dropdown-item>
                    <el-dropdown-item>
                        <el-tooltip :content="control.ifAiGroup==1?'智能分组启用中':'智能分组关闭中'" placement="top" open-delay="500">
                            <div>
                                {{control.ifAiGroup==1?'智能分组':'智能分组'}}
                                <el-switch
                                    v-model="control.ifAiGroup"
                                    active-color="#13ce66"
                                    inactive-color="#dddddd"
                                    active-value="1"
                                    inactive-value="0"
                                    @change="toggleSummaryByGroup">
                                </el-switch>
                            </div>
                        </el-tooltip>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-header>   
        <el-main @mouseup.native="onMainClick">
            <el-table
                :data="dt.rows"
                :highlight-current-row="true"
                :row-class-name="rowClassName"
                ref="table"
                style="width:100%;"
                >
                <el-table-column type="selection" align="center"></el-table-column> 
                <!--el-table-column type="expand">
                    <template>
                        <el-container style="width:50vw;">
                            <el-main>
                                <el-form label-position="right" label-width="120px">
                                    <el-form-item v-for="(v,k) in props.row" :label="k" :key="k">
                                        <el-input :type="(k,metaColumns) | pickType" :value="this.moment(v).format(mx.global.register.format)"  v-if="pickFtype(k) == 'timestamp'"></el-input>
                                        <el-input :type="(k,metaColumns) | pickType" :value="this.moment(v).format('YYYY-MM-DD')"  v-else-if="pickFtype(k) == 'date'"></el-input>
                                        <el-input :type="(k,metaColumns) | pickType" :rows="6" :value="JSON.stringify(v,null,4)"  v-else-if="_.includes(['map','set','list'],pickFtype(k))"></el-input>
                                        <el-input :type="(k,metaColumns) | pickType" :value="v"  v-else></el-input>
                                    </el-form-item>
                                </el-form>
                            </el-main>
                        </el-container>
                    </template>
                </el-table-column-->
                <el-table-column :prop="item.field"
                    :label="item.title" 
                    sortable 
                    show-overflow-tooltip
                    v-for="item in dt.columns"
                    :key="item.id"
                    :width="item.width"
                    :formatter="item.render" 
                    class="event-console"
                    >
                </el-table-column>
                <!--el-table-column label="标签" prop="tags" width="200">
                    <template slot-scope="scope">
                        <mx-tag domain='event' :model.sync="scope.row.tags" :id="scope.row.id" limit="1"></mx-tag>
                    </template>
                </el-table-column-->
            </el-table>
        </el-main>
        <el-footer>
            <div class="toolbar">
                <el-button-group v-if="global">
                    <el-button
                    type="default"
                    v-for="btn in global.register.event.severity"
                    :key="btn[1]"
                    :style="'color:#ffffff;background:' + btn[2]"
                    >
                    {{ btn[1] }}({{btn[0]}})
                    </el-button>
                </el-button-group>
            </div>
            <div class="footbar">
                {{ info.join(' &nbsp; | &nbsp;') }}
            </div>
        </el-footer>
    </el-container>
</template>
<script>
import _ from "lodash";
import $ from "jquery";
window.moment = require("moment");

export default {
  name: "EventList",
    props: {
        model: Object,
        global: Object
    },
    data(){
        return {
            dt:{
                rows:[],
                columns: [],
                selected: []
            },
            info: [],
            control:{
                ifSmart: 1,
                ifAiGroup: 1,
                ifRefresh: 1
            }
        }
    },
    watch: {
        'model.rows': {
            handler(){
                this.dt.rows = [];
                this.initData();
            },
            deep:true
        },
        dt: {
            handler(){
                this.info = [];
                this.info.push(`共 ${this.dt.rows.length} 项`);
                this.info.push(`已选择 ${this.dt.selected.length} 项`);
                this.info.push(this.moment().format("YYYY-MM-DD HH:mm:ss.SSS"));
            },
            deep:true,
            immediate:true
        }
    },
    computed:{
        metaColumns(){
            try{
                return this.model.columns[this.model.rootClass];
            } catch(err){
                return [];
            }
        }
    },
    mounted(){  
        this.initData();

        window.global = this.global;
    },
    methods: {
        pickFtype(key){

            let rtn = 'string';
            try{
                rtn = _.find(this.metaColumns,{data:key}).type;
            } catch(err){
                return rtn;
            }
            return rtn;

        },
        initData(){
            
            _.extend(this.dt, {columns: _.map(this.model.template, function(v){
                
                if(_.isUndefined(v.visible)){
                    _.extend(v, { visible: true });
                }

                if(!v.render){
                    return v;
                } else {
                    return _.extend(v, { render: eval(v.render) });
                }
                
            })});
            
            _.extend(this.dt, { rows: [] });
            _.extend(this.dt, { rows: this.model.rows });

        },
        rowClassName({rowIndex}){
            return `row-${rowIndex}`;
        },
        // 监听鼠标操作 停止自动刷新
        onMainClick(){
            this.$root.control.ifRefresh=0;
        },
        onSelectionChange(val) {
            this.dt.selected = val;
        },
        onAction(evt){
            if(_.isEmpty(this.dt.selected)){
                this.$message({
                    type: "info",
                    message: "请选择事件！"
                });
                return false;
            }

            this.$root.action( {list: this.dt.selected, action:evt});
        },
        onToggle(){
            this.$root.toggleModel(_.without(['view-normal','view-tags'],window.EVENT_VIEW).join(""));
        },
        onRowContextmenu(row, column){
            const self = this;

            $.contextMenu( 'destroy' ).contextMenu({
                selector: `.${column.id}`,
                trigger: "right",
                autoHide: true,
                delay: 5,
                hideOnSecondTrigger: true,
                className: `animated slideIn ${column.id}`,
                build: function() {
                    
                    return {
                        callback: function(key) {
                            
                            if(_.includes(key,'diagnosis')) {
                                self.$root.detailAdd(row);
                            } else if(_.includes(key,'window')) {
                                
                                try{
                                    let tmp = JSON.parse(key.split("::")[1]);
                                    let url = tmp.url;
                                    let target = tmp.target;
                                    window.open(url+row.id,target);
                                } catch(err){
                                    console.log(err);
                                }
                                
                            } else if(_.includes(key,'action')) {
                                // 增加操作类型
                                let action = _.last(key.split("_"));
                                self.$root.action({list: [row], action:action});
                            } else if(_.includes(key,'ticket')){
                                /* alertify.confirm(`确定生成工单<br><br>
                                                    告警ID：${row.id}<br><br>
                                                    实体ID：${row.entity}<br><br>
                                                    模板ID：b223c78b-3107-11e6-8487-446d577ed81c<br><br>
                                                    告警摘要：${row.msg}<br><br>
                                                    告警时间：${this.moment(row.vtime).format("LLL")}<br><br>`, function (e) {
                                    if (e) {
                                        try{
                                            let rtn = fsHandler.callFsJScript("/matrix/readysoft/eventToTicket.js", encodeURIComponent(JSON.stringify(row).replace(/%/g,'%25'))).message.data;
                                            if(rtn.data.success == 1){
                                                self.options.term = row.id;
                                                self.$refs.searchRef.search();
                                                alertify.success(`创建工单成功! <br><br>
                                                            工单单号：${rtn.data.ticket_number}`)
                                            }
                                        }catch(err){
                                            alertify.error(`创建工单失败，请确认！ <br><br>
                                                            ${rtn}<br><br>
                                                            ${err}`)
                                        }
                                    } else {
                                        
                                    }
                                }); */
                            }
                        },
                        items: self.model.contextMenu.event
                    }
                },
                events: {
                    show() {

                    }
                }
            });
        },
        onExport(type){
    
            let options = {
                csvEnclosure: '',
                csvSeparator: ', ',
                csvUseBOM: true,
                ignoreColumn: [0,1],
                fileName: `tableExport_${this.moment().format("YYYY-MM-DD HH:mm:ss")}`,
                type: type,
            };

            if(type === 'png'){
                //$(this.$refs.table.$el.querySelectorAll("table")).tableExport(options);
                $(this.$refs.table.$el.querySelector("table.el-table__body")).tableExport(options);
            } else if(type === 'pdf'){
                _.extend(options, {
                    jspdf: {orientation: 'l',
                            format: 'a3',
                            margins: {left:10, right:10, top:20, bottom:20},
                            autotable: {styles: {fillColor: 'inherit', 
                                                    textColor: 'inherit'},
                                        tableWidth: 'auto'}
                    }
                });
                $(this.$refs.table.$el.querySelectorAll("table")).tableExport(options);
            } else {
                $(this.$refs.table.$el.querySelectorAll("table")).tableExport(options);
            }
            
        }
    }
}
</script>
<style scoped>

.el-container{
    height:calc(100vh - 160px)!important;
    border: 1px solid #dddddd!important;
}

.el-header{
    height:30px!important;
    line-height:30px;
    background:#f2f2f2;
    padding:0 10px;
    border-bottom: 1px solid #ffffff;
}

.el-main{
    border-top: 1px solid #dddddd;
    padding: 0px;
    overflow: hidden;
}

.el-main > .el-table{
    height: 100%;
    overflow: auto;
}

.el-main > .el-table .el-table--small td{
    padding: 0px;
}

.el-footer{
    height: auto!important;
    padding: 5px 0 0 0;
}

.el-footer > .toolbar {
  padding: 0 0 5px 5px;
  border-bottom: 1px solid #dddddd;
}
.el-footer > .footbar{
    border-top: 1px solid #ffffff;
    height:30px;
    line-height: 30px;
    padding: 0 0 0 10px;
    font-size: 12px;
    background: #f2f2f2;
}

.el-table {
    height:100%!important;
    overflow: hidden!important;
}



</style>