export default function randomBytes(amount: number): string {
    if (amount <= 0) return '';

    const characters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

    let result = '';

    for (let i = 0; i < amount*2; i++) {
        result += characters[Math.floor(Math.random()*16)];
    }

    return result;
}