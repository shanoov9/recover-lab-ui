import React from "react"
import { Container} from 'react-bootstrap';
import { GoArrowRight } from "react-icons/go";

function PageNotFound(props) {

return (
    <div className="pagenotfound">

            <div className='inner-hero'>
                <div className='inner-hero-image'>
                    <img src='./assets/img/inner-banner.png'/>
                </div>
                <div className='herotext wow fadeInUp'>
                    <Container>
                        <h2>Recovery Lab Qatar</h2>
                        <h1>404</h1>
                    </Container>
                </div>
            </div>

        <section className="section-padd page404">
            <Container>
                <h1 className="text-center">
                    404 - PAGE DOES NOT EXIST
                </h1>
                <p className="text-center mt-4">This page either doesn’t exist anymore, has been moved or is temporarily unavailable. Check your spelling, or go back to home or the previous page.</p>
                <div className="text-center mt-5"><a href="/" className="btn btn-primary d-inline-block rounded-pill px-5 py-3">Back To Homepage <GoArrowRight/></a></div>
            </Container>
        </section>
    </div>
)
}

export default PageNotFound