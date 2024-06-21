import React, { useEffect, useState } from "react"
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { GoArrowRight } from "react-icons/go";
import './../cms.scss';
import { pageDetailApiService } from "../../../services/apiService";
import { Link } from 'react-router-dom';

function Services() {


    const [pageData, setPageData] = useState([])

    useEffect(() => {
        getServicePageDetails()
    }, [])

    const getServicePageDetails = () => {
        let body = {
            pageTitle: 'SERVICES'
        }
        pageDetailApiService.getPageDetails(body).then((response) => {
            if (response.data.status == true) {
                const responseData = response.data.data
                const responsePageData = responseData.pageData
                console.log(responsePageData);
                setPageData(responsePageData)
                // setPageData(JSON.parse(responsePageData))
            }
        }).catch(err => {
            console.error(err)
        })
    }

    return (

        <div className="cms-container pb-5">
            <div className='inner-hero'>
                <div className='inner-hero-image'>
                    <img src={pageData?.pilotBlockData?.pilotBlockImage} />
                </div>
                <div className='herotext wow fadeInUp'>
                    <Container fluid>
                        <Row>
                            <Col xl={5}>
                                {/* <h2>RECOVERY LAB QATAR</h2> */}
                                <h1>{pageData?.pilotBlockData?.pilotBlockTitle}</h1>
                            </Col>
                            <Col xl={5}></Col>
                            <Col xl={2} className="align-self-center mt-3 mt-lg-0">
                                <Link
                                    to="/book-now"
                                    state={{ bookingType: 'servicesBook' }}
                                    className="btn btn-primary rounded-pill px-5"
                                >
                                    Book Now
                                </Link>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>

            <section className="section-padd-t cms-sections">
                <Container>
                    <Row>
                        <Col lg="6">
                            <h2>Treatment benefits</h2>
                        </Col>
                        <Col lg="6" className="align-self-center mt-4 mt-lg-0">
                            <span dangerouslySetInnerHTML={{ __html: pageData?.treatmentBenefits }} />
                            <Link
                                to="/book-now"
                                state={{ bookingType: 'servicesBook' }}
                                className="btn btn-primary rounded-pill px-5 mt-3"
                            >
                                Book Now
                            </Link>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section className="section-padd-t">
                <Container>
                    <div className='sub-heading text-center'>
                        <h2>
                            <span>Our</span>TREATMENTS
                        </h2>
                    </div>
                </Container>
            </section>

            {pageData?.treatmentsData && pageData?.treatmentsData.map((treatment, index) => {
                return (
                    <section className="section-padd-t cms-sections" key={index}>
                        <Container>
                            <Row>
                                <Col lg="6" className={(index + 1) % 2 ? "order-md-last" : null} >
                                    <img src={treatment.treatmentServiceImage} className="img-fluid" alt={treatment.treatmentServiceName} />
                                </Col>
                                <Col lg="6" className="align-self-center mt-4 mt-lg-0">
                                    <h3 className="mb-4">{treatment.treatmentServiceName}</h3>
                                    <p dangerouslySetInnerHTML={{ __html: treatment.treatmentServiceDescription }} />
                                    <div className='d-flex mt-5'>
                                        <Link
                                            to='/book-now'
                                            state={{ bookingType: 'servicesBook', senderServiceId: treatment.id }}
                                            className='btn btn-primary me-3 rounded-pill px-4'
                                        >
                                            Book Now <GoArrowRight />
                                        </Link>
                                        <Link
                                            to={`/service/${treatment.treatmentServiceName}`}
                                            state={{ bookingType: 'servicesBook', senderServiceId: treatment.id }}
                                            className='btn btn-link rounded-pill px-4'
                                        >
                                            More Info <GoArrowRight />
                                        </Link>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </section>
                )
            })}
        </div>
    )
}

export default Services