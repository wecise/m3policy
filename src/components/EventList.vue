<template>
    <el-container :style="dtContainerHeight">
        <el-header v-if="dtOptions.header">
            
            <el-tooltip :content="$t('event.actions.refresh')"  placement="top">
                <el-button type="text" @click="onRefresh">
                    <span class="el-icon-refresh" style="cursor:pointer;font-size:16px;"></span>
                </el-button>
            </el-tooltip>
            
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
                        <template v-for="item in control.mode.list">
                            <div  class="tool" :key="item.name" v-if="item.status" >
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
                        </template>

                        <!-- 声音告警 -->
                        <div class="tool">
                            <div>{{control.ifVoiceNotify?'声音告警':'声音告警'}}</div>
                            <p>
                                <el-switch
                                    v-model="control.ifVoiceNotify"
                                    active-color="#13ce66"
                                    inactive-color="#dddddd"
                                    :active-value="true"
                                    :inactive-value="false">
                                </el-switch>
                            </p>
                        </div>

                        <ToolsView @tool-click="((data)=>{onToolsKeep(data)})"></ToolsView>

                        
                        <div class="tool" :loading="dt.downloadLoading">
                            <div>选择导出</div>
                            <p>
                                <el-dropdown style="cursor:pointer;font-size:16px;" @command="onExport">
                                    <span class="el-icon-download"></span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item command="csv">CSV</el-dropdown-item>
                                        <el-dropdown-item command="txt">TXT</el-dropdown-item>
                                        <el-dropdown-item command="xlsx">Excel</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </p>
                        </div>
                    </div>
                </el-dropdown-menu>
            </el-dropdown>
        </el-header>   
        
        <el-main @mouseup.native="onMainClick" :style="dtMainStyle">
            <el-dialog
                :title="'上传附件'"
                :visible.sync="dialog.attachment.show"
                :append-to-body="true"
                :modal-append-to-body="false"
                custom-class="attachment-dialog">
                <el-container style="border:unset!important;background:#f2f2f2;">
                    <el-header v-if="dialog.attachment.data">
                        实体: {{dialog.attachment.data.entity}} 事件: {{dialog.attachment.data.id}}
                    </el-header>
                    <el-main>
                        <el-upload
                            name="uploadfile"
                            :action="dialog.attachment.upload.action"
                            :data="dialog.attachment.upload.ifIndex"
                            :on-success="onAttchSuccess"
                            :on-error="onAttchError"
                            :append-to-body="true"
                            :show-file-list="false"
                            style="width:100%;"
                            multiple
                            drag>
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                            <div class="el-upload__tip" slot="tip">单个不超过500MB</div>
                        </el-upload>
                    </el-main>
                </el-container>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialog.attachment.show = false">取 消</el-button>
                    <el-button type="primary" @click="dialog.attachment.show = false">确 定</el-button>
                </span>
            </el-dialog>
            <el-table
                :data="dt.rows"
                :highlight-current-row="true"
                :row-class-name="rowClassName"                
                @row-contextmenu="onRowContextmenu"
                @row-dblclick="onRowContextmenu"
                @current-change="onCurrentChange"
                 @selection-change="(data)=>{ dt.selected = data; }"
                @cell-click="onCellClick"
                ref="table"
                class="event-list"
                style="width:100%;">
                <el-table-column type="selection" align="center"></el-table-column> 
                <template v-for="(item,index) in dt.columns">
                    <el-table-column 
                        :prop="item.field"
                        :label="item.title" 
                        sortable 
                        show-overflow-tooltip
                        :key="index"
                        :width="item.width"
                        :formatter="item.render"
                        v-if="item.visible">
                        <template slot-scope="scope">
                            <div style="height:30px;line-height:30px;" v-if="item.field=='tags'">
                                <TagView domain='event' :model.sync="scope.row.tags" :id="scope.row.id" :limit="1"></TagView>
                            </div>
                            <div v-html='item.render(scope.row, scope.column, scope.row[item.field], scope.$index)' 
                                v-else-if="typeof item.render === 'function'">
                            </div>
                            <div v-else>
                                {{scope.row[item.field]}}
                            </div>
                        </template>
                    </el-table-column>
                </template>
            </el-table>
        </el-main>
        <el-footer>
            <div class="toolbar">
                <el-button-group v-if="global && dt.summary">
                    <el-button
                        type="default"
                        v-for="(btn,key) in global.register.event.severity"
                        :key="key"
                        :style="btn[2] | severityBtnStyle(dt.summary[key],dtOptions)"
                        @click="onToggleSeverity(btn,key)"
                        :class="checkSeverity(key)">
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

                <el-link :underline="false"> 
                    <span v-if="data"> {{data.id}}</span>
                    <span style="position: absolute;top: 4px;left: 10px;">
                        <el-button
                            type="default"
                            :style="'padding: 3px;border-radius: 15px;color:#ffffff;background:'+ global.register.event.severity[data.severity][2]"
                            v-if="global && data">
                        </el-button>
                    </span>
                </el-link>
            </li>

            <template v-for="(menu,index) in dt.contextmenu.list">

                <li :key="index" v-if="data">

                    <el-link @click.prevent="onContextmenuClick(data,menu)" :underline="false" v-if="menu.type==='component'"> 
                        {{ menu.name }}
                    </el-link>
                    
                    <el-link @click.prevent="onContextmenuClick(data,menu)" :underline="false" v-else-if="menu.type==='action'" :disabled="data.status==menu.value">
                        {{ menu.name }}
                    </el-link>
                    
                    <el-link @click.prevent="onContextmenuClick(data,menu)" :underline="false" v-else-if="menu.type==='attachment'" :disabled="!data.entity">
                        {{ menu.name }}
                    </el-link>

                    <el-link @click.prevent="onContextmenuClick(data,menu)" :underline="false" v-else-if="menu.type==='url'">
                        {{ menu.name }}
                    </el-link>

                    <div style="height:40px;line-height:40px;" v-else-if="menu.type==='tag'" >
                        <TagView domain='event' :model.sync="data.tags" :id="data.id" :limit="4"></TagView>
                    </div>

                    <el-divider v-else-if="menu.type==='divider'"></el-divider>

                </li>
            </template>
        </vue-context>
    </el-container>
