var path = require("path");
var fs = require("fs");
var assert = require("assert");

var createModule = require("..");

var code = fs.readFileSync(joinHere("./example/calc.js")).toString();

function joinHere (where) {
  return path.join(__dirname, where);
}

describe("createModule()", function () {
  it("example works as expected normally", function () {
    var calc = require("./example/calc");
    assert(typeof calc.add === "function");
    assert(typeof calc.subtract === "function");
  });

  it("creates modules from arbitrary code", function () {
    var code = "module.exports = {works: true};"
    var result = createModule(code);
    assert(result.exports.works === true);
  });

  it("example is able to properly require dependencies given a good absolute path", function () {
    var result = createModule(code, joinHere("./example/calc.js"));
    assert(typeof result.exports.add === "function");
    assert(typeof result.exports.subtract === "function");
  });

  it("joins path to process.cwd() if path not absolute", function () {
    var result = createModule(code, "test/example/calc.js");
    assert(typeof result.exports.add === "function");
    assert(typeof result.exports.subtract === "function");
  });
});
