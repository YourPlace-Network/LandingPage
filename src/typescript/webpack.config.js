const path = require('path');
const webpack = require('webpack');

module.exports = {
    context: path.resolve(__dirname, ''),
    devtool: 'inline-source-map',
    entry: {
        home: './pages/home.ts',
    },
    mode: 'development',
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            include: path.resolve(__dirname, "."),
            exclude: /node_modules/,
        },{
            test: /\.(sass|scss|css)$/,
            include: path.resolve(__dirname, "../scss"),
            exclude: /node_modules/,
            use: [{
                loader: 'style-loader'  // Adds CSS to the DOM by injecting a `<style>` tag
            },{
                loader: 'css-loader',  // Interprets `@import` and `url()` like `import/require()` and will resolve them
                options: {
                    sourceMap: false,
                }
            },{
                loader: 'postcss-loader',  // Loader for webpack to process CSS with PostCSS
                options: {
                    postcssOptions: {
                        plugins: [["autoprefixer", {}]]
                    }
                }
            },{
                loader: 'sass-loader',  // Loads a SASS/SCSS file and compiles it to CSS
                options: {
                    sourceMap: false,
                    sassOptions: {
                        outputStyle: "compressed",
                    }
                }
            }]
        }]
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../www/js/'),
        clean: true,
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js'],
        fallback: {
            "crypto": require.resolve("crypto-browserify"),
            "stream": require.resolve("stream-browserify"),
            buffer: require.resolve("buffer/"),
            util: require.resolve("util/"),
            "process": false,
            "path": require.resolve("path-browserify"),
        },
        alias: {
            process: "process/browser"
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
        new webpack.ProvidePlugin({
            process: "process/browser",
        }),
    ],
    experiments: {
        topLevelAwait: true,
    },
    ignoreWarnings: [{
        message: /print-color-adjust/,
    }],
    target: "web",
};