import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Tabs, Tab, Container } from 'react-bootstrap';
import { GoArrowRight } from "react-icons/go";
import './Membership.scss';
import { PackagesServiceApis } from '../../services/apiService';
import { Link } from 'react-router-dom';

function Membership() {

    const [monthlyMemberships, setMonthlyMemberships] = useState([]);
    const [quarterlyMemberships, setQuarterlyMemberships] = useState([]);

    useEffect(() => {
        getAllMemberships();
    }, [])

    const getAllMemberships = () => {
        const body = {
            packageType: 'MEMBERSHIP'
        }
        PackagesServiceApis.getAllPlans(body).then((response) => {
            console.log(response.data);
            if (response.data.status === true) {
                console.log(response.data.data);
                setMonthlyMemberships(response.data.data.filter(item => item.packageDuration === 30));
                setQuarterlyMemberships(response.data.data.filter(item => item.packageDuration === 90));
            }
        }).catch((error) => {
            console.log(error);
        })
    }

    return (

        <div className='package-container'>
            <div className='inner-hero'>
                <div className='inner-hero-image'>
                    <img src='./assets/img/inner-banner.png' />
                </div>
                <div className='herotext wow fadeInUp'>
                    <Container>
                        {/* <h2>Recovery Lab Qatar</h2> */}
                        <h1>Memberships</h1>
                    </Container>
                </div>
            </div>

            <section className='section-padd treatment-plan flash-white-card'>
                <Container>
                    <div className='membership-setion'>
                        <Tabs defaultActiveKey="monthly" id="plansType" className="mb-3 plantypes">
                            <Tab eventKey="monthly" title="Monthly">
                                <Row>

                                    {monthlyMemberships.length > 0 && monthlyMemberships.map((item) => {
                                        return (
                                            <Col lg={4} className='my-2' key={item.id}>
                                                <div className='card package-box'>
                                                    <div className='card-body'>
                                                        <h5>{item.packageName}</h5>
                                                        <div className='package-des'>
                                                            <p>{item.shortDescription}</p>
                                                            <p dangerouslySetInnerHTML={{ __html: item.longDescription }} />
                                                            {/* <ul className='list-unstyled list-arrow'>
                                                                <li>{item.treatmentServiceName} ({item.packageDuration} min)</li>
                                                            </ul> */}
                                                        </div>
                                                        <div className='card-price'><span className='p-simbol'>QAR</span>{parseInt(item.packageAmount)} <span className="session">/ Monthly</span></div>
                                                        <Link
                                                            to='/book-now'
                                                            state={{ bookingType: 'membershipsBook', membershipType: 'monthly', membershipId: item.id }}
                                                            className='btn btn-primary rounded-pill px-4'
                                                        >
                                                            Book Now <GoArrowRight />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </Col>
                                        )
                                    })}

                                </Row>
                            </Tab>
                            <Tab eventKey="quarterly" title="Quarterly">
                                <Row>
                                    {quarterlyMemberships.length > 0 && quarterlyMemberships.map((item) => {
                                        return (
                                            <Col lg={4} className='my-2' key={item.id}>
                                                <div className='card package-box'>
                                                    <div className='card-body'>
                                                        <h5>{item.packageName}</h5>
                                                        <div className='package-des'>
                                                            <p>{item.shortDescription}</p>
                                                            <p dangerouslySetInnerHTML={{ __html: item.longDescription }} />
                                                        </div>
                                                        <div className='card-price'><span className='p-simbol'>QAR</span>{parseInt(item.packageAmount)} <span className="session">/ Quarterly</span></div>
                                                        <Link
                                                            to='/book-now'
                                                            state={{ bookingType: 'membershipsBook', membershipType: 'quarterly', senderMembershipId: item.id }}
                                                            className='btn btn-primary rounded-pill px-4'
                                                        >
                                                            Book Now
                                                            <GoArrowRight />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </Col>
                                        )
                                    })}

                                </Row>
                            </Tab>
                        </Tabs>
                    </div>
                </Container>
            </section>

        </div>

    );
}


export default Membership