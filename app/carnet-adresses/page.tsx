import React, { useState, useEffect } from 'react';
import { Search, Plus, User, Phone, Mail, MapPin, Heart, Edit2, Trash2, X, Save, ArrowLeft } from 'lucide-react';

const AddressBookApp = () => {
   
    return (
        <div 
        style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', height: '100%', color: '#aaa', textAlign: 'center',
            padding: '40px'
        }}>
            <User size={80} style={{ marginBottom: '20px', opacity: 0.3 }} />
            <p style={{ fontFamily: '"Instrument Serif", serif', fontSize: '24px', margin: '0 0 10px 0', color: '#2d2d2d' }}>
                Sélectionnez un contact
            </p>
            <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '15px', fontWeight: '300' }}>
                Cliquez sur un contact pour voir ses détails
            </p>



        </div >
    );
};

export default AddressBookApp;


