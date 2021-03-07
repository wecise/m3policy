<template>
  
    
        <el-tabs value="info" v-if="view.model">
            <el-tab-pane label="基本信息" name="info" v-if="view.model.info">
                <el-form ref="form" :model="view.model.info" label-width="80px">
                    <el-form-item label="名称">
                        <el-input v-model="view.model.info.name"></el-input>
                    </el-form-item>
                    <el-form-item label="描述">
                        <el-input type="textarea" :rows="6" v-model="view.model.info.attr.remark"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" @click="onApplyInfo" :loading="view.loading">应用</el-button>
                        <el-button @click="onClose">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="数据源" name="datasource" v-if="view.model.datasource">
                <el-container style="height: calc(100vh - 275px);background: #f2f2f2;">
                    <el-main style="overflow:hidden;">
                        <el-tabs value="source" type="border-card" tab-position="top" style="height:100%;">
                            <el-tab-pane label="数据源" name="source">
                                <el-form ref="form" :model="view.model.datasource" label-width="80px">
                                    <el-form-item label="数据源">
                                        <el-input v-model="view.model.datasource.class" disabled>
                                            <el-dropdown slot="prepend">
                                                <span class="el-dropdown-link">
                                                    <i class="el-icon-coin el-icon--right" style="cursor:pointer;"></i>
                                                </span>
                                                <el-dropdown-menu slot="dropdown">
                                                    <ActionView :root="datasource.root" 
                                                        @node-click="onDataSourceSelect"
                                                        @treedata-loaded="initDataSourceFields"></ActionView>
                                                </el-dropdown-menu>
                                            </el-dropdown>
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item label="过滤条件">
                                        <Editor
                                            v-model="view.model.datasource.filter"
                                            @init="onEditorInit"
                                            :lang="editor.lang.value"
                                            :theme="editor.theme.value"
                                            width="99.8%"
                                            height="15vh"
                                            style="border:1px solid #f2f2f2;"
                                        ></Editor>
                                    </el-form-item>
                                    <el-form-item label="数据结果" v-if="editor.data">
                                        <TableView :model="editor.data"></TableView>
                                    </el-form-item>
                                </el-form>
                            </el-tab-pane>
                            <el-tab-pane label="显示定义" name="columns">
                                <el-transfer
                                    v-model="view.model.datasource.fields"
                                    :data="datasource.fields">
                                </el-transfer>
                            </el-tab-pane>
                        </el-tabs>
                    </el-main>
                    <el-footer style="line-height:60px;">
                        <el-button type="primary" @click="onTestDataSource" :loading="editor.loading">测试数据源</el-button>
                        <el-button type="success" @click="onApplyDataSource" :loading="datasource.loading">应用数据源</el-button>
                        <el-button @click="onClose">取消</el-button>
                    </el-footer>
                </el-container>
            </el-tab-pane>
            <el-tab-pane label="主题设置" name="theme" v-if="view.model.theme">
                <el-form ref="form" :model="view.model.theme" label-width="80px">
                    <el-form-item>
                        <el-button type="success">应用</el-button>
                        <el-button @click="onClose">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    

</template>

<script>
import _ from 'lodash';
import TableView from './TableView';
import ActionView from './ActionView';

