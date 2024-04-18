import React, { useState } from 'react';


type FormEvent = React.FormEvent<HTMLInputElement>

export default function SearchBar() {
    const [address, setAddress] = useState<string>('');
    const [postalCode, setPostalCode] = useState<string>();
    console.log(address);


    return (
        <>
            <input placeholder='Adresse'value={address} onChange={(e: FormEvent) => setAddress(e.target.value)} />
            <input maxLength="5" placeholder='Code Postal' value={postalCode} onChange={(e:FormEvent) => setPostalCode(e.target.value)}/>
        </>
    );
}
