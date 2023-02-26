import React from 'react';
import { CloseButton } from 'react-bootstrap';

export default function ChangeItem({ change, remove }) {
    let item;

    switch(change.type) {
        case 'add':
            item = `Add ${change.level.Name} to ${change.pack.Name}`;
            break;
        case 'remove':
            item = `Remove ${change.level.Name} from ${change.pack.Name}`;
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