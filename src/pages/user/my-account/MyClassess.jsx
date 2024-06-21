import React, { useContext, useEffect, useState } from "react"
import { Container, Row, Col, Form, Accordion, useAccordionButton, Card, Modal } from 'react-bootstrap';
import { IoIosArrowDown } from "react-icons/io";
import UserNav from "./UserNav";
import UserContext from "../../../contexts/UserContext";
import { BookingServiceApis, InstructorServiceApis } from "../../../services/apiService";
import { IMAGE_BASE_URL } from "../../../services/constants";
import userPlaceholder from '../../../assets/images/userPlaceholder.png';
import { toast } from 'react-hot-toast';

function CustomToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionButton(eventKey, () =>
        console.log('totally custom!'),
    );

    return (
        <button type="button" onClick={decoratedOnClick}>{children}</button>
    );
}

function MyClassess() {

    const { user } = useContext(UserContext)

    const [bookedClasses, setBookedClasses] = useState([])
    const [instructorImages, setInstructorImages] = useState([]);

    const [showCancelModal, setShowCancelModal] = useState(false)
    const [selectedClassToCancel, setSelectedClassToCancel] = useState(null)

    const getAllUserServices = () => {
        let body = {
            bookingType: "CLASS"
        }
        let headers = {
            "x-access-token": user?.token
        }
        BookingServiceApis.getUserBookings(body, headers)
            .then(res => {
                console.log(res.data)
                if (res.data.status === true) {
                    setBookedClasses(res.data.data)
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
    useEffect(() => {
        getAllUserServices();
        getInstructorImages();
    }, [user])

    const getFormattedTime = (time) => {
        // 12:00 AM
        const hours = parseInt(time.split(':')[0]);
        const minutes = parseInt(time.split(':')[1]);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const finalHours = hours % 12 === 0 ? 12 : hours % 12;
        return `${finalHours < 10 ? `0${finalHours}` : finalHours}:${minutes < 10 ? `0${minutes}` : minutes} ${ampm}`;
    }

    const getFormattedDate = (date) => {
        // Sun 14 Apr
        const d = new Date(date);
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let resultObj = {
            day: days[d.getDay()],
            date: d.getDate(),
            month: months[d.getMonth()]
        }
        return resultObj;
    }


    const getInstructorImages = () => {
        InstructorServiceApis.getInstructorImages()
            .then(res => {
                if (res.data.status === true) {
                    setInstructorImages(res.data.data)
                }
            }).catch(err => console.error(err))
    }

    const isCancellable = (cls) => {
        let currentDate = new Date();
        let bookingDate = new Date(cls.bookingDate);
        let bookingTime = JSON.parse(cls?.bookingService).classStartTime.split(':').map(Number);
        bookingDate.setHours(bookingTime[0], bookingTime[1]);
        let diff = bookingDate - currentDate;
        console.log(JSON.parse(cls?.bookingService).id, JSON.parse(cls?.bookingService).className, diff);
        let diffInHours = diff / (1000 * 60 * 60);
        return diffInHours > 0;
    }

    return (

        <div className="MyAccount-container">

            <Modal size='lg' show={showCancelModal} onHide={() => setShowCancelModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedClassToCancel !== null
                        ?
                        JSON.parse(selectedClassToCancel?.bookingService)?.className
                        :
                        ""
                    }</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='package-des'>
                        <h6>Do you really want to cancel this class booking?</h6>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        type="button"
                        onClick={() => {
                            if (selectedClassToCancel === null) {
                                toast.error('Please select a package to cancel');
                                return;
                            }
                            BookingServiceApis.changeBookingStatus({ id: selectedClassToCancel?.id, isExpired: true })
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
                                    <h4>My Classes</h4>
                                </div>

                                <Accordion>
                                    {
                                        bookedClasses.map(bookedClass => {
                                            console.log(bookedClass.bookingService)
                                            return (
                                                <Card className='mt-2 classesBox' key={bookedClass.id}>
                                                    <Card.Header className='classes-header'>
                                                        <div className='class-head-des'>
                                                            <div className='insturctors'>
                                                                <div className='instru-img'>
                                                                    <img src={instructorImages.find(ins => ins.id === JSON.parse(bookedClass.bookingService).instructorId)?.profileImage ? IMAGE_BASE_URL + instructorImages.find(ins => ins.id === JSON.parse(bookedClass.bookingService).instructorId)?.profileImage : userPlaceholder} alt='user' />
                                                                </div>
                                                                {JSON.parse(bookedClass?.bookingService).instructorName}
                                                            </div>

                                                            <div className='classes-timing'>
                                                                <span>{getFormattedTime(JSON.parse(bookedClass?.bookingService).classStartTime)} ({JSON.parse(bookedClass?.bookingService).classDuration} min)</span>
                                                                <span>{JSON.parse(bookedClass?.bookingService).className}</span>
                                                                <span>Recovery Lab - Center</span>
                                                            </div>
                                                            <div className="class-pay">
                                                                <span>Payment</span>
                                                                <span>QAR. {JSON.parse(bookedClass?.bookingService).classPrice}</span>
                                                            </div>
                                                            <div className='available-seat'>
                                                                {
                                                                    bookedClass.isExpired === true
                                                                        ?
                                                                        <>
                                                                            {isCancellable(bookedClass)
                                                                                ?
                                                                                <h4 className="d-inline"><span className="badge bg-danger">Cancelled</span></h4>
                                                                                :
                                                                                <h4 className="d-inline"><span className="badge bg-secondary">Expired</span></h4>
                                                                            }
                                                                        </>
                                                                        :
                                                                        <>
                                                                            {isCancellable(bookedClass)
                                                                                ?
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        setSelectedClassToCancel(bookedClass);
                                                                                        setShowCancelModal(true)
                                                                                    }}
                                                                                    className="btn btn-primary border"
                                                                                >
                                                                                    Cancel
                                                                                </button>
                                                                                :
                                                                                <h4 className="d-inline"><span className="badge bg-secondary">Expired</span></h4>
                                                                            }
                                                                        </>
                                                                }
                                                            </div>
                                                            <div className="class-bookDate">
                                                                <span>{getFormattedDate(bookedClass?.bookingDate)?.day}</span>
                                                                {getFormattedDate(bookedClass?.bookingDate)?.date}
                                                                <span>{getFormattedDate(bookedClass?.bookingDate)?.month}</span>
                                                            </div>
                                                        </div>
                                                        <div className='ms-auto collapse-btn'>
                                                            <CustomToggle eventKey={`item_${bookedClass.id}`}><IoIosArrowDown /></CustomToggle>
                                                        </div>
                                                    </Card.Header>
                                                    <Accordion.Collapse eventKey={`item_${bookedClass.id}`}>
                                                        <Card.Body>
                                                            <p dangerouslySetInnerHTML={{ __html: JSON.parse(bookedClass.bookingService)?.classDescription }} />
                                                        </Card.Body>
                                                    </Accordion.Collapse>
                                                </Card>
                                            )
                                        })
                                    }

                                </Accordion>

                            </Col>
                        </Row>
                    </Form>
                </Container>
            </section>




        </div>
    )

}

export default MyClassess