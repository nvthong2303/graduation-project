module.exports = {
    entry: "./js/app.js",
    output: {
        filename: "js/bundle.js"
    },
    debug: true,
    devtool: "#eval-source-map",
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel'
            }
        ]
    }
};
