<template>
  
    <el-container>
        <el-aside width="200px">
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
                        ref="tree" v-if="tree.list">
                        <span slot-scope="{ node, data }" 
                            style="width:100%;height:30px;line-height: 30px;"  
                            @mouseenter="onMouseEnter(data)" 
                            @mouseleave="onMouseLeave(data)">
                            <div>
                                <span class="el-icon-price-tag" style="color: #f8a502;font-size: 14px;"></span> 
                                <span v-if="!data.name">
                                    <span>根目录</span>
                                    <span style="float:right;padding-right:5px;">
                                        <el-button v-show="data.show" type="text" @click.stop="load" icon="el-icon-refresh"></el-button>
                                        <el-button v-show="data.show" type="text" @click="add(data,$event)" icon="el-icon-plus"></el-button>
                                    </span>
                                </span>
                                <span v-else>
                                    <span>{{node.label}}</span>
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
        </el-aside>
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
        require("brace/mode/html");
        require("brace/mode/toml");
        require("brace/mode/javascript"); //language
        require("brace/mode/less");
        require("brace/theme/chrome");
        require("brace/snippets/javascript"); //snippet
    },
    add(){

    },
    del(){

    },
    load(){
        this.m3.callFS("/matrix/eventConsole/getContextMenu.js").then( (rtn)=>{
            this.tree.list = _.filter(rtn.message,(v)=>{
                return v.name;
            });
        } );
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
