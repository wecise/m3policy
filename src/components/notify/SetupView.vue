<template>
  <el-container>
    <el-main>
        <el-tabs value="email" type="border-card">
          <el-tab-pane label="邮件配置" name="email">
              <el-form :model="rtype.data.email"  label-width="100px">
                <el-form-item label="SMTP地址" prop="address">
                  <el-input v-model="rtype.data.email.address"></el-input>
                </el-form-item>
                <el-form-item label="端口" prop="port">
                  <el-input v-model="rtype.data.email.port"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="rtype.data.email.username"></el-input>
                </el-form-item>
                <el-form-item label="用户口令" prop="password">
                  <el-input v-model="rtype.data.email.password"></el-input>
                </el-form-item>
                <el-form-item label="定时器" prop="cron">
                  <el-input v-model="rtype.data.email.cron"></el-input>
                </el-form-item>
                <el-form-item label="服务器" prop="group">
                  <el-input v-model="rtype.data.email.group"></el-input>
                </el-form-item>
                <el-form-item label="开启日志" prop="log">
                  <el-switch v-model="rtype.data.email.log"></el-switch>
                </el-form-item>
                <el-form-item label="重试间隔" prop="retry_interval">
                  <el-input-number v-model="rtype.data.email.retry_interval"></el-input-number>
                </el-form-item>
                <el-form-item label="重试次数" prop="retry_num">
                  <el-input-number v-model="rtype.data.email.retry_num"></el-input-number>
                </el-form-item>
                <el-form-item label="发送数量" prop="send_num">
                  <el-input-number v-model="rtype.data.email.send_num"></el-input-number>
                </el-form-item>
              </el-form>
          </el-tab-pane>

          <el-tab-pane label="短信配置" name="sms">
            <el-form :model="rtype.data.sms"  label-width="100px">
                
                <el-form-item label="接口类型">
                  <el-radio-group v-model="rtype.data.sms.type">
                    <el-radio label="netgate">网关</el-radio>
                    <el-radio label="jdbc">JDBC</el-radio>
                    <el-radio label="rest">REST</el-radio>
                  </el-radio-group>
                </el-form-item>

                <template v-if="rtype.data.sms.type==='netgate'">

                  <el-form-item label="地址" prop="address">
                    <el-input v-model="rtype.data.sms.netgate.address"></el-input>
                  </el-form-item>
                  <el-form-item label="端口" prop="port">
                    <el-input v-model="rtype.data.sms.netgate.port"></el-input>
                  </el-form-item>
                  <el-form-item label="用户名" prop="username">
                    <el-input v-model="rtype.data.sms.netgate.username"></el-input>
                  </el-form-item>
                  <el-form-item label="用户口令" prop="password">
                    <el-input v-model="rtype.data.sms.netgate.password"></el-input>
                  </el-form-item>
                  <el-form-item label="定时器" prop="cron">
                    <el-input v-model="rtype.data.sms.netgate.cron"></el-input>
                  </el-form-item>
                  <el-form-item label="服务器" prop="group">
                    <el-input v-model="rtype.data.sms.netgate.group"></el-input>
                  </el-form-item>
                  <el-form-item label="开启日志" prop="log">
                    <el-switch v-model="rtype.data.sms.netgate.log"></el-switch>
                  </el-form-item>
                  <el-form-item label="重试间隔" prop="retry_interval">
                    <el-input-number v-model="rtype.data.sms.netgate.retry_interval"></el-input-number>
                  </el-form-item>
                  <el-form-item label="重试次数" prop="retry_num">
                    <el-input-number v-model="rtype.data.sms.netgate.retry_num"></el-input-number>
                  </el-form-item>
                  <el-form-item label="发送数量" prop="send_num">
                    <el-input-number v-model="rtype.data.sms.netgate.send_num"></el-input-number>
                  </el-form-item>

                </template>
                <template v-if="rtype.data.sms.type==='jdbc'">
                  
                   <el-form-item label="Driver" prop="driver">
                      <el-input v-model="rtype.data.sms.jdbc.driver"></el-input>
                    </el-form-item>
                  <el-form-item label="Url" prop="url">
                    <el-input v-model="rtype.data.sms.jdbc.url"></el-input>
                  </el-form-item>
                  <el-form-item label="用户名" prop="username">
                    <el-input v-model="rtype.data.sms.jdbc.username"></el-input>
                  </el-form-item>
                  <el-form-item label="用户口令" prop="password">
                    <el-input v-model="rtype.data.sms.jdbc.password"></el-input>
                  </el-form-item>
                  <el-form-item label="定时器" prop="cron">
                    <el-input v-model="rtype.data.sms.jdbc.cron"></el-input>
                  </el-form-item>
                  <el-form-item label="服务器" prop="group">
                    <el-input v-model="rtype.data.sms.jdbc.group"></el-input>
                  </el-form-item>
                  <el-form-item label="开启日志" prop="log">
                    <el-switch v-model="rtype.data.sms.jdbc.log"></el-switch>
                  </el-form-item>
                  <el-form-item label="重试间隔" prop="retry_interval">
                    <el-input-number v-model="rtype.data.sms.jdbc.retry_interval"></el-input-number>
                  </el-form-item>
                  <el-form-item label="重试次数" prop="retry_num">
                    <el-input-number v-model="rtype.data.sms.jdbc.retry_num"></el-input-number>
                  </el-form-item>
                  <el-form-item label="发送数量" prop="send_num">
                    <el-input-number v-model="rtype.data.sms.jdbc.send_num"></el-input-number>
                  </el-form-item>

                </template>
                <template v-if="rtype.data.sms.type==='rest'">
                  
                  <el-form-item label="URL" prop="url">
                    <el-input v-model="rtype.data.sms.rest.url"></el-input>
                  </el-form-item>
                  <el-form-item label="端口" prop="port">
                    <el-input v-model="rtype.data.sms.rest.port"></el-input>
                  </el-form-item>
                  <el-form-item label="用户名" prop="username">
                    <el-input v-model="rtype.data.sms.rest.username"></el-input>
                  </el-form-item>
                  <el-form-item label="用户口令" prop="password">
                    <el-input v-model="rtype.data.sms.rest.password"></el-input>
                  </el-form-item>
                  <el-form-item label="定时器" prop="cron">
                    <el-input v-model="rtype.data.sms.rest.cron"></el-input>
                  </el-form-item>
                  <el-form-item label="服务器" prop="group">
                    <el-input v-model="rtype.data.sms.rest.group"></el-input>
                  </el-form-item>
                  <el-form-item label="开启日志" prop="log">
                    <el-switch v-model="rtype.data.sms.rest.log"></el-switch>
                  </el-form-item>
                  <el-form-item label="重试间隔" prop="retry_interval">
                    <el-input-number v-model="rtype.data.sms.rest.retry_interval"></el-input-number>
                  </el-form-item>
                  <el-form-item label="重试次数" prop="retry_num">
                    <el-input-number v-model="rtype.data.sms.rest.retry_num"></el-input-number>
                  </el-form-item>
                  <el-form-item label="发送数量" prop="send_num">
                    <el-input-number v-model="rtype.data.sms.rest.send_num"></el-input-number>
                  </el-form-item>

                </template>
              </el-form>
          </el-tab-pane>

          <el-tab-pane label="微信配置" name="wechat">
            
            <el-form :model="rtype.data.wechat"  label-width="100px">
                <el-form-item label="地址" prop="address">
                  <el-input v-model="rtype.data.wechat.address"></el-input>
                </el-form-item>
                <el-form-item label="端口" prop="port">
                  <el-input v-model="rtype.data.wechat.port"></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="rtype.data.wechat.username"></el-input>
                </el-form-item>
                <el-form-item label="用户口令" prop="password">
                  <el-input v-model="rtype.data.wechat.password"></el-input>
                </el-form-item>
                <el-form-item label="定时器" prop="cron">
                  <el-input v-model="rtype.data.wechat.cron"></el-input>
                </el-form-item>
                <el-form-item label="服务器" prop="group">
                  <el-input v-model="rtype.data.wechat.group"></el-input>
                </el-form-item>
                <el-form-item label="开启日志" prop="log">
                  <el-switch v-model="rtype.data.wechat.log"></el-switch>
                </el-form-item>
                <el-form-item label="重试间隔" prop="retry_interval">
                  <el-input-number v-model="rtype.data.wechat.retry_interval"></el-input-number>
                </el-form-item>
                <el-form-item label="重试次数" prop="retry_num">
                  <el-input-number v-model="rtype.data.wechat.retry_num"></el-input-number>
                </el-form-item>
                <el-form-item label="发送数量" prop="send_num">
                  <el-input-number v-model="rtype.data.wechat.send_num"></el-input-number>
                </el-form-item>
              </el-form>

          </el-tab-pane>

        </el-tabs>
        <!-- <Split :direction="vertical">
            <SplitArea :size="20" :minSize="0" style="overflow:hidden;">
                <el-container>
                  <el-main>
                      <el-tree :data="treeData" 
                            :props="defaultProps" 
                            node-key="fullname"
                            highlight-current
                            default-expand-all
                            auto-expand-parent
                            @node-click="onNodeClick"
                            :expand-on-click-node="false"
                            style="background: #f2f2f2;height: 100%;"
                            ref="tree">
                        <span slot-scope="{ node, data }" style="width:100%;height:30px;line-height: 30px;">
                            <span v-if="data.ftype=='dir'">
                                <i class="el-icon-folder" style="color:#FFC107;"></i> 
                                <span v-if="data.content"> {{data.content.info.title}}</span>
                                <span v-else> {{node.label}}</span>
                            </span>
                            <span v-else>
                                <i class="el-icon-c-scale-to-original" style="color:#0088cc;"></i>
                                <span v-if="data.content"> {{data.content.info.title}}</span>
                                <span v-else> {{node.label}}</span>
                            </span>
                        </span>  
                    </el-tree>
                  </el-main>
                </el-container>
            </SplitArea>
            <SplitArea :size="80" :minSize="0" style="overflow:hidden;">
                <el-container>
                    <el-header>
                      <el-tooltip content="刷新">
                        <el-button type="text" icon="el-icon-refresh" @click="onRefresh"></el-button>
                      </el-tooltip>
                      <el-tooltip content="新建服务">
                        <el-button type="text" icon="el-icon-plus" @click="onNew"></el-button>
                      </el-tooltip>
                    </el-header>
                    <el-main>
                      <el-table
                        :data="dt.rows"
                        stripe
                        style="width: 100%">
                        <template v-for="(item,index) in dt.columns">
                            <el-table-column 
                                :prop="item.field"
                                :label="item.title" 
                                sortable 
                                show-overflow-tooltip
                                :key="index"
                                :width="item.width"
                                :formatter="item.render"
                                v-if="item.visible">
                                <template slot-scope="scope">
                                    <div style="height:30px;line-height:30px;" v-if="item.field=='tags'">
                                        <TagView domain='notifyRule' :model.sync="scope.row.tags" :id="scope.row.id" :limit="1"></TagView>
                                    </div>
                                    <div v-html='item.render(scope.row, scope.column, scope.row[item.field], scope.$index)' 
                                        v-else-if="typeof item.render === 'function'">
                                    </div>
                                    <div v-else>
                                        {{scope.row[item.field]}}
                                    </div>
                                </template>
                            </el-table-column>
                        </template>
                        <el-table-column label="操作">
                          <template slot-scope="scope">
                            <el-button type="text" icon="el-icon-edit"  @click="onEdit(scope.$index, scope.row)"> 编辑</el-button>
                            <el-button type="text" icon="el-icon-delete"  @click="onDelete(scope.$index, scope.row)"> 删除</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-main>
                  </el-container>
            </SplitArea>
        </Split> -->
    </el-main>
  </el-container>

