const chances = {
    exclamation: 0.2,
    stutter: 0.3,
    preSuffix: 0.2,
    suffix: 0.7,
    duplicateCharacter: 0.4,
};

const preSuffixes = [
    ',',
    '\\~',
    '\\~\\~',
];

const suffixes = [
    ':flushed\\:',
    '<{^v^}>',
    '^ ^ ;;',
    '-.-',
    '>.<',
    '>-<',
    '>_<',
    '>w<',
    'uwu',
    'uwu\\~\\~',
    'rawr',
    'rawr\\~',
    'rawr\\~\\~ x3',
    'owo',
    'nyaa',
    'nya\\~\\~',
    ':D',
    ':P',
    'xD',
    'x3',
    ':3',
    ';3',
    'w',
    ',',
];

export function toUwU(text: string) {
    const replaced = text.split(' ').map((s) => wordToUwU(s)).join(' ');

    return replaced;
}

function wordToUwU(word: string) {
    let replaced = word
        .toLowerCase()
        .replaceAll('r', 'w')
        .replaceAll('l', 'w')
        .replace(/(.p)o(w)/, '$1a$2')
        .replace(/(n)([aeiou])/, '$1y$2');

    const first = replaced.charAt(0);
    const last = replaced.at(-1);
    if (last === undefined) return replaced;

    if (/[a-z]/.test(first)) {
        if (Math.random() < chances.stutter) {
            replaced = first + '-' + replaced;
        }
    }

    if (last === ',') {
        if (Math.random() < chances.duplicateCharacter) {
            replaced += ',,';
        }
    } else if (last === '.') {
        if (Math.random() < chances.exclamation) {
            replaced = replaced.replace(/(\.)$/, '!');
        }
    }

    if ([',', '.', '!', '-', '?'].includes(last)) {
        if (Math.random() < chances.preSuffix) {
            replaced += preSuffixes[Math.floor(Math.random() * preSuffixes.length)];
        }

        if (Math.random() < chances.suffix) {
            replaced += ' ' + suffixes[Math.floor(Math.random() * suffixes.length)];
        }
    }

    return replaced;
}
