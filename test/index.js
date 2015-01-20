var path = require("path");
var fs = require("fs");
var assert = require("assert");

var makeModule = require("..");

function joinHere (where) {
  return path.join(__dirname, where);
}

describe("makeModule()", function () {
  var code = fs.readFileSync(joinHere("./example/calc.js")).toString();

  it("example works as expected normally", function () {
    var calc = require("./example/calc");
    assert(typeof calc.add === "function");
    assert(typeof calc.subtract === "function");
  });

  it("creates modules from arbitrary code", function () {
    var code = "module.exports = {works: true};";
    var result = makeModule(code);
    assert(result.exports.works === true);
  });

  it("example is able to properly require dependencies given a good absolute path", function () {
    var result = makeModule(code, joinHere("./example/calc"));
    assert(typeof result.exports.add === "function");
    assert(typeof result.exports.subtract === "function");
  });

  it("joins path to process.cwd() if path not absolute", function () {
    var result = makeModule(code, "./example/calc");
    assert(typeof result.exports.add === "function");
    assert(typeof result.exports.subtract === "function");
  });

  it("returns instances of the node core `Module` constructor", function () {
    var Module = require("module");
    var result = makeModule("");
    assert((result instanceof Module) === true);
  });

  it("has the expected properties", function () {
    var result = makeModule(code, "./example/calc");
    assert(result.hasOwnProperty("exports"));
    assert(result.hasOwnProperty("id"));
    assert(result.hasOwnProperty("parent"));
    assert(result.hasOwnProperty("filename"));
    assert(result.hasOwnProperty("loaded"));
    assert(result.hasOwnProperty("children"));
    assert(result.hasOwnProperty("paths"));
    assert(result.hasOwnProperty("error"));
    assert(result.error === null);
  });

  it("returns an error property with the error object if compile failed", function () {
    var badCode = "module.exports = {a: 1 b: 1};";
    var result1 = makeModule(badCode);
    assert(/unexpected identifier/i.test(result1.error.message) === true);

    var badRequire = "require('./asdf')";
    var result2 = makeModule(badRequire);
    assert(/cannot find module/i.test(result2.error.message) === true);

    var wontCompile = fs.readFileSync(joinHere("./example/wont-compile.js")).toString();
    var result3 = makeModule(wontCompile);
    assert(/cannot set property '66' of undefined/i.test(result3.error.message) === true);
  });

  it("sets .exports to `null` if compile failed", function () {
    var badCode = "module.exports = {a: 1 b: 1};";
    var result1 = makeModule(badCode);
    assert(result1.exports === null);

    var badRequire = "require('./asdf')";
    var result2 = makeModule(badRequire);
    assert(result2.exports === null);

    var wontCompile = fs.readFileSync(joinHere("./example/wont-compile.js")).toString();
    var result3 = makeModule(wontCompile);
    assert(result3.exports === null);
  });

});
