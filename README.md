# create-module

Create a node module from a string of code, and maybe a file name.

`npm install create-module`

```js
var file = path.join(__dirname, "./some-module.js");
var code = fs.readFileSync(file).toString();
var createdModule = crateModule(code, file);
// find `module.exports` at `createdModule.exports`
```
