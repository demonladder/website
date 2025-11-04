export default function map(num: number, min: number, max: number, toMin: number, toMax: number) {
    return ((num - min) * (toMax - toMin)) / (max - min) + toMin;
}
