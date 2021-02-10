<template>
  <el-container>
    <el-main ref="graphContainer"></el-main>
  </el-container>
</template>

<script>
import 'mxgraph/javascript/src/css/common.css';

import _ from 'lodash';
import $ from 'jquery';
import mxgraph from './mxGraph.js';
const {mxEditor,mxConstants,mxEdgeStyle,mxCellTracker,mxUtils,mxCodec,mxEvent,mxHierarchicalLayout,mxMorphing,mxFastOrganicLayout,mxCompactTreeLayout,mxCircleLayout} = mxgraph;

export default {
  name: "GraphView",
  props: {
    model: Array
  },
  data() {
    return {
      graph: {
            editor:null,
            data: null,
            control:{
              ifIcon: false
            },
            layout: {
                default: 'hierarchical_vertical'
            },
            style: {
                grid: {
                    show: false
                },
                vertex:{
                    align: {
                        value: '',
                        list: [
                            {name: '左对齐', icon:'', value:'mxConstants.ALIGN_LEFT'},
                            {name: '居中', icon:'', value:'mxConstants.ALIGN_CENTER'},
                            {name: '右对齐', icon:'', value:'mxConstants.ALIGN_RIGHT'},
                            {name: '上对齐', icon:'', value:'mxConstants.ALIGN_TOP'},
                            {name: '中间', icon:'', value:'mxConstants.ALIGN_MIDDLE'},
                            {name: '下对齐', icon:'', value:'mxConstants.ALIGN_BOTTOM'}
                        ]
                    }
                },
                edge: {
                    endArrow: 'classic',
                    strokeWidth: 1,
                    strokeColor: '#333333',
                    value: {
                            name: 'isometric1', cnTitle:'等距1', title:'isometricEdgeStyle', keys:[mxConstants.STYLE_EDGE, mxConstants.STYLE_ELBOW, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE], values:['isometricEdgeStyle', null, null, null]
                        },
                    list: [
                        {
                            name: 'straight', cnTitle:'直线', title:'isometricEdgeStyle', keys:[mxConstants.STYLE_EDGE, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE], values:[null, null, null]
                        },
                        {
                            name: 'orthogonal', cnTitle:'正交', title:'orthogonalEdgeStyle', keys:[mxConstants.STYLE_EDGE, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE], values:['orthogonalEdgeStyle', null, null]
                        },
                        {
                            name: 'simple1', cnTitle:'简单1', title:'elbowEdgeStyle', keys:[mxConstants.STYLE_EDGE, mxConstants.STYLE_ELBOW, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE], values:['elbowEdgeStyle', null, null, null]
                        },
                        {
                            name: 'simple2', cnTitle:'简单2', title:'elbowEdgeStyle', keys:[mxConstants.STYLE_EDGE, mxConstants.STYLE_ELBOW, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE], values:['elbowEdgeStyle', 'vertical', null, null]
                        },
                        {
                            name: 'isometric1', cnTitle:'等距1', title:'isometricEdgeStyle', keys:[mxConstants.STYLE_EDGE, mxConstants.STYLE_ELBOW, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE], values:['isometricEdgeStyle', null, null, null]
                        },
                        {
                            name: 'isometric2', cnTitle:'等距2', title:'isometricEdgeStyle', keys:[mxConstants.STYLE_EDGE, mxConstants.STYLE_ELBOW, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE], values:['isometricEdgeStyle', 'vertical', null, null]
                        },
                        {
                            name: 'entityRelation', cnTitle:'实体关联', title:'entityRelationEdgeStyle', keys:[mxConstants.STYLE_EDGE, mxConstants.STYLE_CURVED, mxConstants.STYLE_NOEDGESTYLE], values:['entityRelationEdgeStyle', null, null]
                        }
                    ]
                }
            },
            path: {
                list:[],
                colors:['#ff0000','#ffd700','#666666','#00ffff','#40e0d0','#ff7373','#d3ffce','#3399ff','#000080','#66cccc','#a0db8e','#794044','#6897bb','#cc0000'],
            },
            edges: {
                value: "",
                list: [],
                properties: {
                    value: "",
                    list: []
                }
            }
      }
    };
  },
  watch: {
      model:{
          handler(){
              this.initData();
          },
          deep: true
      }
  },
  created(){
    this.initData();
  },
  mounted(){
    this.init();
  },
  methods: {
    init(){
        this.m3.callFS("/matrix/graph/edges.js",null).then( (rtn)=>{
            this.graph.edges.list = rtn.message;
        } );
    },
    initData(){
        
        if(_.isEmpty(this.model)) {
            this.onReload();
            return false;
        } else {
            let term = encodeURIComponent( `match() <- [*2] - ('${this.model.join("','")}') - [*2] ->()` );
            this.m3.callFS("/matrix/graph/graph_service.js", term).then( (rtn)=>{
                this.graph.data = rtn.message[0].graph;
                this.onReload();
            } )
        }
    },
    initGraph(){
        this.graph.editor = new mxEditor();
        this.graph.editor.setGraphContainer(this.$refs.graphContainer.$el);
        let graph = this.graph.editor.graph;
        
        // Sets global styles
        var style = graph.getStylesheet().getDefaultEdgeStyle();
        style[mxConstants.STYLE_EDGE] = mxEdgeStyle.EntityRelation;
        style[mxConstants.STYLE_ROUNDED] = true;
        style[mxConstants.EDGE_SELECTION_STROKEWIDTH] = 3;
        style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = 'transparent';
        style[mxConstants.STYLE_LABEL_PADDING] = 5;


        style = graph.getStylesheet().getDefaultVertexStyle();
        style[mxConstants.STYLE_FILLCOLOR] = '#2f8ee7';
        style[mxConstants.STYLE_FONTCOLOR] = '#333333';
        style[mxConstants.STYLE_FONTSIZE] = '14';
        style[mxConstants.STYLE_SHAPE] = 'swimlane';
        style[mxConstants.STYLE_SPACING] = '10';
        style[mxConstants.STYLE_STARTSIZE] = 30;
        style[mxConstants.STYLE_GRADIENTCOLOR] = '#419efe';
        style[mxConstants.VERTEX_SELECTION_STROKEWIDTH] = 3;
        style[mxConstants.VERTEX_SELECTION_COLOR] = '#ff0000';

        // 预览时鼠标悬浮到节点时，改变节点样式
        new mxCellTracker(graph);

        // 首先禁用浏览器右键菜单
        mxEvent.disableContextMenu(this.$el);
        // 右键菜单
        graph.popupMenuHandler.factoryMethod = (menu, cell, evt)=>{
            this.createPopupMenu(this.graph.editor, graph, menu, cell, evt);
        };
    },
    checkImgExists(){
        //let term = {parent:"/assets/images/entity/png", name:name};
        return true;//fsHandler.callFsJScript("/matrix/graph/checkHaveFile.js", encodeURIComponent(JSON.stringify(term))).message;
    },  
    // 渲染图片来源
    imageRenderHandler(icon) {
        
        if(_.includes(icon,'http://')){
            return icon;
        } else {
            return `/static/assets/images/entity/png/${icon}.png`;
        }

    },
    onReload(){
        try{
            $(this.$refs.graphContainer.$el).empty();
            
            // 清空
            this.graph.editor.execute("selectAll");
            this.graph.editor.execute("delete");

            // 重新初始化
            this.initGraph();

        } catch(err){

            this.initGraph();

        } finally{
            
            this.renderGraph(this.graph.editor);

        }
    },
    renderGraph(editor){
        
        let graph = editor.graph;
        let model = graph.getModel();
        let parent = graph.getDefaultParent();

        model.beginUpdate();
        
        try{
            

            if(!_.isEmpty(window.URL_PARAMS_ITEM)) {
                let doc = mxUtils.parseXml(this.graph.data);
                let codec = new mxCodec(doc);
                codec.decode(doc.documentElement, model);
            } else {
                
                
                let allNodes = _.concat([],this.graph.data.nodes);
                let allEdges = _.concat([],this.graph.data.edges);

                if( this.graph.data['diff'] && 'add' in this.graph.data['diff'] ){
                    allNodes = _.concat(allNodes, this.graph.data.diff.add.nodes);
                    allEdges = _.concat(allEdges, this.graph.data.diff.add.edges);
                }

                if( this.graph.data['diff'] && 'del' in this.graph.data['diff'] ){
                    allNodes = _.concat(allNodes, this.graph.data.diff.del.nodes);
                    allEdges = _.concat(allEdges, this.graph.data.diff.del.edges);
                }

                allNodes = _.uniqBy(allNodes,'id');
                allEdges = _.uniqBy(allEdges,'id'); 
                
                // 绘制节点
                _.forEach(allNodes,(v)=>{

                    let _type = v._icon || 'matrix';

                    // 可设置默认显示属性
                    let _name =  '';

                    try{
                        if(window.URL_PARAMS_GRAPH){
                            _name = v[window.URL_PARAMS_GRAPH.title];
                        } else {
                            _name = v[this.model.graph.default.title];
                        }
                    } catch(err){
                        _name = v["id"];
                    }

                    // 选择节点渲染模式：icon/shape
                    let imageUrl = this.imageRenderHandler(_type);

                    // icon渲染
                    if(this.graph.control.ifIcon){
                        if(this.checkImgExists(`${_type}.png`)){
                            graph.insertVertex(parent, v.id, _name, 50, 50, 60, 60,`shape=image;html=1;image=${imageUrl};verticalLabelPosition=bottom;verticalAlign=top;`);
                        } else {
                            graph.insertVertex(parent, v.id, _name, 50, 50, 50, 50,`shape=ellipse;perimeter=ellipsePerimeter;html=1;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=middle;`);
                        }    
                    } 
                    // shape渲染
                    else {
                        graph.insertVertex(parent, v.id, _name, 50, 50, 50, 50,`shape=ellipse;perimeter=ellipsePerimeter;html=1;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=middle;`);
                    }
                })
                
                // 绘制边
                _.forEach(allEdges,(k,index)=>{
                    
                    let source = model.getCell(k.source);
                    let target = model.getCell(k.target);
                    
                    let baseEdgeStyle = `edgeStyle=${this.graph.style.edge.value.title};html=1;rounded=1;jettySize=auto;orthogonalLoop=1;endArrow=block;endFill=1;`;
                    let direction = '';

                    if(k.twoway){
                        direction = 'startArrow=block;endArrow=block;endFill=1;';
                    }

                    // edge为path的样式
                    if(k.class === "path"){
                        baseEdgeStyle = `edgeStyle=${this.graph.style.edge.value.title};orthogonalLoop=1;strokeWidth=1;dashed=1;startFill=0;endArrow=none;endFill=0;startArrow=none;orthogonal=1;elbow=vertical;`;
                        let strokeColor = this.model.graph.path.colors[index] || _.sample(this.graph.path.colors);
                        graph.insertEdge(parent, k.id, k.class, source, target, baseEdgeStyle+direction+`strokeColor=${strokeColor}`);
                        return;
                    }

                    
                    try {
                        let edgeName = _.find(this.graph.edges.list,{name:k.class}).remedy;
                        graph.insertEdge(parent, k.id, edgeName, source, target, baseEdgeStyle+direction);
                    } catch(err){
                        graph.insertEdge(parent, k.id, k.class, source, target, baseEdgeStyle+direction);
                    } 
                })
                
            }
            
        }
        finally {
            
            model.endUpdate();    

            this.executeLayout();

        }
    },
    // 右键菜单
    createPopupMenu(editor, graph, menu, cell, evt){
        
        console.log(evt);

        // 节点或边菜单
        if (cell != null){
            
            let id = cell.getId();
            let value = cell.getValue();

            // 节点菜单
            if(!cell.edge){
                console.log(id)
            } else {
                console.log(value)
            }
        } 
        // 画布菜单
        else {
            
            let submenuLayout = menu.addItem('布局', null, null);

            let submenuLayoutHierarchical = menu.addItem('分层布局', null, null,submenuLayout);
            menu.addItem('上下', null, ()=>{
                this.graph.layout.default = 'hierarchical_vertical';
                this.executeLayout();
            }, submenuLayoutHierarchical);
            menu.addItem('左右', null, ()=>{
                this.graph.layout.default = 'hierarchical_horizontal';
                this.executeLayout();
            }, submenuLayoutHierarchical);

            
            let submenuLayoutTree = menu.addItem('树形布局', null, null,submenuLayout);

            menu.addItem('上下', null, ()=>{
                this.graph.layout.default = 'tree_vertical';
                this.executeLayout();
            }, submenuLayoutTree);
            menu.addItem('左右', null, ()=>{
                this.graph.layout.default = 'tree_horizontal';
                this.executeLayout();
            }, submenuLayoutTree);

            menu.addItem('随机布局', null, ()=>{
                this.graph.layout.default = 'organic';
                this.executeLayout();
            }, submenuLayout);
            menu.addItem('圆形布局', null, ()=>{
                this.graph.layout.default = 'circle';
                this.executeLayout();
            }, submenuLayout);
        }
        
    },
    // 设置布局
    executeLayout(){
        let graph = this.graph.editor.graph;
        let parent = graph.getDefaultParent();
        let layout = this.graph.layout;
        let model = graph.getModel();

        // 布局定义
        if(layout.default === 'hierarchical_vertical'){
            // Layout hierarchical
            model.beginUpdate();
            try {
                layout.inst = new mxHierarchicalLayout(graph, mxConstants.DIRECTION_NORTH);
                layout.inst.edgeStyle = layout.edgeStyle;
                layout.inst.intraCellSpacing = 80;
                layout.inst.interRankCellSpacing = 80;
                
                layout.inst.execute(parent, null);

            } finally {
                let morph = new mxMorphing(graph);  
                morph.addListener(mxEvent.DONE, function(){  
                    model.endUpdate();  
                });  
                    
                morph.startAnimation();  
            }
            
        } else if(layout.default === 'hierarchical_horizontal'){
            // Layout hierarchical
            model.beginUpdate();
            try {
                layout.inst = new mxHierarchicalLayout(graph, mxConstants.DIRECTION_WEST);
                layout.inst.edgeStyle = layout.edgeStyle;
                layout.inst.intraCellSpacing = 80;
                layout.inst.interRankCellSpacing = 80;
                
                layout.inst.execute(parent, null);
            } finally {
                let morph = new mxMorphing(graph);  
                morph.addListener(mxEvent.DONE, function(){  
                    model.endUpdate();  
                });  
                    
                morph.startAnimation();  
            }
            
        } else if(layout.default === 'organic'){
            // Layout Organic
            model.beginUpdate();
            try {
                layout.inst = new mxFastOrganicLayout(graph);
                layout.inst.forceConstant = 140;
                //layout.inst.execute(parent);

                layout.inst.execute(parent,null);
            } finally {
                model.endUpdate();
            }
            
        } else if(layout.default === 'tree_vertical'){
            /* Layout tree vertical */
            model.beginUpdate();
            try {
                let tmp = graph.getSelectionCell();
                let roots = null;
                let cells = [tmp];
                
                if ( tmp == null || model.getChildCount(tmp) == 0 ) {
                    if (model.getEdgeCount(tmp) == 0){
                        roots = graph.findTreeRoots(parent);
                    }
                } else {
                    roots = graph.findTreeRoots(tmp);
                }

                if ( roots != null && roots.length > 0 ) {
                    cells = roots;
                }
                
                if( cells.length > 0 ) {
                    _.forEach(cells,(v)=>{
                        layout.inst = new mxCompactTreeLayout(graph, false);
                        layout.inst.edgeRouting = false;
                        layout.inst.levelDistance = 30;
                        layout.inst.execute(parent, v);
                    })
                }

            } finally {
                let morph = new mxMorphing(graph);  
                morph.addListener(mxEvent.DONE, function(){  
                    model.endUpdate();  
                });  
                    
                morph.startAnimation();  
            }
        } else if(layout.default === 'tree_horizontal'){
            /* Layout tree horizontal */
            model.beginUpdate();
            try {
                let tmp = graph.getSelectionCell();
                let roots = null;
                let cells = [tmp];
                
                if (tmp == null || model.getChildCount(tmp) == 0){
                    if (model.getEdgeCount(tmp) == 0){
                        roots = graph.findTreeRoots(parent);
                    }
                } else {
                    roots = graph.findTreeRoots(tmp);
                }

                if (roots != null && roots.length > 0){
                    cells = roots;
                }
                
                if( cells.length > 0 ) {
                    _.forEach(cells,(v)=>{
                        layout.inst = new mxCompactTreeLayout(graph, true);
                        layout.inst.edgeRouting = false;
                        layout.inst.levelDistance = 30;
                        layout.inst.execute(parent, v);
                    })
                }
                
            } finally {
                let morph = new mxMorphing(graph);  
                morph.addListener(mxEvent.DONE, function(){  
                    model.endUpdate();  
                });  
                    
                morph.startAnimation();  
            }
        } else {
            /* Layout Circle */
            model.beginUpdate();
            try {
                layout.inst = new mxCircleLayout(graph);
                layout.inst.execute(parent, null);
            } finally {
                model.endUpdate();
            }
        }
        
    },
    

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .el-container{
        height: calc(100vh - 220px)!important;
    }

    

</style>
