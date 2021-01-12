<template>
  <el-container>
    <el-header>
        <el-input
          placeholder="请输入内容"
          v-model="search.name"
          class="input-with-select"
          clearable
          size="large"
          @keyup.enter.native="onSearch"
        >
          <el-select
            v-model="search.type"
            slot="prepend"
            placeholder="选择视图"
          >
            <el-option label="syslog" value="syslog"></el-option>
            <el-option label="event" value="event"></el-option>
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
      
      <el-table>

      </el-table>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'MainView',
  props: {
    msg: String
  },
  data(){
    return {
      search: {
        term: "",
        type: ""
      }
    }
  },
  methods: {
    onSearch(){

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-container{
    
  }
  .el-header{
    height: 60px;
    line-height: 60px;
    padding: 0px;
  }
  .el-input-group__prepend > .el-select {
    width: 120px;
  }
</style>
