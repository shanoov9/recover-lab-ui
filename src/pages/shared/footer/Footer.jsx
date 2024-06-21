import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { FiMapPin } from "react-icons/fi";
import { CiMobile3 } from "react-icons/ci";
import { FaRegEnvelope, FaFacebookF, FaLinkedinIn, FaInstagram, FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { NewsletterServiceApis, pageDetailApiService } from '../../../services/apiService';

import './Footer.scss';
import toast from 'react-hot-toast';

function Footer() {

  const [centerAddress, setCenterAddress] = useState([])

  useEffect(() => {
    getPageData()
  }, [])

  const getPageData = () => {
    const body = {
      pageTitle: 'CONTACT US'
    }
    pageDetailApiService.getPageDetails(body).then((response) => {
      if (response.data.status == true) {
        const responseData = response.data.data.pageData.centerData
        console.log(responseData)
        setCenterAddress(responseData)
      }
    })
  }


  const [userEmail, setUserEmail] = useState('');
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  const handleSubscribeNewsletterFormSubmit = (e) => {
    e.preventDefault();
    if (!emailRegex.test(userEmail)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    let body = {
      email: userEmail
    }
    NewsletterServiceApis.subscribeNewsletter(body).then(response => {
      if (response.status === 200) {
        toast.success('You have successfully subscribed');
        setUserEmail('');
      } else if (response.status === 208) {
        toast.success('You have already subscribed');
        setUserEmail('');
      }
      else {
        toast.error('Subscription failed. Please try again.');
      }
    }).catch(error => {
      console.error('Error:', error);
    });
  }

  return (
    <footer className='footer-container'>
      <Container>
        <div className='newsletter'>
          <Row>
            <Col lg={4}>
              <div className='sub-heading'>
                <h2>
                  <span>Stay in Touch</span>Subscribe us
                </h2>
              </div>
            </Col>
            <Col lg={1}></Col>
            <Col lg={7}>
              <Form className='newsletter-form' onSubmit={handleSubscribeNewsletterFormSubmit}>
                <Form.Group className="position-relative" controlId="NewsLetter">
                  <Form.Control type="email" value={userEmail} onChange={e => setUserEmail(e.target.value)} placeholder="johndoe@example.com" />
                  <Button type='submit' variant="primary" className='news-btn'><IoArrowForwardCircleOutline /></Button>
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </div>
        {
          centerAddress &&
          <div className='connect-section'>
            <Row className='align-items-center'>
              <Col md={6} lg={3}>
                <img src={'assets/img/wordmark_white.png'} className='footerlogo' alt='Logo' />
                {/* <div>{centerAddress.centerName}</div> */}
              </Col>
              <Col md={6} lg={3}>
                <div className='d-flex touchcon'>
                  <span className='touchIcon'><FiMapPin /></span>
                  <div>{centerAddress.centerAddress}</div>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className='d-flex touchcon'>
                  <span className='touchIcon'><FaRegEnvelope /></span>
                  <div>hello@recoverylabqater.com</div>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className='d-flex touchcon'>
                  <span className='touchIcon'><CiMobile3 /></span>
                  <div>{centerAddress?.centerPhone}</div>
                </div>
              </Col>
            </Row>
          </div>
        }


        <div className='quick-links'>
          <Row>
            <Col lg={9}>
              <h6>Quick Links</h6>
              <ul className='quickconnect list-unstyled'>
                <li><a href='/'>Home</a></li>
                <li><a href='/services'>Tech-Therapies</a></li>
                <li><a href='/services'>Treatments</a></li>
                <li><a href='/classes'>Motion Studio</a></li>
                <li><a href='/packages'>Packages</a></li>
                <li><a href='/membership'>Memberships</a></li>
                <li><a href='/about-us'>About</a></li>
                <li><a href='/corporate-wellness'>Corporate Wellness</a></li>
                <li><a href='/contact'>Contact</a></li>
              </ul>
            </Col>
            <Col lg={3}>
              <h6>Connect With Us</h6>
              <div className='social-connect'>
                {/* <a target='_blank' href='/'><FaLinkedinIn /></a>
                <a target='_blank' href='/'><FaFacebookF /></a> */}
                <a target='_blank' href='https://www.tiktok.com/@recoverylabqatar'><FaTiktok /></a>
                <a target='_blank' href='https://www.instagram.com/recoverylabqatar'><FaInstagram /></a>
              </div>
            </Col>
          </Row>
        </div>

        <div className='copyright'>
          ©Recovery Lab Qater, All right reserved  | <a href='/'>Privacy Policy</a>  | <a href='/'>Terms & Conditions</a>
        </div>

      </Container>
    </footer>
  )
}

export default Footer