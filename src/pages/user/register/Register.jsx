import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { UserServiceApis } from '../../../services/apiService';
import toast from 'react-hot-toast';

const Register = () => {
    const navigate = useNavigate();

    const [isFormValid, setIsFormValid] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');
    const [countryCode, setCountryCode] = useState('+974');
    const [contactNumber, setContactNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [countries, setCountries] = useState([]);

    useEffect(() => {
        fetch("https://gist.githubusercontent.com/anubhavshrimal/75f6183458db8c453306f93521e93d37/raw/f77e7598a8503f1f70528ae1cbf9f66755698a16/CountryCodes.json")
            .then(res => res.json())
            .then(data => setCountries(data));
    }, []);



    // const handleChange = (e) => {
    //     setFormData({ ...formData, [e.target.name]: e.target.value });
    // };

    const handleSubmit = (e) => {
        let form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
            setIsFormValid(true);
            window.scrollTo(0, 370);
            return;
        }
        setIsFormValid(true);
        e.preventDefault();
        let formData = {
            firstName: firstName,
            lastName: lastName,
            gender: gender,
            dob: dob,
            email: email,
            contactNumber: `${countryCode}-${contactNumber}`,
            password: password,
            confirmPassword: confirmPassword,
            userType: 1
        };
        console.log(formData);
        UserServiceApis.registerUser(formData).then(response => {
            console.log(response);
            if (response.data.status === true) {
                toast.success('Registration successful. Please login.');
                navigate('/login');
            } else {
                toast.error(response.data.message);
            }
        }
        ).catch(error => {
            console.log(error);
            toast.error('Registration failed. Please try again.');
        });
    };

    return (
        <div className="register-page">
            <div className='inner-hero'>
                <div className='inner-hero-image'>
                    <img src='./assets/img/inner-banner.png' />
                </div>
                <div className='herotext wow fadeInUp'>
                    <Container>
                        <h2>Recovery Lab Qatar</h2>
                        <h1>Register</h1>
                    </Container>
                </div>
            </div>
            <section className='py-5 formStyles'>
                <div className='container'>
                    <Form onSubmit={handleSubmit} noValidate validated={isFormValid}>
                        {/* Firstname and lastname */}
                        <Row>
                            <Col md={6} className='mb-3'>
                                <Form.Group controlId="firstName">
                                    <Form.Label>First Name <sup>*</sup></Form.Label>
                                    <div className="input-icon">
                                        <Form.Control
                                            type="text"
                                            name="firstName"
                                            placeholder='John'
                                            value={firstName}
                                            onChange={e => setFirstName(e.target.value)}
                                            required
                                            minLength={3}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please provide a valid First Name.
                                        </Form.Control.Feedback>
                                    </div>
                                </Form.Group>
                            </Col>
                            <Col md={6} className='mb-3'>
                                <Form.Group controlId="lastName">
                                    <Form.Label>Last Name <sup>*</sup></Form.Label>
                                    <div className="input-icon">
                                        <Form.Control
                                            type="text"
                                            name="lastName"
                                            placeholder='Doe'
                                            value={lastName}
                                            onChange={e => setLastName(e.target.value)}
                                            required
                                            minLength={3}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please provide a valid Last Name.
                                        </Form.Control.Feedback>
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>
                        {/* Date of birth and gender */}
                        <Row>
                            <Col md={6} className='mb-3'>
                                <Form.Group controlId="dob">
                                    <Form.Label>Date of Birth <sup>*</sup></Form.Label>
                                    <div className="input-icon">
                                        <Form.Control
                                            type="date"
                                            name="dob"
                                            value={dob}
                                            onChange={e => setDob(e.target.value)}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please provide a valid Date of Birth.
                                        </Form.Control.Feedback>
                                    </div>
                                </Form.Group>
                            </Col>

                            <Col md={6} className='mb-3'>
                                <Form.Group controlId="gender">
                                    <Form.Label>Gender <sup>*</sup></Form.Label>
                                    <div className="input-icon">
                                        <Form.Select
                                            value={gender}
                                            onChange={e => setGender(e.target.value)}
                                            name='gender'
                                            id='gender'
                                            required
                                        >
                                            <option value="" disabled>Select gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            Please select Gender
                                        </Form.Control.Feedback>
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>
                        {/* Email and contactNumber */}
                        <Row>
                            <Col md={6} className='mb-3'>
                                <Form.Group controlId="email">
                                    <Form.Label>Email <sup>*</sup></Form.Label>
                                    <div className="input-icon">
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            placeholder='john@example.com'
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please provide a valid Email.
                                        </Form.Control.Feedback>
                                    </div>
                                </Form.Group>
                            </Col>
                            <Col md={6} className='mb-3'>
                                <Form.Group controlId="contactNumber">
                                    <Form.Label>Mobile <sup>*</sup></Form.Label>
                                    <div className="input-icon d-flex">
                                        <Form.Select
                                            aria-label="Country code"
                                            style={{ width: '110px' }}
                                            value={countryCode}
                                            onChange={e => setCountryCode(e.target.value)}
                                            required
                                        >
                                            {countries.map((country, index) => (
                                                <option selected={country.dial_code === "+974"} key={index} value={country.dial_code}>{country.code} ({country.dial_code})</option>
                                            ))}
                                        </Form.Select>
                                        <div>
                                            <Form.Control
                                                type="tel"
                                                name="contactNumber"
                                                className='w-100'
                                                placeholder='9876543210'
                                                value={contactNumber}
                                                onChange={e => setContactNumber(e.target.value.replace(/[^0-9]/, ''))}
                                                pattern='^(?:\+974|0)?(\d{8,10})$'
                                                maxLength={11}
                                                required
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Please provide a valid Mobile number.
                                            </Form.Control.Feedback>
                                        </div>
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>
                        {/* Password and confirm password */}
                        <Row>
                            <Col md={6} className='mb-3'>
                                <Form.Group controlId="password">
                                    <Form.Label>Password <sup>*</sup></Form.Label>
                                    <div className="input-icon">
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            placeholder='Password'
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(.{8,})$"
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please choose a valid Password.
                                        </Form.Control.Feedback>
                                    </div>
                                </Form.Group>
                            </Col>
                            <Col md={6} className='mb-3'>

                                <Form.Group controlId="confirmPassword">
                                    <Form.Label>Confirm Password <sup>*</sup></Form.Label>
                                    <div className="input-icon">
                                        <Form.Control
                                            type="password"
                                            name="confirmPassword"
                                            placeholder='Confirm Password'
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            pattern={`^${password}$`}
                                            disabled={password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(.{8,})$/) ? false : true}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Confirm password must match password.
                                        </Form.Control.Feedback>
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className='mt-3 password-sce'>
                            <h6>Password must contain at least: </h6>
                            <ul>
                                <li>8 characters</li>
                                <li>One uppercase letter</li>
                                <li>One lowercase letter</li>
                                <li>One special character</li>
                                <li>One Number</li>
                            </ul>
                        </div>

                        <div className='my-4'>
                            <Button variant="primary" type="submit" className='lh-lg w-100' >Register</Button>
                            <div className='text-center mt-4'>Already have an account? <Link to='/login' className='btn-info'>Login Here</Link></div>

                        </div>
                    </Form>

                </div>
            </section>
        </div>
    );
};

export default Register;