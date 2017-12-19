const webpack = require('webpack');
const path = require('path');
const jsLoaders = [
	'babel-loader?presets[]=react,presets[]=es2015,plugins[]=add-module-exports,plugins[]=transform-runtime,presets[]=stage-0,plugins[]=react-hot-loader/babel',
];

module.exports = {
	entry: [
		'react-hot-loader/patch',
		'webpack/hot/only-dev-server',
		'./example/index.jsx'
	],
	output: {
		path: __dirname + '/build',
		filename: 'bundle.js'
	},
	devtool: 'eval',
	module: {
		loaders: [
			{
				test: /\.jsx$/,
				exclude: /node_modules/,
				loaders: jsLoaders
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: jsLoaders
			},
			{
				test: /\.css$/,
				loader: 'style!css'
			},
		],
	},
    resolve: {
        modules: [path.resolve(__dirname, '/Components'), 'node_modules/'],
        extensions : ['.js', '.jsx']
    }
	// plugins: [new webpack.NoEmitOnErrorsPlugin()]
};
