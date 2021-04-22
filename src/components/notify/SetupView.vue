<template>
  <el-container>
    <el-main>
        <Split :direction="vertical">
            <SplitArea :size="20" :minSize="0" style="overflow:hidden;">
                <el-container>
                  <el-main>
                      <el-tree :data="treeData" 
                            :props="defaultProps" 
                            node-key="fullname"
                            highlight-current
                            default-expand-all
                            auto-expand-parent
                            @node-click="onNodeClick"
                            :expand-on-click-node="false"
                            style="background: #f2f2f2;height: 100%;"
                            ref="tree">
                        <span slot-scope="{ node, data }" style="width:100%;height:30px;line-height: 30px;">
                            <span v-if="data.ftype=='dir'">
                                <i class="el-icon-folder" style="color:#FFC107;"></i> 
                                <span v-if="data.content"> {{data.content.info.title}}</span>
                                <span v-else> {{node.label}}</span>
                            </span>
                            <span v-else>
                                <i class="el-icon-c-scale-to-original" style="color:#0088cc;"></i>
                                <span v-if="data.content"> {{data.content.info.title}}</span>
                                <span v-else> {{node.label}}</span>
                            </span>
                        </span>  
                    </el-tree>
                  </el-main>
                </el-container>
            </SplitArea>
            <SplitArea :size="80" :minSize="0" style="overflow:hidden;">
                <el-container>
                    <el-header>
                      <el-tooltip content="刷新">
                        <el-button type="text" icon="el-icon-refresh" @click="onRefresh"></el-button>
                      </el-tooltip>
                      <el-tooltip content="新建服务">
                        <el-button type="text" icon="el-icon-plus" @click="onNew"></el-button>
                      </el-tooltip>
                    </el-header>
                    <el-main>
                      <el-table
                        :data="dt.rows"
                        stripe
                        style="width: 100%">
                        <template v-for="(item,index) in dt.columns">
                            <el-table-column 
                                :prop="item.field"
                                :label="item.title" 
                                sortable 
                                show-overflow-tooltip
                                :key="index"
                                :width="item.width"
                                :formatter="item.render"
                                v-if="item.visible">
                                <template slot-scope="scope">
                                    <div style="height:30px;line-height:30px;" v-if="item.field=='tags'">
                                        <TagView domain='notifyRule' :model.sync="scope.row.tags" :id="scope.row.id" :limit="1"></TagView>
                                    </div>
                                    <div v-html='item.render(scope.row, scope.column, scope.row[item.field], scope.$index)' 
                                        v-else-if="typeof item.render === 'function'">
                                    </div>
                                    <div v-else>
                                        {{scope.row[item.field]}}
                                    </div>
                                </template>
                            </el-table-column>
                        </template>
                        <el-table-column label="操作">
                          <template slot-scope="scope">
                            <el-button type="text" icon="el-icon-edit"  @click="onEdit(scope.$index, scope.row)"> 编辑</el-button>
                            <el-button type="text" icon="el-icon-delete"  @click="onDelete(scope.$index, scope.row)"> 删除</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-main>
                  </el-container>
            </SplitArea>
        </Split>
    </el-main>
  </el-container>

</template>

<script>
import _ from 'lodash';

export default {
  name: "SetupView",
  props: {
    model: Object
  },
  data() {
    return {
      root: '/script/matrix/eventConsole/notify/server',
      defaultProps: {
          children: 'children',
          label: 'name'
      },
      treeData: [],
      dt: {
        rows:[],
        columns: [],
        selected: []
      }
    };
  },
  created(){
     this.initData();
  },
  methods: {
    initData(){
        let param = {parent: this.root , fullname: this.root};
        this.m3.dfsList(param).then( res=>{
            var tmp = [];
            _.forEach(res.message,v=>{
          
              this.m3.dfsRead(v).then(r=>{
                  tmp.push(_.extend(v, {content:JSON.parse(r.message)}));
              }).catch(err=>{
                  tmp.push(_.extend(v, {content:err}));
              })
                
            });
            setTimeout(()=>{
              this.treeData = [{ id:-1,fullname:this.root,parent:this.root, name:'服务设置',children: _.orderBy(tmp, ['fullname'],['asc']), ftype:'dir'}];
            },500)
            
        } );
    },
    onNodeClick(node){
      this.dt.columns = [];
      
      this.m3.dfsRead(node).then(res=>{
        let rt = JSON.parse(res.message);
        this.dt.rows = rt.rows;
        this.dt.columns = _.map(rt.columns,v=>{
          if(_.isUndefined(v.visible)){
              _.extend(v, { visible: true });
          }

          if(!v.render){
              return v;
          } else {
              return _.extend(v, { render: eval(v.render) });
          }
        });  
      })
    },
    onRefresh(){
      this.initData();
    },
    onNew(){

    },
    onEdit(index,row){
      console.log(index,row)
    },
    onDelete(index,row){
      console.log(index,row)
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-container{
    height: calc(100vh - 220px)!important;
  }
  .el-header{
    height:40px!important;
    line-height:40px;
  }
  .el-main{
    padding: 0px;
    overflow: hidden;
  }
</style>
