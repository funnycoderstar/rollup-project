import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';

export default {
    input: './src/index.js',
    output: {
        file: 'dist/index.js',
        name: 'rollup-project',
        format: 'umd',
    },
    env: process.env.NODE_ENV,
    sourcemap: true,
    watch: {
        exclude: 'node_modules/**',
    },
    plugins: [
        babel({
            exclude: 'node_modules/**',
            plugins: ['external-helpers'],
        }),
        resolve(),
        commonjs(),
        json(),
    ],
    globals: {

    },
};
