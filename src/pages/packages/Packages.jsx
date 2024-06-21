import React, { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { GoArrowRight } from "react-icons/go";
import './Packages.scss';
import { PackagesServiceApis } from '../../services/apiService';
import { Link } from 'react-router-dom';

function Packages() {

    const [packages, setPackages] = useState([]);

    useEffect(() => {
        getAllPackages();
    }, [])

    const getAllPackages = () => {
        const body = {
            packageType: 'PACKAGE'
        }
        PackagesServiceApis.getAllPlans(body).then((response) => {
            console.log(response.data);
            if (response.data.status === true) {
                console.log(response.data.data);
                setPackages(response.data.data);
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
                        <h1>Packages</h1>
                    </Container>
                </div>
            </div>

            <section className='section-padd packages-section'>
                <Container>
                    <div className='packages-sec'>
                        <Row>
                            {packages.length > 0 &&
                                packages.map((item) => {
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
                                                    <div className='card-price'><span className='p-simbol'>QAR</span>{item.packageAmount}</div>
                                                    <Link
                                                        to='/book-now'
                                                        state={{ bookingType: 'packagesBook', senderServiceId: item.treatmentServiceID, packageId: item.id }}
                                                        className='btn btn-primary rounded-pill px-4'
                                                    >
                                                        Book Now <GoArrowRight />
                                                    </Link>
                                                </div>
                                            </div>
                                        </Col>
                                    )
                                })
                            }
                        </Row>
                    </div>
                </Container>
            </section>

        </div>

    );
}


export default Packages