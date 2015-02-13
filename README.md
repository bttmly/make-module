# make-module [![Build Status](https://travis-ci.org/nickb1080/make-module.svg?branch=master)](https://travis-ci.org/nickb1080/make-module) [![codecov.io](https://codecov.io/github/nickb1080/make-module/coverage.svg?branch=master)](https://codecov.io/github/nickb1080/make-module?branch=master)

Create a node module from a string of code, and maybe a file name.

`npm install make-module`

```js
var file = path.join(__dirname, "./some-module.js");
var code = fs.readFileSync(file).toString();
var someModule = makeModule(code, file);
// find `module.exports` at `someModule.exports`
```
