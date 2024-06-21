import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { GoArrowRight } from "react-icons/go";
import './BookNow.scss';
import ServicesBooking from '../services-booking/ServicesBooking';
import ClassesBooking from '../classes-booking/ClassesBooking';
import MembershipBooking from '../membership-booking/MembershipBooking';
import { useLocation } from 'react-router-dom';
import PackagesBooking from '../packages-booking/PackagesBooking';
import { useEffect } from 'react';

function BookNow() {
    const reactLocation = useLocation();
    const locationState = reactLocation.state;

    const [tabKey, setTabKey] = useState("");

    useEffect(() => {
        if (locationState) {
            setTabKey(locationState?.bookingType || "servicesBook");
        }
    }, [locationState]);

    useEffect(() => {
        console.log(tabKey);
    }, [tabKey]);

    return (
        <div className='BookNow-container'>
            <div className='inner-hero'>
                <div className='inner-hero-image'>
                    <img src='./assets/img/inner-banner.png' />
                </div>
                <div className='herotext wow fadeInUp'>
                    <Container>
                        <h1>Booking Request</h1>
                    </Container>
                </div>
            </div>

            <section className='section-padd bookNow-section'>
                <Tabs defaultActiveKey={locationState?.bookingType || "servicesBook"} id="plansType" className="mb-3 plantypes" onSelect={k => setTabKey(k)}>
                    <Tab eventKey="servicesBook" title="services">
                        <Container>
                            <div className='Packages-con'>
                                <ServicesBooking />
                            </div>
                        </Container>
                    </Tab>
                    <Tab eventKey="classesBook" title="classes">
                        <Container>
                            <div className='Packages-con'>
                                <ClassesBooking />
                            </div>
                        </Container>
                    </Tab>
                    <Tab eventKey="membershipsBook" title="memberships">
                        <Container>
                            <div className='Packages-con'>
                                <MembershipBooking />
                            </div>
                        </Container>
                    </Tab>
                    <Tab eventKey="packagesBook" title="packages">
                        <Container>
                            <div className='Packages-con'>
                                <PackagesBooking />
                            </div>
                        </Container>
                    </Tab>
                </Tabs>
            </section>
        </div>
    )
}

export default BookNow