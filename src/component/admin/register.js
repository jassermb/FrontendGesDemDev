import React, { useState } from 'react';
import {
    MDBBtn,
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBCheckbox,
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem,
} from 'mdb-react-ui-kit';
import { motion } from 'framer-motion';

const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState('');
    const [role, setRole] = useState('Sélectionnez un rôle');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Implémentation de la soumission (AJAX POST request ici)
        // Exemple : setSuccess("Utilisateur créé avec succès !");
    };

    return (
        <MDBContainer fluid className='d-flex align-items-center justify-content-center' style={{
            backgroundImage: 'url(https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp)',
            height: '100vh',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
        }}>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)'
            }}></div>
            <MDBCard className='m-4' style={{ maxWidth: '500px', borderRadius: '15px', overflow: 'hidden' }}>
                <MDBCardBody className='px-4'>
                    <h2 className="text-uppercase text-center mb-4" style={{ color: '#ffffff' }}>Créer un Utilisateur</h2>
                    <form onSubmit={handleSubmit}>
                        <MDBInput
                            wrapperClass='mb-4'
                            label='Votre Email'
                            size='lg'
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ backgroundColor: '#ffffff', borderRadius: '8px' }}
                        />
                        <MDBInput
                            wrapperClass='mb-4'
                            label='Mot de Passe'
                            size='lg'
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ backgroundColor: '#ffffff', borderRadius: '8px' }}
                        />
                        <MDBInput
                            wrapperClass='mb-4'
                            label='Avatar URL (optionnel)'
                            size='lg'
                            type='text'
                            value={avatar}
                            onChange={(e) => setAvatar(e.target.value)}
                            style={{ backgroundColor: '#ffffff', borderRadius: '8px' }}
                        />

                        <MDBDropdown className="mb-4 w-100">
                            <MDBDropdownToggle
                                className="btn btn-outline-light w-100"
                                style={{
                                    borderRadius: '8px',
                                    backgroundColor: '#007bff',
                                    color: '#ffffff',
                                    border: 'none',
                                    transition: 'background-color 0.3s, color 0.3s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#0056b3'; // Changement de couleur au survol
                                    e.currentTarget.style.color = '#ffffff';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#007bff'; // Rétablissement de la couleur
                                    e.currentTarget.style.color = '#ffffff';
                                }}
                            >
                                {role}
                            </MDBDropdownToggle>
                            <MDBDropdownMenu style={{ borderRadius: '8px', padding: '0' }}>
                                <MDBDropdownItem
                                    onClick={() => setRole('COO')}
                                    style={{
                                        padding: '10px 20px',
                                        transition: 'background-color 0.2s',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    COO
                                </MDBDropdownItem>
                                <MDBDropdownItem
                                    onClick={() => setRole('Chef de Produit')}
                                    style={{
                                        padding: '10px 20px',
                                        transition: 'background-color 0.2s',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    Chef de Produit
                                </MDBDropdownItem>
                                <MDBDropdownItem
                                    onClick={() => setRole('Responsable d\'Achat')}
                                    style={{
                                        padding: '10px 20px',
                                        transition: 'background-color 0.2s',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    Responsable d'Achat
                                </MDBDropdownItem>
                            </MDBDropdownMenu>
                        </MDBDropdown>


                        <MDBCheckbox
                            name='flexCheck'
                            id='flexCheckDefault'
                            label='Je suis d’accord avec tous les termes du service'
                            className='mb-4'
                        />

                        <MDBBtn
                            className='mb-4 w-100'
                            size='lg'
                            type='submit'
                            style={{ backgroundColor: '#007bff', borderRadius: '8px', color: '#ffffff' }}>
                            Créer
                        </MDBBtn>

                        {error && <div className="alert alert-danger" style={{ textAlign: 'center' }}>{error}</div>}
                        {success && <div className="alert alert-success" style={{ textAlign: 'center' }}>{success}</div>}
                    </form>
                </MDBCardBody>
            </MDBCard>
        </MDBContainer>
    );
};

export default RegisterForm;
