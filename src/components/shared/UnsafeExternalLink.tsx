import { useMemo, useState } from 'react';
import Modal from '../layout/Modal';
import { PrimaryButton } from '../ui/buttons';
import Checkbox from '../input/CheckBox';
import { useTrustedDomains } from '../../hooks/useTrustedDomains';

interface Props {
    children: React.ReactNode;
    to: string;
}

export function UnsafeExternalLink({ children, to }: Props) {
    const [showWarning, setShowWarning] = useState(false);
    const [trustedDomains, setTrustedDomains] = useTrustedDomains();
    const [shouldTrustDomain, setShouldTrustDomain] = useState(false);
    const url = useMemo(() => new URL(to), [to]);
    const isTrusted = useMemo(() => trustedDomains.includes(url.origin), [trustedDomains, url.origin]);

    const handleContinue = () => {
        if (shouldTrustDomain) {
            setTrustedDomains([...trustedDomains, url.origin]);
        }

        setShowWarning(false);
    };

    if (isTrusted) {
        return (
            <a href={to} target='_blank' rel='noopener noreferrer' className='link'>
                {children}
            </a>
        );
    }

    return (
        <>
            <button onClick={() => setShowWarning(true)} className='link'>
                {children}
            </button>
            <Modal onClose={() => setShowWarning(false)} show={showWarning} title='Leaving Site'>
                <p className='mt-2'>Warning: You are about to leave the site!</p>
                <p>
                    Are you sure you want to continue to <b className='text-blue-400'>{to}</b>?
                </p>
                <label className='flex items-center gap-2 my-4'>
                    <Checkbox checked={shouldTrustDomain} onChange={(e) => setShouldTrustDomain(e.target.checked)} />
                    <p>
                        Trust <b>{url.origin}</b> links from now on
                    </p>
                </label>
                <div className='flex gap-2 justify-end mt-4'>
                    <a href={to} target='_blank' rel='noopener noreferrer' onClick={handleContinue} className='mx-2'>
                        Continue
                    </a>
                    <PrimaryButton onClick={() => setShowWarning(false)}>Cancel</PrimaryButton>
                </div>
            </Modal>
        </>
    );
}
