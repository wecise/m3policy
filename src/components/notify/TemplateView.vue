<template>
  <el-container>
    <el-header>
      <el-tooltip content="刷新模板">
        <el-button type="text" icon="el-icon-refresh" @click="onRefresh"></el-button>
      </el-tooltip>
      <el-tooltip content="新建模板">
        <el-button type="text" icon="el-icon-plus" @click="onNew"></el-button>
      </el-tooltip>
      <!--el-tooltip content="导出模板">
        <el-button type="text" icon="el-icon-upload2"></el-button>
      </el-tooltip>
      <el-tooltip content="导入模板">
        <el-button type="text" icon="el-icon-download"></el-button>
      </el-tooltip-->
    </el-header>
    <el-main>
      <el-table
        :data="dt.rows"
        :row-class-name="rowClassName"
        @current-change="onSelectionChange"
        style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <template v-for="(item,index) in dt.columns">
          <el-table-column 
            node-key="id"
            :key="index"
            :label="item.title" 
            :prop="item.field" 
            :formatter="item.render" 
            v-if="item.visible">
          </el-table-column>
        </template>
        <el-table-column type="expand" label="模板定义" width="300">
          <template slot-scope="scope">
            <el-container>
              <el-header style="height:30px;line-height:30px;">
                <el-tooltip content="点击更新模板内容" open-delay="500">
                  <el-button type="text" icon="el-icon-refresh" @click="onUpdate(scope.row)"></el-button>
                </el-tooltip>
              </el-header>
              <el-main style="padding:0px;">
                <notify-manage-editor :render="scope.row.template" :index="scope.$index" @update:render="scope.row.template = $event"></notify-manage-editor>
              </el-main>
            </el-container>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-delete"  @click="onDelete(scope.$index, scope.row)"> 删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
import _ from 'lodash';

export default {
  name: "TemplateView",
  props: {
    model: Object
  },
  data() {
    return {
      dt: {
        rows:[],
        columns: [],
        selected: [],
        radio:''
      }
    };
  },
  created(){
     this.initData();
  },
  methods: {
    rowClassName({rowIndex}){
        return `row-${rowIndex}`;
    },
    initData(){
      this.m3.callFS("/matrix/notify/getTemplateList.js",null).then((rt)=>{
        let rtn = rt.message;

        this.$set(this.dt,'rows', rtn.rows);
        this.$set(this.dt,'columns', _.map(rtn.columns, (v)=>{
                              
          if(_.isUndefined(v.visible)){
            _.extend(v, { visible: true });
          }

          if(!v.render){
            return v;
          } else {
            return _.extend(v, { render: eval(v.render) });
          }
          
        }));
      });
    },
    onSelectionChange(val) {
      this.dt.selected = val;
      
      // 单选设置
      _.forEach(this.dt.rows,(v)=>{
        this.$set(v,'enableFlag','0');
      })
      this.$set(_.find(this.dt.rows,{name: val.name}),'enableFlag','1');
      this.dt.radio = '1';
    },
    onRefresh(){
      this.initData();
    },
    onNew(){
      
      this.$prompt('请输入模板名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        }).then(({ value }) => {

        if(_.isEmpty(value)){
          this.$message({
            type: "info",
            message: "请输入名称"
          })
          return false;
        }

        let ftype = "json";
        let attr = {remark: ""};
        let parent = `/home/${window.SignedUser_UserName}/Documents/notify`;
        let content = JSON.stringify({template: ""},null,2);

        let param = {
                      parent: parent, name: [value,ftype].join("."), 
                      data: {data: content, type: ftype, attr: attr, index: false}    
                    };
        this.m3.dfsNew(param).then(()=>{
            this.$message({
              type: "success",
              message: "新建模板成功！"
            })  
            this.initData();
        }).catch((err)=>{
            this.$message({
              type: "error",
              message: "新建模板失败 " + err.message
            })
        })
      
        
      })
      
    },
    onUpdate(item){
      
      if(_.isEmpty(item)){
        this.$message({
          type: "info",
          message: "请选择模板"
        });
        return false;
      }
      
      let ftype = item.ftype;
      let parent = item.parent;
      let name = item.name;
      let content = JSON.stringify({template:item.template},null,2);
      let attr = item.attr;
      
      let param = {
                    parent: parent, name: name, 
                    data: {data: content, type: ftype, attr: attr, index: false}    
                  };
      this.m3.dfsNew(param).then(()=>{
          this.$message({
            type: "success",
            message: "更新模板成功！"
          })  
          this.initData();
      }).catch((err)=>{
          this.$message({
            type: "error",
            message: "更新模板失败 " + err.message
          })
      })
    },
    onDelete(index,item){
      console.log(index)
      this.$confirm(`确认要删除该模板：${item.name}？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          
          let param = {parent: item.parent, name: item.name};

          this.m3.dfsDelete(param).then(()=>{
            this.$message({
                    type: 'success',
                    message: '删除模板成功!'
            });
            this.initData();
          }).catch((err)=>{
            this.$message({
                type: 'error',
                message: '删除模板失败 ' + err.message
            });
          });
          
          
      })
    }
  },
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
    padding:0px;
    overflow: hidden;
  }
</style>
