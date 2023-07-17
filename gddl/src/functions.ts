export function ParseDiff(diff: number): string {
    switch(diff) {
        case 0:
            return 'Official Demon';
        case 1:
            return 'Easy Demon';
        case 2:
            return 'Medium Demon';
        case 3:
            return 'Hard Demon';
        case 4:
            return 'Insane Demon';
        case 5:
            return 'Extreme Demon';
        default:
            return 'Unknown'
    }
}

export function ToFixed(f: string, d: number, def: string): string {
    if (isNaN( parseFloat(f))) return def;
    return parseFloat(f).toFixed(d);
}

export function randomBytes(amount: number): string {
    if (amount <= 0) return '';

    const characters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

    let result = '';

    for (let i = 0; i < amount*2; i++) {
        result += characters[Math.floor(Math.random()*16)];
    }

    return result;
}

export function uuid() {
    return randomBytes(4) + '-' + randomBytes(2) + '-' + randomBytes(2) + '-' + randomBytes(2) + '-' + randomBytes(6);
}