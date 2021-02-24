<template>
    <el-container>
        <el-main>
            <Split direction="vertical" :gutterSize="5">
                <SplitArea :size="debug.show?55:100" :minSize="0" style="overflow:hidden;">
                    <editor
                        v-model="model.value"
                        @init="onEditorInit"
                        :lang="editor.lang.value"
                        :theme="editor.theme.value"
                        width="100%"
                        height="100%"
                        style="border:1px solid #f2f2f2;"
                        ref="editorRef"
                    ></editor>
                </SplitArea>
                <SplitArea :size="debug.show?45:0" :minSize="0" style="overflow:hidden;">
                    <el-tabs v-model="debug.tabs.activeIndex" type="border-card" closable @tab-remove="logClose" @tab-click="handleClick">
                        <el-tab-pane name="log">
                            <span slot="label">日志 <i class="el-icon-date"></i></span>
                            <LogView :fullname="model.key" logType="rule"></LogView> 
                        </el-tab-pane>
                        <el-tab-pane label="测试" name="debug">
                            <TestView :fullname="model.key"></TestView>
                        </el-tab-pane>
                        <!-- <el-tab-pane label="数据" name="data">
                            
                        </el-tab-pane> -->
                    </el-tabs>
                </SplitArea>
            </Split>
        </el-main>
    </el-container>
      
</template>
<script>
import _ from 'lodash';
import LogView from '../consolelog/LogView';
import TestView from './TestView';

export default {
    name: "EditView",
    props: {
        model: Object
    },
    components:{
        editor:require("vue2-ace-editor"),
        LogView,
        TestView
    },
    data() {
        return {
            editor: {
                term: "",
                data: null,
                loading: false,
                lang: {
                    value: "lua",
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
            ignore: false,
            changed: false,
            etcd: {
                key: null,
                value: null,
                ttl: null,
                isDir: true
            },
            debug:{
                tabs: {
                    list: [],
                    activeIndex: 'log'
                },
                show: false
            },
            classModel: {}
        }
    },
    created(){
        
        if(_.startsWith(this.model.key,"/matrix/rules")){
            this.edit.lang.value = "lua";
        }
        
        try{
            let name = _.trim(_.split(_.first(this.model.value.match(/^--class.*/mgi)),"=",2)[1]);
            _.extend(this.classModel, {name:name});
        } catch(err){
            _.extend(this.classModel, {name:""});
        }
        
    },
    mounted(){
        // 选择节点
        if(_.has(this.model,'key')){
            this.initEditer();
        }

        /* let initCss = ()=>{
            let e1 = document.getElementsByClassName("el-tabs__content");
            _.forEach(e1,(v)=>{
                v.style.padding = "0px";
            })

            let e2 = document.getElementsByClassName("el-tabs--border-card");
            _.forEach(e2,(v)=>{
                v.style.border = "unset";
                v.style.boxShadow = "unset";
            })

            let e3 = document.getElementsByClassName("el-tabs__header");
            _.forEach(e3,(v)=>{
                v.style.backgroundColor = "#f2f2f2";
                v.style.borderTop = "1px solid #E4E7ED";
                v.style.borderBottom =  "unset";
            })

        };
        initCss(); */
        
    },
    methods: {
        initEditer(){

            let editor = this.$refs.editorRef.editor;
            let parent = this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent;

            editor.on("input", ()=> {
                                    
                if(this.changed) {
                    
                    if(!_.includes(parent.control.save.lis, this.model.key)){
                        parent.control.save.list.push(this.model.key);
                    }
                }

            });
            editor.on('change', ()=> {

                if (!this.ignore) {
                    this.changed = true;
                    this.$emit('editor:change',this.changed);
                }
            });

            editor.on('mousemove', ()=> {
                editor.resize();
            });
            
        },
        onEditorInit(){
            require("brace/ext/language_tools"); //language extension prerequsite...
            require("brace/mode/lua");
            require("brace/snippets/javascript"); //snippet
        },
    }
}
</script>

<style scoped>
    .el-container{
        margin: -35px;
    }
    .el-main{
        overflow: hidden;
    }
    .el-tabs--border-card {
        border: unset;
        box-shadow: unset;
    }
</style>