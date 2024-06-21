import React, { useEffect, useState } from "react"
import { Container, Row, Col } from 'react-bootstrap';
import { GoArrowRight } from "react-icons/go";
import './../cms.scss';
import { useNavigate, useParams, Link } from "react-router-dom";
import { pageDetailApiService } from "../../../services/apiService";

function ClassesDetails() {
  const params = useParams();
  const navigte = useNavigate()


  const [pageData, setPageData] = useState([])

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
          <img src={pageData?.pilotBlock?.pilotBlockImage} />
        </div>
        <div className='herotext wow fadeInUp'>
          <Container fluid>
            <Row>
              <Col xl={5}>
                <h1>{pageData?.pilotBlock?.pilotBlolckHeading}</h1>
                <p dangerouslySetInnerHTML={{ __html: pageData?.pilotBlock?.pilotBlockDescription }}></p>
              </Col>
              <Col xl={5}></Col>
              <Col xl={2} className="align-self-center mt-3 mt-lg-0">
                <Link
                  to="/book-now"
                  state={{ bookingType: 'classesBook' }}
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
          pageData?.contentBlock?.content.map((block, index) => {
            return (
              <Container>
                <Row className="mb-5">
                  <Col lg="6" className={(index + 1) % 2 ? "order-md-last" : null}>
                    <img src={block?.image} className="img-fluid" alt="Cryotherapy" />
                  </Col>
                  <Col lg="6" className="align-self-center mt-4 mt-lg-0">
                    <h2>{block.title}</h2>
                    <p dangerouslySetInnerHTML={{ __html: block.description }}></p>
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
            </section>

            <section className="section-padd cms-sections wow fadeInUp">
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
              <span>Classes Plan</span>Price
            </h2>
          </div>

          <div className='packages-sec'>
            <div className='row'>
              {
                pageData?.pricingBlock?.plans.map((classPlan) => {
                  return (
                    <div className='col-lg-4 mt-4 wow fadeInUp'>
                      <div className='card package-box'>
                        <div className='card-body'>
                          <h5>{classPlan.className}</h5>
                          <div className='package-des'>
                            <p>Join our heated power class, where you will focus on activating your core-muscles to strengthen your body. The sequence will be a mixture of Yoga and some Pilates-based poses, offering you a great variation to build a strong foundation.</p>

                          </div>
                          <h6>ALL LEVELS WELCOME. A BASIC KNOWLEDGE OF YOGA IS PREFERRED</h6>
                          <h5>Duration: {classPlan?.classDuration} min</h5>
                          <h5>Batch size: {classPlan?.batchSize}</h5>
                          <div className='card-price'><span className='p-simbol'>QAR</span>{classPlan?.classPrice}</div>
                          <Link
                            to='/book-now'
                            state={{ bookingType: 'classesBook', bookingClass: classPlan?.classType }}
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



              {/* <div className='col-lg-4 mt-4 mt-lg-0 wow fadeInUp'>
                <div className='card package-box'>
                  <div className='card-body'>
                    <h5>IGNITE</h5>
                    <div className='package-des'>
                      <p>Ignite your inner fire with this hot yoga class, where you will be creating heat and energy in the body as you move through a strong vinyasa flow. A powerful release for the physical and emotional body to release toxins & stagnant energy. </p>
                    </div>
                    <h6>ALL LEVELS WELCOME. A BASIC KNOWLEDGE OF YOGA IS PREFERRED</h6>
                    <h5>Duration: 50min</h5>
                    <div className='card-price'><span className='p-simbol'>$</span>99</div>
                    <a href='/book-now' className='btn btn-primary rounded-pill px-4'>Book Now <GoArrowRight /></a>
                  </div>
                </div>
              </div>

              <div className='col-lg-4 mt-4 mt-lg-0 wow fadeInUp'>
                <div className='card package-box'>
                  <div className='card-body'>
                    <h5>AWAKEN</h5>
                    <div className='package-des'>
                      <p>Awaken the body and mind in this hot and sizzling yoga class, where you are exposed to variations of pranayama and fun, energising yoga flows.</p>
                    </div>
                    <h6>ALL LEVELS WELCOME. A BASIC KNOWLEDGE OF YOGA IS PREFERRED</h6>
                    <h5>Duration: 50min</h5>
                    <div className='card-price'><span className='p-simbol'>$</span>149</div>
                    <a href='/book-now' className='btn btn-primary rounded-pill px-4'>Book Now <GoArrowRight /></a>
                  </div>
                </div>
              </div> */}

            </div>
          </div>

        </Container>
      </section>

    </div>
  )
}

export default ClassesDetails