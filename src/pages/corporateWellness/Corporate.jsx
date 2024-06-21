import React, { useEffect, useState } from 'react'
import { pageDetailApiService } from '../../services/apiService'
import { Container, Row, Col } from 'react-bootstrap';
import { FIXED_PAGES } from '../../services/constants';

function Corporate() {
  const [pageData, setPageData] = useState([])

  useEffect(() => {
    getPageDetail()
  }, [])

  const getPageDetail = () => {
    const body = {
      pageTitle: FIXED_PAGES.CORPORATE_WELLNESS
    }
    pageDetailApiService.getPageDetails(body).then((response) => {
      if (response.data.status == true) {
        const responseData = response.data.data
        const responsePageData = responseData.pageData
        console.log(responsePageData)
        setPageData(responsePageData)
      }
    }).catch(err => {
      console.error(err)

    })
  }
  return (
  
    <div className="cms-container">
      <div className='inner-hero'>
        <div className='inner-hero-image'>
          <img src={pageData?.pilotBlock?.image} />
        </div>
        <div className='herotext wow fadeInUp'>
          <Container fluid>
            <Row>
              <Col lg={5}>
                <h1>{pageData?.pilotBlock?.title}</h1>
              </Col>
            </Row>
          </Container>
        </div>
      </div>

   {
    pageData?.contentBlocks &&
    <section className="section-padd-t section-padd-b-50 cms-sections wow fadeInUp">
    {
      pageData?.contentBlocks.map((block, index) => {
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
   }
    </div >
  )
}

export default Corporate