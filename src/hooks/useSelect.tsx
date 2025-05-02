import { useState } from 'react';
import Select from '../components/Select';

export default function useSelect({ ID, options }: { ID: string, options: { [key: string]: string }}) {
    const [key, setKey] = useState(Object.keys(options)[0]);

    return {
        activeElement: key,
        Select: (<Select id={ID} options={options} activeKey={key} onChange={setKey} />)
    };
}
