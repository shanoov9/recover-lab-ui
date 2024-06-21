import React, { useContext, useEffect, useRef, useState } from 'react';
import { Card, Row, Col, Button, Form, Accordion, useAccordionButton } from 'react-bootstrap';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { CiFilter } from "react-icons/ci";
import { IoIosArrowDown } from "react-icons/io";
import './ClassesBooking.scss';
import { BookingServiceApis, ClassServiceApis, InstructorServiceApis, pageDetailApiService } from '../../services/apiService';
import { FIXED_PAGES, IMAGE_BASE_URL, getTrasanctionIdAndStatus } from '../../services/constants';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../contexts/UserContext';
import userPlaceholder from "../../assets/images/userPlaceholder.png"

function CustomToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionButton(eventKey, () =>
        console.log('totally custom!'),
    );

    return (
        <button type="button" onClick={decoratedOnClick}>{children}</button>
    );
}

function ClassesBooking() {

    const navigate = useNavigate();
    const { user } = useContext(UserContext)

    const [value, setValue] = useState(new Date().toDateString());
    const handleChange = (event, newValue) => {
        setValue(newValue);
        let curClasses = allClasses.filter((item) => JSON.parse(item.classDays)[dayList[new Date(newValue).getDay()]] === true)
        setCurrentClasses(prev => curClasses)
        setFilteredClasses(prev => curClasses)
        clearFilters();
        applyFilters(curClasses, [], [], [], [])
    };


    const [centerList, setCenterList] = useState([]);

    const classBookingFormRef = useRef();
    const [validated, setValidated] = useState(false);
    const [classCenter, setClassCenter] = useState('');

    const [allClasses, setAllClasses] = useState([]);
    const [currentClasses, setCurrentClasses] = useState([]);
    const [filteredClasses, setFilteredClasses] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [uniqueClassDurations, setUniqueClassDurations] = useState([]);
    const [preBookedClassesObj, setPreBookedClassesObj] = useState({});

    const [classNameList, setClassNameList] = useState([]);

    // Filtering states
    const [filterInstructors, setFilterInstructors] = useState([]);
    const [filterClassList, setFilterClassList] = useState([]);
    const [filterTimings, setFilterTimings] = useState([]);
    const [filterDurations, setFilterDurations] = useState([]);

    const getFormattedDate = (date) => {
        // Sun 14 Apr
        const d = new Date(date);
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
    }

    const getFormattedTime = (time) => {
        // 12:00 AM
        const hours = parseInt(time.split(':')[0]);
        const minutes = parseInt(time.split(':')[1]);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const finalHours = hours % 12 === 0 ? 12 : hours % 12;
        return `${finalHours < 10 ? `0${finalHours}` : finalHours}:${minutes < 10 ? `0${minutes}` : minutes} ${ampm}`;
    }

    const tabsDateList = Array(90).fill().map((_, i) => {
        const date = new Date(new Date().setDate(new Date().getDate() + i));
        date.setHours(0, 0, 0, 0);
        return date;
    });
    const dayList = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    const getAllClasses = () => {
        ClassServiceApis.getClasses().then((res) => {
            console.log(res.data);
            if (res.data.status === true) {
                let finalData = res.data.data.filter((item) => item.status === true);
                setAllClasses(finalData);
                setCurrentClasses(finalData.filter((item) => JSON.parse(item.classDays)[dayList[new Date(value).getDay()]] === true))
                setFilteredClasses(finalData.filter((item) => JSON.parse(item.classDays)[dayList[new Date(value).getDay()]] === true))
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    const getClassNameList = () => {
        ClassServiceApis.getAllClassNames().then(res => {
            if (res.data.status === true) {
                let finalData = res.data.data;
                let classList = {};
                finalData.forEach(item => {
                    classList[item.id] = item.className;
                });
                setClassNameList(classList);
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

    useEffect(() => {
        getAllClasses();
        getAllInstructors();
        getCenterList();
        getClassNameList();
    }, []);

    const getCenterList = () => {
        pageDetailApiService.getPageDetails({ pageTitle: FIXED_PAGES.SETTINGS })
            .then((response) => {
                if (response.data.status === true) {
                    const centers = response.data.data.pageData.centerList;
                    setCenterList(centers)
                    setClassCenter(centers[0].id)
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        (() => {
            let date = new Date(value)
            BookingServiceApis.getPreBookedClassesCount({ bookingDate: value })
                .then(res => {
                    setPreBookedClassesObj(res.data.data)
                })
        })();
    }, [value])

    const handleBookClass = (e, classId) => {
        if (user === null) {
            e.preventDefault();
            toast.error('Please login to book a class.');
            navigate('/login');
            return;
        }
        if (classBookingFormRef.current.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
            setValidated(true);
            window.scrollTo(0, 450);
            return;
        }
        e.preventDefault();
        let { transactionId, transactionStatus } = getTrasanctionIdAndStatus();
        let data = {
            bookingCenter: classCenter,
            bookingService: allClasses.find((item) => item.id === classId),
            bookingDate: new Date(value),
            bookingType: 'CLASS',
            transactionId,
            transactionStatus,
        }
        let headers = {
            "x-access-token": user.token
        }
        BookingServiceApis.bookService(data, headers).then((res) => {
            console.log(res.data);
            if (res.data.status === true) {
                toast.success("Class booked successfully.");
                navigate('/my-classess');
            } else {
                toast.error("Failed to book class. Please try again.");
            }
        }).catch((error) => {
            console.log(error);
            toast.error("Failed to book class. Please try again.");
        });
    }

    const isClassTimeBetween = (startTime, endTime, classTime) => {
        // Define time format string
        const timeFormat = "HH:MM";

        // Split times into hour and minute components
        const [startHour, startMinute] = startTime.split(":").map(Number);
        const [endHour, endMinute] = endTime.split(":").map(Number);
        const [classHour, classMinute] = classTime.split(":").map(Number);

        // Calculate total minutes since midnight for each time
        const startMinutes = startHour * 60 + startMinute;
        const endMinutes = endHour * 60 + endMinute;
        const classMinutes = classHour * 60 + classMinute;

        // if (classTime == "03:04") console.log({ startMinutes, endMinutes, classMinutes });
        // if (classTime == "03:04") console.log((startMinutes < classMinutes && endMinutes > classMinutes));

        return (startMinutes <= classMinutes && endMinutes >= classMinutes)
        // Handle cases where start time is after end time (e.g., evening class)
        // if (startMinutes > endMinutes) {
        //     return (classMinutes >= startMinutes || classMinutes <= endMinutes);
        // } else {
        //     return startMinutes <= classMinutes <= endMinutes;
        // }
    }

    function getUniqueDurationsWithCounts(classes) {
        // Create a map to store duration counts
        const durationCounts = new Map();
        for (const course of classes) {
            const duration = course.classDuration;
            // Increment count for the current duration (use default value 0 if not present)
            durationCounts.set(duration, (durationCounts.get(duration) || 0) + 1);
        }

        // Convert duration counts to an array of objects
        const uniqueDurations = [];
        for (const [duration, count] of durationCounts.entries()) {
            uniqueDurations.push({ duration, count });
        }
        // console.log({ durationCounts, uniqueDurations });
        return uniqueDurations;
    }

    useEffect(() => {
        setUniqueClassDurations(getUniqueDurationsWithCounts(currentClasses))
    }, [currentClasses])

    // Filter handlers
    const clearFilters = () => {
        console.log("Clearung filters");
        setFilterInstructors(prev => []);
        setFilterClassList(prev => []);
        setFilterTimings(prev => []);
        setFilterDurations(prev => []);
        setFilteredClasses(allClasses.filter((item) => JSON.parse(item.classDays)[dayList[new Date(value).getDay()]] === true))
    }

    const applyFilters = (currClasses, classes, instructors, durations, timings) => {
        console.log("Applying filters");
        const timingList = {
            "time1": { start: '00:00', end: '10:59' },
            "time2": { start: '11:00', end: '16:59' },
            "time3": { start: '17:00', end: '23:59' },
        };

        let filterTimingsNew = timings.map(t => timingList[t])

        let newClasses = currClasses.filter((c) =>
            (classes.length === 0 || classes.includes(c.classType)) &&
            (instructors.length === 0 || instructors.includes(c.instructorId)) &&
            (durations.length === 0 || durations.includes(c.classDuration)) &&
            (filterTimingsNew.length === 0 || filterTimingsNew.some(t => isClassTimeBetween(t.start, t.end, c.classStartTime)))
        );

        console.log("New Classes -> ", newClasses);

        setFilteredClasses(newClasses)
    }

    return (
        <div className='classes-booking'>
            <Form ref={classBookingFormRef} noValidate validated={validated}>
                <Form.Group className="mb-3 center-select">
                    <Form.Label>Motion Studio by Recovery Lab</Form.Label>
                    <Form.Select
                        value={classCenter}
                        onChange={(e) => setClassCenter(e.target.value)}
                        required
                    >
                        <option value={''} disabled>Select a Center</option>
                        {centerList.map((center, index) => (
                            <option key={index} selected={index === 0} value={center.id}>{center.name}</option>
                        ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Please select a Center.
                    </Form.Control.Feedback>
                </Form.Group>
            </Form>

            {/* Filters */}
            <Accordion className='classess-filters'>
                <Accordion.Item eventKey="0">
                    <Accordion.Header><CiFilter /> Filters</Accordion.Header>
                    <Accordion.Body>
                        <Row>
                            <Col md={3}>
                                <div className='filter-boxes'>
                                    <h5>Instructors</h5>
                                    <div className='filter-lists'>
                                        <ul className='list-unstyled'>
                                            {instructors.map(ins => (
                                                <li>
                                                    <Form.Check
                                                        type="checkbox"
                                                        name='f-inst'
                                                        id={ins.id}
                                                        value={ins.id}
                                                        checked={filterInstructors.includes(ins.id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setFilterInstructors([...filterInstructors, ins.id]);
                                                            } else {
                                                                setFilterInstructors(filterInstructors.filter(insId => parseInt(insId) !== ins.id))
                                                            }
                                                        }}
                                                        label={ins.name}
                                                    />
                                                    <span className='f-count ms-auto'>({currentClasses.filter(cls => (cls.instructorId == ins.id)).length})</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </Col>
                            <Col md={3}>
                                <div className='filter-boxes'>
                                    <h5>Classes</h5>
                                    <div className='filter-lists'>
                                        <ul className='list-unstyled'>
                                            <li>
                                                <Form.Check
                                                    type="checkbox"
                                                    name='f-inst'
                                                    id={`class_${1}`}
                                                    value={1}
                                                    checked={filterClassList.includes(1)}
                                                    onChange={e => {
                                                        if (e.target.checked) {
                                                            setFilterClassList([...filterClassList, 1])
                                                        } else {
                                                            setFilterClassList(filterClassList.filter(item => item !== 1))
                                                        }
                                                    }}
                                                    label="Yoga"
                                                />
                                                <span className='f-count ms-auto'>({currentClasses.filter(cls => cls.classType === 1).length})</span>
                                            </li>
                                            <li>
                                                <Form.Check
                                                    type="checkbox"
                                                    name='f-inst'
                                                    id={`class_${2}`}
                                                    value={2}
                                                    checked={filterClassList.includes(2)}
                                                    onChange={e => {
                                                        if (e.target.checked) {
                                                            setFilterClassList([...filterClassList, 2])
                                                        } else {
                                                            setFilterClassList(filterClassList.filter(item => item !== 2))
                                                        }
                                                    }}
                                                    label="Meditation"
                                                />
                                                <span className='f-count ms-auto'>({currentClasses.filter(cls => cls.classType === 2).length})</span>
                                            </li>
                                            <li>
                                                <Form.Check
                                                    type="checkbox"
                                                    name='f-inst'
                                                    id={`class_${3}`}
                                                    value={3}
                                                    checked={filterClassList.includes(3)}
                                                    onChange={e => {
                                                        if (e.target.checked) {
                                                            setFilterClassList([...filterClassList, 3])
                                                        } else {
                                                            setFilterClassList(filterClassList.filter(item => item !== 3))
                                                        }
                                                    }}
                                                    label="Hot Yoga"
                                                />
                                                <span className='f-count ms-auto'>({currentClasses.filter(cls => cls.classType === 3).length})</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </Col>
                            <Col md={3}>
                                <div className='filter-boxes'>
                                    <h5>Time</h5>
                                    <div className='filter-lists'>
                                        <ul className='list-unstyled'>
                                            <li>
                                                <Form.Check
                                                    type="checkbox"
                                                    name='f-inst'
                                                    id="time1"
                                                    value={'time1'}
                                                    checked={filterTimings.includes('time1')}
                                                    onChange={e => {
                                                        if (e.target.checked) {
                                                            setFilterTimings([...filterTimings, 'time1'])
                                                        } else {
                                                            setFilterTimings(filterTimings.filter(timing => timing !== 'time1'))
                                                        }
                                                    }}
                                                    label="Morning - 12:00AM - 11:00AM" />
                                                <span className='f-count ms-auto'>({currentClasses.filter(cls => isClassTimeBetween("00:00", "10:59", cls.classStartTime)).length})</span>
                                            </li>
                                            <li>
                                                <Form.Check
                                                    type="checkbox"
                                                    name='f-inst'
                                                    id="time2"
                                                    value={'time2'}
                                                    checked={filterTimings.includes('time2')}
                                                    onChange={e => {
                                                        if (e.target.checked) {
                                                            setFilterTimings([...filterTimings, 'time2'])
                                                        } else {
                                                            setFilterTimings(filterTimings.filter(timing => timing !== 'time2'))
                                                        }
                                                    }}
                                                    label="Afternoon - 11:00AM - 5:00PM" />
                                                <span className='f-count ms-auto'>({currentClasses.filter(cls => isClassTimeBetween("11:00", "16:59", cls.classStartTime)).length})</span>
                                            </li>
                                            <li>
                                                <Form.Check
                                                    type="checkbox"
                                                    name='f-inst'
                                                    id="time3"
                                                    value={'time3'}
                                                    checked={filterTimings.includes('time3')}
                                                    onChange={e => {
                                                        if (e.target.checked) {
                                                            setFilterTimings([...filterTimings, 'time3'])
                                                        } else {
                                                            setFilterTimings(filterTimings.filter(timing => timing !== 'time3'))
                                                        }
                                                    }}
                                                    label="Evening - 5:00PM - 12:00AM" />
                                                <span className='f-count ms-auto'>({currentClasses.filter(cls => isClassTimeBetween("17:00", "23:59", cls.classStartTime)).length})</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </Col>
                            <Col md={3}>
                                <div className='filter-boxes'>
                                    <h5>Duration</h5>
                                    <div className='filter-lists'>
                                        <ul className='list-unstyled'>
                                            {uniqueClassDurations.map(item => (
                                                <li>
                                                    <Form.Check
                                                        type="checkbox"
                                                        name='f-inst'
                                                        id={`duration_${item.duration}`}
                                                        value={item.duration}
                                                        checked={filterDurations.includes(item.duration)}
                                                        onChange={e => {
                                                            if (e.target.checked) {
                                                                setFilterDurations([...filterDurations, item.duration])
                                                            } else {
                                                                setFilterDurations(filterDurations.filter(dur => dur !== item.duration))
                                                            }
                                                        }}
                                                        label={`${item.duration} min.`}
                                                    />
                                                    <span className='f-count ms-auto'>({item.count})</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <div className='btn-action-g mt-4'>
                            <Button
                                onClick={() => {
                                    clearFilters()
                                }}
                                className='btn btn-info rounded-pill px-4 me-3'
                            >
                                Clear
                            </Button>

                            <Button
                                onClick={() => {
                                    console.log("Applying filters");
                                    applyFilters(currentClasses, filterClassList, filterInstructors, filterDurations, filterTimings)
                                }}
                                className='btn btn-primary rounded-pill px-4'
                            >
                                Apply
                            </Button>
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

            {/* Classes Dates */}
            <div className='classes-box d-flex mt-3'>
                <div className='classesDate'>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div components={['DatePicker']}>
                            <DatePicker
                                value={dayjs(value)}
                                onChange={(newValue) => {
                                    setValue(newValue.toDate().toDateString())
                                    let curClasses = allClasses.filter((item) => JSON.parse(item.classDays)[dayList[new Date(newValue).getDay()]] === true)
                                    setCurrentClasses(curClasses)
                                    setFilteredClasses(curClasses)
                                    clearFilters();
                                    applyFilters(curClasses, [], [], [], [])
                                }}
                                minDate={dayjs()}
                                maxDate={dayjs().add(89, 'day')}
                            />
                        </div>
                    </LocalizationProvider>
                </div>

                <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons aria-label="visible arrows tabs example"
                    sx={{ [`& .${tabsClasses.scrollButtons}`]: { '&.Mui-disabled': { opacity: 0.3 }, }, }}>
                    {tabsDateList.map((date, index) => (
                        <Tab key={index} label={getFormattedDate(date)} value={date.toDateString()} />
                    ))}
                </Tabs>

            </div>

            <div className='classess-availabe mt-3'>
                <Accordion>
                    {filteredClasses
                        .map((item, index) => (
                            <Card key={index} className='mt-2 classesBox'>
                                <Card.Header className='classes-header'>
                                    <div className='class-head-des'>
                                        <div className='insturctors'>
                                            <div className='instru-img'>
                                                <img src={instructors.find(ins => ins.id === item.instructorId)?.profileImage ? IMAGE_BASE_URL + instructors.find(ins => ins.id === item.instructorId)?.profileImage : userPlaceholder} alt='user' />
                                            </div>
                                            <span title={item.instructorName} >
                                                {item.instructorName.length > 15 ? `${item.instructorName.slice(0, 15)}...` : item.instructorName}
                                            </span>
                                        </div>

                                        <div className='classes-timing'>
                                            <span>{getFormattedTime(item.classStartTime)} ({item.classDuration} min.)</span>
                                            <span>{item.className} - {classNameList[item.classType]}</span>
                                            <span>Motion Studio by Recovery Lab - Center</span>
                                        </div>
                                        <div className='available-seat'>
                                            <strong>Available Slot<br /> {item.batchSize - preBookedClassesObj[`${item.id}`]}</strong>
                                        </div>
                                        <div className='classes-book-btn'>
                                            <button
                                                className='btn btn-secondary'
                                                onClick={(e) => handleBookClass(e, item.id)}
                                            >
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                    <div className='ms-auto collapse-btn'>
                                        <CustomToggle eventKey={index}><IoIosArrowDown /></CustomToggle>
                                    </div>
                                </Card.Header>
                                <Accordion.Collapse eventKey={index}>
                                    <Card.Body>
                                        <p dangerouslySetInnerHTML={{ __html: item.classDescription }} />
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        ))}
                </Accordion>
            </div>

        </div>
    );
}

export default ClassesBooking