<template>
  
    <el-container>
        <el-header style="height:auto!important;min-height:60px!important;">
            <el-dropdown style="position:absolute;top:5px;left:15px;" trigger="click">
                <span class="el-dropdown-link">
                    <i class="el-icon-s-grid el-icon--right" style="cursor:pointer;padding-top:10px;font-size:16px;"></i>
                </span>
                <el-dropdown-menu slot="dropdown" style="width:30vw;padding:20px;">
                    <el-container>
                        <el-header style="line-height: 60px;" v-show="attr.dt.selected.length > 1">
                            <span style="float:right;">
                                <el-button type="success" @click="onAttrSelect(';')">选择（OR）</el-button>
                                <el-button type="warning" @click="onAttrSelect('|')">选择（AND）</el-button>
                            </span>
                        </el-header>
                        <el-header style="line-height: 60px;" v-show="attr.dt.selected.length == 1">
                            <span style="float:right;">
                                <el-button type="primary" @click="onAttrSelect(',')">选择</el-button>
                            </span>
                        </el-header>
                        <el-main style="padding: 10px 0 0 0;">
                            <el-table
                                ref="attrTable"
                                border
                                :data="attr.dt.rows"
                                tooltip-effect="dark"
                                style="width: 100%"
                                @selection-change="onAttrSelectionChange">
                                <el-table-column
                                    type="selection"
                                    width="55">
                                </el-table-column>
                                <el-table-column
                                    prop="name"
                                    label="属性"
                                    width="120">
                                </el-table-column>
                                <el-table-column
                                    prop="value"
                                    label="值">
                                </el-table-column>
                            </el-table>
                        </el-main>
                    </el-container>
                </el-dropdown-menu>
            </el-dropdown>
            <div class="tag-box" v-if="attr.tag.list.length > 0">
                <el-tag 
                    class="tag-box-item"
                    :key="index" 
                    v-for="(tag,index) in attr.tag.list"
                    :type="attr.tag.type"
                    effect="dark"
                    closable
                    @close="onAttrTagClose(tag)">{{tag}}</el-tag>
            </div>
        </el-header>
        <el-main style="padding:0px;overflow:hidden;">
            <EventList :model="result.dt" :global="global" :options="result.dt.options" v-if="result.dt.rows"></EventList>
        </el-main>
    </el-container>

</template>

<script>
import EventList from '../EventList.vue'
import _ from 'lodash';
const m3 = require("@cnwangzd/m3js");

export default {
  name: "AttributeRelView",
  props: {
    model: Object,
    global: Object
  },
  components:{
    EventList
  },
  data() {
    return {
      dt: {
          rows: []
      },
      attr:{
          dt: {
              // 属性列表
              rows: [],
              // 选择的属性
              selected: []
          },
          // 根据选择的属性生成的tag条件
          tag: {
              list:[],
              type: _.sample(['success','info','danger','warning'])
          }
      },
      result: {
          dt: {
              rows: [],
              columns: [],
              options:{
                  header:false,
                  dtContainerHeight: '320px',
                }
          }
      }
    };
  },
  watch:{
      'attr.tag.list':{
          handler(val){
            if(_.isEmpty(val)) {
                this.result.dt.rows = [];
                return false;
            }
            this.onSearchByTags(val);
          }
      }
  },
  created(){
     this.initData();
     this.onTip();
  },
  methods: {
    initData(){
        let term = encodeURIComponent(JSON.stringify(this.model).replace(/%/gi,'%25'));
        m3.callFS("/matrix/eventConsole/diagnosis/journal.js", term).then((rtn)=>{
            this.dt.rows = rtn.message;
        })

        this.attr.dt.rows = _.compact(_.map(this.model, (v,k)=>{
                                if(!v) return;
                                return {name:k, value:v};
                            }));
    },
    onAttrSelectionChange(val){
        this.attr.dt.selected = val;
    },
    onAttrSelect(val){
        let selected = _.map(this.attr.dt.selected, (v)=>{
            return `${v.name}=${v.value}`;
        }).join(` ${val} `);
        
        if( _.indexOf(this.attr.tag.list,selected) !== -1 ) {
            return;
        } else {
            this.attr.tag.list.push( selected );
        }

        this.attr.dt.selected = [];
        this.$refs.attrTable.clearSelection();
    },
    onAttrTagClose(tag){
        this.attr.tag.list.splice(this.attr.tag.list.indexOf(tag), 1);
    },
    onSearchByTags(val){
        let term = encodeURIComponent(JSON.stringify(  val.join(" | ") ).replace(/%/gi,'%25'));
        m3.callFS("/matrix/eventConsole/diagnosis/attributeRel.js", term).then( (rtn)=>{
            this.result.dt = rtn.message;
        } )
    },
    onTip(){
        const h = this.$createElement;
        this.$notify({
          title: '多维度关联性告警',
          message: h('i', { style: 'color: teal'}, '选则当前告警属性，可多选、可单选，通过选择不同的属性组合进行关联告警的查找、分析，从而通过相关告警快速定位问题所在。')
        });
    }

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-container{
    height:calc(100vh - 220px);
}

.el-main{
    padding:0px;
}

  .tag-box{
    display: flex;
    flex-wrap: wrap;
    height:100px!important;
    align-items: center;
  }
  .tag-box-item{
      margin: 5px;
  }
</style>
