var Module = require("module");
var path = require("path");

var callsite = require("callsite");

// copied from node/lib/module.js
function stripBOM (content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

function makeModule (code, where) {
  where = where || "";
  
  if (where.charAt(0) !== "/") {
    var stack = callsite();
    var parent = stack[1];
    if (parent) {
      where = path.join(path.dirname(parent.getFileName()), where);
    } else {
      where = path.join(process.cwd(), where);
    }
  }

  var result = new Module(where, module);
  code = stripBOM(code);
  result.paths = Module._nodeModulePaths(path.dirname(where));
  result.filename = where;
  result._compile(code, where);
  result.loaded = true;
  return result;
}

module.exports = makeModule;
