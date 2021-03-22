<template>
  
    <el-container style="height:calc(100vh - 115px);background:#f2f2f2;">
        <el-main style="padding:0px;">
            <Split direction="horizontal">
                <SplitArea :size="25" :minSize="0" style="overflow:hidden;">
                    <el-container>
                        <el-header>
                            <span>右键工具</span>
                            <span style="float:right;">
                                <el-button type="text" @click="load" icon="el-icon-refresh"></el-button>
                                <el-button type="text" @click="add(null,$event)" icon="el-icon-plus"></el-button>
                            </span>
                        </el-header>
                        <el-main>
                            <el-tree node-key="name" 
                                highlight-current 
                                :data="tree.list" 
                                :props="tree.defaultProps"
                                @node-click="onTreeNodeClick"
                                ref="tree" v-if="tree.list"
                                style="background:#f2f2f2;">
                                <span slot-scope="{ node, data }" 
                                    style="width:100%;height:30px;line-height: 30px;"  
                                    @mouseenter="onMouseEnter(data)" 
                                    @mouseleave="onMouseLeave(data)">
                                    <div>
                                        <span class="el-icon-price-tag" style="color: #f8a502;font-size: 14px;"></span> 
                                        <span v-if="!data.name">
                                            <span> 根目录</span>
                                            <span style="float:right;padding-right:5px;">
                                                <el-button v-show="data.show" type="text" @click.stop="load" icon="el-icon-refresh"></el-button>
                                                <el-button v-show="data.show" type="text" @click="add(data,$event)" icon="el-icon-plus"></el-button>
                                            </span>
                                        </span>
                                        <span v-else>
                                            <span> {{node.label}}</span>
                                            <span style="float:right;padding-right:5px;">
                                                <el-button v-show="data.show" type="text" @click="add(data,$event)" icon="el-icon-plus"></el-button>
                                                <el-button v-show="data.show" type="text" @click="del(data,$event)" icon="el-icon-delete"></el-button>
                                            </span>
                                        </span>
                                    </div>
                                </span>  
                            </el-tree>
                        </el-main>
                    </el-container>  
                </SplitArea>
                <SplitArea :size="75" :minSize="0" style="overflow:hidden;">
                    
                    <el-container style="height:calc(100vh - 55px);">
                        <el-main>
                            <el-form ref="form" :model="form.data" label-width="80px" v-if="form.data">
                                <el-form-item label="名称">
                                    <el-input v-model="form.data.name"></el-input>
                                </el-form-item>
                                <el-form-item label="类型">
                                    <el-radio-group v-model="form.data.type">
                                        <el-radio label="component">组件</el-radio>
                                        <el-radio label="action">动作</el-radio>
                                        <el-radio label="url">URL</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="动作编辑" v-if="form.data.type === 'action'">
                                    <editor
                                        v-model="form.data.callback"
                                        @init="onEditorInit"
                                        :lang="editor.lang.value"
                                        :theme="editor.theme.value"
                                        width="100%"
                                        height="30vh"
                                    ></editor>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="onFormSubmit">立即创建</el-button>
                                    <el-button>取消</el-button>
                                </el-form-item>
                                </el-form>
                        </el-main>
                        <el-footer>

                        </el-footer>
                    </el-container>
                    
                </SplitArea>
            </Split>
        </el-main>
        
    </el-container>
  
</template>

<script>
import _ from 'lodash';

export default {
  name: "CtmenuKeepView",
  props: {
    
  },
  components:{
    editor: require("vue2-ace-editor"),
  },
  watch:{
      'form.data.type'(){
          
      }
  },
  data() {
    return {
        auth: null,
        tree:{
            defaultProps: {
                children: 'subMenu',
                label: 'name'
            },
            list: []
        },
        form: {
            data: null
        },
        editor: {
            lang: {
                value: "toml",
                list: []
            },
            theme: {
                value: "chrome",
                list: this.m3.EDITOR_THEME
            }
        }
    };
  },
  created(){
    this.load();
    this.auth = this.m3.auth.signedUser;
  },
  methods: {
    onMouseEnter(data){
        this.$set(data, 'show', true);
        this.$refs.tree.setCurrentKey(data.key);
    },
    onMouseLeave(data){
        this.$set(data, 'show', false)
    },
    onTreeNodeClick(data){
        this.form.data = data;
    },
    onFormSubmit(){

    },
    onEditorInit(){
        require("brace/ext/language_tools"); //language extension prerequsite...
        require(`brace/mode/${this.editor.lang.value}`); //language
        require(`brace/snippets/${this.editor.lang.value}`); //snippet
        require(`brace/theme/${this.editor.theme.value}`); //language
    },
    add(){

    },
    del(){

    },
    load(){
        this.m3.callFS("/matrix/eventConsole/contextmenu/getContextMenu.js").then( (rtn)=>{
            this.tree.list = _.filter(rtn.message,(v)=>{
                return v.name;
            });
        });
    },
    edit(){

    }

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    .el-header{
        height: 30px!important;
        line-height: 30px;
        background: #f2f2f2;
    }

    .ace_editor {
        border: 1px solid #ddd;
    }
</style>
