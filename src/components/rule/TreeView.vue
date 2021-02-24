<template>
    <el-container>
        <el-header>
            <el-input v-model="filterText" 
                placeholder="搜索"
                clearable></el-input>

                <el-dropdown placement="top-start" trigger="click">
                    <el-tooltip content="导出、导入" >
                        <el-button type="text" icon="el-icon-menu" style="color:#333333;"></el-button>
                    </el-tooltip>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                            <label for="auto-file-upload" class="custom-file-upload" style="display: inline-block;padding: 6px 12px;cursor: pointer;">
                                <i class="el-icon-download"></i> 导入
                            </label>
                            <input id="auto-file-upload" type="file" @change="configImport" required="required" style="display:none;" />
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <el-button type="text" @click="configExport"><i class="el-icon-upload2"></i> 导出</el-button>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
        </el-header>
        <el-main>
            <el-tree :data="treeData" 
                    :props="defaultProps" 
                    node-key="key"
                    highlight-current
                    accordion
                    @node-click="onNodeClick"
                    :filter-node-method="onNodeFilter"
                    :expand-on-click-node="true"
                    auto-expand-parent
                    :default-expanded-keys="defaultExpandedKeys"
                    style="background:transparent;"
                    ref="tree">
                <span slot-scope="{ node, data }" style="width:100%;height:30px;line-height: 30px;"  @mouseenter="onMouseEnter(data)" @mouseleave="onMouseLeave(data)">
                    <span v-if="data.dir">
                        <i class="el-icon-timer" style="color:#FFC107;" v-if="pickTypeFromLabel(node.label,'jobs')"></i>
                        <i class="el-icon-bank-card" style="color:#FFC107;" v-else-if="pickTypeFromLabel(node.label,'rules')"></i>
                        <i class="el-icon-s-platform" style="color:#FFC107;" v-else-if="pickTypeFromLabel(node.label,'hosts')"></i>
                        <i class="el-icon-lock" style="color:#FFC107;" v-else-if="pickTypeFromLabel(node.label,'lock')"></i>
                        <i class="el-icon-warning" style="color:#FFC107;" v-else-if="pickTypeFromLabel(node.label,'notify')"></i>
                        <i class="el-icon-folder" style="color:#FFC107;" v-else></i>
                        <span v-if="node.label==='/'"> 我的配置({{data.nodes.length}})</span>
                        <span v-else> {{ pickLabel(node.label) }}({{data.nodes.length}})</span>
                        <el-dropdown v-show="data.show" style="float:right;width:14px;margin:0 5px;">
                            <span class="el-dropdown-link">
                                <i class="el-icon-more el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="onRefresh(data)" icon="el-icon-refresh">刷新</el-dropdown-item>
                                <el-dropdown-item @click.native="onNewFile(data)" icon="el-icon-plus" divided>新建</el-dropdown-item>
                                <el-dropdown-item @click.native="onNewDir(data)" icon="el-icon-folder-add">新建目录</el-dropdown-item>
                                <el-dropdown-item @click.native="onEditFile(data)" icon="el-icon-edit-outline" divided>编辑</el-dropdown-item>
                                <el-dropdown-item @click.native="onExport(data)" icon="el-icon-download" divided>导出</el-dropdown-item>
                                <el-dropdown-item @click.native="onDelete(data)" icon="el-icon-delete" divided>删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </span>
                    <span v-else>
                        <i class="el-icon-c-scale-to-original" style="color:#0088cc;"></i>
                        <span> {{ pickLabel(node.label) }}</span>
                        <el-dropdown v-show="data.show" style="float:right;width:14px;margin:0 5px;">
                            <span class="el-dropdown-link">
                                <i class="el-icon-more el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="onEditFile(data)" icon="el-icon-edit-outline">编辑</el-dropdown-item>
                                <el-dropdown-item @click.native="onNewFile(data)" icon="el-icon-plus" divided>新建</el-dropdown-item>
                                <el-dropdown-item @click.native="onNewDir(data)" icon="el-icon-folder-add">新建目录</el-dropdown-item>
                                <el-dropdown-item @click.native="onDelete(data)" icon="el-icon-delete" divided>删除</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <el-tooltip content="编辑" >
                            <el-button v-show="data.show" type="text" @click.stop="onEditFile(data)" icon="el-icon-edit-outline" style="float:right;width:14px;margin:0 5px;"></el-button>
                        </el-tooltip>
                    </span>
                </span>  
            </el-tree>
            <el-dialog :title="dialog.configNew.formItem.ifDir?'新增目录':'新增配置'" 
                :visible.sync="dialog.configNew.show" 
                v-if="dialog.configNew.show">
                <el-container>
                    <el-main style="padding:0px 20px;height:100%;overflow:auto;">
                        <el-form label-width="80">
                            <el-form-item label="位置" prop="parent">
                                <el-input v-model="dialog.configNew.parent" placeholder="位置" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="名称" prop="name">
                                <el-input v-model="dialog.configNew.name" :placeholder="dialog.configNew.formItem.ifDir?'目录名称':'配置名称'" autofocus="true"></el-input>
                            </el-form-item>
                            <el-form-item :label="dialog.configNew.formItem.ifDir?'目录':'配置'">
                                <el-switch v-model="dialog.configNew.formItem.ifDir"
                                    active-color="#13ce66"
                                    :active-value="true"
                                    :inactive-value="false"></el-switch>
                            </el-form-item>
                            <el-form-item label="TTL" prop="ttl">
                                <el-input v-model="dialog.configNew.formItem.ttl" placeholder="TTL"></el-input>
                            </el-form-item>
                            <el-form-item label="值" prop="value">
                                <el-input v-model="dialog.configNew.formItem.value" type="textarea" placeholder="配置内容"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-main>
                    <el-footer style="text-align:right;">
                        <el-button type="default" @click="dialog.configNew.show = false;">取消</el-button>
                        <el-button type="primary" @click="onConfigSave" :loading="dialog.configNew.loading">提交</el-button>
                    </el-footer>
                </el-container>
            </el-dialog> 
        </el-main>
    </el-container>
