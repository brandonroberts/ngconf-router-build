import { Renderer, ElementRef } from '@angular/core';
import { ControlValueAccessor } from './control_value_accessor';
export declare const CHECKBOX_VALUE_ACCESSOR: any;
/**
 * The accessor for writing a value and listening to changes on a checkbox input element.
 *
 *  ### Example
 *  ```
 *  <input type="checkbox" ngControl="rememberLogin">
 *  ```
 *
 *  @experimental
 */
export declare class CheckboxControlValueAccessor implements ControlValueAccessor {
    private _renderer;
    private _elementRef;
    onChange: (_: any) => void;
    onTouched: () => void;
    constructor(_renderer: Renderer, _elementRef: ElementRef);
    writeValue(value: any): void;
    registerOnChange(fn: (_: any) => {}): void;
    registerOnTouched(fn: () => {}): void;
}
