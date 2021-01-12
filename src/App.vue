<template>
  <el-container>
    <el-header>
        M3事件控制台
      </el-header>
    <el-main>
      <MainView></MainView>
    </el-main>
  </el-container>
</template>

<script>
import MainView from './components/MainView.vue'

export default {
  name: 'app',
  components: {
    MainView
  }
}
</script>

<style scoped>
  .el-header{
    height: 60px;
    line-height: 60px;
  }
  .el-main{
    padding: 0px;
  }
</style>
