"use strict";
var static_reflector_1 = require('./static_reflector');
var ts = require('typescript');
var tsc_wrapped_1 = require('@angular/tsc-wrapped');
var fs = require('fs');
var path = require('path');
var compiler_private_1 = require('./compiler_private');
var EXT = /(\.ts|\.d\.ts|\.js|\.jsx|\.tsx)$/;
var DTS = /\.d\.ts$/;
var NodeReflectorHost = (function () {
    function NodeReflectorHost(program, compilerHost, options) {
        this.program = program;
        this.compilerHost = compilerHost;
        this.options = options;
        this.metadataCollector = new tsc_wrapped_1.MetadataCollector();
        this.typeCache = new Map();
    }
    NodeReflectorHost.prototype.angularImportLocations = function () {
        return {
            coreDecorators: '@angular/core/src/metadata',
            diDecorators: '@angular/core/src/di/decorators',
            diMetadata: '@angular/core/src/di/metadata',
            animationMetadata: '@angular/core/src/animation/metadata',
            provider: '@angular/core/src/di/provider'
        };
    };
    NodeReflectorHost.prototype.resolve = function (m, containingFile) {
        var resolved = ts.resolveModuleName(m, containingFile, this.options, this.compilerHost).resolvedModule;
        return resolved ? resolved.resolvedFileName : null;
    };
    ;
    NodeReflectorHost.prototype.normalizeAssetUrl = function (url) {
        var assetUrl = compiler_private_1.AssetUrl.parse(url);
        return assetUrl ? assetUrl.packageName + "/" + assetUrl.modulePath : null;
    };
    NodeReflectorHost.prototype.resolveAssetUrl = function (url, containingFile) {
        var assetUrl = this.normalizeAssetUrl(url);
        if (assetUrl) {
            return this.resolve(assetUrl, containingFile);
        }
        return url;
    };
    /**
     * We want a moduleId that will appear in import statements in the generated code.
     * These need to be in a form that system.js can load, so absolute file paths don't work.
     * Relativize the paths by checking candidate prefixes of the absolute path, to see if
     * they are resolvable by the moduleResolution strategy from the CompilerHost.
     */
    NodeReflectorHost.prototype.getImportPath = function (containingFile, importedFile) {
        importedFile = this.resolveAssetUrl(importedFile, containingFile);
        containingFile = this.resolveAssetUrl(containingFile, '');
        // TODO(tbosch): if a file does not yet exist (because we compile it later),
        // we still need to create it so that the `resolve` method works!
        if (!this.compilerHost.fileExists(importedFile)) {
            if (this.options.trace) {
                console.log("Generating empty file " + importedFile + " to allow resolution of import");
            }
            this.compilerHost.writeFile(importedFile, '', false);
            fs.writeFileSync(importedFile, '');
        }
        var importModuleName = importedFile.replace(EXT, '');
        var parts = importModuleName.split(path.sep).filter(function (p) { return !!p; });
        for (var index = parts.length - 1; index >= 0; index--) {
            var candidate_1 = parts.slice(index, parts.length).join(path.sep);
            if (this.resolve('.' + path.sep + candidate_1, containingFile) === importedFile) {
                return "./" + candidate_1;
            }
            if (this.resolve(candidate_1, containingFile) === importedFile) {
                return candidate_1;
            }
        }
        // Try a relative import
        var candidate = path.relative(path.dirname(containingFile), importModuleName);
        if (this.resolve(candidate, containingFile) === importedFile) {
            return candidate;
        }
        throw new Error("Unable to find any resolvable import for " + importedFile + " relative to " + containingFile);
    };
    NodeReflectorHost.prototype.findDeclaration = function (module, symbolName, containingFile, containingModule) {
        if (!containingFile || !containingFile.length) {
            if (module.indexOf(".") === 0) {
                throw new Error("Resolution of relative paths requires a containing file.");
            }
            // Any containing file gives the same result for absolute imports
            containingFile = path.join(this.options.basePath, 'index.ts');
        }
        try {
            var assetUrl = this.normalizeAssetUrl(module);
            if (assetUrl) {
                module = assetUrl;
            }
            var filePath = this.resolve(module, containingFile);
            if (!filePath) {
                throw new Error("Could not resolve module " + module + " relative to " + containingFile);
            }
            var tc = this.program.getTypeChecker();
            var sf = this.program.getSourceFile(filePath);
            var symbol = tc.getExportsOfModule(sf.symbol).find(function (m) { return m.name === symbolName; });
            if (!symbol) {
                throw new Error("can't find symbol " + symbolName + " exported from module " + filePath);
            }
            if (symbol &&
                symbol.flags & ts.SymbolFlags.Alias) {
                symbol = tc.getAliasedSymbol(symbol);
            }
            var declaration = symbol.getDeclarations()[0];
            var declarationFile = declaration.getSourceFile().fileName;
            return this.getStaticSymbol(declarationFile, symbol.getName());
        }
        catch (e) {
            console.error("can't resolve module " + module + " from " + containingFile);
            throw e;
        }
    };
    /**
     * getStaticSymbol produces a Type whose metadata is known but whose implementation is not loaded.
     * All types passed to the StaticResolver should be pseudo-types returned by this method.
     *
     * @param declarationFile the absolute path of the file where the symbol is declared
     * @param name the name of the type.
     */
    NodeReflectorHost.prototype.getStaticSymbol = function (declarationFile, name) {
        var key = "\"" + declarationFile + "\"." + name;
        var result = this.typeCache.get(key);
        if (!result) {
            result = new static_reflector_1.StaticSymbol(declarationFile, name);
            this.typeCache.set(key, result);
        }
        return result;
    };
    // TODO(alexeagle): take a statictype
    NodeReflectorHost.prototype.getMetadataFor = function (filePath) {
        if (!fs.existsSync(filePath)) {
            throw new Error("No such file '" + filePath + "'");
        }
        if (DTS.test(filePath)) {
            var metadataPath = filePath.replace(DTS, '.metadata.json');
            if (fs.existsSync(metadataPath)) {
                return this.readMetadata(metadataPath);
            }
        }
        var sf = this.program.getSourceFile(filePath);
        if (!sf) {
            throw new Error("Source file " + filePath + " not present in program.");
        }
        var metadata = this.metadataCollector.getMetadata(sf);
        return metadata;
    };
    NodeReflectorHost.prototype.readMetadata = function (filePath) {
        try {
            var result = JSON.parse(fs.readFileSync(filePath, { encoding: 'utf-8' }));
            return result;
        }
        catch (e) {
            console.error("Failed to read JSON file " + filePath);
            throw e;
        }
    };
    return NodeReflectorHost;
}());
exports.NodeReflectorHost = NodeReflectorHost;
//# sourceMappingURL=reflector_host.js.map