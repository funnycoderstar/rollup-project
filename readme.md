
> rollup是一款小巧的javascript打包器，可以将小块代码编译成大块复杂的代码，更适合于库应用的构建工具。

[rollup官方文档](https://rollupjs.org/guide/en)

## 全局安装
```
npm install --global rollup
``` 

## 快速开始

创建`main.js`

```
console.log(111);
```
执行 `rollup --input main.js --output bundle.js --format cjs`, 该命令编译 `main.js` 生成 `bundle.js`, `--format cjs` 意味着打包为 node.js 环境代码, 请观察 bundle.js 文件内容
```
'use strict'
console.log(111);
```

> 关于format选项
rollup提供了三种选项:
- cjs: node.js环境
- iife: 浏览器环境
- umd: 兼容环境,同时支持node.js环境和浏览器

## 使用配置文件
rollup.config.js

```js
export default {
    input: 'src/main.js',
    output: {
        file: 'bundle.js',
        format: 'cjs'
    }
};
```
执行 `rollup -c rollup.config.js`启动配置项;

## 使用rollup插件

```js
npm install --save-dev rollup-plugin-json

```
我们用的是 --save-dev 而不是 --save，因为代码实际执行时不依赖这个插件——只是在打包时使用。

在配置文件中启用插件
```js
import json from 'rollup-plugin-json';
export default {
    input: './main.js',
    output: {
        file: 'bundle.js',
        format: 'umd'
    },
    plugins: [
        json(),
    ],
}
```

新建文件 `data.json`
```js
{
    "name": "xiaoming",
    "age": 12
}
```
在`main.js` 引入 `data.json`

```js
import { name } from './data.json';
console.log(name);
```
执行 `rollup -c rollup.config.js`,并查看 bundle.js

```js
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

var name = "xiaoming";

console.log(name);

})));

```
看到bundle中仅引用了data.json中的name字段,这是因为rollup会自动进行 Tree-shaking,main.js中仅引入了name,age并没有没引用,所以age并不会被打包

## rollup于其他工具集成

### 打包npm 模块

于webpack和Browserify不同, rollup 不会去寻找从npm安装到你的node_modules文件夹中的软件包;
`rollup-plugin-node-resolve` 插件可以告诉 Rollup 如何查找外部模块
```js
npm install --save-dev rollup-plugin-node-resolve
```

### 打包 commonjs模块

npm中的大多数包都是以CommonJS模块的形式出现的。 在它们更改之前，我们需要将CommonJS模块转换为 ES2015 供 Rollup 处理。
rollup-plugin-commonjs 插件就是用来将 CommonJS 转换成 ES2015 模块的。
请注意，rollup-plugin-commonjs应该用在其他插件转换你的模块之前 - 这是为了防止其他插件的改变破坏CommonJS的检测
```js
npm install --save-dev rollup-plugin-commonjs
```

### 使用babel
使用 Babel 和 Rollup 的最简单方法是使用 rollup-plugin-babel

```js
npm install --save-dev rollup-plugin-babel
```
新建.babelrc
```js
{
    "presets": [
        ["latest", {
            "es2015": {
                "modules": false
            }
        }]
    ],
    "plugins": ["external-helpers"]
}
```
- 首先，我们设置"modules": false，否则 Babel 会在 Rollup 有机会做处理之前，将我们的模块转成 CommonJS，导致 Rollup 的一些处理失败
- 我们使用external-helpers插件，它允许 Rollup 在包的顶部只引用一次 “helpers”，而不是每个使用它们的模块中都引用一遍（这是默认行为）
运行 rollup之前, 需要安装latest preset 和external-helpers插件

```js
npm i -D babel-preset-latest babel-plugin-external-helpers
```

### 一个完整的配置项
```js
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
export default {
    input: './main.js',
    output: {
        file: 'bundle.js',
        format: 'umd'
    },
    watch: {
        exclude: 'node_modules/**'
    },
    plugins: [
        resolve(),
        commonjs(),
        json(),
        babel({
            exclude: 'node_modules/**'
        })
    ],
}
```


## rollup优势
- 自动 Tree-shaking(Tree-shaking, 也被称为 "live code inclusion," 它是清除实际上并没有在给定项目中使用的代码的过程，但是它可以更加高效。)
- 打包速度快
- 配置简单

## rollup VS webpack

rollup更适合构建javascript库,也可用于构建绝大多数应用程序;但是rollup 还不支持一些特定的高级功能，尤其是用在构建一些应用程序的时候，特别是代码拆分和运行时态的动态导入 dynamic imports at runtime.如果你的项目中需要这些功能,则使用webpack更为适合;



