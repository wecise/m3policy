<template>
  <el-container>
    <el-header>
        <el-button type="success" icon="el-icon-plus" @click="onNew">新建视图</el-button>
    </el-header>
    <el-main>
      <el-radio-group v-model="view.activeName" @change="onChange">
          <el-radio :label="item.name" :key="index" v-for="(item,index) in dt.rows">
              <el-card :body-style="{ padding: '20px' }" style="text-align: center;padding:0px;">
                  <el-dropdown style="position: absolute;right: 15px;top: 30px;">
                    <span class="el-dropdown-link">
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>编辑</el-dropdown-item>
                      <el-dropdown-item @click.native="onDelete(item)" divided>删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <span class="el-icon-bank-card" style="font-size:65px;padding:0px 65px;color:rgba(0,0,0,.5)"></span>
                  <div style="text-align: left;">
                      <p>
                        视图名称：{{item.name}}
                      </p>
                      <p>
                        创建时间:{{  item.ctime | formatTime}}
                      </p>
                  </div>
              </el-card>
          </el-radio>
      </el-radio-group>
    </el-main>
  </el-container>
</template>

<script>

export default {
  name: "DashView",
  props: {
    
  },
  data() {
    return {
      dt: {
          rows: []
      },
      view: {
        activeName: ""
      }
    };
  },
  filters:{
    formatTime(value){
      return new Date(value).toLocaleString();//format(window.global.register.format);
    }
  },
  created(){
     this.initData();
  },
  methods: {
    initData(){
        let term = encodeURIComponent(JSON.stringify({  action: "list"  }));
        this.m3.callFS("/matrix/eventConsole/view/action.js", term).then((rtn)=>{
            this.dt.rows = rtn.message;
        })
    },
    onNew(){
      let term = encodeURIComponent(JSON.stringify({  action: "add"  }));
      this.m3.callFS("/matrix/eventConsole/view/action.js", term).then((rtn)=>{
          this.dt.rows = rtn.message;
      })
    },
    onChange(val){
      console.log(val)
    },
    onDelete(){

    }

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-container{
    height: calc(100vh - 220px);
  }
</style>
