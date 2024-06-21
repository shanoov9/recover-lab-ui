import React, { useState, useCallback } from 'react';
import { Container, Form, Accordion, Row, Col, Tab, Tabs, Table, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { BookingServiceApis, PackagesServiceApis, pageDetailApiService } from '../../services/apiService';
import { useEffect } from 'react';
import { useRef } from 'react';
import UserContext from '../../contexts/UserContext';
import { useContext } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FIXED_PAGES, getTrasanctionIdAndStatus } from '../../services/constants';

function MembershipBooking() {

    const navigate = useNavigate();
    const reactLocation = useLocation();
    const locationState = reactLocation.state;

    const { user } = useContext(UserContext);

    const [centerList, setCenterList] = useState([]);
    const [taxPercentage, setTaxPercentage] = useState(0);

    const [allMemberships, setAllMemberships] = useState([]);
    const [monthlyMemberships, setMonthlyMemberships] = useState([]);
    const [quarterlyMemberships, setQuarterlyMemberships] = useState([]);

    // Validations
    const bookingFormRef = useRef();
    const [isBookingFormValid, setIsBookingFormValid] = useState(false);

    // Data
    const [membershipCenter, setMembershipCenter] = useState('');
    const [selectedMembership, setSelectedMembership] = useState('');

    const calculateTax = (rate) => {
        let amount = allMemberships.find(mem => mem.id === selectedMembership)?.packageAmount || 0;
        return parseFloat(amount) * rate / 100;
    }

    const calculateTotalAmount = () => {
        let amount = allMemberships.find(mem => mem.id === selectedMembership)?.packageAmount || 0;
        let tax = calculateTax(taxPercentage);
        return parseFloat(amount) + parseFloat(tax);
    }

    const calculateExpiryDate = () => {
        let duration = allMemberships.find(mem => mem.id === selectedMembership)?.packageDuration || 0;
        let date = new Date();
        date.setDate(date.getDate() + duration);
        return date;
    }

    const getCenterList = () => {
        pageDetailApiService.getPageDetails({ pageTitle: FIXED_PAGES.SETTINGS })
            .then((response) => {
                if (response.data.status === true) {
                    const centers = response.data.data.pageData.centerList;
                    const tax = parseInt(response.data.data.pageData.taxPercentage);
                    setCenterList(centers);
                    setTaxPercentage(tax);
                    setMembershipCenter(centers[0].id);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        getAllMemberships();
        getCenterList();
    }, [])

    const getAllMemberships = () => {
        const body = {
            packageType: 'MEMBERSHIP'
        }
        PackagesServiceApis.getAllPlans(body).then((response) => {
            console.log(response.data);
            if (response.data.status === true) {
                console.log(response.data.data);
                setAllMemberships(response.data.data);
                setMonthlyMemberships(response.data.data.filter(item => item.packageDuration === 30));
                setQuarterlyMemberships(response.data.data.filter(item => item.packageDuration === 90));
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    const handleBookNowFormSubmit = (e) => {
        if (user === null) {
            e.preventDefault();
            toast.error('Please login to purchase a membership.');
            navigate('/login');
            return;
        }
        if (bookingFormRef.current.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
            setIsBookingFormValid(true);
            window.scrollTo(0, 450);
            console.log("hhehe");
            return;
        }
        e.preventDefault();
        // Handle Booking Part
        let { transactionId, transactionStatus } = getTrasanctionIdAndStatus();
        let data = {
            bookingCenter: membershipCenter,
            bookingService: allMemberships.find(mem => mem.id === parseInt(selectedMembership)),
            bookingDate: new Date(),
            totalAmount: calculateTotalAmount(),
            bookingType: 'MEMBERSHIP',
            expiryDate: calculateExpiryDate(),
            transactionId,
            transactionStatus,
        }
        let headers = {
            "x-access-token": user?.token
        }
        BookingServiceApis.bookService(data, headers).then((response) => {
            console.log(response.data);
            if (response.data.status === true) {
                toast.success("Membership purchased successfully.");
                navigate('/my-membership');
            } else {
                toast.error("Failed to purchase membership!");
            }
        }).catch((error) => {
            console.log(error);
            toast.error('Failed to purchase membership!');
        })
    }

    return (
        <div className='membership-booking'>
            <Form onSubmit={handleBookNowFormSubmit} noValidate validated={isBookingFormValid} ref={bookingFormRef}>
                <Form.Group className="mb-3 center-select">
                    <Form.Label>Recovery Lab Center</Form.Label>
                    <Form.Select
                        value={membershipCenter}
                        onChange={(e) => setMembershipCenter(e.target.value)}
                        required
                    >
                        <option value={''} disabled>Select a Center</option>
                        {centerList.map((center) =>
                            <option key={center.id} value={center.id}>{center.name}</option>
                        )}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Please select a center.
                    </Form.Control.Feedback>
                </Form.Group>

                <label className='form-label'>Select A Membership</label>
                <div className='select-services mb-3'>
                    <Tabs defaultActiveKey={locationState?.membershipType || "monthly"} id="ServicesSelect" className="">
                        <Tab eventKey="monthly" title="Monthly">
                            {monthlyMemberships.length > 0 && monthlyMemberships.map((item) => {
                                return (
                                    <div className='services-pack' key={item.id}>
                                        <Form.Check
                                            type="radio"
                                            defaultChecked={locationState?.senderMembershipId == item.id}
                                            name='membership'
                                            required
                                            onChange={(e) => { if (e.target.checked) setSelectedMembership(item.id) }}
                                            id={`monthly${item.id}`}
                                            label={(<><b>{item.packageName}</b><span>{item.shortDescription}</span></>)}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please select a membership.
                                        </Form.Control.Feedback>
                                        <div className='price-pack ms-auto'>
                                            <span className='pricesign'>QAR</span> {parseFloat(item.packageAmount)} <span className='timePack'>/ Per Month</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </Tab>
                        <Tab eventKey="quarterly" title="Quarterly">
                            {quarterlyMemberships.length > 0 && quarterlyMemberships.map((item) => {
                                return (
                                    <div className='services-pack' key={item.id}>
                                        <Form.Check
                                            type="radio"
                                            name='membership'
                                            required
                                            onChange={(e) => { if (e.target.checked) setSelectedMembership(item.id) }}
                                            defaultChecked={locationState?.senderMembershipId == item.id}
                                            id={`quarterly${item.id}`} label={(<><b>{item.packageName}</b><span>{item.shortDescription}</span></>)}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Please select a membership.
                                        </Form.Control.Feedback>
                                        <div className='price-pack ms-auto'>
                                            <span className='pricesign'>QAR</span> {parseFloat(item.packageAmount)} <span className='timePack'>/ Per Quarter</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </Tab>
                    </Tabs>
                </div>

                <div className='payment-details mt-3'>
                    <Row>
                        <Col lg={6}>
                            <div className='payment-des'>
                                <h5>Booking Details</h5>
                                {selectedMembership && <div className='booking-date'>
                                    {allMemberships.find(mem => mem.id === selectedMembership)?.packageName} | {allMemberships.find(mem => mem.id === selectedMembership)?.packageDuration === 30 ? 'Monthly' : 'Quarterly'}
                                </div>}
                                <Table>
                                    <tbody>
                                        <tr>
                                            <td className='border-0'>Total</td>
                                            <td className='border-0 text-end'><span className='prisimbole'>QAR</span>{parseFloat(allMemberships.find(mem => mem.id === selectedMembership)?.packageAmount || 0)}</td>
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
                                    Countinue to Checkout
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </div>

            </Form>
        </div>
    )
}

export default MembershipBooking