<template>
    <el-container>
        <el-header>
            
            <el-tooltip :content="$t('event.actions.runningMode')"  placement="top">
                <el-button type="text" @click="onToggle">
                    <span class="el-icon-notebook-2" style="cursor:pointer;font-size:16px;"></span>
                </el-button>
            </el-tooltip>

            <el-tooltip :content="$t('event.actions.refresh')"  placement="top">
                <el-button type="text" @click="onRefresh">
                    <span class="el-icon-refresh" style="cursor:pointer;font-size:16px;"></span>
                </el-button>
            </el-tooltip>
            
            <el-tooltip :content="$t('event.actions.export')" placement="top" >
                <el-dropdown @command="onExport" style="cursor:pointer;font-size:16px;padding-left:10px;">
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
            
            <!--el-tooltip :content="$t('event.actions.runningMode')" placement="top" >
                <el-dropdown style="margin-left:10px;">
                    <span class="el-dropdown-link">
                        <el-button type="text" icon="el-icon-s-platform"></el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="m">{{ $t('event.actions.monitorModel') }}</el-dropdown-item>
                        <el-dropdown-item command="o">{{ $t('event.actions.operationModel') }}</el-dropdown-item>
                        <el-dropdown-item command="f" divided>{{ $t('event.actions.fullscreenModel') }}</el-dropdown-item>
                        <el-dropdown-item command="e">{{ $t('event.actions.exitFullscreenModel') }}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-tooltip-->
            <el-tooltip :content="control.ifRefresh?'自动刷新启用中':'自动刷新关闭中'" placement="top" >
                <span style="float:right;">
                    {{ control.ifRefresh ? '自动刷新' : '刷新关闭' }}
                    <el-switch
                        v-model="control.ifRefresh"
                        active-color="#13ce66"
                        inactive-color="#dddddd"
                        :active-value="true"
                        :inactive-value="false">
                    </el-switch>
                </span>
            </el-tooltip>
            <el-dropdown style="padding-left:10px;">
                <span class="el-dropdown-link">
                    <i class="el-icon-s-grid el-icon--right" style="cursor:pointer;padding-top:7px;font-size:16px;"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <div class="tool-box">
                        <!-- 运行模式 -->
                        <div class="tool" :key="item.name" v-for="item in control.mode.list">
                            <div>{{item.value?item.title+'开':item.title+'关'}}</div>
                            <p>
                                <el-switch
                                    v-model="item.value"
                                    active-color="#13ce66"
                                    inactive-color="#dddddd"
                                    :active-value="true"
                                    :inactive-value="false"
                                    @change="control.mode.value=item">
                                </el-switch>
                            </p>
                        </div>
                        <!-- 业务工具 -->
                        <div class="tool">
                            <div>{{control.ifSmartGroup?'智能分组':'智能分组'}}</div>
                            <p>
                                <el-switch
                                    v-model="control.ifSmartGroup"
                                    active-color="#13ce66"
                                    inactive-color="#dddddd"
                                    :active-value="true"
                                    :inactive-value="false">
                                </el-switch>
                            </p>
                        </div>
                        <div class="tool">
                            <div>{{control.ifSmart?'智能分析':'智能分析'}}</div>
                            <p>
                                <el-switch
                                    v-model="control.ifSmart"
                                    active-color="#13ce66"
                                    inactive-color="#dddddd"
                                    :active-value="true"
                                    :inactive-value="false">
                                </el-switch>
                            </p>
                        </div>
                        <!-- 一般工具 -->
                        <div class="tool">
                            <div>选择导出</div>
                            <p>
                                <el-dropdown style="cursor:pointer;font-size:16px;padding-left:10px;">
                                    <span class="el-icon-download"></span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item command="csv">CSV</el-dropdown-item>
                                        <el-dropdown-item command="json">JSON</el-dropdown-item>
                                        <!--el-dropdown-item command="pdf">PDF</el-dropdown-item-->
                                        <el-dropdown-item command="png">PNG</el-dropdown-item>
                                        <!--el-dropdown-item command="sql">SQL</el-dropdown-item-->
                                        <el-dropdown-item command="xls">XLS (Excel 2000 HTML format)</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </p>
                        </div>
                    </div>
                </el-dropdown-menu>
            </el-dropdown>
        </el-header>   
        
        <el-main @mouseup.native="onMainClick">
            <el-table
                :data="dt.rows"
                :highlight-current-row="true"
                :row-class-name="rowClassName"                
                @row-contextmenu="onRowContextmenu"
                ref="table"
                style="width:100%;">
                <el-table-column type="selection" align="center"></el-table-column> 
                <!--el-table-column type="expand">
                    <template>
                        <el-container style="width:50vw;">
                            <el-main>
                                <el-form label-position="right" label-width="120px">
                                    <el-form-item v-for="(v,k) in props.row" :label="k" :key="k">
                                        <el-input :type="(k,metaColumns) | pickType" :value="this.moment(v).format(global.register.format)"  v-if="pickFtype(k) == 'timestamp'"></el-input>
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
                    :formatter="item.render">
                    
                </el-table-column>
                <el-table-column label="标签" prop="tags" width="200">
                    <template slot-scope="scope">
                        <div style="height:30px;line-height:30px;">
                            <TagView domain='event' :model.sync="scope.row.tags" :id="scope.row.id" :limit="1"></TagView>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-main>
        <el-footer>
            <div class="toolbar">
                <el-button-group v-if="global">
                    <el-button
                    type="default"
                    v-for="(btn,key) in global.register.event.severity"
                    :key="btn[1]"
                    :style="'color:#ffffff;background:' + btn[2]"
                    >
                    {{ btn[1] }} <span style="font-variant: all-small-caps;">{{btn[0]}}</span> {{ dt.summary[key]?dt.summary[key].length:0 }}
                    </el-button>
                </el-button-group>
            </div>
            <div class="footbar">
                {{ info.join(' &nbsp; | &nbsp;') }}
                <span style="float:right;padding-right:10px;" id="countDownTimer"></span>
            </div>
        </el-footer>
        <vue-context 
            :close-on-click="dt.contextmenu.closeOnClick"
            :close-on-scroll="dt.contextmenu.closeOnScroll"
            ref="contextmenu" v-slot="{data}"
            v-show="dt.contextmenu.show">
            <li>
                <el-link @click.prevent="onContextmenuClick(data,null)" :underline="false"> 
                    <!-- <el-button
                        type="default"
                        :style="'padding: 5px;border-radius: 15px;color:#ffffff;background:' + global.register.event.severity[data.severity][2]"
                        >
                        {{ global.register.event.severity[data.severity][1] }} <span style="font-variant: all-small-caps;">{{global.register.event.severity[data.severity][0]}}</span>
                    </el-button> -->
                    <span> {{data.id}}</span>
                    <span style="position: absolute;top: 3px;left: 10px;">
                        <el-button
                            type="default"
                            :style="'padding: 5px;border-radius: 15px;color:#ffffff;background:' + global.register.event.severity[data.severity][2]">
                            <!-- {{ global.register.event.severity[data.severity][1] }} <span style="font-variant: all-small-caps;">{{global.register.event.severity[data.severity][0]}}</span> -->
                        </el-button>
                    </span>
                </el-link>
            </li>
            <el-divider></el-divider>
            <li :key="index" v-for="(menu,index) in dt.contextmenu.list">
                <div v-if="menu.name && menu.type==='tag'" style="height:40px;line-height:40px;">
                    <TagView domain='event' :model.sync="data.tags" :id="data.id" :limit="4"></TagView>
                </div>
                <el-link @click.prevent="onContextmenuClick(data,menu)" :underline="false" v-else-if="menu.name">
                    {{ menu.name }}
                </el-link>
                <el-divider v-else></el-divider>
            </li>
        </vue-context>
    </el-container>
