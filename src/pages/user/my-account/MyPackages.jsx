import React, { useContext, useEffect, useState } from "react"
import { Container, Row, Col, Form, Modal } from 'react-bootstrap';
import UserNav from "./UserNav";
import UserContext from "../../../contexts/UserContext";
import { BookingServiceApis, ClassServiceApis, PackagesServiceApis } from "../../../services/apiService";
import { toast } from 'react-hot-toast'

function MyPackages(props) {

    const { user } = useContext(UserContext)

    const [packages, setPackages] = useState([]);
    const [allClasses, setAllClasses] = useState([]);
    const [allPlans, setAllPlans] = useState([]);

    const [showViewDetailsModal, setShowViewDetailsModal] = useState(false);
    const [selectedPackageToView, setSelectedPackageToView] = useState(null);

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedPackageToCancel, setSelectedPackageToCancel] = useState(null);


    const getAllUserServices = () => {
        let body = {
            bookingType: "PACKAGE"
        }
        let headers = {
            "x-access-token": user?.token
        }
        BookingServiceApis.getUserBookings(body, headers)
            .then(res => {
                console.log(res.data)
                if (res.data.status === true) {
                    setPackages(res.data.data)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    const getAllPlans = () => {
        let body = {
            packageType: 'PLAN'
        }
        PackagesServiceApis.getAllPlans(body).then(res => {
            if (res.data.status === true) {
                console.log(`Plans --> `, res.data.data);
                setAllPlans(res.data.data);
            }
        }).catch(err => {
            console.log(err);
        })
    }

    const getAllClasses = () => {
        ClassServiceApis.getClasses().then(res => {
            if (res.data.status === true) {
                console.log(`Classes --> `, res.data.data);
                setAllClasses(res.data.data);
            }
        }).catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        getAllUserServices();
        getAllPlans();
        getAllClasses();
    }, [user])

    const isPackageExhausted = (packageContent) => {
        let contentsExhausted = Array(packageContent.length).fill(false);
        packageContent.map((content, index) => {
            if (content.usedFrequency >= content.frequency) {
                contentsExhausted[index] = true;
            }
        })
        return contentsExhausted.includes(false) ? true : false;
    }

    return (

        <div className="MyAccount-container">
            {/* Details */}
            <Modal size='lg' show={showViewDetailsModal} onHide={() => setShowViewDetailsModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedPackageToView !== null
                        ?
                        JSON.parse(selectedPackageToView?.bookingService)?.packageName
                        :
                        ""
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='package-des'>
                        <h5>Package Contents: </h5>
                        {selectedPackageToView !== null && <p className="">
                            {JSON.parse(selectedPackageToView?.bookingService)?.packageContent && JSON.parse(selectedPackageToView?.bookingService)?.packageContent.map((content, index) => {
                                let currentPlan = allPlans.find(plan => plan.id === content.plan);
                                let currentClass = allClasses.find(cls => cls.id === content.plan);

                                return (
                                    <div key={index} className='my-3'>
                                        <b>{index + 1}. {content.type}: {content.type === 'plan' ? currentPlan?.packageName : currentClass?.className} ({content.type === 'plan' ? currentPlan?.packageTherapyTime : currentClass?.classDuration} mins.)</b>  {(content.usedFrequency >= content.frequency) && <span className="badge bg-danger">Exhausted</span>} <br />
                                        <span>Total Credits: {content.frequency}</span> <br />
                                        <span>Credits Used: {content.usedFrequency}</span> <br />
                                    </div>
                                )
                            })}
                        </p>}
                    </div>


                </Modal.Body>
            </Modal>

            {/* Cancel */}
            <Modal size='lg' show={showCancelModal} onHide={() => setShowCancelModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedPackageToCancel !== null
                        ?
                        JSON.parse(selectedPackageToCancel?.bookingService)?.packageName
                        :
                        ""
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='package-des'>
                        <h4>Do you really want to cancel this package booking?</h4>
                        <h5>Contents: </h5>
                        {selectedPackageToCancel !== null && <p className="">
                            {JSON.parse(selectedPackageToCancel?.bookingService)?.packageContent && JSON.parse(selectedPackageToCancel?.bookingService)?.packageContent.map((content, index) => {
                                let currentPlan = allPlans.find(plan => plan.id === content.plan);
                                let currentClass = allClasses.find(cls => cls.id === content.plan);

                                return (
                                    <div key={index} className='my-3 d-flex justify-content-between w-75 mx-auto'>
                                        <b>{index + 1}. {content.type}: {content.type === 'plan' ? currentPlan?.packageName : currentClass?.className} X {content.frequency}</b> <br />
                                        <p>({content.type === 'plan' ? currentPlan?.packageTherapyTime : currentClass?.classDuration} mins.)</p>
                                    </div>
                                )
                            })}
                        </p>}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        type="button"
                        onClick={() => {
                            if (selectedPackageToCancel === null) {
                                toast.error('Please select a package to cancel');
                                return;
                            }
                            BookingServiceApis.changeBookingStatus({ id: selectedPackageToCancel?.id, isExpired: true })
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
                                    <h4>My Packages</h4>
                                </div>

                                <Row>
                                    {packages.map((item, index) => {
                                        return (
                                            <Col md={4} key={index} className="mb-3">
                                                <div className='card package-box'>
                                                    <div className='card-body'>
                                                        <h5 title={JSON.parse(item?.bookingService)?.packageName}>{JSON.parse(item?.bookingService)?.packageName}</h5>
                                                        <div className='package-des'>
                                                            <p dangerouslySetInnerHTML={{ __html: JSON.parse(item?.bookingService)?.longDescription }} />
                                                        </div>

                                                        <div className='card-price mb-0'><span className='p-simbol'>QAR. </span>{item.totalAmount}</div>
                                                        <div className="d-flex my-2 align-items-center gap-2">
                                                            {
                                                                item.isExpired === true
                                                                    ?
                                                                    <h4><span className="badge bg-danger">Expired</span></h4>
                                                                    :
                                                                    <>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setSelectedPackageToView(item);
                                                                                setShowViewDetailsModal(true)
                                                                            }}
                                                                            className="btn btn-primary"
                                                                        >
                                                                            Details
                                                                        </button>
                                                                        {isPackageExhausted(JSON.parse(item?.bookingService).packageContent) && <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setSelectedPackageToCancel(item);
                                                                                setShowCancelModal(true)
                                                                            }}
                                                                            className="btn btn-primary"
                                                                        >
                                                                            Cancel
                                                                        </button>}
                                                                    </>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </Col>
                                        )

                                    }
                                    )}
                                </Row>

                            </Col>
                        </Row>
                    </Form>
                </Container>
            </section>
        </div>
    )

}

export default MyPackages