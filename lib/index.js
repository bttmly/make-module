var Module = require("module");
var path = require("path");

var assign = require("object-assign");
var stripBOM = require("strip-bom");

function makeModule (code, where) {
  code = stripBOM(code);
  where = where || "";

  if (where.charAt(0) !== "/") {
    var parent = module.parent;
    if (parent) {
      where = path.join(path.dirname(parent.filename), where);
    } else {
      where = path.join(process.cwd(), where);
    }
  }

  var _module = new Module(where, module);

  assign(_module, {
    paths: Module._nodeModulePaths(path.dirname(where)),
    filename: where,
    error: null,
    code: code,
    loaded: true
  });

  try {
    _module._compile(code, where);
  } catch (err) {
    _module.error = err;
    _module.exports = null;
  }

  return _module;
}

module.exports = makeModule;
