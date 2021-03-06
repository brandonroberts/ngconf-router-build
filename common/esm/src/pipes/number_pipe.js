import { Pipe } from '@angular/core';
import { isNumber, isPresent, isBlank, NumberWrapper, RegExpWrapper } from '../facade/lang';
import { BaseException } from '../facade/exceptions';
import { NumberFormatter, NumberFormatStyle } from '../facade/intl';
import { InvalidPipeArgumentException } from './invalid_pipe_argument_exception';
var defaultLocale = 'en-US';
var _re = RegExpWrapper.create('^(\\d+)?\\.((\\d+)(\\-(\\d+))?)?$');
/**
 * Internal function to format numbers used by Decimal, Percent and Date pipes.
 */
function formatNumber(pipe, value, style, digits, currency = null, currencyAsSymbol = false) {
    if (isBlank(value))
        return null;
    if (!isNumber(value)) {
        throw new InvalidPipeArgumentException(pipe, value);
    }
    var minInt = 1, minFraction = 0, maxFraction = 3;
    if (isPresent(digits)) {
        var parts = RegExpWrapper.firstMatch(_re, digits);
        if (isBlank(parts)) {
            throw new BaseException(`${digits} is not a valid digit info for number pipes`);
        }
        if (isPresent(parts[1])) {
            minInt = NumberWrapper.parseIntAutoRadix(parts[1]);
        }
        if (isPresent(parts[3])) {
            minFraction = NumberWrapper.parseIntAutoRadix(parts[3]);
        }
        if (isPresent(parts[5])) {
            maxFraction = NumberWrapper.parseIntAutoRadix(parts[5]);
        }
    }
    return NumberFormatter.format(value, defaultLocale, style, {
        minimumIntegerDigits: minInt,
        minimumFractionDigits: minFraction,
        maximumFractionDigits: maxFraction,
        currency: currency,
        currencyAsSymbol: currencyAsSymbol
    });
}
export class DecimalPipe {
    transform(value, digits = null) {
        return formatNumber(DecimalPipe, value, NumberFormatStyle.Decimal, digits);
    }
}
DecimalPipe.decorators = [
    { type: Pipe, args: [{ name: 'number' },] },
];
export class PercentPipe {
    transform(value, digits = null) {
        return formatNumber(PercentPipe, value, NumberFormatStyle.Percent, digits);
    }
}
PercentPipe.decorators = [
    { type: Pipe, args: [{ name: 'percent' },] },
];
export class CurrencyPipe {
    transform(value, currencyCode = 'USD', symbolDisplay = false, digits = null) {
        return formatNumber(CurrencyPipe, value, NumberFormatStyle.Currency, digits, currencyCode, symbolDisplay);
    }
}
CurrencyPipe.decorators = [
    { type: Pipe, args: [{ name: 'currency' },] },
];
//# sourceMappingURL=number_pipe.js.map