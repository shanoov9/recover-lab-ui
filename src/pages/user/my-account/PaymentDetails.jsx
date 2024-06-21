import React, { useContext, useEffect, useState } from "react"
import { Container, Row, Col, Form } from 'react-bootstrap';
import UserNav from "./UserNav";
import { transactionApiService } from "../../../services/apiService";
import UserContext from "../../../contexts/UserContext";

function PaymentDetails(props) {
    const { user } = useContext(UserContext)
    const [transactionData, setTransactionData ] = useState([])

    useEffect(()=>{
        getAlltransactions()
    },[user])

    const getAlltransactions = ()=>  {
        console.log(user)
        let headers = {
            "x-access-token": user?.token
        }
        transactionApiService.getallTransactions({}, headers).then(response => {
            console.log(response)
            if(response.data.status == true) {
                const responseData = response.data.data
                setTransactionData(responseData)
            }
        }).catch(err => console.error(err))
    }
    return (

        <div className="MyAccount-container">
            <div className='inner-hero'>
                <div className='inner-hero-image'>
                    <img src='./assets/img/inner-banner.png'/>
                </div>
                <div className='herotext wow fadeInUp'>
                    <Container>
                        <h2>Recovery Lab Qatar</h2>
                        <h1>My Account</h1>
                    </Container>
                </div>
            </div>

            <section className="myaccount-section">
                <Container>
                    <Form className="formStyles">
                        <Row>
                            <Col lg={3}>
                                <UserNav/>
                            </Col>
                            <Col lg={9} className="mt-4 mt-lg-0">
                                <div className="account-heading d-flex mb-3 pb-2">
                                    <h4>My Transactions</h4>
                                </div>

                            {
                                transactionData && transactionData.map(transaction => {
                                    return (
<div className="mt-3 myServicesBox" key={transaction.id}>
                                    <h4>Trans ID: #{transaction.transactionId}</h4>
                                    <Row>
                                        <Col xs={6} md={3}>
                                            <h6>Service Name</h6>
                                            <div className="service-txt">{transaction?.packagePlanName}</div>
                                        </Col>
                                        <Col xs={6} md={3}>
                                            <h6>Date & Time</h6>
                                            <div className="service-txt">{transaction.createdAt.substring(0, 10)} - {transaction?.createdAt.match(/\d\d:\d\d/)}</div>
                                        </Col>
                                        <Col xs={6} md={3} className="mt-3 mt-md-0">
                                            <h6>Amont</h6>
                                            <div className="service-txt">${transaction?.amount}</div>
                                        </Col>
                                        <Col xs={6} md={3} className="mt-3 mt-md-0">
                                            <h6>Status</h6>
                                            <div className="service-txt"><strong className="text-success">{transaction?.transactionStatus}</strong></div>
                                        </Col>
                                    </Row>
                                </div>
                                    )
                                })
                            }
                                

                            </Col>
                        </Row>
                    </Form>
                </Container>
            </section>
        </div>
    )

}

export default PaymentDetails