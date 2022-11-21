const path = require('path')
module.exports = {
	entry: path.join(__dirname, '/src/yeim-uni-sdk.js'),
	output: {
		path: path.join(__dirname, '/dist'),
		filename: 'yeim-uni-sdk.min.js',
		libraryTarget: 'umd'
	},
	mode: 'production',
	plugins: []
}
