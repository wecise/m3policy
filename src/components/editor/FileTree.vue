<template>
    <el-container>
        <el-header style="height:40px;line-height:40px;padding:0px 10px;">
            <el-input v-model="filterText" 
                placeholder="搜索" size="mini"
                clearable></el-input>
        </el-header>
        <el-main style="padding:0px; height: 100%;">
            <el-tree :data="treeData" 
                    :props="defaultProps" 
                    node-key="fullname"
                    highlight-current
                    default-expand-all
                    auto-expand-parent
                    @node-click="onNodeClick"
                    :filter-node-method="onFilterNode"
                    :expand-on-click-node="false"
                    style="background:transparent;"
                    ref="tree">
                <span slot-scope="{ node, data }" style="width:100%;height:30px;line-height: 30px;"  @mouseenter="onMouseEnter(data)" @mouseleave="onMouseLeave(data)">
                    <span v-if="data.ftype=='dir'">
                        <i class="el-icon-folder" style="color:#FFC107;"></i> 
                        <span> {{node.label}}</span>
                        <el-dropdown v-show="data.show" style="float:right;width:14px;padding-right:10px;">
                            <span class="el-dropdown-link">
                                <i class="el-icon-more el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="onDelete(data,$event)" icon="el-icon-delete">删除</el-dropdown-item>
                                <el-dropdown-item @click.native="onNodeClick(data)" icon="el-icon-refresh">刷新</el-dropdown-item>
                                <el-dropdown-item @click.native="onNewFile(data,$event)" icon="el-icon-plus">新建文件</el-dropdown-item>
                                <el-dropdown-item @click.native="onNewDir(data,$event)" icon="el-icon-folder-add">新建目录</el-dropdown-item>
                                <el-dropdown-item @click.native="onUpload(data,$event)" icon="el-icon-upload">上传</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </span>
                    <span v-else>
                        <i class="el-icon-c-scale-to-original" style="color:#0088cc;"></i>
                        <span> {{node.label}}</span>
                        <el-dropdown v-show="data.show" style="float:right;width:14px;padding-right:10px;">
                            <span class="el-dropdown-link">
                                <i class="el-icon-more el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="onDelete(data,$event)" icon="el-icon-delete">删除</el-dropdown-item>
                                <el-dropdown-item @click.native="onNodeClick(data)" icon="el-icon-refresh">刷新</el-dropdown-item>
                                <el-dropdown-item @click.native="onNewFile(data,$event)" icon="el-icon-plus">新建文件</el-dropdown-item>
                                <el-dropdown-item @click.native="onNewDir(data,$event)" icon="el-icon-folder-add">新建目录</el-dropdown-item>
                                <el-dropdown-item @click.native="onUpload(data,$event)" icon="el-icon-upload">上传</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <el-button v-show="data.show" type="text" @click.stop="onEdit(data)" style="float:right;width:14px;margin:0 5px;" icon="el-icon-edit-outline"></el-button>
                    </span>
                </span>  
            </el-tree>
        </el-main>
    </el-container>
</template>

<script>
import _ from 'lodash';

