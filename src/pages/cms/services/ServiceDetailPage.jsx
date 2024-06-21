import React, { useEffect, useState } from "react"
import { Container, Row, Col } from 'react-bootstrap';
import { GoArrowRight } from "react-icons/go";
import './../cms.scss';
import { useNavigate, useParams, Link } from "react-router-dom";
import { pageDetailApiService } from "../../../services/apiService";
import { useLocation } from 'react-router-dom';

function ServiceDetailPage() {

  const reactLocation = useLocation();
  const locationState = reactLocation?.state;

  const navigte = useNavigate()
  const params = useParams();

  const [pageData, setPageData] = useState([])


  console.log(params)

  useEffect(() => {
    getPageDetail()
  }, [params.title])

  const getPageDetail = () => {
    const body = {
      pageTitle: params.title.toUpperCase()
    }
    pageDetailApiService.getPageDetails(body).then((response) => {
      if (response.data.status == true) {
        const responseData = response.data.data
        const responsePageData = responseData.pageData
        console.log(responsePageData)
        setPageData(responsePageData)
        // setPageData(JSON.parse(responsePageData))

      }
    }).catch(err => {
      navigte('/')
      console.error(err)

    })
  }

  return (

    <div className="cms-container">
      <div className='inner-hero'>
        <div className='inner-hero-image'>
          <img src={pageData?.pilotBlockData?.pilotBlockImage} />
        </div>
        <div className='herotext wow fadeInUp'>
          <Container fluid>
            {console.log(pageData?.pilotBlockData?.pilotBlolckHeading)}
            <Row>
              <Col xl={5}>
                <h1>{pageData?.pilotBlockData?.pilotBlolckHeading}</h1>
                <p dangerouslySetInnerHTML={{ __html: pageData?.pilotBlockData?.pilotBlockDescription }}></p>
              </Col>
              <Col xl={5}></Col>
              <Col xl={2} className="align-self-center mt-3 mt-lg-0">
                <Link
                  to="/book-now"
                  state={locationState}
                  className="btn btn-primary rounded-pill px-5"
                >
                  Book Now
                </Link>
              </Col>
            </Row>
          </Container>
        </div>
      </div>

      <section className="section-padd-t section-padd-b-50 cms-sections wow fadeInUp">
        {
          pageData?.contentBlockData?.content.map((block, index) => {
            return (
              <Container key={index}>
                <Row className="mb-5">
                  <Col lg="6" className={(index + 1) % 2 ? "order-md-last" : null} >
                    <img src={block.image} className="img-fluid" alt="Cryotherapy" />
                  </Col>
                  <Col lg="6" className="align-self-center mt-4 mt-lg-0">
                    <h2>{block.title}</h2>
                    <p dangerouslySetInnerHTML={{ __html: block?.description }}></p>
                  </Col>
                </Row>
              </Container>
            )
          })
        }

      </section>

      {/* <section className="section-padd-t cms-sections wow fadeInUp">
                <Container>
                    <Row>
                        <Col lg="6">
                            <img src='./assets/img/Cryo_therapy_banner1-1.png' className="img-fluid" alt="Cryotherapy"/>
                        </Col>
                        <Col lg="6" className="align-self-center mt-4 mt-lg-0">
                            <h2>WHAT SHOULD I EXPECT FROM A SESSION?</h2>
                            <p>We have a high-end double cryo-chamber that is designed for four-person use. During a cryotherapy session, the body is exposed to a temperature of -110 degrees of dry cold air. Once the session begins you will spend 20 seconds at -60 degrees, before entering the second chamber of -100 degrees where you will spend up to 2 minutes and 40 seconds. This has an unprecedented number of effects, including more energy, less stress, better sleep, and faster recovery after exercise. </p>
                        </Col>
                    </Row>
                </Container>
            </section> */}

      {/* <section className="section-padd cms-sections wow fadeInUp">
                <Container>
                    <Row>
                        <Col lg="6" className="order-md-last">
                            <img src='./assets/img/cro-3.png' className="img-fluid" alt="Cryotherapy"/>
                        </Col>
                        <Col lg="6" className="align-self-center mt-4 mt-lg-0">
                            <h2>PRIOR TO YOUR TREATMENT</h2>
                            <li>Please remove any jewellery or exterior body piercings below the neck. Also, don’t apply any oils, lotions, or cologne prior to your treatment. You’ll be provided with a robe, socks, slippers, and gloves for protection. We recommend wearing underwear, shorts, bathing suits, or bikinis.</li>
                        </Col>
                    </Row>
                </Container>
            </section> */}

      <section className='section-padd treatment-plan bg-pastel-blue'>
        <Container>
          <div className='sub-heading text-center wow fadeInUp'>
            <h2>
              <span>Treatments Plan</span>PACKAGES
            </h2>
          </div>

          <div className='packages-sec'>
            <div className='row'>
              {
                pageData?.pricingBlockData?.plan &&
                <div className='col-lg-4 mt-4 wow fadeInUp'>
                  <div className='card package-box'>
                    <div className='card-body'>
                      <h5>SINGLE TREATMENT</h5>
                      <p>{pageData?.pricingBlockData?.plan.packageName} </p>
                      <div className='package-des'>
                        <p>{pageData?.pricingBlockData?.plan.shortDescription}</p>
                      </div>
                      <div className='card-price'><span className='p-simbol'>QAR</span>{pageData?.pricingBlockData?.plan.packageAmount}</div>
                      <Link
                        to='/book-now'
                        state={{ ...locationState, senderPlanId: pageData?.pricingBlockData?.plan.id }}
                        className='btn btn-primary rounded-pill px-4'
                      >
                        Book Now <GoArrowRight />
                      </Link>
                    </div>
                  </div>
                </div>
              }

              {
                pageData?.pricingBlockData?.package &&
                <div className='col-lg-4 mt-4 wow fadeInUp'>
                  <div className='card package-box'>
                    <div className='card-body'>
                      <h5>PACKAGE</h5>
                      <p>{pageData?.pricingBlockData?.package.packageName} </p>
                      <div className='package-des'>
                        <p>{pageData?.pricingBlockData?.package.shortDescription}</p>
                      </div>
                      <div className='card-price'><span className='p-simbol'>QAR</span>{pageData?.pricingBlockData?.package.packageAmount}</div>
                      <Link
                        to='/book-now'
                        state={{ bookingType: 'packagesBook', senderServiceId: pageData?.pricingBlockData?.package.treatmentServiceID, packageId: pageData?.pricingBlockData?.package.id }}
                      className='btn btn-primary rounded-pill px-4'
                      >
                      Book Now <GoArrowRight />
                    </Link>
                  </div>
                </div>
                </div>


              }

            {
              pageData?.pricingBlockData?.membership &&
              <div className='col-lg-4 mt-4 wow fadeInUp'>
                <div className='card package-box'>
                  <div className='card-body'>
                    <h5>MEMBERSHIP</h5>
                    <p>{pageData?.pricingBlockData?.membership.packageName} </p>
                    <div className='package-des'>
                      <p>{pageData?.pricingBlockData?.membership.shortDescription}</p>
                    </div>
                    <div className='card-price'><span className='p-simbol'>QAR</span>{pageData?.pricingBlockData?.membership.packageAmount}</div>
                    <Link
                      to='/book-now'
                      state={{ bookingType: 'membershipsBook', membershipType: pageData?.pricingBlockData?.membership.packageDuration === 30 ? 'monthly' : 'quarterly', senderMembershipId: pageData?.pricingBlockData?.membership.id }}
                      className='btn btn-primary rounded-pill px-4'
                    >
                      Book Now <GoArrowRight />
                    </Link>
                  </div>
                </div>
              </div>
            }



          </div>
        </div>

      </Container>
    </section>

    </div >
  )
}

export default ServiceDetailPage