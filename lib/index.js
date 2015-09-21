var Module = require("module");
var path = require("path");

var assign = require("object-assign");
var stripBOM = require("strip-bom");
var callsite = require("callsite");

function tryCompile (_module, code, where) {
  try {
    _module._compile(code, where);
  } catch (err) {
    _module.error = err;
    _module.exports = null;
  }
}

function makeModule (code, where) {
  code = stripBOM(code);
  where = where || "";
  
  if (where.charAt(0) !== "/") {
    var parent = callsite()[1];
    if (parent) {
      where = path.join(path.dirname(parent.getFileName()), where);
    } else {
      where = path.join(process.cwd(), where);
    }
  }

  var result = new Module(where, module);
  
  assign(result, {
    paths: Module._nodeModulePaths(path.dirname(where)),
    filename: where,
    error: null,
    code: code,
    loaded: true
  });

  tryCompile(result, code, where);

  return result;
}

module.exports = makeModule;
