import React, { useState } from 'react';

export default function ProblemForm() {
    const [email, setEmail] = useState('');
    const [problemDescription, setProblemDescription] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('https://your-symfony-server.com/submit-problem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, problemDescription }),
        });

        if (response.ok) {
            alert('Problème soumis avec succès. Nous vous recontacterons par email.');
        } else {
            alert('Erreur lors de la soumission du problème.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email:</label>
            <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <label htmlFor="problemDescription">Description du problème:</label>
            <textarea
                id="problemDescription"
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                maxLength={500}
                required
            />
            <button type="submit">Envoyer</button>
        </form>
    );
};
