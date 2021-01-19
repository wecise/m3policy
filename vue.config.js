const webpack = require('webpack')
module.exports = {
    devServer: {
        proxy: 'http://47.92.151.165:8080'
    },

    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                $:"jquery",
                jQuery:"jquery",
                "windows.jQuery":"jquery",
                m3: "@cnwangzd/m3js"
            })
        ]
    },

    outputDir: 'app/matrix/m3event',
    productionSourceMap: false
}