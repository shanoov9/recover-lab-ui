import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { GoArrowRight } from "react-icons/go";
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import { pageDetailApiService } from '../../services/apiService';
import { FIXED_PAGES } from '../../services/constants';

function Contact() {

    const [pageData, setPageData] = useState([])
    const [ centerList,setCenterList]=useState([])

    useEffect(() => {
      getPageData()
      getCenterList()
    }, [])
  
    const getPageData = () => {
      const body = {
        pageTitle: 'CONTACT US'
      }
      pageDetailApiService.getPageDetails(body).then((response) => {
        if (response.data.status == true) {
          const responseData = response.data.data.pageData
          setPageData(responseData)
        }
      })
    }
  
    const getDay = (holidayDate) => {
        const date = new Date(holidayDate)
        const day = date.getDay()
        const dayName = (day ==1 )? 'Monday' :  (day == 2 ) ? 'Tuesday' :  (day == 3 ) ? 'Wednesday':  (day == 4 ) ? 'Thursday':  (day == 5 ) ? 'Friday':  (day == 6) ? 'Saturday' :  (day == 0 ) ? 'Sunday' : ''
        return dayName
    }

    const getCenterList = () => {
        pageDetailApiService.getPageDetails({ pageTitle: FIXED_PAGES.SETTINGS })
            .then((response) => {
                if (response.data.status === true) {
                    const centers = response.data.data.pageData.centerList;
                    setCenterList(centers);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <div className='about-container'>

            <div className='inner-hero'>
                <div className='inner-hero-image'>
                    <img src={pageData?.pilotBlock?.image} />
                </div>
                <div className='herotext wow fadeInUp'>
                    <Container>
                        <h1>{pageData?.pilotBlock?.title}</h1>
                        <p dangerouslySetInnerHTML={{__html:pageData?.pilotBlock?.description}}></p>

                    </Container>
                </div>
            </div>

            <section className='section-padd contact-txt'>
                <Container>
                    <h4 className='con-sep mb-4 pb-4'>CONTACT US</h4>

                    <div className='con-sep mb-4 pb-4'>
                        <p>{pageData?.centerData?.centerAddress} </p>
                        <p className='mb-0'>{pageData?.centerData?.centerPhone}</p>
                    </div>

                    <div className='con-sep mb-4 pb-4'>
                        <Row>
                            <Col lg={3}>
                                <h6>For general inquiries</h6>
                                <a href='mailto:welcome@renessence.com' className='btn-info'>{pageData?.emailIds?.inquiryEmail}</a>
                            </Col>
                            <Col lg={3} className='mt-4'>
                                <h6>For events, partnerships and space rental collaborations</h6>
                                <a href='mailto:events@recoverylabquatar' className='btn-info'>{pageData?.emailIds?.eventsEmail}</a>
                            </Col>
                            <Col lg={3} className='mt-4'>
                                <h6>For hiring inquiries</h6>
                                <a href='mailto:career@recoverylabquatar' className='btn-info'>{pageData?.emailIds?.hiringEmail}</a>
                            </Col>
                            <Col lg={3} className='mt-4'>
                                <h6>For press requests</h6>
                                <a href='mailto:press@recoverylabquatar' className='btn-info'>{pageData?.emailIds?.pressEmail}</a>
                            </Col>
                        </Row>
                    </div>

                    <div className='con-sep mb-4 pb-4'>
                        <h5 className='mb-4'>OPENING HOURS</h5>
                        <Row>
                            <Col lg={4} className='mt-4'>
                                <h6>Monday to Thursday</h6>
                                {pageData?.openingClosingHours?.mondayToThursday.openingTime} till {pageData?.openingClosingHours?.mondayToThursday.closingTime}
                            </Col>
                            <Col lg={4} className='mt-4'>
                                <h6>Friday</h6>
                                {pageData?.openingClosingHours?.friday.openingTime} till {pageData?.openingClosingHours?.friday.closingTime}                            </Col>
                            <Col lg={4} className='mt-4'>
                                <h6>Saturday & Sunday</h6>
                                {pageData?.openingClosingHours?.saturdaySunday.openingTime} till {pageData?.openingClosingHours?.saturdaySunday.closingTime}   
                            </Col>
                        </Row>
                    </div>

                    <div className='con-sep mb-4 pb-4'>
                        <h5 className='mb-4'>HOLIDAY OPENING HOURS</h5>
                        {
                            pageData?.holidayHours && pageData?.holidayHours.map((holiday, index)=>{
                                return(
                                    <div className='mb-3' key={index}>
                                    <h6>{holiday.day} - {getDay(holiday.date)} , {holiday.date} - <span>{holiday.openingTime} till {holiday.closingTime}</span></h6>
                                </div>
                                )
                            })
                        }
                    </div>


                    <div className='con-sep mb-4 pb-4'>
                        <h5 className='mb-4'>ALL CENTERS</h5>
                                <Row>
                                    {
                                        centerList.length && centerList.map(center => {
                                            return (
                                                <div className='mb-3' key={center.id}>
                                                    <h4>{center?.name}</h4>
                                                    <p>{center?.address}</p>
                                                    <p>
                                                        <span className='p-2'>{center?.phone1}</span>
                                                        <span className='p-2'>{center?.phone2}</span>
                                                        </p>
                                            </div>
                                            )
                                        })
                                    }
                                   
                                </Row>
                        
                                  
                        
                    </div>

                </Container>
            </section>


        </div>
    )
}

export default Contact