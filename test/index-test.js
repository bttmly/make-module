var path = require("path");
var fs = require("fs");
var assert = require("assert");

var makeModule = require("../lib/index.js");

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
    assert(result instanceof Module);
  });

  it("has the expected properties and values when providing a location", function () {

    var result = makeModule(code, "./example/calc");

    assert(result.hasOwnProperty("exports"));
    assert(result.exports.hasOwnProperty("add"));
    assert(result.exports.hasOwnProperty("subtract"));

    assert(result.hasOwnProperty("id"));
    assert.equal(result.id, path.join(__dirname, "..", "test/example/calc"));

    assert(result.hasOwnProperty("parent"));
    assert(result.parent.id, path.join(__dirname, "..", "lib/index.js"));
    
    assert(result.hasOwnProperty("filename"));
    assert.equal(result.filename, path.join(__dirname, "..", "test/example/calc"));

    assert(result.hasOwnProperty("loaded"));
    assert(result.loaded === true);
    
    assert(result.hasOwnProperty("children"));
    assert.deepEqual(result.children, []);
    
    assert(result.hasOwnProperty("paths"));
    assert(Array.isArray(result.paths));
    
    assert(result.hasOwnProperty("error"));
    assert(result.error === null);
  });

it("has the expected properties and values when not providing a location", function () {

  var theCode = "module.exports = {name: 'Joe', age: 30};";

  var result = makeModule(theCode);

  assert(result.hasOwnProperty("exports"));
  assert.equal(result.exports.name, "Joe");
  assert.equal(result.exports.age, 30);

  assert(result.hasOwnProperty("id"));
  assert.equal(result.id, __dirname);

  assert(result.hasOwnProperty("parent"));
  assert.equal(result.parent.id, path.join(__dirname, "../lib/index.js"));
  
  assert(result.hasOwnProperty("filename"));
  assert.equal(result.filename, __dirname);

  assert(result.hasOwnProperty("loaded"));
  assert(result.loaded === true);
  
  assert(result.hasOwnProperty("children"));
  assert.deepEqual(result.children, []);
  
  assert(result.hasOwnProperty("paths"));
  assert(Array.isArray(result.paths));
  
  assert(result.hasOwnProperty("error"));
  assert.equal(result.error, null);
});

  it("strips the BOM if present", function () {
    var BOM = String.fromCharCode(0xFEFF);
    var code = "module.exports = true;";
    var codeWithBOM = BOM + code;
    var result = makeModule(codeWithBOM);
    assert.equal(result.code.indexOf(BOM), -1);
  });

  it("returns an error property with the error object if compile failed", function () {
    // missing a comma between object properties (errors at parse time)
    var badCode = "module.exports = {a: 1 b: 1};";
    var result1 = makeModule(badCode);
    assert(/unexpected identifier/i.test(result1.error.message) === true);

    // no module at that location
    var badRequire = "require('./asdf')";
    var result2 = makeModule(badRequire);
    assert(/cannot find module/i.test(result2.error.message) === true);

    // throws an exception during execution
    var result3 = makeModule("throw new Error('Kaboom!')");
    assert(result3.error.message === "Kaboom!");
  });

  it("sets .exports to `null` if compile failed", function () {
    var badCode = "module.exports = {a: 1 b: 1};";
    var result1 = makeModule(badCode);
    assert(result1.exports === null);

    var badRequire = "require('./asdf')";
    var result2 = makeModule(badRequire);
    assert(result2.exports === null);

    var result3 = makeModule("throw new Error('Kaboom!')");
    assert(result3.exports === null);
  });

});
