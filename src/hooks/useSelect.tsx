import { useState } from 'react';
import Select from '../components/shared/input/Select';

export default function useSelect({ ID, options }: { ID: string; options: { [key: string]: string } }) {
    const [key, setKey] = useState(Object.keys(options)[0]);

    return {
        activeElement: key,
        Select: <Select<Record<string, string>> id={ID} options={options} activeKey={key} onChange={setKey} />,
    };
}
