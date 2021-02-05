<template>
  <el-container>
    <el-main>
      <el-tabs v-model="tabs.activeTab" type="border-card">
        <el-tab-pane :name="item.name" :key="item.name" v-for="item in tabs.list" lazy>
          <span slot="label">{{item.title}}</span>
          <InfoView :model="model" v-if="item.type==='info'"></InfoView>
          <JournalView :model="model" v-else-if="item.type==='journal'"></JournalView>
          <AttributeRelView :model="model" :global="global" v-else-if="item.type==='attribute'"></AttributeRelView>
          <HistoryView :model="model" v-else-if="item.type==='history'"></HistoryView>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
import InfoView from './InfoView.vue';
import JournalView from './JournalView.vue';
import AttributeRelView from './AttributeRelView.vue';
import HistoryView from './HistoryView.vue';

// const m3 = require("@cnwangzd/m3js");

export default {
  name: "DiagnosisView",
  props: {
    model: Object,
    global: Object
  },
  components:{
    InfoView,
    JournalView,
    AttributeRelView,
    HistoryView
  },
  data() {
    return {
      tabs: {
          list: [],
          activeTab: 'info'
      }
    };
  },
  created(){
    this.tabs.list = [
            {name:'info',title:'告警信息',type:'info',data: this.model},
            {name:'journal',title:'告警轨迹',type:'journal', data: this.model},
            {name:'attribute',title:'维度关联性告警',type:'attribute', data: this.model},
            {name:'history',title:'历史相似告警',type:'history', data: this.model},
            {name:'topological',title:'资源分析',type:'topological', data: this.model}
          ];
  },
  methods: {
    

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
