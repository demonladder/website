import { assert } from 'chai';
import { describe, it } from 'mocha';
import { validateIntChange } from '../src/utils/validators/validateIntChange';

describe('Validator functions', () => {
    describe('validateIntChange()', () => {
        it('should return undefined on empty strings', () => {
            assert.strictEqual(validateIntChange(''), undefined);
        });
        
        it('should return 0 with "0"', () => {
            assert.strictEqual(validateIntChange('0'), 0);
        });

        it('should return null with "regular words"', () => {
            assert.strictEqual(validateIntChange('regular words'), null);
        });

        it('should return null with spaces', () => {
            assert.strictEqual(validateIntChange('    '), null);
        });

        it('should return 3 with "3g"', () => {
            assert.strictEqual(validateIntChange('3g'), 3);
        });

        it('should return null with "asdf3g"', () => {
            assert.strictEqual(validateIntChange('asdf3g'), null);
        });
    });
});