import path from 'path';
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from "@rollup/plugin-terser";
import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
const env = process.env.NODE_ENV
const config = {
    input: path.resolve(__dirname, 'src/yeim-uni-sdk.js'),
    output: {
        file: './dist/yeim-uni-sdk.min.js',
        format: 'es',
        name: 'YeIMUniSDK',
    },
    plugins: [
        resolve(),
        commonjs(),
        json(),
        babel({ babelHelpers: 'runtime' })
    ]
}

config.plugins.push(terser({
    compress: {
        pure_getters: true, unsafe: true, unsafe_comps: true, warnings: false
    }
}))

if (env === 'production') {
    config.plugins.push(terser({
        compress: {
            pure_getters: true, unsafe: true, unsafe_comps: true, warnings: false
        }
    }))
}

export default config
