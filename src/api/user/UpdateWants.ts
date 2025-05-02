import APIClient from '../APIClient';

export default async function UpdateSubmissionSettings(bitField: BitField, DMTierLimit: number) {
    await APIClient.patch('/wants', { bitField: bitField.bits, DMTierLimit });
}

export class BitField {
    private _bits: number;
    get bits(): number {
        return this._bits;
    }

    constructor(bits: number) {
        this._bits = bits;
    }

    add(bit: number) {
        this._bits = this._bits | bit;
    }

    remove(bit: number) {
        this._bits = this._bits - (this._bits & bit);
    }
}
