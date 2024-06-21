import React from "react"
import { Container, Row, Col, Form, Modal } from 'react-bootstrap';
import UserNav from "./UserNav";
import { useState } from "react";
import { BookingServiceApis } from "../../../services/apiService";
import { useEffect } from "react";
import { useContext } from "react";
import UserContext from "../../../contexts/UserContext";
import { Link } from "react-router-dom";
import { toast } from 'react-hot-toast';

function MyServices() {

    const { user } = useContext(UserContext)

    const [services, setServices] = useState([])

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedServiceToCancel, setSelectedServiceToCancel] = useState(null);

    const getAllUserServices = () => {
        let body = {
            bookingType: "PLAN"
        }
        let headers = {
            "x-access-token": user?.token
        }
        BookingServiceApis.getUserBookings(body, headers)
            .then(res => {
                console.log(res.data)
                if (res.data.status === true) {
                    setServices(res.data.data)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
    useEffect(() => {
        getAllUserServices()
    }, [user])

    const getFormattedDate = (dateStr) => {
        let date = new Date(dateStr);
        let days = ['Sunday', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let day = date.getDay();
        let month = date.getMonth() + 1;
        let dt = date.getDate();
        let year = date.getFullYear();
        return `${days[day]}, ${dt} ${months[month]} ${year}`;
    }

    const getFormattedTime = (time) => {
        let hours = parseInt(time.split(':')[0]);
        let minutes = parseInt(time.split(':')[1]);
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes} ${ampm}`;
    }

    const isCancellable = (service) => {
        let currentDate = new Date();
        let bookingDate = new Date(service.bookingDate);
        let bookingTime = service.bookingTime.split(':').map(Number);
        bookingDate.setHours(bookingTime[0], bookingTime[1]);
        let diff = bookingDate - currentDate;
        let diffInHours = diff / (1000 * 60 * 60);
        return diffInHours > 0;
    }


    return (

        <div className="MyAccount-container">
            {/* Cancel */}
            <Modal size='lg' show={showCancelModal} onHide={() => setShowCancelModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedServiceToCancel !== null
                        ?
                        JSON.parse(selectedServiceToCancel?.bookingService)?.packageName
                        :
                        `${JSON.stringify(selectedServiceToCancel)}`
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='package-des'>
                        <h6>Do you really want to cancel this service booking?</h6>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        type="button"
                        onClick={() => {
                            if (setSelectedServiceToCancel === null) {
                                toast.error('Please select a package to cancel');
                                return;
                            }
                            BookingServiceApis.changeBookingStatus({ id: selectedServiceToCancel?.id, isExpired: true })
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
                                    <h4>Service Appointments</h4>
                                </div>

                                {services.map((service, index, arr) => {
                                    return (
                                        <div key={index} className={`${arr[index - 1]?.bookingId === service.bookingId ? '' : 'mt-3'} myServicesBox`} style={service.bookingGuest === "TwoTwoGuest" ? {
                                            background: '#FFCFF1',
                                            borderColor: "#FBA0E3"
                                        } : {}}>
                                            <h4 className="d-flex align-items-center justify-content-between">
                                                <span>
                                                    {JSON.parse(service.bookingService).packageName} {
                                                        service.isExpired === true
                                                            ?
                                                            <>
                                                                {isCancellable(service)
                                                                    ?
                                                                    <h4 className="d-inline"><span className="badge bg-danger">Cancelled</span></h4>
                                                                    :
                                                                    <h4 className="d-inline"><span className="badge bg-secondary">Expired</span></h4>
                                                                }
                                                            </>
                                                            :
                                                            <>
                                                                {isCancellable(service)
                                                                    ?
                                                                    <span
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setSelectedServiceToCancel(service);
                                                                            setShowCancelModal(true)
                                                                        }}
                                                                        className="badge btn-secondary"
                                                                    >
                                                                        Cancel
                                                                    </span>
                                                                    :
                                                                    <span className="badge bg-secondary">Expired</span>
                                                                }
                                                            </>
                                                    }
                                                </span>
                                                <Link
                                                    to={`/service/${JSON.parse(service.bookingService).treatmentServiceName}`}
                                                    className="text-secondary fs-6 text-decoration-none"
                                                >
                                                    {JSON.parse(service.bookingService).treatmentServiceName}
                                                </Link>
                                            </h4>
                                            <Row>
                                                <Col xs={6} md={3}>
                                                    <h6>Date</h6>
                                                    <div className="service-txt">{getFormattedDate(service.bookingDate)}</div>
                                                </Col>
                                                <Col xs={6} md={3}>
                                                    <h6>Time</h6>
                                                    <div className="service-txt">{getFormattedTime(service.bookingTime)}</div>
                                                </Col>
                                                <Col xs={6} md={3} className="mt-3 mt-md-0">
                                                    <h6>Member</h6>
                                                    <div className="service-txt">{service.bookingGuest === "JustMe" ? 1 : 2}</div>
                                                </Col>
                                                <Col xs={6} md={3} className="mt-3 mt-md-0">
                                                    <h6>Payment</h6>
                                                    <div className="service-txt">QAR. {service.totalAmount}</div>
                                                </Col>
                                            </Row>
                                        </div>
                                    )
                                })}

                            </Col>
                        </Row>
                    </Form>
                </Container>
            </section>
        </div>
    )

}

export default MyServices