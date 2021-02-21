<template>
  
    <el-dialog :title="'视图编辑 ' + model.name" :visible.sync="show" 
        :close-on-press-escape="false"
        :close-on-click-modal="false">
        <el-tabs value="info">
            <el-tab-pane label="基本信息" name="info" v-if="view.data.info">
                <el-form ref="form" :model="view.data.info" label-width="80px">
                    <el-form-item label="名称">
                        <el-input v-model="view.data.info.name"></el-input>
                    </el-form-item>
                    <el-form-item label="描述">
                        <el-input type="textarea" :rows="6" v-model="view.data.info.attr.remark"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" @click="onApplyInfo" :loading="loading">应用</el-button>
                        <el-button @click="onClose">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="数据源" name="datasource" v-if="view.data.datasource">
                <el-form ref="form" :model="view.data.datasource" label-width="80px">
                    <el-form-item label="名称">
                        <el-input v-model="view.data.datasource.name"></el-input>
                    </el-form-item>
                    <el-form-item label="数据源">
                        <editor
                            v-model="view.data.datasource.datasource"
                            @init="onEditorInit"
                            :lang="editor.lang.value"
                            :theme="editor.theme.value"
                            width="99.8%"
                            height="15vh"
                            style="border:1px solid #f2f2f2;"
                        ></editor>
                    </el-form-item>
                    <el-form-item label="数据结果">
                        <TableView :model="editor.data" v-if="editor.data"></TableView>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onTestDataSource" :loading="editor.loading">测试数据源</el-button>
                        <el-button type="success" @click="onApplyDataSource" :loading="editor.loading">应用数据源</el-button>
                        <el-button @click="onClose">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="属性管理" name="view" v-if="view.data.view">
                <el-form ref="form" :model="view.data.view" label-width="80px">
                    <el-form-item>
                        <el-button type="success">应用</el-button>
                        <el-button @click="onClose">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </el-dialog>

</template>

<script>
import _ from 'lodash';
import TableView from './TableView';
const editor = require("vue2-ace-editor");

export default {
  name: "EditView",
  props: {
    model: Object,
    show: Boolean
  },
  components:{
    TableView,
    editor
  },
  data() {
    return {
        dt: {
            rows: []
        },
        view: {
            activeName: "",
            data: null
        },
        file:{
            remark: "", 
            icon: ""
        },
        editor: {
            term: "",
            data: null,
            loading: false,
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
        },
        loading: false
    };
  },
  filters:{
    
  },
  created(){
     this.initData();
  },
  methods: {
    initFileInfo(){
        try{
            
            // 初始化attr
            if(_.isEmpty(this.view.data.info.attr)){
                _.extend(this.view.data.info, {attr:this.file});   
            } else {
                _.extend(this.view.data.info, {attr: JSON.parse(this.view.data.info.attr)});   
            }

        } catch(err){
            console.log(err)
        }
    },
    initData(){
        let param = encodeURIComponent(JSON.stringify({  action: "read", data: this.model }));
        this.m3.callFS("/matrix/eventConsole/view/action.js", param).then((rtn)=>{
            this.view.data = JSON.parse(rtn.message);
            
            this.view.data.info = _.cloneDeep(this.model);
            this.view.data.info.name = this.view.data.info.name.split(".")[0];

            this.initFileInfo();
        }).catch((err)=>{
            console.log(err);
            this.view.data = null;
        })
    },
    onApplyInfo(){
        this.onApplyName();
        this.onApplyAttr();
    },
    onApplyName(){

        this.loading = true;

        // update name
        let param = {
                srcpath: this.model.fullname, 
                dstpath: [this.view.data.info.parent,[this.view.data.info.name, this.view.data.info.ftype].join(".")].join("/")
            };
        
        if(param.srcpath == param.dstpath){
            this.loading = false;
            return false;
        }

        this.m3.dfsRename(param).then(()=>{
            this.model = this.view.data.info;
            this.loading = false;
        }).catch((err)=>{
            this.$message({
                type: 'error',
                message: err.message
            })
            this.loading = false;
        })
    },
    onApplyAttr(){
        this.loading = true;
        // update attr
        let attr = {
            parent: this.model.parent, 
            name: this.model.name,
            attr: JSON.stringify(this.view.data.info.attr)
        };

        if(this.view.data.info.attr.remark == this.model.attr.remark){
            this.loading = false;
            return false;
        }

        this.m3.dfsUpdateAttr(attr).then(()=>{
            this.model = this.view.data.info;
            this.$message({
                type: 'success',
                message: '更新成功'
            })

            
        }).catch((err)=>{
            this.$message({
                type: 'error',
                message: err.message
            })    
            this.loading = false;
        })
    },
    onClose(){
        this.$emit('dialog:close');
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
    onTestDataSource(){
        this.editor.loading = true;

        let param = encodeURIComponent(JSON.stringify({  view:"", term: this.view.data.datasource.datasource }));
        
        this.m3.callFS("/matrix/eventConsole/event_list.js", param).then((rt)=>{
            
            this.editor.data = rt.message;

            this.editor.loading = false;

        }).catch((err)=>{
            console.log(err);
            this.editor.loading = false;
        })
    },
    onApplyDataSource(){
        
        let content = JSON.stringify(this.view.data,null,2);

        let param = {
                      parent: this.model.parent, name: this.model.name, 
                      data: {data: content, type: this.model.ftype, attr: this.model.attr, index: true}    
                    };
        this.m3.dfsNew(param).then(()=>{
            this.$message({
              type: "success",
              message: "更新数据源成功"
            })  
            this.initData();
        }).catch((err)=>{
            this.$message({
              type: "error",
              message: "新建数据源失败 " + err.message
            })
        })
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  
</style>
