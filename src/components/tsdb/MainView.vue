<template>
  <el-container>
    <el-header style="display:none;">
      <entity-view 
        @bucket-selected="((data)=>{ onSetBucket(data); })"
        @entity-selected="((data)=>{ onSetEntity(data); })"></entity-view>
    </el-header>
    <el-main style="padding-top:5px;">
        <tsdb-view :bucket="bucket" :entity="entity"></tsdb-view>
    </el-main>
  </el-container>
</template>

<script>
import TsdbView from './TsdbView.vue';
import EntityView from './EntityView.vue';

export default {
  components: { TsdbView, EntityView },
  name: 'MainView',
  props: {
    model: String
  },
  data(){
    return {
      entity: null,
      bucket: null
    }
  },
  watch: {
    model:{
      handler(val){
        this.init(val);
      },
      immediate: true
    }
  },
  mounted(){
    document.body.style.setProperty('overflow-y','auto','important');
  },
  methods: {
    // 根据实体初始化bucket
    init(value){
      let param = encodeURIComponent(value);
      this.m3.callFS("/matrix/m3event/diagnosis/tsdb/getBucketByEntity.js", param).then( rtn=>{
          this.bucket = rtn.message.bucket;
          this.entity = rtn.message.entity;
      })
    },
    //选择的bucket定义
    onSetBucket(data){
      this.bucket = data;
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
