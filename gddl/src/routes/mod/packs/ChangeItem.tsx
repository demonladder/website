import React from 'react';
import { CloseButton } from 'react-bootstrap';
import { Level } from '../../../api/levels';
import { Pack } from '../../../api/packs';

export type PackChange = {
    Level: Level,
    Pack: Pack,
    Type: string,
    ID: any,
}

type Props = {
    change: PackChange,
    remove: (change: PackChange) => void,
}

export default function ChangeItem({ change, remove }: Props) {
    if (!change.Level) {
        return <></>;
    }

    let item;

    switch(change.Type) {
        case 'add':
            item = `Add ${change.Level.Name} to ${change.Pack.Name}`;
            break;
        case 'remove':
            item = `Remove ${change.Level.Name} from ${change.Pack.Name}`;
            break;
        default:
            item = 'Unknown change';
            break;
    }

    return (
        <div className='d-flex mb-2'>
            <CloseButton variant='white' className='me-3' onClick={() => remove(change.ID)} />
            <p className='m-0'>{item}</p>
        </div>
    );
}