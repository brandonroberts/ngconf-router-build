import { isPresent } from '../../facade/lang';
import { unimplemented } from '../../facade/exceptions';
/**
 * Base class for control directives.
 *
 * Only used internally in the forms module.
 *
 * @experimental
 */
export class AbstractControlDirective {
    get control() { return unimplemented(); }
    get value() { return isPresent(this.control) ? this.control.value : null; }
    get valid() { return isPresent(this.control) ? this.control.valid : null; }
    get errors() {
        return isPresent(this.control) ? this.control.errors : null;
    }
    get pristine() { return isPresent(this.control) ? this.control.pristine : null; }
    get dirty() { return isPresent(this.control) ? this.control.dirty : null; }
    get touched() { return isPresent(this.control) ? this.control.touched : null; }
    get untouched() { return isPresent(this.control) ? this.control.untouched : null; }
    get path() { return null; }
}
//# sourceMappingURL=abstract_control_directive.js.map