export default {
    name: "FileView",
    props: {
        model: Object
    },
    data(){
        return {
            root: '/script/matrix/eventConsole',
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            treeData: [],
            filterText: ""
        }
    },
    watch: {
        filterText(val) {
            if(_.isEmpty(val)){
                this.onInit();
            } else {
                this.$refs.tree.filter(val);
            }
        }
    },
    created(){
        this.onInitTreeData();
    },
    methods: {
        onMouseEnter(item){
            this.$set(item, 'show', true)
            this.$refs.tree.setCurrentKey(item.key);
        },
        onMouseLeave(item){
            this.$set(item, 'show', false)
        },
        onRefresh(item){
            this.m3.dfsList(item.fullname).then( (rtn)=>{
                this.$set(item, 'children', rtn);
            } );
        },
        onNewDir(item){
            this.$prompt('请输入目录名称', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
              }).then(({ value }) => {
                if(_.isEmpty(value)){
                    this.$message({
                        type: 'warning',
                        message: '请输入目录名称！'
                    });
                    return false;
                }

                let _attr = {remark: '', rate: 0};

                this.m3.dfsNew('dir', item.fullname, value, null, _attr).then( (rtn)=>{
                    if(rtn == 1){
                        this.$message({
                            type: "success",
                            message: "新建目录成功！"
                        })
                        
                        this.onInit();
                        
                    } else {
                        this.$message({
                            type: "error",
                            message: "新建目录失败，" + rtn.message
                        })
                    }
                } );
                
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '取消输入'
                });       
              });
            
        },
        onNewFile(item){
            this.$prompt('请输入文件名称', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
              }).then(({ value }) => {
                if(_.isEmpty(value)){
                    this.$message({
                        type: 'warning',
                        message: '请输入名称！'
                    });
                    return false;
                }

                let _attr = {remark: '', rate: 0};

                this.m3.dfsNew('md', item.fullname, [value,'md'].join("."), null, _attr).then( (rtn)=>{
                    if(rtn == 1){
                        this.$message({
                            type: "success",
                            message: "新建成功！"
                        })
                        this.onInit();
                    } else {
                        this.$message({
                            type: "error",
                            message: "新建失败，" + rtn.message
                        })
                    }
                } );
                
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '取消输入'
                });       
              });
        },
        onDelete(item){
            
            this.$confirm(`确认要删除该目录或文件：${item.name}？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                
                this.m3.dfsDelete(item.parent,item.name).then( (rtn)=>{
                    if(rtn == 1){
                        this.$message({
                            type: "success",
                            message: "删除成功！"
                        })
                        
                        this.onInit();
                        
                    } else {
                        this.$message({
                            type: "error",
                            message: "删除失败！"
                        })
                    }
                } );

            }).catch(() => {
                
            });
        },
        onUpload(){

            /* let wnd = null;
            let wndID = `jsPanel-upload-${objectHash.sha1(item.id)}`;

            try{
                if(jsPanel.activePanels.getPanel(wndID)){
                    jsPanel.activePanels.getPanel(wndID).close();
                }
            } catch(error){

            }
            finally{
                wnd = maxWindow.winUpload('文件上传', `<div id="${wndID}"></div>`, null, null);
            }
            
            new Vue({
                delimiters: ['#{', '}#'],
                template:   `<el-container>
                                <el-main>
                                    <el-upload drag
                                        multiple
                                        show-file-list="false"
                                        :action="upload.url"
                                        :on-success="onSuccess"
                                        :on-remove="onRemove"
                                        list-type="text"
                                        name="uploadfile">
                                        <i class="el-icon-upload"></i>
                                    </el-upload>
                                </el-main>
                                <el-footer>
                                    <i class="fas fa-clock"></i> 上传文件：#{upload.fileList.length}# 
                                </el-footer>
                            </el-container>`,
                data: {
                    upload: {
                        url: `/fs/${item.fullname}?issys=true`,
                        fileList: []
                    }
                },
                created(){
                    
                },
                methods: {
                    beforeUpload(file){
                        
                    },
                    onSuccess(res,file,FileList){
                        this.upload.fileList = FileList;
                    },
                    onRemove(file) {
                        fsHandler.fsDeleteAsync(item.fullname,file.name).then( (rtn)=>{

                        } );
                    },
                    onPreview(file) {
                        console.log(file);
                    }
                }
            }).$mount(`#${wndID}`); */
            
        },  
        onFilterNode:_.debounce(function(value) {
            const self = this;

            if (!value) return true;

            try{
                this.m3.callFS("/matrix/fs/getFsByTerm.js", encodeURIComponent(value)).then( (rtn)=>{
                    self.treeData = rtn.message;
                } );
            } catch(err){
                self.treeData = [];
            }
        },1000),
        onNodeClick(data){
            try{

                if(data.isdir) {
                    let param = {parent: data.fullname };
                    this.m3.dfsList(param).then( (rtn)=>{
                        let children = _.sortBy(rtn.message,'fullname');
                        this.$set(data, 'children', children);
                    } )
                }

            } catch(err){
                console.error(err);
            }

        },
        onEdit(data){
            this.$emit("node-click",data);
        },
        onInitTreeData(){
            let param = {parent: this.root };
            this.m3.dfsList(param).then( (rtn)=>{
                this.treeData = [{ id:-1,fullname:'/Project',name:'Project',children: _.orderBy(rtn.message, ['fullname'],['asc']), ftype:'dir'}];
            } );
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-container{
    height: calc(100vh - 220px);
  }

  .el-main{
    overflow: hidden;
  }
</style>
