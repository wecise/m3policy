<template>  

    <el-tabs value="info" v-if="view.model" type="border-card" @tab-click="onTabClick">
        <el-tab-pane name="info" v-if="view.model.info">
            <h3 slot="label">
                1、基本信息<small> 设置视图名称和描述信息</small>
            </h3>
            <el-form ref="form" :model="view.model.info" label-width="80px">
                <el-form-item label="名称">
                    <el-input v-model="view.model.info.name"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" :rows="6" v-model="view.model.info.attr.remark"></el-input>
                </el-form-item>
                <el-form-item>
                    <TagView domain='dashview' :model.sync="view.model.info.tags" :id="view.model.info.id" :limit="4"></TagView>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" @click="onDelete(model)" :loading="view.loading">删除视图</el-button>
                    <el-button type="success" @click="onApplyInfo" :loading="view.loading">应用</el-button>
                    <el-button @click="onClose">取消</el-button>
                </el-form-item>
            </el-form>
        </el-tab-pane>
        <el-tab-pane name="datasource" v-if="view.model.datasource">
            <h3 slot="label">
                2、选择数据源<small> 选择数据源</small>
            </h3>
            <el-container>
                <el-main>
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
                            <div style="color:#999999;background: #f2f2f2;border: 1px solid #ddd;padding: 0 20px;font-size: 10px;">过滤条件可参考一键搜索语法，示例：severity>=3 | status=10 | top 500 | print id,name,class</div>
                            <Editor
                                v-model="view.model.datasource.filter"
                                @init="onEditorInit"
                                :lang="editor.lang.value"
                                :theme="editor.theme.value"
                                width="100%"
                                height="20vh"
                                style="border:1px solid #f2f2f2;border-left: unset;"
                            ></Editor>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="success" @click="onTestDataSource" :loading="editor.loading">测试数据源</el-button>
                            <el-button type="success" @click="onApplyDataSource" :loading="datasource.loading">应用</el-button>
                            <el-button @click="onClose">取消</el-button>
                        </el-form-item>
                        <el-form-item label="数据结果" v-if="editor.data">
                            <TableView :model="editor.data"></TableView>
                        </el-form-item>
                    </el-form>
                </el-main>
            </el-container>
        </el-tab-pane>
        <el-tab-pane name="props" v-if="view.model.datasource">
             <h3 slot="label">
                3、显示定义<small> 根据所选数据源列出属性，选择需要显示的属性</small>
            </h3>
             <el-container>
                <el-main>
                    <el-transfer
                        v-model="view.model.datasource.fields.value"
                        :data="datasource.fields"
                        :props="{
                            key: 'field',
                            label: 'title'
                        }"
                        :titles="['选择属性生成显示视图', '已选属性']"
                        :button-texts="['取消选择', '选择属性']"
                        target-order="custome"
                        filterable
                        :filter-method="onPropsFilter"
                        filter-placeholder="关键字"
                        ref="transfer">
                        <div slot-scope="{ option }">
                            
                            <el-form :model="option" :inline="true">
                                
                                <el-form-item style="width:80px;">
                                    <span style="color:#606266;font-size: 12px;">{{option.field}}</span>
                                </el-form-item>
                                <el-form-item label="别名" class="alias">
                                    <el-input v-model="option.title" size="mini" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="类型" class="ftype">
                                    <el-input v-model="option.ftype" size="mini" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="标题" class="title">
                                    <el-input v-model="option.title" size="mini"></el-input>
                                </el-form-item>
                                <el-form-item label="宽度" class="width">
                                    <el-input-number v-model="option.width" size="mini"></el-input-number>
                                </el-form-item>
                                <el-form-item label="可见" class="visible">
                                    <el-switch v-model="option.visible" size="mini"></el-switch>
                                </el-form-item>
                                <el-form-item class="render">
                                    <el-popover
                                        placement="right"
                                        width="400"
                                        popper-class="props-render-popper"
                                        trigger="click">
                                        <div style="width:100%;height:40px;line-height:40px;">
                                            <el-button type="default" @click="onSetRender(option,item)" :key="index" v-for="(item,index) in render">
                                                {{item.name}}
                                            </el-button>
                                        </div>
                                        <Editor
                                            v-model="option.render"
                                            @init="onEditorInit"
                                            :lang="editor.lang.value"
                                            :theme="editor.theme.value"
                                            width="99.8%"
                                            height="calc(100% - 40px)"
                                            style="border:1px solid #f2f2f2;"
                                        ></Editor>
                                        <el-button slot="reference">属性渲染定义 </el-button>
                                    </el-popover>
                                </el-form-item>
                                <el-form-item class="tip">
                                    <span @click="onTip()" class="el-icon-question"></span>
                                </el-form-item>
                            </el-form>
                                
                        </div>
                    </el-transfer>
                </el-main>
                <el-footer style="line-height:60px;text-align: center;">
                    <el-button type="success" @click="onApplyDataSource" :loading="datasource.loading">应用</el-button>
                    <el-button @click="onClose">取消</el-button>
                </el-footer>
            </el-container>
        </el-tab-pane>
        <el-tab-pane name="sort" v-if="view.model.datasource" >
             <h3 slot="label">
                4、显示属性排序<small> 根据需要指定属性的显示顺序</small>
            </h3>
             <el-container>
                <el-main>
                    <div style="color:#999999;background: #f2f2f2;border: 1px solid #ddd;padding: 5px 20px;font-size: 10px;">
                        拖动进行属性排序
                    </div>
                    <draggable
                        :list="sort.data"
                        class="list-group"
                        ghost-class="ghost"
                        @start="sort.dragging = true"
                        @end="sort.dragging = false"
                    >
                        <div class="list-group-item"
                            v-for="(element,index) in sort.data"
                            :key="index"
                        >
                        {{index+1}}. {{ element.title }} <span style="float:right;font-variant: petite-caps;"> 名称 {{ element.field }}   类型 {{ element.ftype }}</span>
                        </div>
                    </draggable>
                </el-main>
                <el-footer style="line-height:60px;text-align: center;">
                    <el-button type="success" @click="onApplyDataSourceBySorted" :loading="datasource.loading">应用</el-button>
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
import $ from 'jquery';
import TableView from './TableView';
import ActionView from './ActionView';
import draggable from "vuedraggable";
import TagView from '../tags/TagView';

