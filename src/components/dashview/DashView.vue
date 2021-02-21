<template>
  <el-container>
    <el-header>
        <el-button type="default" icon="el-icon-refresh" @click="onRefresh">刷新</el-button>
        <el-button type="success" icon="el-icon-plus" @click="onNew">新建</el-button>
    </el-header>
    <el-main>
      
      <el-card :body-style="{ padding: '20px' }" 
          style="text-align: center;padding:0px;" :key="index" v-for="(item,index) in dt.rows"
          @dblclick.native="onEdit(item)">
          <el-dropdown style="position: absolute;right: 5px;top: 5px;cursor:pointer;">
            <span class="el-dropdown-link">
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="onEdit(item)">编辑</el-dropdown-item>
              <el-dropdown-item @click.native="onDelete(item)" divided>删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span class="el-icon-bank-card" style="font-size:65px;padding:0px 65px;color:rgba(0,0,0,.5)"></span>
          <div style="text-align: left;">
              <p>
                视图名称：{{item.name | formatName}}
              </p>
              <p>
                创建时间:{{  item.ctime | formatTime}}
              </p>
          </div>
      </el-card>
    </el-main>
    <EditView :show.sync="edit.show" :model="dt.selected" ref="editView" v-if="edit.show" @dialog:close="onClose"></EditView>
  </el-container>
</template>

<script>
import EditView from './EditView';
import _ from 'lodash';

export default {
  name: "DashView",
  props: {
    global:Object,
    model: Object
  },
  components:{
    EditView
  },
  data() {
    return {
      dt: {
        rows:[],
        selected: null
      },
      edit:{
        show: false
      }
    };
  },
  filters:{
    formatTime(value){
      return new Date(value).toLocaleString();//format(window.global.register.format);
    },
    formatName(value){
      return value.split(".")[0];
    }
  },
  created(){
     this.initData();
  },
  methods: {
    initData(){
        let term = encodeURIComponent(JSON.stringify({  action: "list"  }));
        this.m3.callFS("/matrix/eventConsole/view/action.js", term).then((rtn)=>{
            this.dt.rows = _.orderBy(rtn.message,['name'],['asc']);
            this.edit.show = false;
        })
    },
    onRefresh(){
      this.initData();
    },
    onNew(){
      let term = encodeURIComponent(JSON.stringify({  action: "add", data:this.m3.EventViewDataObj }));
      this.m3.callFS("/matrix/eventConsole/view/action.js", term).then((rtn)=>{
          this.dt.rows = rtn.message;
          this.onRefresh();
      })
    },
    onEdit(item){
      this.dt.selected = item;
      this.edit.show = true;
    },
    onDelete(item){
      this.$confirm('确定要删除该视图, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        /* let term = encodeURIComponent(JSON.stringify({  action: "delete", data: item  }));
        this.m3.callFS("/matrix/eventConsole/view/action.js", term).then((rtn)=>{
            this.dt.rows = rtn.message;
        }) */
        this.m3.dfsDelete(item).then(()=>{
          this.$message({
            type: "success",
            message: "删除成功"
          })
          this.onRefresh();
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
    },
    onClose(){
      this.edit.show = false;
      this.onRefresh();
    }

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-container{
    height: calc(100vh - 115px);
  }
  .el-header{
    line-height: 60px;
  }
  .el-main{
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    align-content: flex-start;
  }
  .el-card {
    position: relative;
    width: 20em;
    height: 15em;
    margin: 10px;
  }

  
</style>
