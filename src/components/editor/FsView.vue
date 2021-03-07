<template>
    <el-container>
        <el-header style="background-color:#f2f2f2;border-bottom:1px solid #ddd;height:40px;line-height:40px;">
            <!-- 工具栏 -->
            <div>  
                
                <span v-if="currentTab">
                    <el-tooltip content="重打开" >
                        <el-button type="text" icon="el-icon-refresh" @click="onReload"></el-button>
                    </el-tooltip>    
                    <el-divider direction="vertical"></el-divider>
                    <el-tooltip content="保存" >
                        <el-button type="text" icon="el-icon-position" @click="onSave"></el-button>
                    </el-tooltip>
                    <span  v-if="currentTab.data.ftype=='js'">
                        <el-divider direction="vertical"></el-divider>
                        <el-tooltip content="执行" >
                            <el-button type="text" icon="el-icon-caret-right" @click="onSaveAndPlay" :loading="tip.loading"></el-button>
                        </el-tooltip>
                        <el-divider direction="vertical"></el-divider>
                        <el-tooltip content="执行日志" >
                            <el-button type="text" icon="el-icon-monitor" @click="onToggleRunningView('log')"></el-button>
                        </el-tooltip>
                        <el-tooltip content="执行结果" >
                            <el-button type="text" icon="el-icon-tickets" @click="onToggleRunningView('result')"></el-button>
                        </el-tooltip>
                    </span>
                    <span v-if="currentTab.data.ftype=='html' || currentTab.data.ftype=='js' || currentTab.data.ftype=='json'">
                        <el-divider direction="vertical"></el-divider>
                        <el-tooltip content="格式化" >
                            <el-button type="text" icon="el-icon-finished" @click="onFormatContent"></el-button>
                        </el-tooltip>
                    </span>
                    <span v-if="currentTab.data.ftype=='html'">
                        <el-divider direction="vertical"></el-divider>
                        <el-tooltip content="预览" >
                            <el-button type="text" icon="el-icon-platform-eleme" @click="onToggleRunningView('preview')" ></el-button>
                        </el-tooltip>
                    </span>
                    <el-tooltip content="主题" >
                        
                    </el-tooltip>
                    <span style="padding-left:20px;font-size:12px;" v-if="tip.loading">{{tip.message}}</span>
                </span>
                <span style="float:right;">
                    <el-tooltip content="全屏" >
                        <el-button type="text" icon="el-icon-s-platform" @click="onToggleFullScreen" ></el-button>
                    </el-tooltip>
                </span>
            </div>
        </el-header>
        <el-main style="padding:0px;">
            <Split direction="horizontal">
                <SplitArea :size="25" :minSize="0" style="overflow:hidden;padding:20px;">
                    <FileTree @node-click="(data)=>{ onTabOpen(data); }"></FileTree>
                </SplitArea>
                <SplitArea :size="75" :minSize="0" style="overflow:hidden;background:#ffffff;">
                    
                    <Split direction="vertical" v-if="currentTab">
                        <SplitArea :size="100" :minSize="0" style="overflow:hidden;">
                            <el-tabs v-model="tabs.activeIndex" type="border-card" 
                                closable 
                                @tab-remove="onTabClose">
                                
                                    <el-tab-pane :name="item.data.id" :key="index" v-for="(item,index) in tabs.list">
                                        <span slot="label">{{item.data.name}}</span>
                                        <editor
                                            v-model="item.content"
                                            @init="onEditorInit(index)"
                                            :lang="editor.lang.value"
                                            :theme="editor.theme.value"
                                            width="inherit"
                                            height="calc(100vh - 225px)"
                                            style="border:1px solid #f2f2f2;margin:-15px;"
                                            ref="editor"
                                        ></editor>
                                    </el-tab-pane>
                                
                            </el-tabs>
                        </SplitArea>
                        <SplitArea :size="0" :minSize="0" style="overflow:hidden;">
                            <el-tabs v-model="debug.tabs.activeIndex" type="border-card" closable>
                                <el-tab-pane name="log">
                                    <span slot="label">日志 <i class="el-icon-date"></i></span>
                                    <LogView :fullname="currentTab.data.fullname" logType="serverjs"></LogView> 
                                </el-tab-pane>
                                <el-tab-pane label="结果" name="result">
                                    
                                </el-tab-pane>
                            </el-tabs>
                        </SplitArea>
                    </Split>
                    <div v-else>
                        <Welcome></Welcome>
                    </div>
                    
                </SplitArea>
            </Split>
        </el-main>
        <el-footer>
            时间：{{currentDateTime}}
            <el-divider direction="vertical"></el-divider>
            当前编辑：{{currentTab ? currentTab.data.name : ""}}  
            <el-divider direction="vertical"></el-divider>  
            打开：{{tabs.list.length}}
            <span style="float:right;" v-if="currentTab">
                <el-button type="text" icon="el-icon-tickets" @click="onDegug(currentTab)"></el-button>
            </span>
        </el-footer>
  </el-container>
