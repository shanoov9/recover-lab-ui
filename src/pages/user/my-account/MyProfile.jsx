import React from "react"
import { Container, Row, Col, Form } from 'react-bootstrap';
import UserNav from "./UserNav";
import { useContext } from "react";
import UserContext from "../../../contexts/UserContext";
import { useState } from "react";
import { FiCheck, FiLogOut } from "react-icons/fi";
import { ALL_LANGUAGES } from "../../../services/constants";
import { useEffect } from "react";
import { UserServiceApis } from "../../../services/apiService";
import { toast } from "react-hot-toast";

function MyProfile(props) {
    console.log("profile", props)

    const { user, logoutUser } = useContext(UserContext);
    console.log(user)

    const [editing, setEditing] = useState(false);

    const [userData, setUserData] = useState({})

    // password change
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    useEffect(() => {
        setUserData(user)
    }, [user])

    const handleUpdateUserSaveClick = (e) => {
        e.preventDefault();
        console.log(userData);
        UserServiceApis.updateUserInfo(userData)
            .then((res) => {
                console.log(res)
                if (res.data.status === true) {
                    toast.success("Details Saved Successfully")
                    setEditing(false)
                } else {
                    toast.error("Something went wrong")
                }
            })
            .catch((err) => {
                console.log(err)
                toast.error("Something went wrong")
            })
    }

    const handleUpdatePasswordClick = (e) => {
        e.preventDefault();
        console.log(oldPassword, newPassword, confirmPassword);
        if (!oldPassword || !newPassword || !confirmPassword) {
            toast.error("All fields are required")
            return
        }
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }
        UserServiceApis.changePassword({ oldPassword, newPassword }, { "x-access-token": user?.token })
            .then((res) => {
                console.log(res)
                if (res.data.status === true) {
                    toast.success("Password Updated Successfully. Login Again.")
                    setOldPassword('')
                    setNewPassword('')
                    setConfirmPassword('')
                    logoutUser()
                } else {
                    toast.error("Something went wrong")
                }
            })
            .catch((err) => {
                console.log(err)
                toast.error("Something went wrong")
            })
    }


    return (

        <div className="MyAccount-container">
            <div className='inner-hero'>
                <div className='inner-hero-image'>
                    <img src='./assets/img/inner-banner.png' />
                </div>
                <div className='herotext wow fadeInUp'>
                    <Container>
                        <h2>Recovery Lab Qatar</h2>
                        <h1>My Account</h1>
                    </Container>
                </div>
            </div>

            <section className="myaccount-section">
                <Container>
                    <Form className="formStyles">
                        <Row>
                            <Col lg={3}>
                                <UserNav />
                            </Col>
                            <Col lg={9} className="mt-4 mt-lg-0">
                                <div className="account-heading d-flex justify-content-between mb-3 pb-2">
                                    <h4>Profile Summary</h4>
                                    {editing
                                        ?
                                        <div className="d-flex gap-2">
                                            <button
                                                type="button"
                                                onClick={handleUpdateUserSaveClick}
                                                className="btn btn-primary ms-auto rounded-pill px-3"
                                            >
                                                Save
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setEditing(false)}
                                                className="btn btn-outline-primary ms-auto rounded-pill px-3"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                        :
                                        <button
                                            type="button"
                                            onClick={() => setEditing(true)}
                                            className="btn btn-primary ms-auto rounded-pill px-3"
                                        >
                                            Edit
                                        </button>
                                    }
                                </div>

                                <Row>
                                    <Col md={6} lg={4}>
                                        <Form.Group className="mb-3" controlId="">
                                            <Form.Label>First Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="John"
                                                disabled={!editing}
                                                value={userData?.firstName}
                                                onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} lg={4}>
                                        <Form.Group className="mb-3" controlId="">
                                            <Form.Label>Last Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Smit"
                                                value={userData?.lastName}
                                                onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                                                disabled={!editing}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} lg={4}>
                                        <Form.Group className="mb-3" controlId="">
                                            <Form.Label>Date of Birth</Form.Label>
                                            <Form.Control
                                                type="date"
                                                placeholder="DOB"
                                                value={userData?.dob}
                                                onChange={(e) => setUserData({ ...userData, dob: e.target.value })}
                                                disabled={!editing}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} lg={4}>
                                        <Form.Group className="mb-3" controlId="">
                                            <Form.Label>Gender</Form.Label>
                                            <Form.Select
                                                value={userData?.gender}
                                                onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
                                                disabled={!editing}
                                            >
                                                <option value="male" >Male</option>
                                                <option value="female" >Female</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} lg={4}>
                                        <Form.Group className="mb-3" controlId="">
                                            <Form.Label>Apt #</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="ABC-123"
                                                value={userData?.apartment}
                                                onChange={(e) => setUserData({ ...userData, apartment: e.target.value })}
                                                disabled={!editing}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} lg={4}>
                                        <Form.Group className="mb-3" controlId="">
                                            <Form.Label>City</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Qatar"
                                                value={userData?.city}
                                                onChange={(e) => setUserData({ ...userData, city: e.target.value })}
                                                disabled={!editing}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={12} lg={12}>
                                        <Form.Group className="mb-3" controlId="">
                                            <Form.Label>Street address</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Street address"
                                                value={userData?.address}
                                                onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                                                disabled={!editing}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} lg={4}>
                                        <Form.Group className="mb-3" controlId="">
                                            <Form.Label>Country</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Country"
                                                value={userData?.country}
                                                onChange={(e) => setUserData({ ...userData, country: e.target.value })}
                                                disabled={!editing}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} lg={4}>
                                        <Form.Group className="mb-3" controlId="">
                                            <Form.Label>State</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder=""
                                                value={userData?.state}
                                                onChange={(e) => setUserData({ ...userData, state: e.target.value })}
                                                disabled={!editing}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} lg={4}>
                                        <Form.Group className="mb-3" controlId="">
                                            <Form.Label>Pincode</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Pincode"
                                                value={userData?.pincode}
                                                onChange={(e) => setUserData({ ...userData, pincode: e.target.value })}
                                                disabled={!editing}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <div className="account-heading d-flex mb-3 pb-2 mt-3">
                                    <h5>Contact Info</h5>
                                </div>

                                <Row>
                                    <Col md={6} lg={4}>
                                        <Form.Group className="mb-3" controlId="">
                                            <Form.Label>Mobile</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="9876543210"
                                                value={userData?.contactNumber}
                                                onChange={(e) => setUserData({ ...userData, contactNumber: e.target.value })}
                                                disabled={!editing}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} lg={4}>
                                        <Form.Group className="mb-3" controlId="">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="john@example.com"
                                                value={userData?.email}
                                                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                                disabled={!editing}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} lg={4}>
                                        <Form.Group className="mb-3" controlId="">
                                            <Form.Label>Preferred language</Form.Label>
                                            <Form.Select
                                                value={userData?.preferredLanguage}
                                                onChange={(e) => setUserData({ ...userData, preferredLanguage: e.target.value })}
                                                disabled={!editing}
                                            >
                                                {ALL_LANGUAGES.map((lang, index) => (
                                                    <option key={index} value={lang}>{lang}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <div className="account-heading d-flex mb-3 pb-2 mt-3">
                                    <h5>Change Password</h5>
                                </div>

                                <Row>
                                    <Col md={6} lg={4}>
                                        <Form.Group className="mb-3" controlId="">
                                            <Form.Label>Old Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Enter Old Password"
                                                value={oldPassword}
                                                onChange={(e) => setOldPassword(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} lg={4}>
                                        <Form.Group className="mb-3" controlId="">
                                            <Form.Label>New Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Enter New Password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6} lg={4}>
                                        <Form.Group className="mb-3" controlId="">
                                            <Form.Label>Confirm New Password</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Confirm New Password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <button onClick={handleUpdatePasswordClick} type="button" className="btn btn-primary px-4 mt-3">Update Password</button>

                            </Col>
                        </Row>
                    </Form>
                </Container>
            </section>




        </div>
    )

}

export default MyProfile