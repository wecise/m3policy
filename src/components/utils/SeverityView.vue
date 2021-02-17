<template>
  <el-container>
    <el-header>
      <el-tooltip content="新建级别">
        <el-button type="text" icon="el-icon-plus"></el-button>
      </el-tooltip>
    </el-header>
    <el-main>
      <el-table
        :data="dt.rows"
        style="width: 100%"
        ref="table"
        v-if="dt.rows">
        <el-table-column :label="item.title" :prop="item.field" sortable :key="index" v-for="(item,index) in dt.columns">
          <template slot-scope="scope" v-if="item.visible">
            <el-color-picker
              :value="scope.row.color"
              show-alpha
              v-if="item.field=='color'">
            </el-color-picker>
            <span style="font-weight:900;" v-else>{{scope.row[item['field']]}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button @click="onEdit(scope.row)" type="text">编辑</el-button>
            <el-button @click="onDelete(scope.row)" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
import _ from 'lodash';

export default {
  name: "SeverityView",
  props: {
    model: Object
  },
  data(){
    return {
      dt: {
        rows:[],
        columns: [],
        selected: []
      }
    }
  },
  created(){
    this.initData();
  },
  mounted() {
    
  },
  methods:{
    initData(){
      let term = {action:"list"};
      this.m3.callFS("/matrix/system/severity-action.js",encodeURIComponent(JSON.stringify(term))).then((rtn)=>{
        _.extend(this.dt,rtn.message);
      });
    },
    onEdit(row){
      console.log(row)
    },
    onDelete(row){
      console.log(row)
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-container{
    height: calc(100vh - 220px);
  }

  .el-header{
    height:40px!important;
    line-height:40px;
  }

</style>
