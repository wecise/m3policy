<template>
  <el-container>
    <el-header>
      <entity-view 
        @bucket-selected="((data)=>{ onSetBucket(data); })"
        @entity-selected="((data)=>{ onSetEntity(data); })"></entity-view>
    </el-header>
    <el-main style="padding-top:5px;">
        <bitlog-view :bucket="bucket" :entity="entity"></bitlog-view>
    </el-main>
  </el-container>
</template>

<script>
import BitlogView from './BitlogView.vue'
import EntityView from './EntityView.vue'
export default {
  components: { BitlogView, EntityView },
  name: 'MainView',
  props: {
    global: Object
  },
  data(){
    return {
      entity: null,
      bucket: null
    }
  },
  mounted(){
    document.body.style.setProperty('overflow-y','auto','important');
  },
  methods: {
    //选择的bucket定义
    onSetBucket(data){
      this.bucket = data.children;
    },
    //选择的实体
    onSetEntity(data){
      this.entity = data;
    }
  },
  destroyed(){
    document.body.style.removeProperty('overflow-y');
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-header{
    line-height: 60px;
  }
</style>
