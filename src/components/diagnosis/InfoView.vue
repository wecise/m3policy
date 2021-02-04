<template>
  <el-container>
    <el-main>
      <el-form :label-position="labelPosition" label-width="80px">
        <el-form-item :label="k" :key="k" v-for="(v,k) in model">
          <el-input :value="v"></el-input>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
// const m3 = require("@cnwangzd/m3js");

export default {
  name: "DiagnosisView",
  props: {
    model: Object
  },
  data() {
    return {
      labelPosition: 'right',
      tabs: {
          list: [],
          activeTab: 'info'
      }
    };
  },
  created(){
    
  },
  methods: {
    

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-container{
    height: calc(100vh - 220px);
  }

</style>