export default {
  name: "EditView",
  props: {
    model: Object
  },
  components:{
    TableView,
    ActionView,
    Editor:require("vue2-ace-editor")
  },
  data() {
    return {
        
        view: {
            loading: false,
            activeName: "",
            model: null
        },
        editor: {
            term: "",
            data: null,
            loading: false,
            lang: {
                value: "javascript",
                list: []
            },
            theme: {
                value: "chrome",
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
        datasource:{
            root: "/matrix/devops",
            loading: false,
            fields: []
        }
    };
  },
  filters:{
    
  },
  watch:{
     model:{
         handler(){
             this.initData();
         },
         immediate: true
     }
  },
  mounted(){
    
  },
  methods: {
    initFileInfo(){
        try{
            
            // 初始化attr
            if(_.isEmpty(this.view.model.info.attr)){
                _.extend(this.view.model.info, {attr:  {remark: "", icon: ""} });   
            } else {
                _.extend(this.view.model.info, {attr: JSON.parse(this.view.model.info.attr)});   
            }

        } catch(err){
            console.log(err)
             _.extend(this.view.model.info, {attr:  {remark: "", icon: ""} });   
        }
    },
    initData(){
        let param = encodeURIComponent(JSON.stringify({  action: "read", data: this.model }));
        this.m3.callFS("/matrix/eventConsole/view/action.js", param).then((rtn)=>{
            this.view.model = JSON.parse(rtn.message);
            
            this.view.model.info = _.cloneDeep(this.model);
            this.view.model.info.name = this.view.model.info.name.split(".")[0];

            this.initFileInfo();

        }).catch((err)=>{
            console.log(err);
            this.view.model = null;
        })
    },
    initDataSourceFields(treeData){
        
        if(!this.view.model) return false;

        try{
            
            let find = (nodes)=>{
                
                _.forEach(nodes,(v)=>{
                    
                    if(this.view.model.datasource.class == v.class){
                        if(v.fields){
                            this.datasource.fields = _.compact(_.map(v.fields,(val)=>{
                                if(_.includes(val,'_')) return;  
                                return {key:val, label:val};
                            }));
                        }
                    }

                    if(v.children){
                        find(v.children);
                    }
                })
                
            };
            
            find(treeData);            

        } catch(err){
            console.log(err)
        }
    },
    onApplyInfo(){
        this.onApplyName();
    },
    onApplyName(){

        this.view.loading = true;

        // update name
        let param = {
                srcpath: this.model.fullname, 
                dstpath: [this.view.model.info.parent,[this.view.model.info.name, this.view.model.info.ftype].join(".")].join("/")
            };
        
        if(param.srcpath == param.dstpath){
            this.view.loading = false;
            this.onApplyAttr();
            return false;
        }

        this.m3.dfsRename(param).then(()=>{
            this.view.loading = false;
            this.onApplyAttr();
        }).catch((err)=>{
            this.$message({
                type: 'error',
                message: err.message
            })
            this.view.loading = false;
            this.onApplyAttr();
        })
    },
    onApplyAttr(){
        this.loading = true;
        
        if(this.view.model.info.attr === this.model.attr){
            this.loading = false;
            return false;
        }

        // update attr
        let attr = {
            parent: this.view.model.info.parent, 
            name: [this.view.model.info.name, this.view.model.info.ftype].join("."),
            attr: JSON.stringify(this.view.model.info.attr)
        };

        this.m3.dfsUpdateAttr(attr).then(()=>{
            
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
        require(`brace/mode/${this.editor.lang.value}`); //language
        require(`brace/snippets/${this.editor.lang.value}`); //snippet
        require(`brace/theme/${this.editor.theme.value}`); //language
    },
    onTestDataSource(){
        this.editor.loading = true;

        let param = encodeURIComponent(JSON.stringify({  view:"", term: this.view.model.datasource.datasource }));
        
        this.m3.callFS("/matrix/eventConsole/event_list.js", param).then((rt)=>{
            
            this.editor.data = rt.message;

            this.editor.loading = false;

        }).catch((err)=>{
            console.log(err);
            this.editor.loading = false;
        })
    },
    onDataSourceSelect(data){
        
        this.view.model.datasource.name = `${data.class}/${_.now()}`
        this.view.model.datasource.class = data.class;
        this.datasource.fields = _.compact(_.map(data.fields,(v,k)=>{
            if(_.includes(v,'_')) return;  
            return {key:k, label:v};
        }));
    },
    onApplyDataSource(){
        
        this.datasource.loading = true;

        let content = JSON.stringify(this.view.model,null,2);
    
        let param = {
                      parent: this.model.parent, name: this.model.name, 
                      data: { data: content, type: this.model.ftype, attr: this.model.attr, index: true }    
                    };

        this.m3.dfsNew(param).then(()=>{
            this.$message({
              type: "success",
              message: "更新数据源成功"
            })  
            this.initData();

            this.datasource.loading = false;
        }).catch((err)=>{
            this.$message({
              type: "error",
              message: "新建数据源失败 " + err.message
            })
            this.datasource.loading = false;
        })
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  
</style>