</template>

<script>
import _ from 'lodash';

export default {
  name: "SetupView",
  props: {
    model: Object
  },
  data() {
    return {
      root: '/script/matrix/eventConsole/notify/server',
      defaultProps: {
          children: 'children',
          label: 'name'
      },
      treeData: [],
      dt: {
        rows:[],
        columns: [],
        selected: []
      },
      rtype: {
        list: [
          { name:'sms', title:'短信', type:"netgate", 
            netgate:{
              address:"47.92.151.165", port:8080, username:"",password:"", cron: "*/1 * * * *", group: "mxsvr", log: true, retry_interval: 5, retry_num: 3, send_num: 5
            },
            jdbc:{
              driver:"com.mysql.jdbc.Driver", url:"jdbc:mysql://47.92.151.165:port/dbname", username:"",password:"", cron: "*/1 * * * *", group: "mxsvr", log: true, retry_interval: 5, retry_num: 3, send_num: 5
            },
            rest:{
              url:"http://47.92.151.165", username:"",password:"", cron: "*/1 * * * *", group: "mxsvr", log: true, retry_interval: 5, retry_num: 3, send_num: 5
            }
          } ,
          { name:'email', title:'邮件', address:"smtp.mxhichina.com", port:25, username:"",password:"", cron: "*/1 * * * *", group: "mxsvr", log: true, retry_interval: 5, retry_num: 3, send_num: 5},
          { name:'wechat', title:'企业微信', address:"47.92.151.165", port:8080, username:"",password:"", cron: "*/1 * * * *", group: "mxsvr", log: true, retry_interval: 5, retry_num: 3, send_num: 5}
        ],
        data: {
          netgate:{
            address:"47.92.151.165", port:8080, username:"",password:"", cron: "*/1 * * * *", group: "mxsvr", log: true, retry_interval: 5, retry_num: 3, send_num: 5
          },
          jdbc:{
            driver:"com.mysql.jdbc.Driver", url:"jdbc:mysql://47.92.151.165:port/dbname", username:"",password:"", cron: "*/1 * * * *", group: "mxsvr", log: true, retry_interval: 5, retry_num: 3, send_num: 5
          },
          rest:{
            url:"http://47.92.151.165", username:"",password:"", cron: "*/1 * * * *", group: "mxsvr", log: true, retry_interval: 5, retry_num: 3, send_num: 5
          }
        }
      }
    };
  },
  created(){
     this.initData();
  },
  methods: {
    initData(){
        let param = {parent: this.root , fullname: this.root};
        this.m3.dfsList(param).then( res=>{
            var tmp = [];
            _.forEach(res.message,v=>{
          
              this.m3.dfsRead(v).then(r=>{
                  tmp.push(_.extend(v, {content:JSON.parse(r.message)}));
              }).catch(err=>{
                  tmp.push(_.extend(v, {content:err}));
              })
                
            });
            setTimeout(()=>{
              this.treeData = [{ id:-1,fullname:this.root,parent:this.root, name:'服务设置',children: _.orderBy(tmp, ['fullname'],['asc']), ftype:'dir'}];
            },500)
            
        } );
    },
    onNodeClick(node){
      this.dt.columns = [];
      
      this.m3.dfsRead(node).then(res=>{
        let rt = JSON.parse(res.message);
        this.dt.rows = rt.rows;
        this.dt.columns = _.map(rt.columns,v=>{
          if(_.isUndefined(v.visible)){
              _.extend(v, { visible: true });
          }

          if(!v.render){
              return v;
          } else {
              return _.extend(v, { render: eval(v.render) });
          }
        });  
      })
    },
    onRefresh(){
      this.initData();
    },
    onNew(){

    },
    onEdit(index,row){
      console.log(index,row)
    },
    onDelete(index,row){
      console.log(index,row)
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-container{
    height: calc(100vh - 220px)!important;
  }
  .el-header{
    height:40px!important;
    line-height:40px;
  }
  .el-main{
    padding: 0px;
    overflow: hidden;
  }
</style>
