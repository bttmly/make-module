var Module = require("module");
var path = require("path");

// copied from node/lib/module.js
function stripBOM (content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

function makeModule (code, where) {
  where = where || "";
  // if file path isn't an absolute path, use process.cwd()
  // as a best guess for how to resolve it.
  if (where.charAt(0) !== "/") {
    where = path.join(process.cwd(), where);
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
