import { Directive, ViewContainerRef, Attribute, ReflectiveInjector } from '@angular/core';
import { RouterOutletMap } from '../router';
import { DEFAULT_OUTLET_NAME } from '../constants';
import { isPresent, isBlank } from '../facade/lang';
export class RouterOutlet {
    constructor(parentOutletMap, _location, name) {
        this._location = _location;
        parentOutletMap.registerOutlet(isBlank(name) ? DEFAULT_OUTLET_NAME : name, this);
    }
    deactivate() {
        this._activated.destroy();
        this._activated = null;
    }
    /**
     * Returns the loaded component.
     */
    get component() { return isPresent(this._activated) ? this._activated.instance : null; }
    /**
     * Returns true is the outlet is not empty.
     */
    get isActivated() { return isPresent(this._activated); }
    /**
     * Called by the Router to instantiate a new component.
     */
    activate(factory, providers, outletMap) {
        this.outletMap = outletMap;
        let inj = ReflectiveInjector.fromResolvedProviders(providers, this._location.parentInjector);
        this._activated = this._location.createComponent(factory, this._location.length, inj, []);
        return this._activated;
    }
}
RouterOutlet.decorators = [
    { type: Directive, args: [{ selector: 'router-outlet' },] },
];
RouterOutlet.ctorParameters = [
    { type: RouterOutletMap, },
    { type: ViewContainerRef, },
    { type: undefined, decorators: [{ type: Attribute, args: ['name',] },] },
];
//# sourceMappingURL=router_outlet.js.map