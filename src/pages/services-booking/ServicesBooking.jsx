import React, { useState, useCallback, useEffect, useContext } from 'react';
import { Container, Form, Accordion, Row, Col, Tab, Tabs, Table } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './ServicesBooking.scss';
import { BookingServiceApis, InstructorServiceApis, PackagesServiceApis, TreatmentServiceApis, pageDetailApiService } from '../../services/apiService';
import UserContext from '../../contexts/UserContext';
import { Link, json, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useRef } from 'react';
import { FIXED_PAGES, getTrasanctionIdAndStatus, PREPARATION_TIME } from '../../services/constants';


import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';

function ServicesBooking(props) {

    const navigate = useNavigate();
    const reactLocation = useLocation();
    const locationState = reactLocation.state;

    // pre selection


    // Validations
    const bookingFormRef = useRef(null);
    const [isBookingFormValid, setIsBookingFormValid] = useState(false);

    // Booking states
    const [bookingCenter, setBookingCenter] = useState('');
    const [bookingGuest, setBookingGuest] = useState('JustMe');
    const [guestOneDetails, setGuestOneDetails] = useState({
        fName: '',
        lName: '',
        email: '',
        mNumber: '',
        DOB: '',
        gender: '',
    });
    const [guestTwoDetails, setGuestTwoDetails] = useState({
        fName: '',
        lName: '',
        email: '',
        mNumber: '',
        gender: '',
    });
    const [bookingService, setBookingService] = useState('');
    const [bookingService2, setBookingService2] = useState('');
    const [bookingDate, setBookingDate] = useState(new Date());
    const [bookingTime, setBookingTime] = useState('');
    const [selectedInstructorId, setSelectedInstructorId] = useState('');
    const [selectedInstructorId2, setSelectedInstructorId2] = useState('')
    const [centerList, setCenterList] = useState([]);
    const [taxPercentage, setTaxPercentage] = useState(0); // 0% tax
    const [preparationTime, setPreparationTime] = useState(0); // 0 minutes

    // States for services
    const [services, setServices] = useState([]);
    const [plans, setPlans] = useState([]);

    // States for instructors
    const [instructors, setInstructors] = useState([]);

    // Modal states
    const [showModal, setShowModal] = useState(false);

    // User
    const { user } = useContext(UserContext)

    useEffect(() => {
        getAllServices();
        getAllPlans();
        getAllInstructors();
        getCenterList();
    }, []);

    useEffect(() => {
        setGuestOneDetails({
            fName: user?.firstName,
            lName: user?.lastName,
            email: user?.email,
            mNumber: user?.contactNumber,
            DOB: user?.dob,
            gender: user?.gender
        })
    }, [user])

    useEffect(() => {
        if (locationState) {

        }
    }, [bookingCenter])

    const disableNonWorkingDays = (dt, insId) => {
        if (!insId) {
            return false;
        }

        let dayList = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
        let date = dt.toDate();
        // console.log(date);
        if (insId === "0") {
            // If any instructor is selected, then check for all instructors work days and return true if any instructor is available
            let isAvailable = true;
            instructors
                .filter(ins => JSON.parse(ins.associatedServices).map(ser => ser.id).includes(plans.find(pln => pln.id === bookingService)?.treatmentServiceID))
                .forEach(instructor => {
                    let workDays = JSON.parse(instructor.workDays);
                    if (workDays[dayList[date.getDay()]] === true) {
                        isAvailable = false;
                    }
                });
            return isAvailable;
        }

        let instructor = instructors.find(ins => ins.id === parseInt(insId));
        let workDays = JSON.parse(instructor?.workDays);
        return workDays[dayList[date.getDay()]] === false;
    }
    const getAllServices = () => {
        TreatmentServiceApis.getAllServices().then(res => {
            if (res.data.status === true) {
                console.log(`Services --> `, res.data.data);
                setServices(res.data.data);
            }
        }).catch(err => {
            console.log(err);
        })
    }
    const getAllPlans = () => {
        let body = {
            packageType: 'PLAN'
        }
        PackagesServiceApis.getAllPlans(body).then(res => {
            if (res.data.status === true) {
                console.log(`Plans --> `, res.data.data);
                setPlans(res.data.data);
            }
        }).catch(err => {
            console.log(err);
        })
    }
    const getAllInstructors = () => {
        InstructorServiceApis.getInstructors().then(res => {
            if (res.data.status === true) {
                console.log(`Instructors --> `, res.data.data);
                setInstructors(res.data.data);
            }
        }).catch(err => {
            console.log(err);
        })
    }

    const getCenterList = () => {
        pageDetailApiService.getPageDetails({ pageTitle: FIXED_PAGES.SETTINGS })
            .then((response) => {
                if (response.data.status === true) {
                    const centers = response.data.data.pageData.centerList;
                    const prepTime = parseInt(response.data.data.pageData.preparationTime);
                    const tax = parseInt(response.data.data.pageData.taxPercentage);
                    setCenterList(centers)
                    setTaxPercentage(tax);
                    setPreparationTime(prepTime);
                    setBookingCenter(centers[0].id);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const getFormattedDate = (date) => {
        let days = ['Sunday', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        let day = date.getDay();
        let month = date.getMonth() + 1;
        let dt = date.getDate();
        let year = date.getFullYear();
        return `${days[day]}, ${dt} ${months[month]} ${year}`;
    }

    const calculateTax = (rate) => {
        let amount = parseFloat(plans.find(pln => pln.id === bookingService)?.packageAmount || 0);
        if (bookingGuest === "TwoTwoGuest") {
            let x = parseFloat(plans.find(pln => pln.id === bookingService2)?.packageAmount || 0);
            amount += x;
        }
        console.log(amount);
        return parseFloat(amount) * rate / 100;
    }

    const calculateTotalAmount = () => {
        let amount = parseFloat(plans.find(pln => pln.id === bookingService)?.packageAmount || 0);
        if (bookingGuest === "TwoTwoGuest") {
            let x = parseFloat(plans.find(pln => pln.id === bookingService2)?.packageAmount || 0);
            amount += x;
        }
        let tax = calculateTax(taxPercentage);
        return parseFloat(amount) + parseFloat(tax);
    }

    const [bookingTimingList, setBookingTimingList] = useState([]);


    const [bookingTimeList, setBookingTimeList] = useState([]);

    const getBookingTimings = async (selectedInstructorId) => {
        if (bookingCenter !== "" && bookingDate !== "" && selectedInstructorId !== "") {
            let bookingTimingsList = [];
            let curServ = plans.find(pln => pln.id === parseInt(bookingService));
            let csDur = curServ?.packageTherapyTime;

            let curServ2 = plans.find(pln => pln.id === parseInt(bookingService2));
            let csDur2 = curServ2?.packageTherapyTime;

            let curServDuration = 0;
            if (csDur2) {
                curServDuration = (csDur >= csDur2) ? csDur : csDur2;
            } else {
                curServDuration = csDur
            }


            console.log({ curServDuration });
            let body = {
                bookingCenter,
                bookingDate,
                instructorId: selectedInstructorId,
                bookingType: 'PLAN'
            };

            if (selectedInstructorId === '0') {
                console.log("Selected any");
                let allTimings = [];
                const instructorPromises = instructors
                    .filter(ins => JSON.parse(ins.associatedServices).map(ser => ser.id).includes(plans.find(pln => pln.id === bookingService)?.treatmentServiceID))
                    .map(async (ins) => {
                        let timeShifts = JSON.parse(ins.shiftTiming);
                        try {
                            const res = await BookingServiceApis.getBookingTimings({ ...body, instructorId: ins.id });
                            if (res.data.status === true) {
                                let data = res.data.data;
                                allTimings.push(...await getTimeList(curServDuration, timeShifts[0].startTime, timeShifts[0].endTime, data));
                            }
                        } catch (err) {
                            console.log(err);
                        }
                    });
                await Promise.all(instructorPromises);
                let finalTimings = allTimings
                    .filter((value, index, arr) => arr.indexOf(value) === index)
                    .sort((a, b) => a - b);
                bookingTimingsList = finalTimings;
            } else {
                try {
                    const res = await BookingServiceApis.getBookingTimings(body);
                    if (res.data.status === true) {
                        let data = res.data.data;
                        let timeShifts = instructors.find(ins => ins.id === parseInt(selectedInstructorId)).shiftTiming;
                        timeShifts = JSON.parse(timeShifts);
                        bookingTimingsList = await getTimeList(curServDuration, timeShifts[0].startTime, timeShifts[0].endTime, data);
                        setBookingTimingList(res.data.data);
                    }
                } catch (err) {
                    console.log(err);
                }
            }
            return bookingTimingsList;
        }
    };

    function dateGenerator(timeStr) {
        let date = new Date(`2022-01-01T${timeStr}`);
        return date;
    }

    function filterTimeSlots(slots, duration) {
        let timeSlots = [];
        slots.sort(); // Sort the slots in ascending order

        for (let i = 0; i < slots.length; i++) {
            let currentSlot = dateGenerator(slots[i]);
            let endTime = new Date(currentSlot.getTime() + duration * 60000);

            // Check if the current slot overlaps with any previous slots
            let overlaps = false;
            for (let j = 0; j < timeSlots.length; j++) {
                let prevSlot = dateGenerator(timeSlots[j]);
                let prevEndTime = new Date(prevSlot.getTime() + duration * 60000);

                if (currentSlot < prevEndTime && endTime > prevSlot) {
                    overlaps = true;
                    break;
                }
            }

            // If the current slot doesn't overlap, add it to the timeSlots array
            if (!overlaps) {
                timeSlots.push(slots[i]);
            }
        }

        return timeSlots;
    }

    useEffect(() => {

        let curServ = plans.find(pln => pln.id === parseInt(bookingService));
        let csDur = curServ?.packageTherapyTime;

        let curServ2 = plans.find(pln => pln.id === parseInt(bookingService2));
        let csDur2 = curServ2?.packageTherapyTime;

        let curServDuration = 0;
        if (csDur2) {
            curServDuration = (csDur >= csDur2) ? csDur : csDur2;
        } else {
            curServDuration = csDur
        }

        let ins1Prom = getBookingTimings(selectedInstructorId);
        let ins2Prom = getBookingTimings(selectedInstructorId2);
        let insPromArr = [ins1Prom, ins2Prom]
        Promise.all(insPromArr)
            .then(async (data) => {
                console.log(data);
                let finalData = data?.flat(Infinity)
                console.log(finalData);
                finalData = await filterTimeSlots(finalData, curServDuration)
                console.log(finalData);
                setBookingTimeList(finalData)
            })

    }, [bookingCenter, bookingDate, selectedInstructorId, selectedInstructorId2])

    const getFormattedTime = (time) => {
        if (typeof time !== 'string') {
            return "None"
        }
        const [hours, minutes] = time.split(':');
        let newHours = parseInt(hours) % 12 || 12;
        let ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
        return `${newHours}:${minutes} ${ampm}`;
    }

    function getAvailableSlots(bookedSlots, availableSlots, currentServiceDuration) {
        // Helper function to check if a slot conflicts with any booked slot
        function isSlotConflicting(slot) {
            const slotStart = new Date(`2022-01-01T${slot}`);
            const slotEnd = new Date(slotStart.getTime() + (currentServiceDuration + preparationTime) * 60000); // Duration in milliseconds
            // console.log("Slot start & end: ", slotStart, slotEnd);
            return bookedSlots.some(bookedSlot => {
                const bookedStart = new Date(`2022-01-01T${bookedSlot.bookingTime}`);
                const bookedEnd = new Date(bookedStart.getTime() + (bookedSlot.bookingDuration + preparationTime) * 60000);

                // Check for overlap
                // console.log(slot);
                // console.table({slotStart, bookedEnd, slotEnd, bookedStart});
                return (slotStart < bookedEnd && slotEnd > bookedStart);
            });
        }

        // Filter available slots based on conflict with booked slots
        return availableSlots.filter(slot => !isSlotConflicting(slot));
    }


    const getTimeList = (duration, sTime, eTime, occupiedObjs) => {
        let startTime = new Date(`2022-01-01T${sTime}:00`);
        const curTime = new Date().setFullYear(2022, 0, 1);
        // if (startTime <= curTime) {
        //     startTime = curTime;
        // }
        const endTime = new Date(`2022-01-01T${eTime}:00`);
        const timeList = [];
        let currentTime = new Date(startTime);
        while (currentTime <= endTime) {
            if (bookingDate.toLocaleDateString() === new Date().toLocaleDateString() && currentTime < curTime) {
                console.log("Current time is less than current time");
                currentTime.setMinutes(currentTime.getMinutes() + duration + preparationTime);
                continue;
            }
            console.log("not less");
            timeList.push(currentTime.toLocaleTimeString([], { hourCycle: 'h24' }));
            currentTime.setMinutes(currentTime.getMinutes() + duration + preparationTime);
        }
        // console.log("timeList -> ", timeList);
        let finalList = getAvailableSlots(occupiedObjs, timeList, duration);
        // console.log('finalList -> ', finalList);
        return finalList;
    }

    const handleBookNowFormSubmit = (e) => {
        if (user === null) {
            e.preventDefault();
            toast.error('Please login to book an appointment');
            navigate('/login');
            return;
        }
        if (bookingFormRef.current.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
            setIsBookingFormValid(true);
            window.scrollTo(0, 450);
            return;
        }
        e.preventDefault();
        setShowModal(true);
    }

    const handleBookAppointmentBtnClick = (e) => {
        e.preventDefault();
        let { transactionId, transactionStatus } = getTrasanctionIdAndStatus();
        let bookingPlan1 = plans.find(plan => plan.id === bookingService);
        let bookingPlan2 = plans.find(plan => plan.id === bookingService2);
        let d = new Date();
        let timestamp = d.toISOString();
        let data = {
            bookingCenter,
            bookingGuest,
            bookingService: bookingPlan1,
            bookingDate,
            bookingTime,
            totalAmount: calculateTotalAmount(),
            instructorId: parseInt(selectedInstructorId),
            bookingType: 'PLAN',
            bookingDuration: bookingPlan1.packageTherapyTime,
            bookingId: timestamp,
            transactionId,
            transactionStatus,
        }
        let header = {
            'x-access-token': user?.token,
        }

        let guestOneDetails = {
            fName: user?.firstName,
            lName: user?.lastName,
            email: user?.email,
            mNumber: user?.contactNumber,
            DOB: user?.dob,
            gender: user?.gender,
        };


        BookingServiceApis.bookService({ ...data, guestOneDetails }, header).then(res => {
            if (res.data.status === true) {
                if (bookingGuest === "TwoTwoGuest") {
                    let data2 = {
                        ...data,
                        guestTwoDetails,
                        bookingService: bookingPlan2,
                        bookingDuration: bookingPlan2?.packageTherapyTime,
                        instructorId: parseInt(selectedInstructorId2)
                    }
                    BookingServiceApis.bookService(data2, header)
                        .then(res2 => {
                            if (res2.data.status === true) {
                                toast.success('Appointment booked successfully');
                                navigate('/my-services');
                            }
                        })
                } else {
                    toast.success('Appointment booked successfully');
                    navigate('/my-services');
                }
            } else {
                toast.error('Failed to book appointment');
            }
        }).catch(err => {
            console.log(err);
            toast.error('Failed to book appointment');
        })

    }

    useEffect(() => {
        console.log(`props --> `, props);
    }, [props.location])

    return (
        <div className='services-booking'>
            <Modal size='lg' show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Appointment Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='appointment-details'>
                        <div className='appointment-center'>
                            <p> <b>Center: </b> {bookingCenter}</p>
                        </div>
                        <div className='appointment-guest'>
                            {bookingGuest === "JustMe" ?
                                <>
                                    <h5>User Details</h5>
                                    <Table>
                                        <tbody>
                                            <tr>
                                                <td className='border-0'>Name</td>
                                                <td className='border-0 text-end'>{user?.firstName} {user?.lastName}</td>
                                            </tr>
                                            <tr>
                                                <td>Email</td>
                                                <td className='text-end'>{user?.email}</td>
                                            </tr>
                                            <tr>
                                                <td>Mobile</td>
                                                <td className='text-end'>{user?.contactNumber}</td>
                                            </tr>
                                            <tr>
                                                <td>Gender</td>
                                                <td className='text-end'>{user?.gender || "Male"}</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </>
                                :
                                <>
                                    <h5>Guest Details</h5>
                                    <div className='guest-details'>
                                        <Tabs
                                            defaultActiveKey="guest1"
                                            id="GuestDetailsDisplay"
                                            className="mb-3 justify-content-start gap-2"
                                        >
                                            <Tab eventKey="guest1" title="Guest 1">
                                                <Table>
                                                    <tbody>
                                                        <tr>
                                                            <td className='border-0'>Name</td>
                                                            <td className='border-0 text-end'>{guestOneDetails.fName} {guestOneDetails.lName}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Email</td>
                                                            <td className='text-end'>{guestOneDetails.email}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Mobile</td>
                                                            <td className='text-end'>{guestOneDetails.mNumber}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>DOB</td>
                                                            <td className='text-end'>{guestOneDetails.DOB}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Gender</td>
                                                            <td className='text-end'>{guestOneDetails.gender}</td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </Tab>
                                            <Tab eventKey="guest2" title="Guest 2">
                                                <Table>
                                                    <tbody>
                                                        <tr>
                                                            <td className='border-0'>Name</td>
                                                            <td className='border-0 text-end'>{guestTwoDetails.fName} {guestTwoDetails.lName}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Email</td>
                                                            <td className='text-end'>{guestTwoDetails.email}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Mobile</td>
                                                            <td className='text-end'>{guestTwoDetails.mNumber}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>DOB</td>
                                                            <td className='text-end'>{guestTwoDetails.DOB}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Gender</td>
                                                            <td className='text-end'>{guestTwoDetails.gender}</td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                            </Tab>
                                        </Tabs>
                                    </div>
                                </>
                            }
                        </div>
                        <div className='appointment-service'>
                            <h5>Service</h5>
                            <p>{plans.find(plan => plan.id === bookingService)?.packageName} @ QAR. {calculateTotalAmount()} (QAR. {parseFloat(plans.find(plan => plan.id === bookingService)?.packageAmount)} + QAR. {calculateTax(taxPercentage)}) / {plans.find(plan => plan.id === bookingService)?.packageTherapyTime} min</p>
                        </div>
                        <div className='appointment-date'>
                            <h5>Date & Time</h5>
                            <p>{getFormattedDate(bookingDate)} @ {bookingTime}</p>
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleBookAppointmentBtnClick}>
                        Book Appointment
                    </Button>
                </Modal.Footer>
            </Modal>
            <Form onSubmit={handleBookNowFormSubmit} noValidate validated={isBookingFormValid} ref={bookingFormRef}>
                {/* Center */}
                <Form.Group className="mb-3 center-select">
                    <Form.Label>Recovery Lab Center</Form.Label>
                    <Form.Select
                        onChange={(e) => { setBookingCenter(e.target.value) }}
                        value={bookingCenter}
                        required
                    >
                        <option value={''} disabled>Select a Center</option>
                        {centerList.map(center =>
                            <option value={center.id} key={center.id}>{center.name}</option>
                        )}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Please select a center
                    </Form.Control.Feedback>
                </Form.Group>

                {/* Guest Type */}
                {bookingCenter && <>
                    <Form.Group className="mb-3">
                        <Form.Label>Guest</Form.Label>
                        <div className='d-flex custom-radio'>
                            <Form.Check type="radio" name='guest' onChange={e => { if (e.target.checked) { setBookingGuest(e.target.value); setBookingService(''); setBookingService2(''); setSelectedInstructorId(''); setSelectedInstructorId2('') } }} value="JustMe" id="JustMe" label="Just Me" defaultChecked />
                            <Form.Check type="radio" name='guest' onChange={e => { if (e.target.checked) { setBookingGuest(e.target.value); setBookingService(''); setBookingService2(''); setSelectedInstructorId(''); setSelectedInstructorId2('') } }} value="TwoTwoGuest" id="TwoTwoGuest" label="2-2 Guest" />
                        </div>
                    </Form.Group>
                    {/* Guest Details */}
                    {bookingGuest === "TwoTwoGuest" && <div className='guest-details mb-3'>
                        <Accordion defaultActiveKey="0">
                            <Accordion.Item eventKey="0" className='mb-0'>
                                <Accordion.Header>Guest 1 Details <span className='capitalize fw-400'>{user !== null && `(${user?.firstName} ${user?.lastName})`}</span></Accordion.Header>
                                <Accordion.Body className='text-center'>
                                    {user === null &&
                                        <>
                                            <p>Guest One will be the logged in user.</p>
                                            <p><Link type='button' to="/login" className='btn btn-primary'>Login</Link></p>

                                        </>
                                    }
                                    {/* <Row>
                                        <Col md={4}>
                                            <Form.Group className="mb-3" controlId="fName">
                                                <Form.Control
                                                    value={guestOneDetails.fName}
                                                    onChange={e => { setGuestOneDetails({ ...guestOneDetails, fName: e.target.value }) }}
                                                    type="text"
                                                    placeholder="First Name"
                                                    required
                                                    minLength={3}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Please provide a valid first name
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-3" controlId="lName">
                                                <Form.Control
                                                    value={guestOneDetails.lName}
                                                    onChange={e => { setGuestOneDetails({ ...guestOneDetails, lName: e.target.value }) }}
                                                    type="text"
                                                    placeholder="Last Name"
                                                    required
                                                    minLength={3}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Please provide a valid last name
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-3" controlId="email">
                                                <Form.Control
                                                    value={guestOneDetails.email}
                                                    onChange={e => { setGuestOneDetails({ ...guestOneDetails, email: e.target.value }) }}
                                                    type="email"
                                                    placeholder="Email"
                                                    required
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Please provide a valid email
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-3" controlId="mNumber">
                                                <Form.Control
                                                    value={guestOneDetails.mNumber}
                                                    onChange={e => { setGuestOneDetails({ ...guestOneDetails, mNumber: e.target.value }) }}
                                                    type="text"
                                                    placeholder="Mobile No"
                                                    required
                                                    pattern='[0-9]{10}'
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Please provide a valid mobile number
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-3" controlId="DOB">
                                                <Form.Control
                                                    value={guestOneDetails.DOB}
                                                    onChange={e => { setGuestOneDetails({ ...guestOneDetails, DOB: e.target.value }) }}
                                                    type="date"
                                                    placeholder="Date of Birth"
                                                    required
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Please provide a valid date of birth
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-3" controlId="gender">
                                                <Form.Select
                                                    value={guestOneDetails.gender}
                                                    onChange={e => { setGuestOneDetails({ ...guestOneDetails, gender: e.target.value }) }}
                                                    required
                                                >
                                                    <option value={''} disabled>Choose Your Gender</option>
                                                    <option value={'male'}>Male</option>
                                                    <option value={'female'}>Female</option>
                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    Please choose gender
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row> */}
                                    {/* Service selector */}
                                    <label className='form-label'>Select A Service</label>
                                    <div className='select-services mb-3'>
                                        <Tabs defaultActiveKey={locationState?.senderServiceId || services[0]?.id} id="ServicesSelect" className="justify-content-start gap-2">
                                            {services.map((service) => {
                                                return (
                                                    <Tab eventKey={service.id} title={service.treatmentServiceName} key={service.id}>
                                                        {plans.filter(plan => plan.treatmentServiceID === service.id).length === 0 && <div>No plans available for this service</div>}
                                                        {plans.filter(plan => plan.treatmentServiceID === service.id).map((plan, index) => {
                                                            return (
                                                                <div key={plan.id} className='services-pack'>
                                                                    <Form.Check
                                                                        value={plan.id}
                                                                        onChange={e => {
                                                                            if (e.target.checked) {
                                                                                setBookingService(plan.id)
                                                                                setSelectedInstructorId('')
                                                                            }
                                                                        }}
                                                                        type="radio"
                                                                        name='services'
                                                                        id={plan.id}
                                                                        label={plan.packageName}
                                                                        defaultChecked={locationState?.senderServiceId === service.id && locationState?.senderPlanId === plan.id}
                                                                        required
                                                                    />
                                                                    <Form.Control.Feedback type="invalid">
                                                                        Please select a service
                                                                    </Form.Control.Feedback>
                                                                    <div className='price-pack ms-auto'>
                                                                        <span className='pricesign'>QAR</span> {plan.packageAmount} <span className='timePack'>/ {plan.packageTherapyTime} min</span>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </Tab>
                                                )
                                            })
                                            }
                                            {/* <Tab eventKey="cryotherapy" title="Cryotherapy">
                                                <div className='services-pack'>
                                                    <Form.Check value={'service1'} onChange={e => { if (e.target.checked) setBookingService('service1') }} type="radio" name='services' id="service1" label="Acupuncture - First session 75 Min" />
                                                    <div className='price-pack ms-auto'>
                                                        <span className='pricesign'>$</span> 55 <span className='timePack'>/ 75 min</span>
                                                    </div>
                                                </div>
                                                <div className='services-pack'>
                                                    <Form.Check value={'service2'} onChange={e => { if (e.target.checked) setBookingService('service2') }} type="radio" name='services' id="service2" label="Acupuncture - First session 75 Min" />
                                                    <div className='price-pack ms-auto'>
                                                        <span className='pricesign'>$</span> 99 <span className='timePack'>/ 75 min</span>
                                                    </div>
                                                </div>
                                            </Tab> */}
                                        </Tabs>
                                    </div>
                                    {/* Instructor Selector */}
                                    {bookingService && <>
                                        <label className='form-label'>Select An Instructor</label>
                                        <div className='select-instructor mb-3'>
                                            <Form.Select
                                                value={selectedInstructorId}
                                                defaultValue={''}
                                                onChange={(e) => { setSelectedInstructorId(e.target.value) }}
                                                required
                                            >
                                                <option value={''} disabled>Select an Instructor</option>
                                                <option value={'0'}>Any Instructor</option>
                                                {instructors
                                                    .filter(ins => JSON.parse(ins.associatedServices).map(ser => ser.id).includes(plans.find(pln => pln.id === bookingService)?.treatmentServiceID))
                                                    .map(instructor => {
                                                        return (
                                                            <option disabled={instructor.id === parseInt(selectedInstructorId2)} value={instructor.id} key={instructor.id}>{instructor.name}</option>
                                                        )
                                                    })}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                Please select an instructor
                                            </Form.Control.Feedback>
                                        </div>
                                    </>}
                                </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>Guest 2 Details</Accordion.Header>
                                <Accordion.Body>
                                    <Row>
                                        <Col md={4}>
                                            <Form.Group className="mb-3" controlId="fName">
                                                <Form.Control
                                                    value={guestTwoDetails.fName}
                                                    onChange={e => { setGuestTwoDetails({ ...guestTwoDetails, fName: e.target.value }) }}
                                                    type="text"
                                                    placeholder="First Name"
                                                    required
                                                    minLength={3}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Please provide a valid first name
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-3" controlId="lName">
                                                <Form.Control
                                                    value={guestTwoDetails.lName}
                                                    onChange={e => { setGuestTwoDetails({ ...guestTwoDetails, lName: e.target.value }) }}
                                                    type="text"
                                                    placeholder="Last Name"
                                                    required
                                                    minLength={3}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Please provide a valid last name
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-3" controlId="email">
                                                <Form.Control
                                                    value={guestTwoDetails.email}
                                                    onChange={e => { setGuestTwoDetails({ ...guestTwoDetails, email: e.target.value }) }}
                                                    type="email"
                                                    placeholder="Email"
                                                    required
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Please provide a valid email
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-3" controlId="mNumber">
                                                <Form.Control
                                                    value={guestTwoDetails.mNumber}
                                                    onChange={e => { setGuestTwoDetails({ ...guestTwoDetails, mNumber: e.target.value }) }}
                                                    type="text"
                                                    placeholder="Mobile No"
                                                    required
                                                    pattern='[0-9]{10}'
                                                />
                                                <Form.Control.Feedback type='invalid'>
                                                    Please enter a 10 digit mobile number.
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-3" controlId="gender">
                                                <Form.Select
                                                    value={guestTwoDetails.gender}
                                                    onChange={e => { setGuestTwoDetails({ ...guestTwoDetails, gender: e.target.value }) }}
                                                    required
                                                >
                                                    <option value={''} disabled>Choose Your Gender</option>
                                                    <option value={'male'}>Male</option>
                                                    <option value={'female'}>Female</option>
                                                </Form.Select>
                                                <Form.Control.Feedback type="invalid">
                                                    Please choose Gender
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    {/* Service selector */}
                                    <label className='form-label'>Select A Service</label>
                                    <div className='select-services mb-3'>
                                        <Tabs defaultActiveKey={locationState?.senderServiceId || services[0]?.id} id="ServicesSelect" className="justify-content-start gap-2">
                                            {services.map((service) => {
                                                return (
                                                    <Tab eventKey={service.id} title={service.treatmentServiceName} key={service.id}>
                                                        {plans.filter(plan => plan.treatmentServiceID === service.id).length === 0 && <div>No plans available for this service</div>}
                                                        {plans.filter(plan => plan.treatmentServiceID === service.id).map((plan, index) => {
                                                            return (
                                                                <div key={plan.id} className='services-pack'>
                                                                    <Form.Check
                                                                        value={plan.id}
                                                                        onChange={e => {
                                                                            if (e.target.checked) {
                                                                                setBookingService2(plan.id)
                                                                                setSelectedInstructorId2('')
                                                                            }
                                                                        }}
                                                                        type="radio"
                                                                        name='services2'
                                                                        id={`serv2${plan.id}`}
                                                                        label={plan.packageName}
                                                                        defaultChecked={locationState?.senderServiceId === service.id && locationState?.senderPlanId === plan.id}
                                                                        required
                                                                    />
                                                                    <Form.Control.Feedback type="invalid">
                                                                        Please select a service
                                                                    </Form.Control.Feedback>
                                                                    <div className='price-pack ms-auto'>
                                                                        <span className='pricesign'>QAR</span> {plan.packageAmount} <span className='timePack'>/ {plan.packageTherapyTime} min</span>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </Tab>
                                                )
                                            })
                                            }
                                            {/* <Tab eventKey="cryotherapy" title="Cryotherapy">
                            <div className='services-pack'>
                                <Form.Check value={'service1'} onChange={e => { if (e.target.checked) setBookingService('service1') }} type="radio" name='services' id="service1" label="Acupuncture - First session 75 Min" />
                                <div className='price-pack ms-auto'>
                                    <span className='pricesign'>$</span> 55 <span className='timePack'>/ 75 min</span>
                                </div>
                            </div>
                            <div className='services-pack'>
                                <Form.Check value={'service2'} onChange={e => { if (e.target.checked) setBookingService('service2') }} type="radio" name='services' id="service2" label="Acupuncture - First session 75 Min" />
                                <div className='price-pack ms-auto'>
                                    <span className='pricesign'>$</span> 99 <span className='timePack'>/ 75 min</span>
                                </div>
                            </div>
                        </Tab> */}
                                        </Tabs>
                                    </div>
                                    {/* Instructor Selector */}
                                    {bookingService2 && <>
                                        <label className='form-label'>Select An Instructor</label>
                                        <div className='select-instructor mb-3'>
                                            <Form.Select
                                                value={selectedInstructorId2}
                                                defaultValue={''}
                                                onChange={(e) => { setSelectedInstructorId2(e.target.value) }}
                                                required
                                            >
                                                <option value={''} disabled>Select an Instructor</option>
                                                <option value={'0'}>Any Instructor</option>
                                                {instructors
                                                    .filter(ins => JSON.parse(ins.associatedServices).map(ser => ser.id).includes(plans.find(pln => pln.id === bookingService2)?.treatmentServiceID))
                                                    .map(instructor => {
                                                        return (
                                                            <option disabled={instructor.id === parseInt(selectedInstructorId)} value={instructor.id} key={instructor.id}>{instructor.name}</option>
                                                        )
                                                    })}
                                            </Form.Select>
                                            <Form.Control.Feedback type="invalid">
                                                Please select an instructor
                                            </Form.Control.Feedback>
                                        </div>
                                    </>}
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>}
                </>
                }

                {bookingCenter && bookingGuest === "JustMe" && <>
                    {/* Service selector */}
                    <label className='form-label'>Select A Service</label>
                    <div className='select-services mb-3'>
                        <Tabs defaultActiveKey={locationState?.senderServiceId || services[0]?.id} id="ServicesSelect" className="justify-content-start gap-2">
                            {services.map((service) => {
                                return (
                                    <Tab eventKey={service.id} title={service.treatmentServiceName} key={service.id}>
                                        {plans.filter(plan => plan.treatmentServiceID === service.id).length === 0 && <div>No plans available for this service</div>}
                                        {plans.filter(plan => plan.treatmentServiceID === service.id).map((plan, index) => {
                                            return (
                                                <div key={plan.id} className='services-pack'>
                                                    <Form.Check
                                                        value={plan.id}
                                                        onChange={e => {
                                                            if (e.target.checked) {
                                                                setBookingService(plan.id)
                                                                setSelectedInstructorId('')
                                                            }
                                                        }}
                                                        type="radio"
                                                        name='services'
                                                        id={plan.id}
                                                        label={plan.packageName}
                                                        defaultChecked={locationState?.senderServiceId === service.id && locationState?.senderPlanId === plan.id}
                                                        required
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        Please select a service
                                                    </Form.Control.Feedback>
                                                    <div className='price-pack ms-auto'>
                                                        <span className='pricesign'>QAR</span> {plan.packageAmount} <span className='timePack'>/ {plan.packageTherapyTime} min</span>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </Tab>
                                )
                            })
                            }
                            {/* <Tab eventKey="cryotherapy" title="Cryotherapy">
                            <div className='services-pack'>
                                <Form.Check value={'service1'} onChange={e => { if (e.target.checked) setBookingService('service1') }} type="radio" name='services' id="service1" label="Acupuncture - First session 75 Min" />
                                <div className='price-pack ms-auto'>
                                    <span className='pricesign'>$</span> 55 <span className='timePack'>/ 75 min</span>
                                </div>
                            </div>
                            <div className='services-pack'>
                                <Form.Check value={'service2'} onChange={e => { if (e.target.checked) setBookingService('service2') }} type="radio" name='services' id="service2" label="Acupuncture - First session 75 Min" />
                                <div className='price-pack ms-auto'>
                                    <span className='pricesign'>$</span> 99 <span className='timePack'>/ 75 min</span>
                                </div>
                            </div>
                        </Tab> */}
                        </Tabs>
                    </div>
                    {/* Instructor Selector */}
                    {bookingService && <>
                        <label className='form-label'>Select An Instructor</label>
                        <div className='select-instructor mb-3'>
                            <Form.Select
                                value={selectedInstructorId}
                                defaultValue={''}
                                onChange={(e) => { setSelectedInstructorId(e.target.value) }}
                                required
                            >
                                <option value={''} disabled>Select an Instructor</option>
                                <option value={'0'}>Any Instructor</option>
                                {instructors
                                    .filter(ins => JSON.parse(ins.associatedServices).map(ser => ser.id).includes(plans.find(pln => pln.id === bookingService)?.treatmentServiceID))
                                    .map(instructor => {
                                        return (
                                            <option disabled={instructor.id === parseInt(selectedInstructorId2)} value={instructor.id} key={instructor.id}>{instructor.name}</option>
                                        )
                                    })}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Please select an instructor
                            </Form.Control.Feedback>
                        </div>
                    </>}

                </>}

                {(
                    (bookingGuest === "JustMe" && selectedInstructorId !== "")
                    ||
                    (bookingGuest === "TwoTwoGuest" && selectedInstructorId !== "" && selectedInstructorId2 !== "")
                ) &&
                    <>
                        <div className='dateTime-con'>
                            <Row>
                                {/* Date */}
                                <Col lg={6}>
                                    <label className='form-label'>Select Date</label>
                                    <div className='calender-plug'>
                                        {/* <Calendar
                                        value={bookingDate}
                                        onClickDay={(value) => {
                                            console.log((JSON.parse(instructors.find(ins => ins.id === parseInt(selectedInstructorId))?.workDays)));
                                            setBookingDate(value)
                                        }}
                                        minDate={new Date()}
                                        maxDate={new Date(new Date().setDate(new Date().getDate() + 30))}
                                    /> */}
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DateCalendar
                                                value={dayjs(bookingDate)}
                                                onChange={(value) => {
                                                    setBookingDate(value.toDate());
                                                }}
                                                minDate={dayjs()}
                                                maxDate={dayjs(new Date().setDate(new Date().getDate() + 30))}
                                                shouldDisableDate={dt => (disableNonWorkingDays(dt, selectedInstructorId) || disableNonWorkingDays(dt, selectedInstructorId2))}
                                                rerendererone={selectedInstructorId}
                                                rerenderertwo={selectedInstructorId2}
                                                style={{
                                                    height: '290px',
                                                    padding: '0px',
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                </Col>
                                {/* Time */}
                                {!(disableNonWorkingDays(dayjs(bookingDate), selectedInstructorId) || disableNonWorkingDays(dayjs(bookingDate), selectedInstructorId2)) && <Col lg={6} className='mt-3 mt-lg-0'>
                                    <label className='form-label'>Select Time</label>
                                    <div className='time-plug'>
                                        {bookingTimeList.filter(tm => tm != undefined).map((time, index) => {
                                            return (
                                                <div className='time-select' key={index}>
                                                    <Form.Check type="radio" name='time' id={`time-${index}`} onChange={e => { if (e.target.checked) setBookingTime(time) }} label={getFormattedTime(time)} />
                                                </div>
                                            )
                                        })}
                                    </div>
                                </Col>}
                            </Row>
                        </div>

                        <div className='payment-details mt-3'>
                            <Row>
                                <Col lg={6}>
                                    <div className='payment-des'>
                                        <h5>Booking Details</h5>
                                        <div className='booking-date'>
                                            {getFormattedDate(bookingDate)} @ {bookingTime}
                                        </div>
                                        <Table>
                                            <tbody>
                                                <tr>
                                                    <td className='border-0'>{plans.find(pln => pln.id === bookingService)?.packageName}</td>
                                                    <td className='border-0 text-end'><span className='prisimbole'>QAR</span>{parseFloat(plans.find(pln => pln.id === bookingService)?.packageAmount || 0)}</td>
                                                </tr>
                                                {bookingGuest === "TwoTwoGuest" && <tr>
                                                    <td className='border-0'>{plans.find(pln => pln.id === bookingService2)?.packageName}</td>
                                                    <td className='border-0 text-end'><span className='prisimbole'>QAR</span>{parseFloat(plans.find(pln => pln.id === bookingService2)?.packageAmount || 0)}</td>
                                                </tr>}
                                                <tr>
                                                    <td>Tax</td>
                                                    <td className='text-end'><span className='prisimbole'>QAR</span>{calculateTax(taxPercentage)}</td>
                                                </tr>
                                                <tr>
                                                    <td className='border-0'>Total Amount</td>
                                                    <td className='border-0 text-end'><span className='prisimbole'>QAR</span>{calculateTotalAmount()}</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </div>
                                </Col>
                                <Col lg={6} className='align-self-center mt-4 mt-lg-0'>
                                    <div className='d-flex justify-content-center'>
                                        <Button type='submit' variant="primary" size="lg" className='px-5'>
                                            Book Appointment
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </>}

            </Form>
        </div >
    )
}

export default ServicesBooking