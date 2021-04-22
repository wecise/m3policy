<template>
  
    <el-container style="height:calc(100vh - 115px);background:#f2f2f2;">
        <el-main style="padding:0px;">
            <Split direction="horizontal">
                <SplitArea :size="25" :minSize="0" style="overflow:hidden;">
                    <el-container>
                        <el-header>
                            <span>右键工具</span>
                            <span style="float:right;">
                                <el-button type="text" @click="onLoad" icon="el-icon-refresh"></el-button>
                                <el-button type="text" @click="onNew(null,$event)" icon="el-icon-plus"></el-button>
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
                                                <el-button v-show="data.show" type="text" @click.stop="onLoad" icon="el-icon-refresh"></el-button>
                                                <el-button v-show="data.show" type="text" @click="onNew(data,$event)" icon="el-icon-plus"></el-button>
                                            </span>
                                        </span>
                                        <span v-else>
                                            <span> {{node.label}}</span>
                                            <span style="float:right;padding-right:5px;">
                                                <el-button v-show="data.show" type="text" @click="onNew(data,$event)" icon="el-icon-plus"></el-button>
                                                <el-button v-show="data.show" type="text" @click="onDelete(data,$event)" icon="el-icon-delete"></el-button>
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
                                    <el-radio-group v-model="form.data.type" disabled>
                                        <el-radio-button label="component">组件</el-radio-button>
                                        <el-radio-button label="action">动作</el-radio-button>
                                        <el-radio-button label="url">URL</el-radio-button>
                                        <el-radio-button label="attachment">附件</el-radio-button>
                                        <el-radio-button label="tags">标签</el-radio-button>
                                        <el-radio-button label="dir">菜单目录</el-radio-button>
                                    </el-radio-group>
                                </el-form-item>
                                <template v-if="form.data.type=='component'">
                                    <el-form-item label="组件">
                                        <el-radio-group v-model="form.data.component.name" size="small">
                                            <el-radio :label="cp.component.name" border v-for="cp in component.list" :key="cp.id">{{cp.name}}</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </template>
                                <template v-if="form.data.type=='url'">
                                    <el-form-item label="URL">
                                        <el-input v-model="form.data.url.value"></el-input>
                                    </el-form-item>
                                    <el-form-item label="打开方式">
                                        <el-radio-group v-model="form.data.url.target">
                                            <el-radio label="_top">当前窗口打开</el-radio>
                                            <el-radio label="_blank">新窗口打开</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="参数">
                                        <el-input v-model="form.data.url.param"></el-input>
                                    </el-form-item>
                                </template>
                                 <template v-if="form.data.type=='action'">
                                    <el-form-item label="动作编辑">
                                        <editor
                                            v-model="form.data.action.name"
                                            @init="onEditorInit"
                                            :lang="editor.lang.value"
                                            :theme="editor.theme.value"
                                            width="100%"
                                            height="30vh"
                                        ></editor>
                                    </el-form-item>
                                    <el-form-item label="参数">
                                        <el-input v-model="form.data.action.value"></el-input>
                                    </el-form-item>
                                 </template>
                                <el-form-item>
                                    <el-button type="primary" @click="onSave(form.data)">提交</el-button>
                                </el-form-item>
                                </el-form>
                        </el-main>
                        <el-footer>

                        </el-footer>
                    </el-container>
                    
                </SplitArea>
            </Split>

            <el-dialog title="新建右键工具" 
                :visible.sync="dialog.new.show"
                :show-close="false"
                :close-on-press-escape="true"
                :close-on-click-modal="false"
                :destroy-on-close="true"
                v-if="dialog.new.show"
                custom-class="contextmenu-dialog">
                <el-form :model="dialog.new.data" :rules="dialog.new.rules" label-position="top">
                    <el-form-item label="名称">
                        <el-input v-model="dialog.new.data.name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="类型">
                        <el-radio-group v-model="dialog.new.data.type">
                            <el-radio-button label="component">组件</el-radio-button>
                            <el-radio-button label="action">动作</el-radio-button>
                            <el-radio-button label="url">URL</el-radio-button>
                            <el-radio-button label="attachment">附件</el-radio-button>
                            <el-radio-button label="tags">标签</el-radio-button>
                            <el-radio-button label="dir">菜单目录</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <template v-if="dialog.new.data.type=='component'">
                        <el-form-item label="组件">
                            <el-radio-group v-model="dialog.new.data.component.name" size="small">
                                <el-radio :label="cp.id" border v-for="cp in component.list" :key="cp.id">{{cp.name}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </template>
                    <template v-if="dialog.new.data.type=='url'">
                        <el-form-item label="URL">
                            <el-input v-model="dialog.new.data.url.name"></el-input>
                        </el-form-item>
                        <el-form-item label="打开方式">
                            <el-radio-group v-model="dialog.new.data.url.target">
                                <el-radio label="_top">当前窗口打开</el-radio>
                                <el-radio label="_blank">新窗口打开</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="参数">
                            <el-input v-model="dialog.new.data.url.param"></el-input>
                        </el-form-item>
                    </template>
                    <template v-if="dialog.new.data.type === 'action'">
                        <el-form-item label="动作编辑">
                            <editor
                                v-model="dialog.new.data.action.name"
                                @init="onEditorInit"
                                :lang="editor.lang.value"
                                :theme="editor.theme.value"
                                width="100%"
                                height="15vh"
                            ></editor>
                        </el-form-item>
                        <el-form-item label="参数">
                            <el-input v-model="dialog.new.data.action.param"></el-input>
                        </el-form-item>
                    </template>
                    
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialog.new.show = false">取 消</el-button>
                    <el-button type="primary" @click="onSave">确 定</el-button>
                </div>
            </el-dialog>
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
        },
        component:{
            list: []
        },
        dialog: {
            new:{
                show: false,
                data: {
                    name: "",
                    type: "component",
                    icon: "",
                    url: {
                        name: "",
                        target: "",
                        param: ""
                    },
                    component: {
                        name: ""
                    },
                    action:{
                        name:"",
                        value: ""
                    }
                },
                rules: []
            }
        }
    };
  },
  created(){
    this.onLoad();
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
    onEditorInit(){
        require("brace/ext/language_tools"); //language extension prerequsite...
        require(`brace/mode/${this.editor.lang.value}`); //language
        require(`brace/snippets/${this.editor.lang.value}`); //snippet
        require(`brace/theme/${this.editor.theme.value}`); //language
    },
    onNew(){
        this.dialog.new.show = true;
    },
    onSave(data){
        console.log(data)

    },
    onDelete(){

    },
    onLoad(){
        this.m3.callFS("/matrix/eventConsole/contextmenu/getContextMenu.js").then( (rtn)=>{
            this.tree.list = _.filter(rtn.message,(v)=>{
                return v.name;
            });
        });

        this.m3.dfsRead({parent:"/script/matrix/eventConsole/tools", name:"tools.json"}).then( rtn=>{
            this.component.list = JSON.parse(rtn.message);
        })
    },
    onEdit(){

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

    .el-radio--small.is-bordered {
        width: 10em;
        margin: 10px;
    }
</style>

<style>
.contextmenu-dialog.el-dialog{
    width :65vw!important;
    height:70vh;
}
</style>
