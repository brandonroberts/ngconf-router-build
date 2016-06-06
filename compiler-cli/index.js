"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var codegen_1 = require('./src/codegen');
exports.CodeGenerator = codegen_1.CodeGenerator;
var reflector_host_1 = require('./src/reflector_host');
exports.NodeReflectorHost = reflector_host_1.NodeReflectorHost;
var static_reflector_1 = require('./src/static_reflector');
exports.StaticReflector = static_reflector_1.StaticReflector;
exports.StaticSymbol = static_reflector_1.StaticSymbol;
__export(require('@angular/tsc-wrapped'));
//# sourceMappingURL=index.js.map