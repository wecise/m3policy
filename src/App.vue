<template>
  <el-container class="m3 event-console">
    <el-header>
        <el-row type="flex" :gutter="0" v-if="auth">
            <el-col :span="19">
                <el-link href="/" :underline="false">
                  <el-image :src="auth.Company.logo" fit="contain"></el-image>
                </el-link>
                <span style="position: absolute;left: 40px;">{{auth.Company.title}}</span>
            </el-col>
            <el-col :span="1" style="text-align: right;">
                <div id="ai-robot"></div>
            </el-col>
            <el-col :span="3" style="text-align: right;">
                
            </el-col>
            <el-col :span="2">
                <el-menu :default-active="activeIndex" 
                        class="topbar-el-menu" 
                        mode="horizontal" 
                        menu-trigger="hover"
                        @select="onSelect">
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-user-solid" style="color:#ffffff;"></i> {{ auth.username }}
                        </template>
                        <el-menu-item index="/matrix/user">
                            <template slot="title">
                                <i class="el-icon-user"></i>
                                <span slot="title">用户</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="/matrix/system" divided v-if="auth.isAdmin">
                            <template slot="title">
                                <i class="el-icon-setting"></i>
                                <span slot="title">系统管理</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="/matrix/files">
                            <template slot="title">
                                <i class="el-icon-folder-opened"></i>
                                <span slot="title">我的文件</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="home">
                            <template slot="title">
                                <i class="el-icon-s-home"></i>
                                <span slot="title">默认首页</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="signout" divided>
                            <template slot="title">
                                <i class="el-icon-switch-button"></i>
                                <span slot="title">注销</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-col>
        </el-row>
      </el-header>
    <el-main>
      <MainView :global="global" v-if="global"></MainView>
    </el-main>
  </el-container>
</template>

<script>
import MainView from './components/MainView.vue'
import _ from 'lodash';

export default {
  name: 'app',
  components: {
    MainView
  },
  data(){
    return {
      global:null,
      auth: null,
      activeIndex: '1'
    }
  },
  mounted(){
    setTimeout(()=>{
      this.global = this.m3.global;
      this.auth = this.m3.auth.signedUser;
      this.m3.setTitle(this.auth);
    },600)
  },
  methods: {
    onSelect(key) {
        if(_.startsWith(key,'/matrix/')){
            window.open(key, '_blank');
        } else {
            if(key === 'home'){
                this.m3.setAppAsHome(this,{url:'/home'});
            } else if(key==='signout'){
                window.open(`/user/logout/${this.auth.Company.name}`,'_parent');
            } 
        }
    }
  }
}
</script>

<style>
  body{
    overflow: hidden!important;
    font-size: 12px;
    font-family: "PingFang SC",Arial,"Microsoft YaHei",sans-serif;
    margin: 0px;
    padding: 0px;
  }

  .m3 > .el-header{
    height: 50px!important;
    line-height: 50px;
    /* background: rgb(37, 45, 71); */
    background: #252D47;
    color: #ffffff;
    padding: 0px 0px 0px 10px;
  }

  .m3 > .el-header .el-image > .el-image__inner{
    max-width: 120px;
    min-width: 32px;
    width: 32px;
    height: 32px;
    padding: 7px 0px;
  }

  .m3 > .el-main{
    padding: 0px;
  }

  .el-link.el-link--default {
    color: #ffffff;
  }

  .topbar-el-menu .el-submenu__icon-arrow.el-icon-arrow-down{
		color: #ffffff;
	}

	.el-menu-item:hover{
		background-color: #409dfe!important;
	}

  .topbar-el-menu.el-menu.el-menu--horizontal {
		border-bottom: unset;
		background: #242c46;
	}
	.topbar-el-menu.el-menu.el-menu--horizontal >.el-menu-item {
		height: 30px;
		line-height: 30px;
	}
	.topbar-el-menu.el-menu.el-menu--horizontal>.el-submenu {
		float: right;
	}
	.topbar-el-menu.el-menu.el-menu--horizontal >.el-submenu .el-submenu__title {
		height: 50px;
		line-height: 50px;
		border-bottom: unset;
		color: #ffffff;
	}

  .el-menu--horizontal>.el-menu-item:not(.is-disabled):focus, 
  .el-menu--horizontal>.el-menu-item:not(.is-disabled):hover, 
  .el-menu--horizontal>.el-submenu .el-submenu__title:hover {
      background-color: #409dfe!important;
  }

  /* el-table hover actived style */
  .el-table--enable-row-hover .el-table__body tr:hover>td {
        background-color: #3c99f7!important;
  }
  .el-table__body tr.current-row>td {
        background-color:#3c99f7!important;;
  }

  /* mxgraph contextmenu style */
  td.mxPopupMenuIcon div {
    width:16px;
    height:16px;
  }
  html div.mxPopupMenu {
    -webkit-box-shadow:2px 2px 3px #d5d5d5;
    -moz-box-shadow:2px 2px 3px #d5d5d5;
    box-shadow:2px 2px 3px #d5d5d5;
    _filter:progid:DXImageTransform.Microsoft.DropShadow(OffX=2, OffY=2, Color='#d0d0d0', Positive='true');
    background:white;
    position:absolute;
    border:1px solid #e7e7e7;
    padding:3px;
  }
  html table.mxPopupMenu {
    border-collapse:collapse;
    margin:0px;
  }
  html td.mxPopupMenuItem {
    padding:7px 30px 7px 30px;
    font-family: "微软雅黑";/* Microsoft YaHei,Helvetica Neue,Helvetica,Arial Unicode MS,Arial;*/
    font-size:12px;
  }
  html td.mxPopupMenuIcon {
    background-color:white;
    padding:0px;
  }
  td.mxPopupMenuIcon .geIcon {
    padding:2px;
    padding-bottom:4px;
    margin:2px;
    border:1px solid transparent;
    opacity:0.5;
    _width:26px;
    _height:26px;
  }
  td.mxPopupMenuIcon .geIcon:hover {
    border:1px solid gray;
    border-radius:2px;
    opacity:1;
  }
  html tr.mxPopupMenuItemHover {
    background-color: #f5f5f5;
    color: black;
  }
  table.mxPopupMenu hr {
    color:#cccccc;
    background-color:#f5f5f5;
    border:none;
    height:1px;
  }
  table.mxPopupMenu tr {
    font-size:4pt;
  }

.el-table{
    -webkit-user-select:none;/*谷歌 /Chrome*/
    -moz-user-select:none; /*火狐/Firefox*/
    -ms-user-select:none;    /*IE 10+*/
    user-select:none;
}

.el-dialog{
      width: 90vw!important;
      height:85vh;
  }

  /* Event Console Table */
  .el-table {
        height:100%!important;
        overflow: hidden!important;
    }

    .el-table--small td, 
    .el-table--small th {
        padding: 4px 0;
    }

    .el-table .cell {
        white-space: nowrap!important;
        line-height: 18px!important;
    }

    .el-table .el-table__body-wrapper {
        overflow: auto;
        position: relative;
        height: calc(100% - 50px)!important;
    }

    /* el-checkbox */
    .el-checkbox__label {
        font-size: 12px!important;
    }

    /* el-tabs */
    .el-tabs--border-card>.el-tabs__header {
      background-color: #f2f2f2!important;
      border-bottom: unset!important;
      border-top: 1px solid #dddddd;
    }

</style>
