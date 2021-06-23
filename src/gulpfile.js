// Requirements
const { src, dest, watch, series, parallel } = require('gulp');
const del = require('del');
const size = require('gulp-size');
const webpack = require('webpack-stream');
const concat = require('gulp-concat');
const path = require('path');
const sass = require('gulp-sass');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
sass.compiler = require('node-sass');


// Configuration
const js_src = './frontend/**/*.js';
const js_dest = './static/frontend/js/';
const js_filename = 'app.js';
const scss_src = './frontend/**/*.scss';
const css_dest = './static/frontend/css/';
const css_filename = 'app.css';


// JS Tasks
function transform_js() {
    return src(js_src)
        .pipe(webpack({
            config: {
                output: {
                    filename: js_filename
                },
                module: {
                    rules: [
                        {
                            test: /.js$/,
                            use: {
                                loader:'babel-loader',
                                options: {
                                    compact: true,
                                    presets: [
                                        '@babel/react',
                                    ],
                                    plugins: [
                                        "@babel/plugin-proposal-optional-chaining",
                                    ],
                                },
                            },
                        },
                    ],
                },
                devtool: 'source-map',
                mode: 'production',
                resolve: {
                    modules: [path.resolve(__dirname, './frontend'), 'node_modules'],
                },
                cache: true,
                plugins: [
                    //new BundleAnalyzerPlugin()
                ],
            },
        }))
        .pipe(dest(js_dest))
        .pipe(size({showFiles: true}));
}

function clean_js() {
    return del(js_dest + js_filename, {force: true});
}

function watch_js() {
    return watch(js_src, series(clean_js, transform_js));
}

// SCSS Tasks
function transform_scss() {
    return src(scss_src)
        //.pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        //.pipe(sourcemaps.write('./maps'))
        .pipe(concat(css_filename))
        .pipe(dest(css_dest))
        .pipe(size({showFiles: true}));
}

function clean_scss() {
    return del(css_dest + css_filename, {force: true});
}

function watch_scss() {
    return watch(scss_src, series(clean_scss, transform_scss));
}

// Exports
exports.transform_js = transform_js;
exports.watch_js = watch_js;
exports.clean_js = clean_js;
exports.transform_scss = transform_scss;
exports.watch_scss = watch_scss;
exports.clean_scss = clean_scss;
const build = exports.build = series(clean_scss, clean_js, transform_scss, transform_js);
exports.build_and_watch = series(build, parallel(watch_scss, watch_js));