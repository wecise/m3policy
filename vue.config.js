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
            /* new WebpackZipPlugin({
                initialFile: 'app',
                endPath: './',
                zipName: 'app.zip',
<<<<<<< HEAD
                frontShell: 'sed -i \'\' \'s/src="/src="\\/static\\/app\\/matrix\\/m3event/g\; s/href="/href="\\/static\\/app\\/matrix\\/m3event/g\' ./app/matrix/m3event/index.html',
=======
                exclude: ['.DS_Store'],
                frontShell: 'sed -i \'s/src="/src="\\/static\\/app\\/matrix\\/m3event/g\; s/href="/href="\\/static\\/app\\/matrix\\/m3event/g\' ./app/matrix/m3event/index.html',
>>>>>>> fcc724743c0c405f2110839e6d4aa91fb3d0250c
                behindShell: './deploy.sh'
            }) */
        ]
    }
}