</template>

<script>

import _ from 'lodash';
import $ from 'jquery';
import {Howl} from 'howler';
import Cookies from 'js-cookie';
import VueContext from 'vue-context';
import 'vue-context/dist/css/vue-context.css';
// import jsPanel from 'jspanel4/dist/jspanel.min.js';
// import 'jspanel4/dist/jspanel.min.css';
import TagView from './tags/TagView';
import ToolsView from './tools/ToolsView';

window.moment = require("moment");

export default {
  name: "EventList",
    props: {
        model: Object,
        global: Object,
        options: Object
    },
    components: {
        VueContext,
        TagView,
        ToolsView
    },
    data(){
   
        return {
            
            dt:{
                options: {
                    header:true,
                    severityBar: true
                },
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
                summary: null,
                orderBy: [['severity','vtime'],['desc','desc']],
                selectedSeverity:[],
                origin: -1, // 这里给一个变量作为起点
                pin: false, 
                downloadLoading: false
            },
            info: [],
            control:{
                ifSmart: false,
                ifRefresh: false,
                ifVoiceNotify: false,
                mode: {
                    value: {name:'r',title:'运维模式',value:true},
                    list: [
                        {name:'m',title:'监控模式',value:false, status: false},
                        {name:'r',title:'运维模式',value:true, status: true},
                        {name:'f',title:'全屏模式',value:false, status: true}
                    ]
                }
            },
            dialog:{
                attachment:{
                    show: false,
                    data: null,
                    upload: {
                        action: "",
                        Authorization:Cookies.get("matrixSession"),
                        baseUrl: "/script/matrix/m3event/attachment",
                        ifIndex: {
                            index:true
                        }
                    }
                }
            },
            notify: {
                sound: null
            }
        }
    },
    watch: {
        'model.rows': {
            handler(){
                this.dt.rows = [];
                this.initData();
                this.dt.summary = _.groupBy(this.dt.rows,'severity');
                _.delay(()=>{
                    this.$refs.table.doLayout();
                },1000)
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
        'control.ifVoiceNotify':{
            handler(val){
                this.onVoiceNotify(val);
            }
        },
        'control.mode.value':{
            handler(val){
                this.onToogleRunMode(val);
            },
            deep: true
        },
        'dt.selectedSeverity':{
            handler(val){
                this.$emit("severity:change",val);
            }
        }
    },
    computed:{
        metaColumns(){
            try{
                return this.model.columns[this.model.rootClass];
            } catch(err){
                return [];
            }
        },
        dtOptions(){
            return _.extend(this.dt.options,this.options);
        },
        dtContainerHeight(){
            return `height:calc(100vh - ${this.dtOptions.dtContainerHeight})!important;`
        },
        dtMainStyle(){
            if(this.dtOptions.header){
                return `border-top: 1px solid #dddddd;
                        padding: 0px;
                        overflow: hidden;`
            } else {
                return `padding: 0px;
                        overflow: hidden;`
            }
        }
    },
    filters: {
        severityBtnStyle(color, dt, options){
            
            let hexToRGB = (hex, alpha)=>{
                var r = parseInt(hex.slice(1, 3), 16),
                    g = parseInt(hex.slice(3, 5), 16),
                    b = parseInt(hex.slice(5, 7), 16);

                if (alpha) {
                    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
                } else {
                    return "rgb(" + r + ", " + g + ", " + b + ")";
                }
            };
            let rtn = "";
            if(_.isEmpty(dt)){
                rtn = `color:#ffffff;background:${ hexToRGB(color,0.3) };${!options.severityBar?'display:none;':''}`;
            } else {
                
                if(dt.length > 0){
                    rtn = `color:#ffffff;background:${ color };`;
                } else {
                    rtn = `color:#ffffff;background:${ hexToRGB(color,0.3) };${!options.severityBar?'display:none;':''}`;
                }

            }
            
            return rtn;
        }
    },
    created(){
        
        this.initContextMenu();

        document.onkeydown = ()=> {
            let key = window.event.keyCode;
            if (key === 16) {
                this.dt.pin = true;
            }
        };
        document.onkeyup = ()=> {
            this.dt.pin = false;
        };
    },
    mounted(){  
        
        window.global = this.global;

        /* this.$refs.table.bodyWrapper.addEventListener('scroll', (res) => {

            let height = res.target;
            let clientHeight = height.clientHeight;
            let scrollTop = height.scrollTop;
            let scrollHeight = height.scrollHeight;

            if(clientHeight + scrollTop + 300 > scrollHeight){
                console.log(clientHeight + scrollTop);
                console.log(scrollHeight);
            }

        },true); */

    },
    methods: {
        checkSeverity(key){
            return _.includes(this.dt.selectedSeverity,key)?'severity-active':'';
        },
        onToggleSeverity(btn,key){
            this.dt.selectedSeverity = _.xor(this.dt.selectedSeverity,[key]);
        },
        initContextMenu(){
            this.m3.callFS("/matrix/m3event/contextmenu/getContextMenu.js").then( (rtn)=>{
                this.dt.contextmenu.list = rtn.message;
            } );
            document.addEventListener('click',()=>{
                this.dt.contextmenu.show = false;
            })
        },
        startTimer(duration, display) {
            var timer = duration, minutes, seconds;
            window.countdownInterval = setInterval( ()=> {
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
        /* 
            重新加载数据 
            重置样式
        */
        onRefresh(){
            this.onCellClick();
            this.$refs.table.clearSort();
            this.$emit("onSearch");
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
            
            try{
                _.extend(this.dt, {columns: _.map(this.model.columns, (v)=>{
                    
                    if(_.isUndefined(v.visible)){
                        _.extend(v, { visible: true });
                    }
                    
                    if(_.isUndefined(v.render)){
                        return v;
                    } else {
                        return _.extend(v, { render: eval(v.render) });
                    }
                    
                })});
                
                _.extend(this.dt, { rows: [] });
                /* 
                *   1、默认排序
                *   2、配合多选
                */
                let rows = _.map(_.orderBy(this.model.rows,this.dt.orderBy[0], this.dt.orderBy[1]),(v,index)=>{  v.index = index; return v; });
                _.extend(this.dt, { rows: rows });

            } catch(err){
                console.log(err)
            }
            
        },
        rowClassName({rowIndex}){
            return `row-${rowIndex}`;
        },
        // 监听鼠标操作 停止自动刷新
        onMainClick(){
            this.control.ifRefresh = false;
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
            
            if(menu){
                // URL
                if(menu.type === 'url'){
                    window.open(`${menu[menu.type].value}${menu[menu.type].param?'&'+encodeURIComponent( menu[menu.type].param ):''}`,menu[menu.type].target?menu[menu.type].target:'_blank');
                } 
                // Action
                else if(menu.type === 'action'){
                     if (menu[menu.type]) {
                        
                        let ids = [row.id];
                        let rows = [row];

                        // 多选
                        if(!_.isEmpty(this.dt.selected)){
                            ids = _.values(_.map(this.dt.selected,'id'));
                            rows = this.dt.selected;
                        }

                        let term =  JSON.stringify({id: ids, value: menu[menu.type].value}) ;
                        
                        let fn = new Function('term',menu.action.name);
                        fn(term);

                        _.forEach(rows,(v)=>{
                            v.status = menu[menu.type].value;
                        })
                        
                     }
                } 
                // Component
                else if(menu.type === 'component'){
                    this.$emit(menu[menu.type].name,{row:row,menu:menu});
                } 
                // Attachment
                else if(menu.type === 'attachment'){
                     this.onAttach(row);
                } 
                // Other
                else {
                    this.openPanel();
                } 
            }
            this.dt.contextmenu.show = !this.dt.contextmenu.show;
        },
        /* 打开附近上传 */
        onAttach(data){
            this.dialog.attachment.show = true;
            this.dialog.attachment.data = data;
            this.dialog.attachment.upload.action = [[
                '','fs'+this.dialog.attachment.upload.baseUrl,this.dialog.attachment.data.entity].join("/"),
                this.dialog.attachment.data.id].join("/")+'?issys=true';
            this.onAttchNewDir();
        },
        onAttchNewDir(){
            try{
                let param = {
                                parent: [this.dialog.attachment.upload.baseUrl,this.dialog.attachment.data.entity].join("/"), 
                                name: this.dialog.attachment.data.id,
                                data:{content:null,ftype:'dir',attr:""}
                };
                this.m3.dfsNew(param);
            }catch(err){
                console.error(err);
            }
        },
        onAttchSuccess(){
            
            this.$message({
                type: "success",
                dangerouslyUseHTMLString: true,
                message: `上传成功！`
            })

            this.dialog.attachment.show = false;

        },
        onAttchError(){
            this.$message({
                type: "error",
                dangerouslyUseHTMLString: true,
                message: `上传失败，请确认！`
            })

            this.dialog.attachment.show = false;
        },
        /* shift 多选 */
        onCurrentChange(row,oldRow){
            try{
                if(!oldRow) return false;

                const data = this.dt.rows;
                let origin = oldRow.index;
                let endIdx = row.index;
                if (this.dt.pin) { // 判断按住
                    const sum = Math.abs(origin - endIdx) + 1;// 终点
                    const min = Math.min(origin, endIdx);// 起点
                    let i = 0;
                    while (i < sum) {
                        const index = min + i;
                        
                        this.$refs.table.toggleRowSelection(data[index], true);
                        this.dt.selected.push(data[index]);
                        $(`.el-table .row-${index}`).addClass("current-row");
                        i++;

                    }
                    setTimeout(()=>{
                        $(`.el-table .row-${min}`).addClass("current-row");
                    },50)
                } else {
                    // this.dt.origin = row.index; // 没按住记录起点
                    this.dt.selected = [];
                }
            } catch(err){
                console.log(err);
            }
        },
        /* shift多选后，单点恢复样式 */
        onCellClick(){
            if (!this.dt.pin) {
                this.$refs.table.clearSelection();
                this.dt.selected = [];
                $(`.el-table .current-row`).removeClass("current-row");
            }
        },
        onToggle(){
            this.$root.toggleModel(_.without(['view-normal','view-tags'],window.EVENT_VIEW).join(""));
        },
        onExport(type){
            this.dt.downloadLoading = true;
            let formatJson = (filterVal, jsonData)=>{
                return jsonData.map(v => filterVal.map(j => {
                    if (_.includes(['day','ctime','vtime'],j)) {
                        return new Date(v[j]).toLocaleString();
                    } else if (typeof v[j] == 'object') {
                        return JSON.stringify(v[j],null,2);
                    } else {
                        return v[j];
                    }
                }));
            };
            import('@/vendor/Export2Excel').then(excel => {
                const tHeader = _.keys(_.head(this.dt.rows));
                const data = formatJson(tHeader, this.dt.rows);
                excel.export_json_to_excel({
                    header: tHeader,
                    data,
                    filename: `Export_${this.moment().format("YYYY-MM-DD HH:mm:ss")}`,
                    autoWidth: true,
                    bookType: type
                })
                this.dt.downloadLoading = false;
            })
            
        },
        openPanel(){
            
        },
        /* 倒计时刷新 */
        onCountdownTimeRefresh(val){
            if(val){
                let display = document.querySelector('#countDownTimer');
                this.startTimer(60, display);
            } else {
                
                if (window.countdownInterval != null) {
                    clearInterval(window.countdownInterval);
                    window.countdownInterval = null;
                }
                let display = document.querySelector('#countDownTimer');
                display.textContent = "";
            }
        },  
        onToolsKeep(menu){
            let row = {id: menu.id};
            this.$emit("addTab",{row:row, data:menu});
        },
        /* 声音告警 */
        onVoiceNotify(val){
            if(val){
                if(this.model.notify > 0){
                    this.onNotifyPlay();
                } else {
                    this.onNotifyStop();
                }
            }else{
                this.onNotifyStop();
            }
        },
        /* 声音播放 */
        onNotifyPlay(){
      
            if(this.notify.sound){
                this.notify.sound.stop();
            }

            let src = `/static/assets/audio/notification.mp3`;
            this.notify.sound = new Howl({
                src: [src],
                volume: 1,
                loop: true
            });
            this.notify.sound.play();
        },
        /* 声音停止 */
        onNotifyStop(){
            this.notify.sound.stop();
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
                this.m3.fullScreen(true);
            } 
            // 监控模式
            else if(this.control.mode.value.name === 'm'){
                this.m3.fullScreen(true);
            }
            // 运维模式
            else {
                this.m3.fullScreen(false);
            }
            
        }
    }
}
</script>

<style scoped>

    .el-container{
        border: 1px solid #dddddd!important;
    }

    .el-header{
        height:30px!important;
        line-height:30px;
        background:#f2f2f2;
        padding:0 10px;
        border-bottom: 1px solid #ffffff;
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

    .el-divider{
        margin: 0px;
    }

    .tool-box{
        display:flex;
        flex-wrap: wrap;
        align-items:flex-start;
        padding:20px;
        width: 585px;
    }
    .tool-box .tool{
        text-align:center;
        padding:20px;
        margin:5px;
        border:1px solid #efefef;
        height: 60px;
        width: 65px;
        border-radius: 5px;
    }
    .tool-box .tool:hover{
        cursor: pointer;
        background: rgba(125, 202, 253,.2);
    }

    /* 多选选中文字状态 */
    .cell-user-select{
        -webkit-user-select:none;/*谷歌 /Chrome*/
        -moz-user-select:none; /*火狐/Firefox*/
        -ms-user-select:none;    /*IE 10+*/
        user-select:none;
    }

</style>

<style>
    .attachment-dialog.el-dialog{
        width: 50%!important;
        height: auto!important;
    }

    .el-upload,
    .el-upload-dragger{
        width: 100%!important;
    }

    /* el-table hover actived style */
    .el-table--enable-row-hover .el-table__body tr:hover>td {
            background-color: #86b4e6!important;
    }
    .el-table__body tr.current-row>td {
            background-color:#3c99f7!important;;
    }

    /* Event Console Table */
    .el-table {
        height:100%!important;
        overflow: hidden!important;
    }
    .el-table--small td, 
    .el-table--small th {
        padding: 4px 0;
    }
    .el-table .cell {
        white-space: nowrap!important;
        line-height: 18px!important;
    }
    .event-list.el-table .el-table__body-wrapper {
        overflow: auto;
        position: relative;
        height: calc(100% - 50px)!important;
    }
    .el-table{
        -webkit-user-select:none;/*谷歌 /Chrome*/
        -moz-user-select:none; /*火狐/Firefox*/
        -ms-user-select:none;    /*IE 10+*/
        user-select:none;
    }

    .severity-active{
        /* filter: drop-shadow(black 2px 4px 6px); */
        border-top: 2px solid #333333!important;
    }
</style>