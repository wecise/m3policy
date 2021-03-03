<template>
    <el-container>
        <el-header style="background-color:#f2f2f2;border-bottom:1px solid #ddd;height:40px;line-height:40px;">
            <!-- 工具栏 -->
            <div>  
                <span v-if="tabs.list.length > 0">
                    <el-tooltip content="重打开" placement="top" >
                        <el-button type="text" icon="el-icon-refresh" @click="onReload"></el-button>
                    </el-tooltip>    
                    <el-divider direction="vertical"></el-divider>
                    <el-tooltip content="保存" placement="top" >
                        <el-button type="text" icon="far fa-save" @click="onSave"></el-button>
                    </el-tooltip>
                    <span  v-if="tabs.activeIndex.ftype=='js'">
                        <el-divider direction="vertical"></el-divider>
                        <el-tooltip content="执行" placement="top" >
                            <el-button type="text" icon="el-icon-caret-right" @click="onSaveAndPlay" :loading="tip.loading"></el-button>
                        </el-tooltip>
                        <el-divider direction="vertical"></el-divider>
                        <el-tooltip content="执行日志" placement="top" >
                            <el-button type="text" icon="el-icon-monitor" @click="onToggleRunningView('log')"></el-button>
                        </el-tooltip>
                        <el-tooltip content="执行结果" placement="top" >
                            <el-button type="text" icon="el-icon-tickets" @click="onToggleRunningView('result')"></el-button>
                        </el-tooltip>
                    </span>
                    <span v-if="tabs.activeIndex.ftype=='html' || tabs.activeIndex.ftype=='js' || tabs.activeIndex.ftype=='json'">
                        <el-divider direction="vertical"></el-divider>
                        <el-tooltip content="格式化" placement="top" >
                            <el-button type="text" icon="el-icon-finished" @click="onFormatContent"></el-button>
                        </el-tooltip>
                    </span>
                    <span v-if="tabs.activeIndex.ftype=='html'">
                        <el-divider direction="vertical"></el-divider>
                        <el-tooltip content="预览" placement="top" >
                            <el-button type="text" icon="el-icon-platform-eleme" @click="onToggleRunningView('preview')" ></el-button>
                        </el-tooltip>
                    </span>
                    <el-tooltip content="主题" placement="top" >
                        
                    </el-tooltip>
                    <span style="padding-left:20px;font-size:12px;" v-if="tip.loading">{{tip.message}}</span>
                </span>
                <span style="float:right;">
                    <el-tooltip content="全屏" placement="top" >
                        <el-button type="text" icon="el-icon-s-platform" @click="onToggleFullScreen" ></el-button>
                    </el-tooltip>
                </span>
            </div>
        </el-header>
        <el-main style="padding:0px;">
            <Split direction="horizontal">
                <SplitArea :size="25" :minSize="0" style="overflow:hidden;">
                    <el-container>
                        <el-main style="padding:0px;">
                            <FileTree @node-click="(data)=>{ onTabOpen(data); }"></FileTree>
                        </el-main>
                    </el-container>
                </SplitArea>
                <SplitArea :size="75" :minSize="0" style="overflow:hidden;">
                    <el-container>
                        <el-main style="padding:0px;overflow:hidden;">  
                            <el-tabs v-model="tabs.activeIndex" type="border-card" closable @tab-remove="onTabClose">
                                
                                    <el-tab-pane :name="item.data.id" :key="index" v-for="(item,index) in tabs.list">
                                        <span slot="label">{{item.data.name}}</span>
                                        <editor
                                            v-model="item.content"
                                            @init="onEditorInit"
                                            :lang="editor.lang.value"
                                            :theme="editor.theme.value"
                                            width="inherit"
                                            height="calc(100vh - 225px)"
                                            style="border:1px solid #f2f2f2;margin:-15px;"
                                            :ref="'editorRef-'+item.data.id"
                                        ></editor>
                                    </el-tab-pane>
                                
                            </el-tabs>
                        </el-main>
                    </el-container>
                </SplitArea>
            </Split>
        </el-main>
        <el-footer>
            时间：{{currentDateTime}}
            <el-divider direction="vertical"></el-divider>
            当前编辑：{{currentTab ? currentTab.data.name : ""}}  
            <el-divider direction="vertical"></el-divider>  
            打开：{{tabs.list.length}}
            <span style="float:right;" v-if="tabs.activeIndex">
                <el-button type="text" icon="el-icon-tickets" @click="onDegug(tabs.activeIndex)"></el-button>
            </span>
        </el-footer>
  </el-container>
</template>

<script>
import _ from 'lodash';
import FileTree from './FileTree';

export default {
    name: "FsView",
    props: {
        model: Object
    },
    components:{
        editor:require("vue2-ace-editor"),
        FileTree
    },
    computed:{
        currentDateTime: function(){ 
            return this.moment().format(window.global.register.format);
        },
        currentTab(){
            return _.find(this.tabs.list, (v)=>{ 
                return v.data.id === this.tabs.activeIndex; 
            }) || null;
        }
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
            }
        }
    },
    methods:{
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
                this.m3.dfsGet(data).then((rtn)=>{
                    this.tabs.list.push({data: data, content: rtn.message});
                })

            } catch(error){
                this.tabs.list = [];
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
                        activeIndex = nextTab.id;
                    }
                    }
                });
            }
            
            this.tabs.activeIndex = activeIndex;
            this.tabs.list = tabs.filter(tab => tab.data.id !== targetName);
             
            
        },
        onInitTreeData(){

        },
        onEditorInit(){
            require("brace/ext/language_tools"); //language extension prerequsite...
            require(`brace/mode/${this.editor.lang.value}`); //language
            require(`brace/snippets/${this.editor.lang.value}`); //snippet
            require(`brace/theme/${this.editor.theme.value}`); //language
        },
        onToggleRunningView(){

        },
        onToggleFullScreen(){
            this.m3.fullScreen(true);
        },
        onSave(){

        },
        onSaveAndPlay(){

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
