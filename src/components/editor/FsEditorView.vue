<template>
    <el-container>
        <el-main>
            <Split direction="vertical" style="overflow: hidden;">
                <SplitArea :size="debug.show?55:100" :minSize="0" style="overflow:hidden;">
                    <editor
                        v-model="editor.value"
                        @init="onEditorInit"
                        :lang="editor.lang.value"
                        :theme="editor.theme.value"
                        width="inherit"
                        height="calc(100vh - 225px)"
                        style="border:1px solid #f2f2f2;"
                        ref="editorRef"
                    ></editor>
                </SplitArea>
                <SplitArea :size="debug.show?45:0" :minSize="0" style="overflow:hidden;">
                    <el-tabs v-model="debug.tabs.activeIndex" type="border-card" closable>
                        <el-tab-pane name="log">
                            <span slot="label">日志 <i class="el-icon-date"></i></span>
                            <LogView :fullname="model.data.fullname" logType="serverjs"></LogView> 
                        </el-tab-pane>
                        <el-tab-pane label="结果" name="result">
                            
                        </el-tab-pane>
                    </el-tabs>
                </SplitArea>
            </Split>
        </el-main>
    </el-container>
</template>

<script>
import _ from 'lodash';
import LogView from '../consolelog/LogView';

export default {
    name: "FsEditorView",
    props: {
        model: Object
    },
    components:{
        editor:require("vue2-ace-editor"),
        LogView
    },
    data(){
        return {
            editor: {
                value: "",
                loading: false,
                lang: {
                    value: "javascript",
                    list: []
                },
                theme: {
                    value: "merbivore",
                    list: this.m3.EDITOR_THEME
                }
            },
            ignore: false,
            changed: false,
            debug:{
                tabs: {
                    list: [],
                    activeIndex: 'log'
                },
                show: false
            }
        }
    },
    created(){
        this.editor.value = this.model.content;
    },
    methods:{
        initEditor(){

            let editor = this.$refs.editorRef.editor;
            
            editor.on("input", ()=> {
                            
                if(this.changed) {
                    
                    /* if(!_.includes(parent.control.save.lis, this.model.key)){
                        parent.control.save.list.push(this.model.key);
                    } */
                }

            });
           
            editor.on('change', _.debounce(()=> {
                if (!this.ignore) {
                    this.changed = true;
                    this.$emit('editor:change',this.changed);
                }
                this.$emit('editor:value', this.editor.value)
            }),500);

            editor.on('mousemove', ()=> {
                editor.resize();
            });
            
        },
        onEditorInit(){
            require("brace/ext/language_tools"); //language extension prerequsite...
            require(`brace/mode/${this.editor.lang.value}`); //language
            require(`brace/snippets/${this.editor.lang.value}`); //snippet
            require(`brace/theme/${this.editor.theme.value}`); //language
            this.initEditor();
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .el-container{
        margin: -34px;
    }
    .el-main{
        overflow: hidden;
    }
    .el-tabs--border-card {
        border: unset;
        box-shadow: unset;
    }

</style>
