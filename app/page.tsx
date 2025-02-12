'use client';

import { useState } from 'react';
import axios from 'axios';
import '../styles/home.css';

export default function Home() {
    const formatPhoneNumber = (phoneNumber: string) => {
        const cleaned = phoneNumber.replace(/\D/g, '');
        if (cleaned.length !== 10) {
            return null;
        }
        return `1${cleaned}`;
    };

    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        setPhoneNumber(value);
    };

    const makeApiCall = async () => {
        setError('');
        const formattedNumber = formatPhoneNumber(phoneNumber);
        
        if (!formattedNumber) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }

        setIsLoading(true);
        setStatus('Making API call...');

        try {
            const data = {
                pathway_id: "ef791f03-091e-4381-818f-c9798e9a2a30",
                phone_number: formattedNumber,
                model: "enhanced",
                language: "en",
                voice: "nat",
                max_duration: 12,
                record: false
            };

            const response = await axios.post('https://api.bland.ai/v1/calls', data, {
                headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_BLAND_AI_API_KEY}` }
            });
            
            setStatus(`Call initiated successfully! Call ID: ${response.data.call_id}`);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message;
            setStatus(`Error: ${errorMessage}`);
            console.error('API call failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>Hello World</h1>
            <div className="date">January 30, 2025</div>
            <input 
                type="tel" 
                value={phoneNumber}
                onChange={handlePhoneInput}
                className="phone-input" 
                placeholder="Enter phone number (e.g., 8328631936)"
                maxLength={10}
            />
            <div className="error-message">{error}</div>
            <button 
                className="api-button" 
                onClick={makeApiCall} 
                disabled={isLoading}
            >
                Make API Call
                {isLoading && <span className="loading-spinner" />}
            </button>
            <div id="status">{status}</div>
        </div>
    );
}
