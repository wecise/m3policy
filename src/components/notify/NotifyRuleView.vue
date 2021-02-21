<template>
  <el-container>
    <el-header>
      <el-tooltip content="刷新">
        <el-button type="text" icon="el-icon-refresh" @click="onRefresh"></el-button>
      </el-tooltip>
      <el-tooltip content="新建规则">
        <el-button type="text" icon="el-icon-plus" @click="onNew"></el-button>
      </el-tooltip>
      <!--el-tooltip content="导出规则">
        <el-button type="text" icon="el-icon-upload2"></el-button>
      </el-tooltip>
      <el-tooltip content="导入规则">
        <el-button type="text" icon="el-icon-download"></el-button>
      </el-tooltip-->
    </el-header>
    <el-main>
      <el-table
        :data="dt.rows"
        stripe
        :row-class-name="rowClassName"
        style="width: 100%">
        <template v-for="(item,index) in dt.columns">
          <el-table-column 
            node-key="id"
            :label="item.title" 
            :prop="item.field" 
            :formatter="item.render"
            :key="index"
            v-if="item.visible">
          </el-table-column>
        </template>
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
  name: "NotifyRuleView",
  props: {
    model: Object
  },
  data() {
    return {
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
      this.m3.callFS("/matrix/notify/getRuleList.js").then((rt)=>{
        let rtn = rt.message;

        _.extend(rtn, {columns: _.map(rtn.columns, (v)=>{
                            
          if(_.isUndefined(v.visible)){
            _.extend(v, { visible: true });
          }

          if(!v.render){
            return v;
          } else {
            return _.extend(v, { render: eval(v.render) });
          }
          
        })});
        _.extend(this.dt, rtn);
      })
    },
    rowClassName({rowIndex}){
        return `row-${rowIndex}`;
    },
    onRefresh(){
      this.initData();
    },
    onNew(){
      
      this.$prompt('请输入规则名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        }).then(({ value }) => {

        if(_.isEmpty(value)){
          this.$message({
            type: "info",
            message: "请输入规则名称"
          })
          return false;
        }

        let term = encodeURIComponent(JSON.stringify({
                    action: "new",
                    model: {
                      name: value,
                      persons:"",
                      rtype:"",
                      situation:"",
                      status:1,
                      template:""
                    }
                  }));

        this.m3.callFS("/matrix/notify/ruleAction.js",term).then(()=>{
          this.$message({
            type: "success",
            message: "新建规则成功！"
          })
          this.initData();
        });
      })
    },
    onDelete(index,item){
      console.log(index);
      this.$confirm(`确认要删除该规则：${item.name}？`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
        
        let term = encodeURIComponent(JSON.stringify({action:"delete",model:item}));
        this.m3.callFS("/matrix/notify/ruleAction.js",term).then(()=>{
          this.$message({
                type: 'success',
                message: '删除规则成功!'
          })

          this.initData();
        }).catch((err)=>{
          this.$message({
              type: 'error',
              message: '删除规则失败 ' + err.message
          });
        });
          
      })
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
    padding:0px;
    overflow: hidden;
  }
</style>
