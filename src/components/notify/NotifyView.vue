<template>
  <el-container>
    <el-main>
        <el-tabs value="rule" type="border-card">
            <el-tab-pane label="通知规则" name="rule">
                <NotifyRuleView></NotifyRuleView>
            </el-tab-pane>
            <el-tab-pane label="分类管理" name="classified">
                <ClassifiedView></ClassifiedView>
            </el-tab-pane>
            <el-tab-pane label="模版管理" name="template">
                <TemplateView></TemplateView>
            </el-tab-pane>
            <el-tab-pane label="声音媒介" name="media">
                <MediaView></MediaView>
            </el-tab-pane>
        </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
import NotifyRuleView from './NotifyRuleView';
import TemplateView from './TemplateView';
import MediaView from './MediaView';
import ClassifiedView from './ClassifiedView';

export default {
  name: "NotifyView",
  props: {
    model: Object
  },
  components: {
    NotifyRuleView,
    TemplateView,
    MediaView,
    ClassifiedView
  },
  data() {
    return {
      dt: {
          rows: []
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
    height: calc(100vh - 115px);
  }
  .el-main{
    overflow: hidden;
  }
</style>
