import APIClient from '../APIClient';

export function UpdateSubmissionSettings(bitField: BitField, DMTierLimit: number) {
    return APIClient.put('/notifications/wants', { bitField: bitField.get(), DMTierLimit });
}

// export function UpdateSubmissionSettings(bitField: BitField, DMTierLimit: number) {
//     return APIClient.put('/notifications/wants', { bitField: bitField.get(), DMTierLimit });
// }

export class BitField {
    private bits: number;

    constructor(bits: number) {
        this.bits = bits;
    }

    get() {
        return this.bits;
    }

    add(bit: number) {
        this.bits = this.bits | bit;
    }

    remove(bit: number) {
        this.bits = this.bits - (this.bits & bit);
    }
}