</template>
<script>
import _ from 'lodash';

export default {
    name: 'TreeView',
    data(){
        return {
            auth: window.auth,
            defaultProps: {
                children: 'nodes',
                label: 'key'
            },
            treeData: [],
            defaultExpandedKeys: ["/"],
            filterText: "",
            dialog:{
                configNew: {
                    show: false,
                    parent: '',
                    name: '',
                    formItem: {
                        key: '',
                        value: '',
                        ttl: null,
                        ifDir: true,
                    },
                    data: null,
                    loading: false
                }
            }
        }
    },
    watch: {
        filterText(val) {
            if(_.isEmpty(val)){
                this.initData();
            } else {
                this.$refs.tree.filter(val);
            }
        }
    },
    mounted(){
        this.initData();
    },
    methods: {
        pickTypeFromLabel(label,value){
            return _.endsWith(label,value);
        },
        pickLabel(label){
            return _.last(label.split("/"));
        },
        initData(){
            let root = ["",this.auth.signedUser.Company.ospace,'rules'].join("/");
            this.m3.ruleGet(root).then( (rtn)=>{
                this.treeData = [rtn.message];
            } );
        },
        onMouseEnter(item){
            this.$set(item, 'show', true)
            this.$refs.tree.setCurrentKey(item.key);
        },
        onMouseLeave(item){
            this.$set(item, 'show', false)
        },
        onNodeFilter(value, data) {
            if(!value) return true;
            
            return data.key.indexOf(value) !== -1;
        },
        onCollapseAll(){
            _.forEach(this.$refs.tree.store._getAllNodes(), (v)=>{
                this.$set(v, 'expanded', false);
            })
        },                      
        onRefresh(data){
            this.m3.ruleGet(data.key).then( (rtn)=>{
                this.$set(data, 'nodes', rtn.message.nodes);
            } );
        },
        onNodeClick(data){
            
            this.$emit("node-click",data);
            
            this.onRefresh(data);

        },
        onDelete(data){
            
            let item = data;
            let parent = this.$refs.tree.getNode(data.key).parent.data;

            const h = this.$createElement;
            this.$msgbox({
                    title: `确认要删除以下配置`, 
                    message: h('span', null, [
                        h('p', null, `位置：${item.key}`),
                        h('p', null, `值：${_.truncate(item.value)}`),
                        h('p', null, `TTL：${  _.isUndefined(item.ttl) ? '' : item.ttl }`)
                    ]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
            }).then(() => {

                this.m3.ruleDelete(item).then( (rtn)=>{
                    if(rtn == 1){
                        // 刷新
                        this.onRefresh(parent);
                        
                        // 关闭Tab
                        this.$root.configClose(item.key);
                    }
                } );

            }).catch(() => {
                    
            }); 

        },
        onNewFile(data){

            this.dialog.configNew.formItem.ifDir = false;
            this.dialog.configNew.data = data;
            this.dialog.configNew.parent = data.key || '/';
            
            this.dialog.configNew.show = true;
            
        },
        onNewDir(data){
            
            this.dialog.configNew.formItem.ifDir = true;
            this.dialog.configNew.data = data;
            this.dialog.configNew.parent = data.key || '/';

            this.dialog.configNew.show = true;
        },
        onEditFile(data){

            this.m3.ruleGet(data.key).then( (rtn)=>{
                this.$emit("node-open", rtn.message);
            } );
        },
        onResetConfig(){
            
            this.dialog.configNew.parent = '';
            this.dialog.configNew.name = '';
            this.dialog.configNew.data = null;
            this.dialog.configNew.formItem.key = '';
            this.dialog.configNew.formItem.value = '';
            this.dialog.configNew.formItem.ttl = null;
            this.dialog.configNew.formItem.ifDir = true;

        },
        onExport(data){
            
            this.$confirm(`确认要导出 ${data.key} 下的配置?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                
                this.m3.ruleExport(data.key,this);
                
            }).catch(() => {
                
            });
        },  
        onConfigSave(){
            

            if(_.isEmpty(this.dialog.configNew.name)){
                this.$message({
                    type: "warning",
                    message: "配置名称不能为空！"
                })
                return false;
            }

            this.dialog.configNew.loading = true;
            
            this.dialog.configNew.formItem.key = [this.dialog.configNew.parent, this.dialog.configNew.name].join("/").replace(/\/\//g,'/');
            
            const h = this.$createElement;
            this.$msgbox({
                    title: `确认要添加以下配置`, 
                    message: h('span', null, [
                        h('p', null, `位置：${this.dialog.configNew.formItem.key}`),
                        h('p', null, `值：${_.truncate(this.dialog.configNew.formItem.value)}`),
                        h('p', null, `TTL：${ this.dialog.configNew.formItem.ttl ? this.dialog.configNew.formItem.ttl : ''}`)
                    ]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
            }).then(() => {

                this.m3.ruleAdd(this.dialog.configNew.formItem).then( (rtn)=>{
                    if(rtn == 1){
                        this.$message({
                            type: "success",
                            message: "保存成功！"
                        })
                        
                        // 刷新
                        this.onRefresh(this.dialog.configNew.data);

                        this.onResetConfig();
                        
                        this.dialog.configNew.show = false;


                    } else {
                        this.$message({
                            type: "error",
                            message: "保存失败：" + rtn
                        })
                    }

                    this.dialog.configNew.loading = false;
                } );

            }).catch(() => {
                this.dialog.configNew.loading = false;
            }); 

        },
        configImport(){

        },
        configExport(){

        }
    }    
}
</script>
<style scoped>
    .el-container{
        
    }
    .el-header{
        height:40px!important;
        line-height:40px;
        display:flex;
    }
    .el-main{
        overflow:auto;
    }
</style>
