<template>
  <el-container>
    <el-aside>
        <el-container>
          <el-header>
          </el-header>
          <el-main>
              <el-tree 
                node-key="id"
                :data="tree.data" 
                :props="tree.defaultProps" 
                @node-click="onNodeClick"
                style="background:transparent;"
                ref="tree">
                <span slot-scope="{ node, data }" style="width:100%;height:30px;line-height: 30px;"  @mouseenter="onMouseEnter(data)" @mouseleave="onMouseLeave(data)">
                  <span>{{node.label}}</span>
                  <el-button v-show="data.show" type="text" @click="delNode(data,$event)" style="float:right;width:14px;margin:0 5px;" icon="el-icon-delete"></el-button>
                  <el-button v-show="data.show" type="text" @click="newNode(data,$event)" style="float:right;width:14px;margin:0 5px;" icon="el-icon-plus"></el-button>
                  <el-button v-show="data.show" type="text" @click="newGroup(data,$event)" style="float:right;width:14px;margin:0 5px;" icon="el-icon-folder-add"></el-button>
                  <el-button v-show="data.show" type="text" @click="refresh(data,$event)" style="float:right;width:14px;margin:0 5px;" icon="el-icon-refresh"></el-button>
                </span>   
              </el-tree>
          </el-main>
        </el-container>
    </el-aside>  

    <el-container>
        <el-header style="height:40px;line-height:40px;">
          <el-tooltip content="删除选择的分类">
            <el-button type="text" icon="el-icon-delete"></el-button>
          </el-tooltip>
          <el-tooltip content="导出">
            <el-button type="text" icon="el-icon-download"></el-button>
          </el-tooltip>
          <el-tooltip content="导入">
            <el-button type="text" icon="el-icon-upload2"></el-button>
          </el-tooltip>
        </el-header>
        <el-main  style="padding:0px;height:100%;">
          <el-table
            :data="dt.rows"
            style="width: 100%">
            <el-table-column type="index"></el-table-column>
            <template v-for="(item,index) in dt.columns">
              <el-table-column 
                :label="item.title" 
                :prop="item.field" 
                :key="index"
                v-if="item.visible"></el-table-column>
            </template>
          </el-table>
        </el-main>
    </el-container>
  </el-container>
</template>

<script>

export default {
  name: "ClassifiedView",
  props: {
    
  },
  data() {
    return {
      tree: {
        data: [
          {
            id: "1",
            label: '主机事件',
            show: false,
            children: [
              {
                id: "11",
                label: '主机硬件',
                show: false,
                param: `alerttype="1"`,
                children: []
              },
              {
                id: "12",
                label: '主机系统',
                show: false,
                param: `alerttype="2"`,
                children: []
              },
              {
                id: "13",
                label: '主机DB2',
                show: false,
                param: `alerttype="3"`,
                children: []
              }
            ]
          }, 
          {
            id: "2",
            label: '开放事件',
            children: [
              {
                id: "21",
                label: '开放硬件',
                show: false,
                param: `alerttype="1"`,
                children: []
              },
              {
                id: "22",
                label: '开放系统',
                show: false,
                param: `alerttype="2"`,
                children: []
              },
              {
                id: "3",
                label: '开放DB2',
                show: false,
                param: `alerttype="3"`,
                children: []
              }
            ]
          }
        ],
        defaultProps:{
          children: 'children',
                label: 'label'
        }
      },
      dt: {
        rows:[{
          id: '1',
          class: "/matrix/system/notify",
          name: '运维开放',
          status: '1',
          param: `alerttype='1'`,
          config: ''
        },
        {
          id: '2',
          class: "/matrix/system/notify",
          name: '运维主机',
          status: '1',
          param: `alerttype='1'`,
          config: ''
        }],
        columns: [
          {
            field: "id",
            title: "ID",
            width: 120,
            visible:false
          },
          {
            field: "class",
            title: "CLASS",
            width: 120,
            visible:false
          },
          {
            field: "name",
            title: "规则名称",
            width: 160,
            visible: true
          },
          {
            field: "param",
            title: "规则定义",
            visible: true
          },
          {
            field: "config",
            title: "其它",
            width: 160,
            visible: true
          }],
        selected: []
      }
    };
  },
  created(){
     
  },
  methods: {
    onNodeClick(){

    },
    newNode(){

    },
    delNode(){
      
    },
    newGroup(){
      
    },
    refresh(){

    },
    onMouseEnter(data){
      this.$set(data, 'show', true)
    },
    onMouseLeave(data){
      this.$set(data, 'show', false)
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-container{
    height: calc(100vh - 220px)!important;
    background: #ffffff;
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
