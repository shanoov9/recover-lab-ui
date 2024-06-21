import React, { useState, useContext } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiUnlock } from "react-icons/fi";
import { UserServiceApis } from '../../../services/apiService';
import UserContext from '../../../contexts/UserContext';
import { toast } from 'react-hot-toast';

const Login = () => {

    const { getUserInformation } = useContext(UserContext);

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,5}$/
    const validateForm = () => {
        if (!email.match(emailRegex)) {
            toast.error('Please enter a valid email address.');
            return false;
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            let loginData = {
                email: email,
                password: password
            };
            console.log(loginData);
            UserServiceApis.loginUser(loginData).then(response => {
                console.log(response);
                if (response.data.status === true) {
                    toast.success('Login successful.')
                    let token = response.data.data.token;
                    localStorage.setItem('RLQ_Token', token);
                    getUserInformation(token);
                    navigate('/');
                } else {
                    if (response.data.status === 402) {
                        toast('Please verify your email address.', { icon: '📧' })
                        navigate('/verify-user', { state: { email: email } });
                    } else {
                        toast.error('Login failed. Please try again.');
                    }
                }
            }).catch(error => {
                console.log(error);
                toast.error('Login failed. Please try again.');
            }
            );
        }
    };

    return (
        <div>
            <div className='inner-hero'>
                <div className='inner-hero-image'>
                    <img src='./assets/img/inner-banner.png' />
                </div>
                <div className='herotext wow fadeInUp'>
                    <Container>
                        <h2>Recovery Lab Qatar</h2>
                        <h1>Login</h1>
                    </Container>
                </div>
            </div>
            <div className='section-padd login-con formStyles'>
                <Container>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formEmail" className='mb-3 position-relative'>
                            <i className='icons-fields'><FiUser /></i>
                            <Form.Label>Email address <sup>*</sup></Form.Label>
                            <Form.Control type="email" placeholder="Ex:jhone.smit@gmail.com" value={email} pattern={emailRegex} onChange={(e) => setEmail(e.target.value)} />
                        </Form.Group>

                        <Form.Group controlId="formPassword" className='mb-3 position-relative'>
                            <i className='icons-fields'><FiUnlock /></i>
                            <Form.Label>Password <sup>*</sup></Form.Label>
                            <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>

                        <div className='my-4'>
                            <Button variant="primary" type="submit" className='lh-lg w-100' >Log in</Button>
                            <div className='text-center mt-3'><Link to='/forgot-password' className='btn-info'>Forgot Password</Link></div>
                            <div className='text-center mt-4'>Don't have an account? <Link to='/register' className='btn-info'>Sign up Here</Link></div>
                        </div>
                    </Form>
                </Container>
            </div>
        </div>
    );
};

export default Login;