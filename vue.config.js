const webpack = require('webpack')
const path = require('path');
const WebpackZipPlugin = require('webpack-zip-plugin')
function resolve(dir) {
    return path.join(__dirname, dir);
}
module.exports = {

    devServer: {
        proxy: 'http://47.92.151.165:8080'
    },

    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                
            }),
            // new WebpackZipPlugin({
            //     initialFile: './app',
            //     endPath: './',
            //     zipName: 'app.zip',
            //     //frontShell: 'sed -i "s/src="/src="\/app\/matrix\/m3event/g ./app/matrix/m3event/index.html && sed -i "s/href="/href="\/app\/matrix\/m3event/g ./app/matrix/m3event/index.html',
            //     //frontShell: 'ls -lsa && ls',
            //     //behindShell: 'echo ********** && ls -lsa ./app.zip'
            // })
        ]
    },

    outputDir: 'app/matrix/m3event',
    productionSourceMap: false,
    

    
 
    
    
    
        
    chainWebpack: (config) => {
        config.module
        .rule('')
        .test(/mxClient\.js$/)
        .use('exports-loader')
        .loader('exports-loader?mxClient,mxGraphModel,mxActor,mxShape,mxEventObject,mxGraph,mxPrintPreview,mxEventSource,mxRectangle,mxVertexHandler,mxMouseEvent,mxGraphView,mxImage,mxGeometry,mxRubberband,mxKeyHandler,mxDragSource,mxGraphModel,mxEvent,mxUtils,mxWindow,mxEvent,mxCodec,mxCell,mxConstants,mxPoint,mxGraphHandler,mxCylinder,mxCellRenderer,mxEvent,mxUndoManager')
        .end();
        config.resolve.alias
        .set('@', resolve('src'))
        .set('@assets', resolve('src/assets'));
    }
    
}