</template>

<script>

import _ from 'lodash';
import $ from 'jquery';
import VueContext from 'vue-context';
import 'vue-context/dist/css/vue-context.css';
import jsPanel from 'jspanel4/dist/jspanel.min.js';
import 'jspanel4/dist/jspanel.min.css';
import TagView from './tags/TagView';

const m3 = require("@cnwangzd/m3js");
window.moment = require("moment");

export default {
  name: "EventList",
    props: {
        model: Object,
        global: Object
    },
    components: {
        VueContext,
        TagView
    },
    data(){
        return {
            dt:{
                rows:[],
                columns: [],
                selected: [],
                contextmenu: {
                    
                    show: false,

                    list: [],

                    // when set to true, the context  menu will close when clicked on
                    closeOnClick: true,

                    // when set to true, the context  menu will close when the window is scrolled
                    closeOnScroll: true,

                    // When false, the context menu is shown via v-show and will always be present in the DOM
                    lazy: false,

                    // The `role` attribute on the menu. Recommended to stay as `menu`
                    role: 'menu',

                    // The root html tag of the menu. Recommended to stay as `ul`
                    tag: 'ul',

                    // This is how the component is able to find each menu item. Useful if you use non-recommended markup
                    itemSelector: ['.custom-item-class'],
                },
                summary: null
            },
            info: [],
            control:{
                ifSmart: false,
                ifSmartGroup: false,
                ifRefresh: false,
                mode: {
                    value: {name:'r',title:'运维模式',value:true},
                    list: [
                        {name:'m',title:'监控模式',value:false},
                        {name:'r',title:'运维模式',value:true},
                        {name:'f',title:'全屏模式',value:false}
                    ]
                }
            }
        }
    },
    watch: {
        'model.rows': {
            handler(){
                this.dt.rows = [];
                this.initData();
                this.dt.summary = _.groupBy(this.dt.rows,'severity');
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
        },
        'control.ifRefresh':{
            handler(val){
                this.onCountdownTimeRefresh(val);
            }
        },
        'control.ifSmartGroup':{
            handler(val){
                this.onToogleSmartGroup(val);
            }
        },
        'control.mode.value':{
            handler(val){
                this.onToogleRunMode(val);
            },
            deep: true
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
    created(){
        m3.callFS("/matrix/eventConsole/getContextMenu.js").then( (rtn)=>{
            this.dt.contextmenu.list = rtn.message;
        } );

        document.addEventListener('click',(event)=>{
            event.preventDefault();
            this.dt.contextmenu.show = false;
        })
    },
    mounted(){  
        this.initData();

        window.global = this.global;

        this.$refs.table.bodyWrapper.addEventListener('scroll', (res) => {

            let height = res.target;
            let clientHeight = height.clientHeight;
            let scrollTop = height.scrollTop;
            let scrollHeight = height.scrollHeight;

            if(clientHeight + scrollTop + 300 > scrollHeight){
                console.log(clientHeight + scrollTop);
                console.log(scrollHeight);
            }

        },true);

    },
    methods: {
        startTimer(duration, display) {
            var timer = duration, minutes, seconds;
            setInterval( ()=> {
                minutes = parseInt(timer / 60, 10)
                seconds = parseInt(timer % 60, 10);

                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;
                
                let format = minutes + ":" + seconds;
                
                if(format === '00:00'){
                    this.$emit("onSearch");
                }

                display.textContent = "刷新时间：" + format;
                
                if (--timer < 0) {
                    timer = duration;
                }
            }, 1000);
        },
        onRefresh(){
            
        },
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
        // 右键菜单
        onRowContextmenu(row,column,event){
            event.preventDefault();
            this.$refs.contextmenu.open(event,row);
            this.dt.contextmenu.show = true;
        },
        // 右键菜单事件
        onContextmenuClick(row,menu){
            console.log(row,menu)
            if(menu){
                if(menu.type === 'url'){
                    window.open(menu.url,menu.target?menu.target:'_blank');
                } else if(menu.type === 'component'){
                     this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.addTab(row,menu);
                } else {
                    this.openPanel(row);
                } 
            }
            this.dt.contextmenu.show = !this.dt.contextmenu.show;
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
            
        },
        openPanel(row){
            jsPanel.create({
                headerTitle: row.host || row.id,
                headerControls: 'xs',
                headerLogo: "<span class='el-icon-warning'></span>",
                theme: 'dark',
                border: 'thin',
                panelSize: {
                    width: () => window.innerWidth * 0.6,
                    height: () => window.innerHeight * 0.6,
                },
                content: `<div ref="${row.id}"></div>`,
                footerToolbar: [`<span style="font-size:12px;">${this.moment().format("LLL")}</span>`],
                callback: function(){
                    
                    $(".jsPanel-headerbar",this).css({
                        "min-height": "28px",
                        "border-bottom": "none",
                        "padding-left": "10px"
                    });
                    $(".jsPanel-content",this).css({
                        "border-top": "none"
                    });
                    
                    $(".jsPanel-titlebar",this).css({
                        "min-height": "28px"
                    });
                    
                    $(".jsPanel-titlebar h3",this).css({
                        "font-size": "12px"
                    });

                }
            });
        },
        /* 倒计时刷新 */
        onCountdownTimeRefresh(val){
            if(val){
                let display = document.querySelector('#countDownTimer');
                this.startTimer(60, display);
            } else {
                let display = document.querySelector('#countDownTimer');
                display.textContent('00:00');
            }
        },  
        /* 智能分组 */
        onToogleSmartGroup(val){
            if(val){
                this.$message({
                    type: "info",
                    message: "自动分组开启"
                })
            } else {
                this.$message({
                    type: "info",
                    message: "自动分组关闭"
                })
            }
        },
        /* 运行模式 */
        onToogleRunMode(val){
            
            // 设置当前运行模式
            this.control.mode.value = val;

            // 设置其它模式为关闭
            let xor = _.xorBy(this.control.mode.list,[val],'name');
            _.forEach(xor,(v)=>{
                v.value = false;
            })

            // 如果都是关闭，默认选择运维模式
            if(!this.control.mode.value.value){
                this.control.mode.value = this.control.mode.list[1];
                this.control.mode.value.value = true;
            }

            // 模式逻辑切换
            // 全屏模式
            if(this.control.mode.value.name === 'f'){
                m3.fullScreen(true);
            } 
            // 监控模式
            else if(this.control.mode.value.name === 'm'){
                m3.fullScreen(false);
            }
            // 运维模式
            else {
                m3.fullScreen(false);
            }
            
        }
    }
}
</script>
<style scoped>

.el-container{
    height:calc(100vh - 115px)!important;
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

.el-table--small td, .el-table--small th {
    padding: 4px 0;
}

.el-divider{
    margin: 0px;
}

.tool-box{
    display:flex;
    align-items:flex-start;
    padding:20px;
}
.tool-box .tool{
    text-align:center;
    padding:20px;
    margin:5px;
}

</style>