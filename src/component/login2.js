// src/component/login2.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import '../css/login2.css';
import ImageCarousel from '../component/imagecarousel';
import '../css/imagecarousel.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Login2 = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/users/login', {
                email,
                password
            });
            localStorage.setItem('role', response.data.role);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userId);
            navigate('/tableau');
        } catch (error) {
            console.error('Login error', error);
            toast.error(`Échec de la connexion : Nom d'utilisateur ou mot de passe incorrect`, {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

        }
    };
    return (
        <div className="login2-container">
            <div className="login2-box">
                <div className="login2-logo-container">
                    <img src="/img/logo.png" alt="Logo" className="login2-page-logo" />
                </div>
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 style={{color:'#18181bdd'}}>Se connecter</h2>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    <form onSubmit={handleSubmit}>
                        <div className="login2-input-group">
                            <FaEnvelope />
                            <input
                                className="in"
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="login2-input-group">
                            <FaLock />
                            <input
                                className="in"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {/* <div className="login2-options">
                            <label>
                                <input type="checkbox" />
                                Remember me
                            </label>
                            <a href="/">Forgot password?</a>
                        </div> */}
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="login2-button"
                        >
                            Accéder
                        </motion.button>
                    </form>
                </motion.div>
            </div>
            <motion.div
                className="login2-image"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <ImageCarousel />
            </motion.div>
            <ToastContainer />
        </div>
    );
};

export default Login2;
