// because we omit the return, this should error with:
// `TypeError: Cannot set property '66' of undefined`
var charCodeMap = [65, 66, 67].reduce(function (map, code) {
  map[code] = String.fromCharCode(code);
}, {});

module.exports = charCodeMap;
