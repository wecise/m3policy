const webpack = require('webpack')
const WebpackZipPlugin = require('webpack-zip-plugin')

module.exports = {

    devServer: {
        proxy: 'http://47.92.151.165:8080',
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
                exclude: ['.DS_Store'],
                frontShell: 'sed -i \'s/src="/src="\\/static\\/app\\/matrix\\/m3event/g\; s/href="/href="\\/static\\/app\\/matrix\\/m3event/g\' ./app/matrix/m3event/index.html',
                behindShell: './deploy.sh'
            })
        ]
    }
}