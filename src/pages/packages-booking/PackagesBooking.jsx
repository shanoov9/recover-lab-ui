import React, { useState, useCallback, useEffect, useContext } from 'react';
import { Container, Form, Accordion, Row, Col, Tab, Tabs, Table } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
// import './ServicesBooking.scss';
import { BookingServiceApis, ClassServiceApis, InstructorServiceApis, PackagesServiceApis, TreatmentServiceApis, packageTypeApiService, pageDetailApiService } from '../../services/apiService';
import UserContext from '../../contexts/UserContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useRef } from 'react';
import { FIXED_PAGES, getTrasanctionIdAndStatus } from '../../services/constants';

function PackagesBooking(props) {

    const navigate = useNavigate();
    const reactLocation = useLocation();
    const locationState = reactLocation.state;

    // Validations
    const bookingFormRef = useRef(null);
    const [isBookingFormValid, setIsBookingFormValid] = useState(false);

    const [centerList, setCenterList] = useState([]);
    const [taxPercentage, setTaxPercentage] = useState(0);

    // Booking states
    const [bookingCenter, setBookingCenter] = useState('');

    const [selectedPackage, setSelectedPackage] = useState('');

    // States for services
    const [services, setServices] = useState([]);
    const [packageTypes, setPackageTypes] = useState([]);
    const [packages, setPackages] = useState([]);
    const [allPlans, setAllPlans] = useState([]);
    const [allClasses, setAllClasses] = useState([]);

    // view details modal
    const [showViewDetailsModal, setShowViewDetailsModal] = useState(false);
    const [selectedPackageToView, setSelectedPackageToView] = useState(null);

    // User
    const { user } = useContext(UserContext)

    useEffect(() => {
        getAllServices();
        getAllPackages();
        getCenterList();
        getAllPackageTypes();
        getAllPlans();
        getAllClasses();
    }, []);

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

    const getAllPackages = () => {
        let body = {
            packageType: 'PACKAGE'
        }
        PackagesServiceApis.getAllPlans(body).then(res => {
            if (res.data.status === true) {
                console.log(`Packages --> `, res.data.data);
                setPackages(res.data.data);
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
                    const tax = parseInt(response.data.data.pageData.taxPercentage);
                    setCenterList(centers);
                    setTaxPercentage(tax);
                    setBookingCenter(centers[0].id);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const calculateTax = (rate) => {
        let amount = packages.find(pack => pack.id === selectedPackage)?.packageAmount || 0;
        return parseFloat(amount) * rate / 100;
    }

    const calculateTotalAmount = () => {
        let amount = packages.find(pack => pack.id === selectedPackage)?.packageAmount || 0;
        let tax = calculateTax(taxPercentage);
        return (parseFloat(amount) + parseFloat(tax));
    }

    const calculateExpiryDate = () => {
        let duration = packages.find(pack => pack.id === selectedPackage)?.packageDuration || 0;
        console.log("Duration -->", duration);
        let date = new Date();
        date.setDate(date.getDate() + duration);
        return date;
    }

    const handleBookNowFormSubmit = (e) => {
        if (user === null) {
            e.preventDefault();
            toast.error('Please login to purchase a package');
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
        let totalAmount = calculateTotalAmount();
        let expiryDate = calculateExpiryDate();
        let bookingDate = new Date();
        let { transactionId, transactionStatus } = getTrasanctionIdAndStatus();
        let data = {
            bookingCenter,
            bookingService: packages.find(pack => pack.id === selectedPackage),
            bookingDate,
            totalAmount,
            bookingType: 'PACKAGE',
            expiryDate,
            transactionId,
            transactionStatus,
        }
        let header = {
            'x-access-token': user?.token,
        }
        console.log(data);
        BookingServiceApis.bookService(data, header).then(res => {
            if (res.data.status === true) {
                toast.success('Package purchased successfully');
                navigate('/my-packages');
            } else {
                toast.error('Failed to purchase package');
            }
        }).catch(err => {
            console.log(err);
            toast.error('Failed to purchase package');
        })
    }

    const getAllPackageTypes = () => {
        packageTypeApiService.getAllPackageTypes().then(res => {
            if (res.data.status === true) {
                console.log(`Package Types --> `, res.data.data);
                setPackageTypes(res.data.data);
            }
        }).catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {
        console.log(`props --> `, props);
    }, [props.location])

    return (
        <div className='services-booking'>
            <Modal size='lg' show={showViewDetailsModal} onHide={() => setShowViewDetailsModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedPackageToView?.packageName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedPackageToView !== null && <div className='appointment-details'>
                        {selectedPackageToView.packageContent.map((content, index) => {
                            let currentPlan = allPlans.find(plan => plan.id === content.plan);
                            let currentClass = allClasses.find(cls => cls.id === content.plan);

                            return (
                                <div key={index} className='d-flex justify-content-between w-75 mx-auto'>
                                    <p>{content.type === 'plan' ? currentPlan?.packageName : currentClass?.className} <b> x {content.frequency}</b></p>
                                    <p>{content.type === 'plan' ? currentPlan?.packageTherapyTime : currentClass?.classDuration} mins.</p>
                                </div>
                            )
                        })
                        }
                    </div>}

                </Modal.Body>
            </Modal>
            <Form onSubmit={handleBookNowFormSubmit} noValidate validated={isBookingFormValid} ref={bookingFormRef}>
                <Form.Group className="mb-3 center-select">
                    <Form.Label>Recovery Lab Center</Form.Label>
                    <Form.Select
                        onChange={(e) => { setBookingCenter(e.target.value) }}
                        value={bookingCenter}
                        required
                    >
                        <option value={''} disabled>Select a Center</option>
                        {centerList.map((center) =>
                            <option value={center.id} key={center.id}>{center.name}</option>
                        )}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Please select a center
                    </Form.Control.Feedback>
                </Form.Group>

                {/* Service selector */}
                <label className='form-label'>Select A Package</label>
                <div className='select-services mb-3'>
                    <Tabs defaultActiveKey={packageTypes[0]?.id} id="ServicesSelect" className="justify-content-start gap-2">
                        {packageTypes.map((packageType) => {
                            return (
                                <Tab eventKey={packageType.id} title={packageType.name} key={packageType.id}>
                                    {packages.filter(pack => pack.packageTypeId === packageType.id).length === 0 && <div>No packages available in this category</div>}
                                    {packages.filter(pack => pack.packageTypeId === packageType.id).map((pack, index) => {
                                        return (
                                            <div key={pack.id} className='services-pack'>
                                                <div>
                                                    <Form.Check
                                                        value={pack.id}
                                                        onChange={e => { if (e.target.checked) setSelectedPackage(pack.id) }}
                                                        type="radio"
                                                        name='services'
                                                        id={pack.id}
                                                        label={pack.packageName}
                                                        defaultChecked={locationState?.packageId === pack.id}
                                                        required
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        Please select a package
                                                    </Form.Control.Feedback>
                                                    <p style={{ width: '400px' }} className='package-description' dangerouslySetInnerHTML={{ __html: pack.longDescription }} />
                                                </div>
                                                <div className='price-pack ms-auto'>
                                                    <span className='timePack'>Expires in {pack.packageDuration} days from purchase</span>
                                                </div>
                                                <div className='price-pack ms-auto'>
                                                    <span className='pricesign'>QAR</span> {pack.packageAmount}
                                                    <p
                                                        onClick={() => {
                                                            setSelectedPackageToView(pack);
                                                            setShowViewDetailsModal(true);
                                                        }}
                                                        className='details-button'
                                                    >
                                                        View Details
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </Tab>
                            )
                        })
                        }
                    </Tabs>
                </div>

                <div className='payment-details mt-3'>
                    <Row>
                        <Col lg={6}>
                            <div className='payment-des'>
                                <h5>Booking Details</h5>
                                {selectedPackage && <div className='booking-date'>
                                    {packages.find(pack => pack.id === selectedPackage)?.packageName} | Validity: {packages.find(pack => pack.id === selectedPackage)?.packageDuration} days
                                </div>}
                                <Table>
                                    <tbody>
                                        <tr>
                                            <td className='border-0'>Total</td>
                                            <td className='border-0 text-end'><span className='prisimbole'>QAR</span>{parseFloat(packages.find(pack => pack.id === selectedPackage)?.packageAmount || 0)}</td>
                                        </tr>
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
                                    Continue To Checkout
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </div>

            </Form>
        </div >
    )
}

export default PackagesBooking;