</template>

<script>
import _ from 'lodash';
import FileTree from './FileTree';
import Welcome from './Welcome';
import LogView from '../consolelog/LogView';

export default {
    name: "FsView",
    props: {
        model: Object
    },
    components:{
        editor:require("vue2-ace-editor"),
        FileTree,
        Welcome,
        LogView
    },
    data(){
        return {
            tabs: {
                list: [],
                activeIndex: null
            },
            editor: {
                loading: false,
                lang: {
                    value: "javascript",
                    list: []
                },
                theme: {
                    value: "merbivore",
                    list: [
                        {
                        name: "亮色",
                        items: [
                            { name: "chrome" },
                            { name: "clouds" },
                            { name: "crimson_editor" },
                            { name: "dawn" },
                            { name: "dreamweaver" },
                            { name: "eclipse" },
                            { name: "github" },
                            { name: "iplastic" },
                            { name: "solarized_light" },
                            { name: "textmate" },
                            { name: "tomorrow" },
                            { name: "xcode" },
                            { name: "kuroir" },
                            { name: "katzenmilch" },
                            { name: "sqlserver" },
                        ],
                        },
                        {
                        name: "暗色",
                        items: [
                            { name: "ambiance" },
                            { name: "chaos" },
                            { name: "clouds_midnight" },
                            { name: "dracula" },
                            { name: "cobalt" },
                            { name: "gruvbox" },
                            { name: "gob" },
                            { name: "idle_fingers" },
                            { name: "kr_theme" },
                            { name: "merbivore" },
                            { name: "merbivore_soft" },
                            { name: "mono_industrial" },
                            { name: "monokai" },
                            { name: "pastel_on_dark" },
                            { name: "solarized_dark" },
                            { name: "terminal" },
                            { name: "tomorrow_night" },
                            { name: "tomorrow_night_blue" },
                            { name: "tomorrow_night_bright" },
                            { name: "tomorrow_night_eighties" },
                            { name: "twilight" },
                            { name: "vibrant_ink" },
                        ],
                        },
                    ]
                }
            },
            tree: {
                data: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                }
            },
            control: {

            },
            tip: {
                loading: false,
                message: ""
            },
            debug:{
                tabs: {
                    list: [],
                    activeIndex: 'log'
                },
                show: false
            }
        }
    },
    computed:{
        currentDateTime: function(){ 
            return this.moment().format(window.global.register.format);
        },
        currentTab(){

            if ( _.isEmpty(this.tabs.list) ){
                return null;
            } else {
                let tab = _.find(this.tabs.list, (v)=>{ 
                            return v.data.id === this.tabs.activeIndex; 
                        });
                return  tab;
            }
        }
    },
    created(){
        //console.log(1111,this.model)
    },
    methods:{
        initEditor(index){

            let editor = this.$refs['editor'][index].editor;
            console.log(111,index,this.$refs['editor'],editor)
            /* editor.on("input", ()=> {
                                    
                if(this.changed) {
                    
                    if(!_.includes(parent.control.save.lis, this.model.key)){
                        parent.control.save.list.push(this.model.key);
                    }
                }

            });
            */
            editor.on('change', ()=> {
                /* if (!this.ignore) {
                    this.changed = true;
                    this.$emit('editor:change',this.changed);
                    this.$emit('editor:value', this.editor.value)
                } */
            });

            editor.on('mousemove', ()=> {
                editor.resize();
            });
            
        },
        onReload(){

        },
        onTabOpen(data){
            
            try {
                let id = data.id;
                // 已经打开
                let find = _.find(this.tabs.list,(v)=>{
                    return v.data.id == id;
                });
                if(find){
                    this.tabs.activeIndex = id;
                    return false;
                }
                
                // 添加tab
                this.tabs.activeIndex = id;
                this.m3.dfsRead(data).then((rtn)=>{
                    this.tabs.list.push({data: data, content: rtn.message});
                })

            } catch(err){
                console.error(err);
            }
        },
        onTabClose(targetName){
            
            let tabs = this.tabs.list;
            let activeIndex = this.tabs.activeIndex;
            if (activeIndex === targetName) {
                tabs.forEach((tab, index) => {
                    if (tab.data.id === targetName) {
                        let nextTab = tabs[index + 1] || tabs[index - 1];
                        if (nextTab) {
                            activeIndex = nextTab.data.id;
                        }
                    }
                });
            }
            
            this.tabs.activeIndex = activeIndex;
            this.tabs.list = tabs.filter(tab => tab.data.id !== targetName);
             
            
        },
        onInitTreeData(){

        },
        onEditorInit(index){
            require("brace/ext/language_tools"); //language extension prerequsite...
            require(`brace/mode/${this.editor.lang.value}`); //language
            require(`brace/snippets/${this.editor.lang.value}`); //snippet
            require(`brace/theme/${this.editor.theme.value}`); //language
            this.initEditor(index);
        },
        onToggleRunningView(){

        },
        onToggleFullScreen(){
            this.m3.fullScreen(true);
        },
        onSave(){
            this.tip.loading = true;
            this.tip.message = "保存中...";
            
            let fs = _.find(this.tabs.list, (v)=>{
                return v.data.id == this.tabs.activeIndex;
            });
            
            if(_.isEmpty(fs.content)){
                this.tip.loading = false;
                this.tip.message = "";
                return false;
            }

            let param = {
                parent: fs.data.parent, name: fs.data.name, 
                data: { data: fs.content, type: fs.data.ftype, attr: fs.data.attr, index: true }    
            };

            // save
            this.m3.dfsWrite(param).then( ()=>{

                this.$refs.editor.session.getUndoManager().markClean();

                this.tip.loading = false;
                this.tip.message = "";
            } ).catch((err)=>{
                this.$message("请确认脚本 " + err);
                this.tip.loading = false;
                this.tip.message = "";
                return false;
            });
        },
        onSaveAndPlay(){

        },
        onFormatContent(){
            let fs = this.currentTab;
            
            let content = fs.content;
            let ftype = fs.data.ftype;
            let formatted = "";
            
            if(ftype=='html'){
                formatted = this.m3.htmlFormat(content, 4, ' ', 200);
            } else if(ftype=='js'){
                formatted = this.m3.jsFormat(content, 4, ' ', 0);
            } else if(ftype=='json'){
                formatted = JSON.stringify(JSON.parse(content),null,2);
            } else { 
                return false;
            }

            fs.content = formatted;
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .el-container{
        height: calc(100vh - 115px);
        background: #f2f2f2;
    }

    .el-main{
        overflow: hidden;
    }

    .el-footer{
      height:30px!important;
      line-height: 30px;
      border-top:1px solid #ffffff;
      color:#888888;
  }

  .el-tabs--border-card {
        border: unset;
        box-shadow: unset;
    }

    .el-tabs--border-card>.el-tabs__header{
        border-top:unset;
    }

</style>
