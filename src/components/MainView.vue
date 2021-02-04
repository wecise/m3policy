<template>
  <el-container>
    <el-main style="padding:0px 10px;">
      <el-tabs v-model="tabs.activeTab" closable @tab-remove="removeTab">
        <el-tab-pane label="事件列表" name="event-list">
          <el-container>
            <el-header>
              <el-input
                placeholder="请输入内容"
                v-model="search.model.term"
                class="input-with-select"
                clearable
                @clear="onSearch"
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
            <el-main :loading="loading">
              <EventList :model="search.result" :global="global" @onSearch="onSearch"></EventList>
            </el-main>
            
          </el-container>
        </el-tab-pane>
        <el-tab-pane :name="item.name" :key="item.name" v-for="item in tabs.list">
            <span slot="label">
              <span v-if="item.callback==='DiagnosisView'">
                
                  <el-button
                      type="default"
                      :style="'position:absolute;top:15px;left:5px;padding: 5px;border-radius: 15px;color:#ffffff;background:' + global.register.event.severity[item.data.severity][2]">
                      <!-- {{ global.register.event.severity[item.data.severity][1] }} <span style="font-variant: all-small-caps;">{{global.register.event.severity[item.data.severity][0]}}</span> -->
                  </el-button>
                  {{item.title}} {{ item.data.id }}
              </span>
              <span v-else>
                 {{item.title}}
              </span>
            </span>
          <DiagnosisView :model="item.data" :global="global" v-if="item.callback==='DiagnosisView'"></DiagnosisView>
          <CtmenuKeepView :model="item.data" :global="global" v-else-if="item.callback==='CtmenuKeepView'"></CtmenuKeepView>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
import _ from 'lodash';
import $ from 'jquery';
import EventList from '../components/EventList.vue'
import DiagnosisView from '../components/diagnosis/DiagnosisView';
import CtmenuKeepView from '../components/contextmenu/CtmenuKeepView';

const m3 = require("@cnwangzd/m3js");

export default {
  name: "MainView",
  props: {
    global: Object
  },
  components:{
    EventList,
    DiagnosisView,
    CtmenuKeepView
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
      tabs: {
        activeTab: 'event-list',
        list: []
      }
    };
  },
  watch: {
    'tabs.list':{
        handler(val){
            if(val.length > 0){
                $("#tab-event-list").show();
            }else {
                $("#tab-event-list").hide();
            }
        },
        deep:true
    },
  },
  created(){
    this.onSearch();
  },
  mounted(){
    this.hideTabEventViewConsoleUl();
  },
  methods: {
    hideTabEventViewConsoleUl(){
      if($('#tab-event-list').is(':visible')) {
          $("#tab-event-list").hide();
          $("#tab-event-list > span").hide();
      } else {
          setTimeout(this.hideTabEventViewConsoleUl, 50);
      } 
    },
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
    addTab(row,menu){

      let find = _.find(this.tabs.list, {name:row.id});
      
      if(find){
        this.tabs.activeTab = row.id;
        
      } else {
        let tabObj = {name: row.id, title: menu.name, type: menu.type, callback: menu.callback, data: row};
        this.tabs.list.push(tabObj);
        this.tabs.activeTab = row.id;
      }

      
    },
    removeTab(targetName){
      let tabs = this.tabs.list;
        let activeName = this.tabs.activeTab;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              } else {
                activeName = 'event-list';
              }
            }
          });
        }
        
        this.tabs.activeTab = activeName;
        this.tabs.list = tabs.filter(tab => tab.name !== targetName);
    }
  }
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
