const webpack = require('webpack')
const WebpackZipPlugin = require('webpack-zip-plugin')

module.exports = {
    
    devServer: {
        open: process.platform === 'darwin',
        host: '0.0.0.0',
        port: 8080,
        https: false,
        hotOnly: false,
    },

    outputDir: 'app/matrix/m3event',
    productionSourceMap: false,

    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({

            }),
            new WebpackZipPlugin({
                initialFile: 'app',
                endPath: './',
                zipName: 'app.zip',
                //frontShell: 'sed -i \'\' \'s/src="/src="\\/static\\/app\\/matrix\\/m3event/g\; s/href="/href="\\/static\\/app\\/matrix\\/m3event/g\' ./app/matrix/m3event/index.html',
                frontShell: 'sed -i \'\' \'s/src="/src="\\/static\\/app\\/matrix\\/m3event/g\; s/href="/href="\\/static\\/app\\/matrix\\/m3event/g\' ./app/matrix/m3event/index.html',
                behindShell: './deploy.sh'
            })
        ]
    }
}