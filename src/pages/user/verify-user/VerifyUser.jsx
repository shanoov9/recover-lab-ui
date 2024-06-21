import React, { useContext, useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { redirect, useLocation, useNavigate } from 'react-router-dom';
import { UserServiceApis } from '../../../services/apiService';
import toast from 'react-hot-toast';
import UserContext from '../../../contexts/UserContext';

const VerifyUser = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const { getUserInformation } = useContext(UserContext);

    const [otp, setOtp] = useState('');

    const handleOtpChange = (e) => {
        setOtp(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Perform required checks on the OTP
        if (otp.length !== 6) {
            toast.error('Please enter a valid OTP.');
            return;
        }
        // Perform required checks on the email
        if (!location?.state?.email) {
            toast.error('Invalid email address. Please try again.');
            return navigate('/login')
        }

        const body = {
            email: location?.state?.email,
            otp: otp
        }

        // Call the verifyUser API
        UserServiceApis.verifyUser(body).then(response => {
            console.log(response);
            if (response.data.status === true) {
                toast.success('Verification successful.')
                let token = response.data.data.token;
                localStorage.setItem('RLQ_Token', token);
                getUserInformation(token);
                navigate('/');
            } else {
                toast.error('Verification failed. Please try again.');
            }
        }).catch(error => {
            console.log(error);
            toast.error('Verification failed. Please try again.');
        });
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
                        <h1>Verify User</h1>
                    </Container>
                </div>
            </div>
            <div className='my-4 d-grid col-4 mx-auto'>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="otp" className='mb-2'>
                        <Form.Label>Enter OTP: {location?.state?.email}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            minLength={6}
                            maxLength={6}
                            onChange={handleOtpChange}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Verify
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default VerifyUser;