import React, { useState } from 'react';

type FormEvent = React.FormEvent<HTMLInputElement>

export default function SearchBar() {
    const [address, setAddress] = useState<string>('');
    const [postalCode, setPostalCode] = useState<string>();
    console.log(address);


    return (
        <>
            <input value={address} onChange={(e: FormEvent) => setAddress(e.target.value)} />
            <input />
        </>
    );
}
