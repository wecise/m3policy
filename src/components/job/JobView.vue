<template>
  
    <el-containter>
        <el-main>
        </el-main>
    </el-containter>

</template>

<script>
// import _ from 'lodash';

export default {
  name: "JobView",
  props: {
    model: Object
  },
  data() {
    return {
        dt: {
            rows: [],
            columns: []
        }
    }
  },
  created(){
     
  },
  methods: {
    
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  
</style>
