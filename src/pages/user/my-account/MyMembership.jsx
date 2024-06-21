import React, { useContext, useEffect, useState } from "react"
import { Container, Row, Col, Form, Modal } from 'react-bootstrap';
import { GoArrowRight } from "react-icons/go";
import UserNav from "./UserNav";
import UserContext from "../../../contexts/UserContext";
import { BookingServiceApis } from "../../../services/apiService";
import { toast } from 'react-hot-toast';

function MyMembership() {

    const { user } = useContext(UserContext)

    const [memberships, setMemberships] = useState([])

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedMembershipToCancel, setSelectedMembershipToCancel] = useState(null);

    const getAllUserServices = () => {
        let body = {
            bookingType: "MEMBERSHIP"
        }
        let headers = {
            "x-access-token": user?.token
        }
        BookingServiceApis.getUserBookings(body, headers)
            .then(res => {
                console.log(res.data)
                if (res.data.status === true) {
                    setMemberships(res.data.data)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
    useEffect(() => {
        getAllUserServices()
    }, [user])

    const membershipValidityTexts = {
        30: "Monthly",
        90: "Quarterly",
    }

    return (

        <div className="MyAccount-container">

            {/* Cancel */}
            <Modal size='lg' show={showCancelModal} onHide={() => setShowCancelModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedMembershipToCancel !== null
                        ?
                        JSON.parse(selectedMembershipToCancel?.bookingService)?.packageName
                        :
                        ""
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='package-des'>
                        <h6>Do you really want to cancel this membership booking?</h6>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        type="button"
                        onClick={() => {
                            if (selectedMembershipToCancel === null) {
                                toast.error('Please select a membership to cancel');
                                return;
                            }
                            BookingServiceApis.changeBookingStatus({ id: selectedMembershipToCancel?.id, isExpired: true })
                                .then(res => {
                                    if (res.data.status === true) {
                                        toast.success("Booking Cancelled Successfully!")
                                        getAllUserServices();
                                        setShowCancelModal(false);
                                    }
                                })
                                .catch(err => {
                                    console.log(err);
                                })
                        }}
                        className="btn btn-primary"
                    >
                        Yes
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowCancelModal(false)}
                        className="btn btn-primary"
                    >
                        No
                    </button>
                </Modal.Footer>
            </Modal>

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
                                <div className="account-heading d-flex mb-3 pb-2">
                                    <h4>My Memberships</h4>
                                </div>

                                <Row className="flash-white-card">
                                    {
                                        memberships && memberships.map(membership => {
                                            return (
                                                <Col md={4} className="mb-3">
                                                    <div className='card package-box'>
                                                        <div className='card-body'>
                                                            <h5>{JSON.parse(membership?.bookingService).packageName}</h5>
                                                            <div className='package-des'>
                                                                <p dangerouslySetInnerHTML={{ __html: JSON.parse(membership?.bookingService).longDescription }} ></p>
                                                            </div>
                                                            <div className='card-price mb-0'><span className='p-simbol'>QAR. </span>{membership?.totalAmount}<span className="session">/ {membershipValidityTexts[JSON.parse(membership?.bookingService)?.packageDuration]}</span></div>
                                                            {
                                                                membership.isExpired === true
                                                                    ?
                                                                    <h4><span className="badge bg-danger">Expired</span></h4>
                                                                    :
                                                                    <>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setSelectedMembershipToCancel(membership);
                                                                                setShowCancelModal(true)
                                                                            }}
                                                                            className="btn btn-primary"
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                    </>
                                                            }
                                                        </div>
                                                    </div>
                                                </Col>
                                            )
                                        })
                                    }

                                </Row>

                            </Col>
                        </Row>
                    </Form>
                </Container>
            </section>
        </div>
    )

}

export default MyMembership