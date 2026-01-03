import _ from 'lodash';

function getCharacterVariety(text: string) {
    let variety = 0;

    if (/[0-9]/.test(text)) variety += 10;
    if (/[a-z]/.test(text)) variety += 26;
    if (/[A-Z]/.test(text)) variety += 26;
    if (/\W|_/.test(text)) variety += 32;

    return variety;
}

export function getPasswordStrength(password: string) {
    const entropy = password === '' ? 0 : Math.log2(getCharacterVariety(password)) * password.length;
    const secondsToCrack = 2 ** entropy / 1e9;
    return _.clamp(secondsToCrack ** 0.1466321, 0, 100);
}
