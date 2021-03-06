import * as o from '../output/output_ast';
import { CompileDirectiveMetadata } from "../compile_metadata";
export declare class CompiledAnimation {
    name: string;
    statesMapStatement: o.Statement;
    statesVariableName: string;
    fnStatement: o.Statement;
    fnVariable: o.Expression;
    constructor(name: string, statesMapStatement: o.Statement, statesVariableName: string, fnStatement: o.Statement, fnVariable: o.Expression);
}
export declare class AnimationCompiler {
    compileComponent(component: CompileDirectiveMetadata): CompiledAnimation[];
}
