<template>
  <el-container v-loading="loading">
    <el-main style="padding:0px 10px;">
      <el-tabs value="event-list">
        <el-tab-pane label="事件列表" name="event-list">
          <el-container>
            <el-header>
              <el-input
                placeholder="请输入内容"
                v-model="search.model.term"
                class="input-with-select"
                clearable
                @keyup.enter.native="onSearch"
              >
                <el-select
                  v-model="search.type"
                  slot="prepend"
                  placeholder="选择视图"
                >
                  <el-option
                    label="syslog"
                    value="#/matrix/devops/syslog"
                  ></el-option>
                  <el-option
                    label="event"
                    value="#/matrix/devops/alert"
                  ></el-option>
                  <el-option label="新建视图" value="new"></el-option>
                </el-select>
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="onSearch"
                ></el-button>
              </el-input>
            </el-header>
            <el-main>
              <EventList :model="search.result" :global="global"></EventList>
            </el-main>
            
          </el-container>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
const m3 = require("@cnwangzd/m3js");

import EventList from '../components/EventList.vue'

export default {
  name: "MainView",
  props: {
    global: Object,
  },
  components:{
    EventList
  },
  data() {
    return {
      loading: false,
      search: {
        type: "#/matrix/devops/alert",
        model: {
          term: "",
          view: "all",
        },
        result: null
      },
    };
  },
  created(){
    this.onSearch();
  },
  methods: {
    onSearch() {
      
      this.loading = true;

      let param = {
        view: this.search.model.view,
        term: this.search.model.term
          ? `${this.search.type} | ${this.search.model.term}`
          : this.search.type,
      };

      m3.callFS(
        "/matrix/eventConsole/event_list.js",
        encodeURIComponent(JSON.stringify(param))
      ).then( (rtn)=>{
          this.search.result = rtn.message; 
          this.loading = false;
      }).catch( ()=>{
        this.loading = false;
      } );
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.el-header {
  height: 40px!important;
  padding: 0px;
}

.el-main {
  padding: 0px;
  overflow: hidden;
}
.el-input-group__prepend > .el-select {
  width: 120px;
}
</style>
