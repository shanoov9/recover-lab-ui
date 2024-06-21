import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { GoArrowRight } from "react-icons/go";
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import { Link } from 'react-router-dom';
import { pageDetailApiService } from '../../services/apiService';
import { FIXED_PAGES } from '../../services/constants';

function About() {
    const [pageData, setPageData] = useState([])
    const [blogsData, setBlogsData] = useState([])

    useEffect(() => {
        getAbousUsDetails()
        getBlogsData()
    }, [])

    const getAbousUsDetails = () => {
        let body = {
            pageTitle: 'ABOUT US'
        }
        pageDetailApiService.getPageDetails(body).then((response) => {
            if (response.data.status == true) {
                const responseData = response.data.data
                const responsePageData = responseData.pageData
                setPageData(responsePageData)
            }
        }).catch(err => {
            console.error(err)
        })
    }
    const getBlogsData = () => {
        const body = {
          pageTitle: FIXED_PAGES.HOME
        }
        pageDetailApiService.getPageDetails(body).then((response) => {
          if (response.data.status == true) {
            const responseData = response.data.data.pageData.testimonialsBlockData.testimonials
            setBlogsData(responseData)
          }
        })
      }
    


    return (
        <div className='about-container'>

            <div className='inner-hero'>
                <div className='inner-hero-image'>
                    <img src={pageData?.pilotBlockData?.pilotBlockImage} />
                </div>
                <div className='herotext wow fadeInUp'>
                    <Container>
                        <h2>{pageData?.pilotBlockData?.pilotBlolckHeading}</h2>
                    </Container>
                </div>
            </div>

            <section className='section-padd'>
                <Container>
                    <Row>
                        <Col lg={8}>
                            <h2>{pageData?.articleBlockData?.articleBlockTitle}</h2>
                        </Col>
                        <Col lg={4}></Col>
                    </Row>

                    <Row className='mt-5'>
                        <Col lg={4}></Col>
                        <Col lg={8}>
                            <p dangerouslySetInnerHTML={{ __html: pageData?.articleBlockData?.articleBlockContent }}></p>
                        </Col>
                    </Row>
                </Container>
            </section>


            <section className="section-padd-b cms-sections wow fadeInUp">
                <Container>
                    {
                        pageData?.contentBlockData && pageData?.contentBlockData.content.map((data, index) => {
                            return (
                                <Row className='section-padd-t' key={data.id}>
                                    <Col lg="6" className={(index + 1) % 2 ? "order-md-last" : null}>
                                        <img src={data.image} className="img-fluid" alt="Cryotherapy" />
                                    </Col>

                                    <Col lg="6" className="align-self-center mt-4 mt-lg-0" >
                                        <h2 className='mb-4'>{data.title}</h2>
                                        <p dangerouslySetInnerHTML={{ __html: data.description }}></p>
                                    </Col>
                                </Row>
                            )
                        })
                    }



                </Container>
            </section>

            <section className='section-padd studio-section wow fadeInUp'>
                <Container>
                    <div className='row'>
                        <div className='col-lg-10'>
                            <div className='studio-img'>
                                <img src={pageData?.treatmentInfoBlockData?.treatmentInfoBlockImage} alt='studio' />
                            </div>
                        </div>
                        <div className='col-lg-2'></div>
                        <div className='col-lg-2'></div>
                        <div className='col-lg-10'>
                            <div className='bg-pastel-blue studio-txt'>
                                <div className='sub-heading'>
                                    <h2>{pageData?.treatmentInfoBlockData?.treatmentInfoBlockTitle}</h2>
                                </div>
                                <div className='mt-4'>
                                    <p dangerouslySetInnerHTML={{__html: pageData?.treatmentInfoBlockData?.treatmentInfoBlockDescription}}></p>
                                    <div className='button-info mt-4'>
                                        <Link to='/services' className='btn btn-primary rounded-pill px-4'>View Treatments<GoArrowRight /></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

{
blogsData.length >0 && 
<section className='section-padd testimonials-section wow fadeInUp'>
<Container>
    <OwlCarousel items={1} className="testimonials-slider" nav video margin={10}>
        {
            blogsData.map(blog=> {
                return (
                    <div key={blog.id}>
                    <div className='client-words'>
                        " {blog.content} "
                    </div>
                    <div className='custName'><span>{blog.client}</span></div>
                </div>
                )
            })
        }
       
        {/* <div>
            <div className='client-words'>
                "The most exclusive wellness location in Amsterdam; the recently opened Renessence."
            </div>
            <div className='custName'><span>Paul Lehan</span></div>
        </div> */}
    </OwlCarousel>
</Container>
</section>
}
           

        </div>
    )
}

export default About