export default {
  name: "EditView",
  props: {
    model: Object
  },
  components:{
    TableView,
    ActionView,
    Editor:require("vue2-ace-editor"),
    draggable,
    TagView
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
                list: this.m3.EDITOR_THEME
            }
        },
        datasource:{
            root: "/matrix/devops",
            loading: false,
            fields: []
        },
        render: [
            {
                name: '状态转换',
                code: `var s=function(row, column, cellValue, index){ 
    return global.register.event.status[cellValue][1];
};eval(s);`
            },
            {
                name: '级别映射',
                code: `var s=function(row, column, cellValue, index){ 
    /* by row */
    var el = document.querySelector('.row-'+index);
    /* by column */
    /* var el = document.querySelector('.row-'+index+' >.'+column.id+' > .cell');*/
    el.style.backgroundColor = global.register.event.severity[cellValue][2];
    el.style.color = '#ffffff';
    el.style.textAlign = 'center';
    return global.register.event.severity[cellValue][1]; 
};eval(s);`
            },
            {
                name: '时间转换',
                code: `var s=function(row, column, cellValue, index){
    return moment(cellValue).format("YYYY-MM-DD HH:mm:ss");
};
eval(s);`
            }
        ],
        sort: {
            data: [],
            dragging: false
        }
    };
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
      setTimeout(()=>{
          this.initTransfer();
      },1000)
  },
  methods: {
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
    initTransfer(){
        
        const transfer = this.$refs.transfer.$el;
        const leftPanel = transfer.getElementsByClassName("el-transfer-panel")[0].getElementsByClassName("el-transfer-panel__body")[0];
        const rightPanel = transfer.getElementsByClassName("el-transfer-panel")[1].getElementsByClassName("el-transfer-panel__body")[0];

        $(leftPanel).find('.title').hide();
        $(leftPanel).find('.width').hide();
        $(leftPanel).find('.visible').hide();
        $(leftPanel).find('.render').hide();
        $(leftPanel).find('.tip').hide();

        $(rightPanel).find('.alias').hide();
        $(rightPanel).find('.ftype').hide();

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

                                return {field: val, title: val, ftype: 'varchar', width:120, visible:true};//{key:val, label:val};
                                
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
        } finally{
            if(this.view.model.datasource.fields.value){
                _.forEach(this.view.model.datasource.fields.data,v=>{
                    let index = _.findIndex(this.datasource.fields,{field: v.field});
                    this.datasource.fields.splice(index, 1, v);
                })
            }
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
            this.$message({
                type: 'success',
                message: '更新名称成功'
            })
            this.onApplyAttr();
        }).catch((err)=>{
            this.$message({
                type: 'error',
                message: err.message
            })
            this.view.loading = false;
        })
    },
    onApplyAttr(){
        this.view.loading = true;
        
        if(JSON.stringify(this.view.model.info.attr) === this.model.attr){
            this.view.loading = false;
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
                message: '更新备注成功'
            })

            this.view.loading = false;
            
        }).catch((err)=>{
            this.$message({
                type: 'error',
                message: err.message
            })    
            this.view.loading = false;
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

        let view = this.model.name.replace(/.json/,'');
        let param = encodeURIComponent(JSON.stringify({  view: view, term: this.view.model.datasource.filter }));
        
        this.m3.callFS("/matrix/eventConsole/event_list.js", param).then((rt)=>{
            
            this.editor.data = rt.message;

            this.editor.loading = false;

        }).catch((err)=>{
            console.log(err);
            this.editor.loading = false;
        })
    },
    onDataSourceSelect(data){

        let setData = ()=>{
            this.view.model.datasource.name = `${data.class}/${_.now()}`
            this.view.model.datasource.class = data.class;
            
            this.m3.getClassFieldsById(data.id).then(res=>{
                this.datasource.fields = _.compact(_.map(res.message,(v)=>{
                    if(_.includes(v,'_')) return;  
                    return {field: v.name, title: v.title, ftype: v.ftype, width:120, visible:true};
                }))
                
                if(this.view.model.datasource.fields.data){
                    // _.extend(this.datasource.fields,this.view.model.datasource.fields.data);    
                    this.view.model.datasource.fields.data = [];
                    this.view.model.datasource.fields.value = [];
                }
            })
        }
        
        if(data.class !== this.view.model.datasource.class && !_.isEmpty(this.view.model.datasource.class)){
            this.$confirm(`类选则发生变化，是否继续？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                
                setData();

            }).catch(() => {
                this.$message.info("类选择操作已取消");
            });

            return;
        }

        if(_.isEmpty(this.view.model.datasource.class)){
           
            setData();

            return;
        }


    },
    onApplyDataSource(){
        
        this.datasource.loading = true;
    
        let fieldsValue = _.compact(_.map(this.view.model.datasource.fields.value,v=>{
            return _.find(this.datasource.fields, {field:v});
        }));
        
        
        this.$set(this.view.model.datasource.fields,'data', fieldsValue);

        let content = JSON.stringify(this.view.model,null,2);
    
        let param = {
                      parent: this.model.parent, name: this.model.name, 
                      data: { content: content, type: this.model.ftype, attr: this.view.model.info.attr, index: true }    
                    };
        
        this.m3.dfsWrite(param).then(()=>{
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
    },
    onApplyDataSourceBySorted(){
        this.datasource.loading = true;

        
        this.$set(this.view.model.datasource.fields,'data', this.sort.data);

        let content = JSON.stringify(this.view.model,null,2);
    
        let param = {
                      parent: this.model.parent, name: this.model.name, 
                      data: { content: content, type: this.model.ftype, attr: this.view.model.info.attr, index: true }    
                    };
        
        this.m3.dfsWrite(param).then(()=>{
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
    },
    onPropsFilter(query, item) {
        return item.field.indexOf(query) > -1 || item.title.indexOf(query) > -1;
    }, 
    onSetRender(data,item){
        _.extend(data, {render: item.code});
    },
    onTip(){
        
        this.$notify({
          title: "属性渲染示例",
          duration: 30 * 1000 ,
          dangerouslyUseHTMLString: true,
          message: this.render.map(v=>{ return `<h3>${v.name}</h3><pre style="background:#f2f2f2;padding:5px;">${v.code}</pre>`}).join("\n")
        });
    },
    onTabClick(tabName){
        if(tabName.name === 'props'){
            const transfer = this.$refs.transfer.$el;
            const leftPanel = transfer.getElementsByClassName("el-transfer-panel")[0].getElementsByClassName("el-transfer-panel__body")[0];
            const rightPanel = transfer.getElementsByClassName("el-transfer-panel")[1].getElementsByClassName("el-transfer-panel__body")[0];

            $(leftPanel).find('.title').hide();
            $(leftPanel).find('.width').hide();
            $(leftPanel).find('.visible').hide();
            $(leftPanel).find('.render').hide();
            $(leftPanel).find('.tip').hide();

            $(rightPanel).find('.alias').hide();
            $(rightPanel).find('.ftype').hide();
        } else if(tabName.name === 'sort'){
            if(_.isEmpty(this.view.model.datasource.fields.data)){
                this.sort.data = _.map(this.view.model.datasource.fields.value,v=>{
                    return _.find(this.datasource.fields, {field:v});
                });
            } else {
                this.sort.data = _.cloneDeep(this.view.model.datasource.fields.data);
            }
            
        }
    },
    onDelete(item){
      this.$confirm(`确定要删除该视图 ${item.name}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
       
        this.m3.dfsDelete(item).then(()=>{
          this.$message({
            type: "success",
            message: "删除成功"
          })
          this.$emit("view-delete");
        }).catch((err)=>{
          this.$message({
            type: "error",
            message: "删除失败 " + err
          })
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      })
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .list-group {
        display: -ms-flexbox;
        display: -webkit-box;
        display: flex;
        -ms-flex-direction: column;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        flex-direction: column;
        padding-left: 0;
        margin-bottom: 0;
        box-shadow: 0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 20%), 0 1px 5px 0 rgb(0 0 0 / 12%);
    }
    
    .list-group {
        min-height: 20px;
        border: 1px dashed #999;
    }

    .list-group-item:first-child {
        border-top-left-radius: .25rem;
        border-top-right-radius: .25rem;
    }
    
    .list-group-item {
        position: relative;
        display: block;
        padding: .75rem 1.25rem;
        margin-bottom: -1px;
        background-color: #fff;
        border-bottom: 2px dashed #999;
    }

    .list-group-item:hover {
        background: #f2f2f2;
        box-shadow: 0 2px 2px 0 rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 20%), 0 1px 5px 0 rgb(0 0 0 / 12%);
    }
    
    .list-group-item {
        cursor: pointer;
    }
</style>
<style>
    
    #pane-props .el-transfer-panel:first-child {
        width: 100%;
    }
    #pane-props .el-transfer-panel:last-child {
        width: 100%;
    }
    #pane-props .el-transfer-panel:last-child .el-transfer-panel__body,
    #pane-props .el-transfer-panel:last-child .el-transfer-panel__list.is-filterable{
        height: auto;
    }
    

    #pane-props .el-form-item__label {
        color: #a1a4a9;
    }
    #pane-props .el-transfer-panel__item.el-checkbox {
        margin-bottom: 10px;
        border-bottom: 1px solid #ddd;
        padding-bottom: 10px;
    }
    .el-dialog__body{
        height: auto;
        background: #ffffff!important;
    }
    #pane-props .el-transfer__buttons {
        line-height: 60px;
        text-align: center;
        width: 100%;
    }

    .el-dialog__body small{
        color: #999;
    }

    .el-dialog__body .el-tabs__item.is-top{
        height: 60px;
    }

    .el-notification{
        width: auto!important;
    }
    
    .props-render-popper.el-popover.el-popper{
        width: 60vw!important;
        height: 40vh!important;
    }
</style>
