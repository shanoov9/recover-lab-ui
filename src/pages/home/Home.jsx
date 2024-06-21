import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Tabs, Tab, Container } from 'react-bootstrap';
import { GoArrowRight } from "react-icons/go";
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import './Home.scss';
import { instaFeedsApiService, pageDetailApiService } from '../../services/apiService';
import { FIXED_PAGES } from '../../services/constants';
import { Link } from 'react-router-dom';


function Home() {

  const [pageData, setPageData] = useState([])
  const [instafeeds, setInstafeeds] = useState([])

  useEffect(() => {
    getPageData()
    getInstaFeeds()
  }, [])

  // useEffect(()=>{

  // },[])
  const getPageData = () => {
    const body = {
      pageTitle: FIXED_PAGES.HOME
    }
    pageDetailApiService.getPageDetails(body).then((response) => {
      if (response.data.status == true) {
        const responseData = response.data.data.pageData
        console.log("pageData :", responseData)
        setPageData(responseData)
        // setPageData(JSON.parse(responseData))
      }
    })
  }

  const getInstaFeeds = () => {
    instaFeedsApiService.getAllInstaFeeds().then(response => {
      console.log(response)
      if (response.data.status == true) {
        setInstafeeds(response.data.data)
      }
    }).catch(err => console.error(err))
  }

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://widgets.sociablekit.com/instagram-hashtag-feed/widget.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);


  }, [])

  return (
    <div className='Home-container'>
      <div className='hero-container position-relative'>
        <video width="750" height="500" autoPlay loop muted>
          <source src={'assets/video/hero-video.mp4'} type="video/mp4" />
        </video>
        <div className='herotext wow fadeInUp'>
          <Container fluid>
            <h1>{pageData?.pilotBlockData?.title}</h1>
            <p dangerouslySetInnerHTML={{ __html: pageData?.pilotBlockData?.description }}></p>
          </Container>
        </div>
      </div>

      <section className='section-padd'>
        <Container>
          <div className='d-lg-flex justify-content-between headingtxt'>
            <div className='sub-heading wow fadeInUp'>
              <h2>
                <span>Our Services</span>
                Treatments
              </h2>
            </div>
            <p dangerouslySetInnerHTML={{ __html: pageData?.treatmentsBlockData?.treatmentsBlockDescription }}></p>
          </div>

          <div className='services-section'>
            <div className='row'>
              {pageData?.treatmentsBlockData?.selectedServices.length > 0 && pageData?.treatmentsBlockData?.selectedServices.map((service) => {
                let data = pageData?.treatmentsBlockData?.selectedServicesData[service.id];
                return (
                  <div className='col-lg-4 mt-5 wow fadeInUp' key={service.id}>
                    <div className='servicesBox'>
                      <div className='servicesImg'>
                        <img src={data.image} className='img-fluid' alt='icebath' />
                      </div>
                      <div className='servicesTxt'>
                        <h4>{data.title}</h4>
                        <div className='serviceDes' dangerouslySetInnerHTML={{ __html: data.description }} />
                        <div className='card-price'>
                          <span className="p-simbol">QAR</span>{parseFloat(service.packageAmount)} <span className="session">/ Session</span>
                        </div>
                        <div className='d-flex justify-content-between'>
                          <Link
                            to='/book-now'
                            state={{ bookingType: "servicesBook", senderServiceId: service.treatmentServiceID }}
                            className='btn btn-primary'
                          >
                            Book Now <GoArrowRight />
                          </Link>
                          <Link to={`/service/${service.treatmentServiceName}`} className='btn btn-link'>More Info <GoArrowRight /></Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="text-center wow fadeInUp"><Link to="/services" className="btn btn-outline-primary rounded-pill mt-5 px-4">View All <GoArrowRight /></Link></div>
        </Container>
      </section>

      <section className="section-padd-b insta-section">
        <Container fluid>
          <div className='insta-heading text-center wow fadeInUp'>
            <h2 className=''>#recoverylabqatar</h2>
            <p>Tag @recoverylabqatar in your post and appear on our feed</p>
          </div>


          <div class='sk-ww-instagram-hashtag-feed' data-embed-id='25418744'></div>
          {/* #renessenceworld */}
          {/* <div class='sk-ww-instagram-hashtag-feed' data-embed-id='25416774'></div> */}
          {/* #shotonpixel */}
          {/* <div class='sk-ww-instagram-hashtag-feed' data-embed-id='25416766'></div> */}
        </Container>
      </section>

      <section className='section-padd treatment-plan bg-pastel-blue'>
        <Container>
          <div className='sub-heading text-center wow fadeInUp'>
            <h2>
              PACKAGES
            </h2>
          </div>

          <div className='packages-sec'>
            <div className='row'>
              {/* {console.log(pageData?.packagesBlockData?.selectedPackages)} */}
              {
                pageData?.packagesBlockData?.selectedPackages.map((pack) => {
                  return (
                    <div className='col-lg-4 mt-4 wow fadeInUp' key={pack.id}>
                      <div className='card package-box'>
                        <div className='card-body'>
                          <h5>{pack.treatmentServiceName}</h5>
                          <div className='package-des'>
                            <p>{pack?.shortDescription}</p>
                            <p className='list-unstyled list-arrow' dangerouslySetInnerHTML={{ __html: pack?.longDescription }}></p>
                            {/* <ul className='list-unstyled list-arrow'>
                       {}
                      </ul> */}
                          </div>
                          <div className='card-price'><span className='p-simbol'>QAR</span>{pack.packageAmount}</div>
                          <Link
                            to='/book-now'
                            state={{ bookingType: "packagesBook", senderServiceId: pack.treatmentServiceID, packageId: pack.id }}
                            className='btn btn-primary rounded-pill px-4'
                          >Book Now <GoArrowRight />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })
              }



              {/* <div className='col-lg-4 mt-4 mt-lg-0 wow fadeInUp'>
                <div className='card package-box'>
                  <div className='card-body'>
                    <h5>Revive</h5>
                    <div className='package-des'>
                    <p>Focus on your well-being with our Yoga Package. A Well-being Studio Class of your choice paired with a 25 minute infrared sauna session.</p>
                    <ul className='list-unstyled list-arrow'>
                      <li>Well-being Studio Class (~60 min) </li>
                      <li>Sauna (25 min)</li>
                    </ul>
                    </div>
                    <div className='card-price'><span className='p-simbol'>$</span>99</div>
                    <a href='/book-now' className='btn btn-primary rounded-pill px-4'>Book Now <GoArrowRight /></a>
                  </div>
                </div>
              </div>

              <div className='col-lg-4 mt-4 mt-lg-0 wow fadeInUp'>
                <div className='card package-box'>
                  <div className='card-body'>
                    <h5>Recovery</h5>
                    <div className='package-des'>
                    <p>Focus on your well-being with our Yoga Package. A Well-being Studio Class of your choice paired with a 25 minute infrared sauna session.</p>
                    <ul className='list-unstyled list-arrow'>
                      <li>Well-being Studio Class (~60 min) </li>
                      <li>Sauna (25 min)</li>
                    </ul>
                    </div>
                    <div className='card-price'><span className='p-simbol'>$</span>149</div>
                    <a href='/book-now' className='btn btn-primary rounded-pill px-4'>Book Now <GoArrowRight /></a>
                  </div>
                </div>
              </div> */}

            </div>

            <div className="text-center wow fadeInUp"><Link to="/packages" className="btn btn-outline-primary rounded-pill mt-5 px-4">View All <GoArrowRight /></Link></div>
          </div>

        </Container>
      </section>

      <section className='section-padd treatment-plan bg-flash-white flash-white-card wow fadeInUp'>
        <Container>
          <div className='sub-heading text-center'>
            <h2>
              Memberships
            </h2>
          </div>
          <div className='membership-setion'>
            <Tabs defaultActiveKey="monthly" id="plansType" className="mt-5 plantypes">
              <Tab eventKey="monthly" title="Monthly">
                <div className='row'>
                  {
                    pageData?.membershipsBlockData?.selectedMonthlyMemberships.map((monthlyMembership) => {
                      return (
                        <div className='col-lg-4 mt-4' key={monthlyMembership.id}>
                          <div className='card package-box'>
                            {console.log(monthlyMembership)}
                            <div className='card-body'>
                              <h5>{monthlyMembership?.packageName}</h5>
                              <div className='package-des'>
                                <p >{monthlyMembership?.shortDescription}</p>
                                <p dangerouslySetInnerHTML={{ __html: monthlyMembership?.longDescription }}></p>
                              </div>
                              <div className='card-price'><span className='p-simbol'>QAR</span>{monthlyMembership?.packageAmount}<span className="session">/ Monthly</span></div>
                              <Link
                                to='/book-now'
                                state={{ bookingType: "membershipsBook", membershipType: 'monthly', senderMembershipId: monthlyMembership.id }}
                                className='btn btn-primary rounded-pill px-4'
                              >Book Now <GoArrowRight />
                              </Link>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }



                  {/* <div className='col-lg-4 mt-4 mt-lg-0'>
                    <div className='card package-box'>
                      <div className='card-body'>
                        <h5>Ice Bath</h5>
                        <div className='package-des'>
                        <p>Recharge in your own private infrared sauna to soothe sore muscles, fuel your body and accelerate your metabolism.</p>
                        </div>
                        <div className='card-price'><span className='p-simbol'>$</span>99<span className="session">/ Monthly Membership</span></div>
                        <a href='/book-now' className='btn btn-primary rounded-pill px-4'>Book Now <GoArrowRight /></a>
                      </div>
                    </div>
                  </div>

                  <div className='col-lg-4 mt-4 mt-lg-0'>
                    <div className='card package-box'>
                      <div className='card-body'>
                        <h5>Longevity Membership</h5>
                        <div className='package-des'>
                        <p>Includes Unlimited Tech-Treatments:</p>
                        <ul className='list-unstyled list-arrow'>
                          <li>Oxygen Hydroxy Therapy</li>
                          <li>Infrared Sauna</li>
                          <li>Ice Bath</li>
                          <li>Cryotherapy</li>
                          <li>Sensory Deprivation Float</li>
                          <li>Well-being Studio Classes</li>
                        </ul>
                        </div>
                        <div className='card-price'><span className='p-simbol'>$</span>149<span className="session">/ Monthly Membership</span></div>
                        <a href='/book-now' className='btn btn-primary rounded-pill px-4'>Book Now <GoArrowRight /></a>
                      </div>
                    </div>
                  </div> */}

                </div>
              </Tab>
              <Tab eventKey="quarterly" title="Quarterly">
                <div className='row'>
                  {
                    pageData?.membershipsBlockData?.selectedQuarterlyMemberships.map((quarterlyMembership) => {
                      return (
                        <div className='col-lg-4 mt-4 mt-lg-0' key={quarterlyMembership.id}>
                          <div className='card package-box'>
                            <div className='card-body'>
                              <h5>{quarterlyMembership?.packageName}</h5>
                              <div className='package-des'>
                                <p>{quarterlyMembership.shortDescription}</p>
                                <p dangerouslySetInnerHTML={{ __html: quarterlyMembership?.longDescription }}></p>
                              </div>
                              <div className='card-price'><span className='p-simbol'>QAR</span>{quarterlyMembership.packageAmount}<span className="session">/ Quarterly</span></div>
                              <Link
                                to='/book-now'
                                state={{ bookingType: "membershipsBook", membershipType: 'quarterly', senderMembershipId: quarterlyMembership.id }}
                                className='btn btn-primary rounded-pill px-4'
                              >
                                Book Now <GoArrowRight />
                              </Link>
                            </div>
                          </div>
                        </div>
                      )
                    })

                  }



                </div>
              </Tab>
            </Tabs>

            <div className="text-center"><Link to="/membership" className="btn btn-outline-primary rounded-pill mt-5 px-4">View All <GoArrowRight /></Link></div>
          </div>
        </Container>
      </section>

      <section className='section-padd-b studio-section wow fadeInUp'>
        <Container>
          <div className='row'>
            <div className='col-lg-10'>
              <div className='studio-img'>
                <img src={'assets/img/studio.png'} alt='studio' />
              </div>
            </div>
            <div className='col-lg-2'></div>
            <div className='col-lg-2'></div>
            <div className='col-lg-10'>
              <div className='bg-pastel-blue studio-txt'>
                <div className='sub-heading'>
                  <h2>
                    MOTION STUDIO
                  </h2>
                </div>
                <div className='mt-4'>
                  <p dangerouslySetInnerHTML={{ __html: pageData?.studioBlockData?.studioBlockDescription }}></p>
                  <div className='button-info mt-4'>
                    <Link to='/classes' className='btn btn-primary rounded-pill px-4'>More Info <GoArrowRight /></Link>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className='section-padd-b ourStory'>
        <Container>
          <div className='ab-img wow fadeInUp'><img src={'assets/img/aboutus.png'} alt='About us' /></div>
          <div className='row mt-5 wow fadeInUp'>
            <div className='col-lg-4 ablogo align-self-center'>
              <img src={'assets/img/wordmark_black.png'} className='about-logo' alt='Dark-logo' />
            </div>
            <div className='col-lg-8'>
              <div className='sub-heading'>
                <h2>
                  Our Story
                </h2>
                <div className='mt-4'>
                  <p dangerouslySetInnerHTML={{ __html: pageData?.ourStoryBlockData?.ourStoryBlockDescription }}></p>

                  <div className='button-info mt-4'>
                    <Link to='/about-us' className='btn btn-outline-primary rounded-pill px-4'>More Info <GoArrowRight /></Link>
                  </div>

                </div>
              </div>
            </div>
          </div>

        </Container>
      </section>

      {pageData?.testimonialsBlockData?.testimonials.length > 0 && <section className='section-padd-b testimonials-section wow fadeInUp'>
        <Container>
          <OwlCarousel items={1} className="testimonials-slider" nav video margin={10}>
            {pageData?.testimonialsBlockData?.testimonials.map((testimony) => {
              return (
                <div key={testimony.id}>
                  <div className='client-words'>
                    " {testimony.content} "
                  </div>
                  <div className='custName'><span>{testimony.client}</span></div>
                </div>
              )
            })

            }


            {/* <div>
                <div className='client-words'>
                    "The most exclusive wellness location in Amsterdam; the recently opened Renessence."
                </div>
                <div className='custName'><span>Nickyy Helly</span></div>
              </div>
              <div>
                <div className='client-words'>
                    "The most exclusive wellness location in Amsterdam; the recently opened Renessence."
                </div>
                <div className='custName'><span>Paul Lehan</span></div>
              </div> */}
          </OwlCarousel>
        </Container>
      </section>}
    </div>
  )
}

export default Home