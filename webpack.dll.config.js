const path = require('path');
const webpack = require('webpack');
module.exports = {
    entry: {
        vendor: [
          'rxjs',
          'jquery',
          'lodash',
          'moment',
          'eonasdan-bootstrap-datetimepicker',
        ]
    },
    output: {
        path: path.resolve(__dirname),
        filename: './dll/[name].dll.js',
        library: '[name]_library'
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.resolve('./dll', '[name]-manifest.json'),
            name: '[name]_library'
        })
    ]
};