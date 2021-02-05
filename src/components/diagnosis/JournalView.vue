<template>
  <el-container>
    <el-main @dblclick.native="reverse=!reverse">
      <el-timeline :reverse="reverse">
            <el-timeline-item
            v-for="(row, index) in dt.rows"
            :key="row.id"
            :color="row.severity | pickSeverityColor"
            :timestamp="row.vtime | formatDateTime">
            消息：{{row.msg}}
            <p>
                节点：{{row.node || row.nodealias || row.host}}
            </p>
            <p>
                状态：{{row.status | pickStatus}}
            </p>
            </el-timeline-item>
        </el-timeline>
    </el-main>
  </el-container>
</template>

<script>
const m3 = require("@cnwangzd/m3js");

export default {
  name: "JournalView",
  props: {
    model: Object
  },
  data() {
    return {
      dt: {
          rows: []
      },
      reverse: true
    };
  },
  filters:{
      pickSeverityColor(val){
          return window.global.register.event.severity[val][2];
      },
      pickStatus(val){
          return window.global.register.event.status[val][1];
      },
      formatDateTime(val){
          return moment(val).format(window.global.register.format);
      }
  },
  created(){
     this.initData();
  },
  methods: {
    initData(){
        let term = encodeURIComponent(JSON.stringify(this.model).replace(/%/gi,'%25'));
        m3.callFS("/matrix/eventConsole/diagnosis/journal.js", term).then((rtn)=>{
            this.dt.rows = rtn.message;
        })
    }

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  
</style>
