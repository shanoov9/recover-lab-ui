import React, { useState, useEffect, useContext } from "react"
import logo from '../../../logo.svg';
import { Link, useNavigate } from "react-router-dom";
import { Container, Nav, Navbar, NavDropdown, Dropdown, DropdownButton, Card, Accordion, useAccordionButton } from 'react-bootstrap';
import { GoArrowRight } from "react-icons/go";
import { FiUser, FiLogOut } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import './Header.scss';
import UserContext from "../../../contexts/UserContext";
import { toast } from 'react-hot-toast';
import userPlaceholder from '../../../assets/images/userPlaceholder.png';
import { ClassServiceApis } from "../../../services/apiService";

function CustomToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionButton(eventKey, () =>
        console.log('totally custom!'),
    );

    return (
        <button
            type="button"
            style={{ backgroundColor: 'pink' }}
            onClick={decoratedOnClick}
        >
            {children}
        </button>
    );
}

function Header(props) {
    console.log('Header props', props.services)

    const [expanded, setExpanded] = useState(false);

    const { user, logoutUser, getUserInformation } = useContext(UserContext);
    const navigate = useNavigate();
    console.log('user : ', user)

    // const [services, setServices] = useState([])

    // Add and Remove Class on scroll
    const [scrolltopdata, setscrolltopdata] = useState('');

    useEffect(() => {
        getAllclassNames()
        let token = localStorage.getItem('RLQ_Token');
        if (token) {
            getUserInformation(token)
        }
    }, [])

    const [allAvailableClasses, setAllAvailableClasses] = useState([])
    const getAllclassNames = () => {
        ClassServiceApis.getAllClassNames().then(res => {
            console.log(res)
            if (res.data.status === true) {
                const availableClasses = res.data.data.filter(classes => classes.status == true)
                setAllAvailableClasses(availableClasses)
            }
        }).catch(err => console.error(err))
    }

    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (window.scrollY < 50) {
                setscrolltopdata('');
            } else {
                setscrolltopdata('headerdark');
            }
        });
    }, [])

    // useEffect(() => {
    //   setServices(props.services)
    // }, [props.services])

    // const [user, setUser] = useState() 
    //const [isToggled, setIsToggled] = useState(false);
    const [menuOpen, toggleMenuOpen] = useState(false);
    const [menuOpentt, toggleMenuOpentt] = useState(false);
    const [menuOpenSe, toggleMenuOpenSe] = useState(false);



    return (
        <div className={expanded ? "header-mobile-container" : "Header-main"}>
            <header className={`fixed-top ${scrolltopdata}`}>
                <Navbar expanded={expanded} expand="xl" bg="dark" data-bs-theme="dark" className="mannav-bar">
                    <Container fluid>
                        <Navbar.Brand className="wow fadeInDown" as={Link} to="/"><img src={logo} className="App-logo" alt="logo" /></Navbar.Brand>
                        <Navbar.Collapse id="basic-navbar-nav">

                            {/* Desktop Navigation */}

                            <Nav className="me-auto menuDesktop">
                                <Dropdown onMouseEnter={() => { toggleMenuOpentt(true); }} onMouseLeave={() => { toggleMenuOpentt(false); }} show={menuOpentt}>
                                    <Dropdown.Toggle id="servces-dropdown" as={Link} to='/services'>Tech-Therapies</Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {props && props.services
                                            .filter(serv => serv.serviceType === 2)
                                            .map((service) => {
                                                return (
                                                    <Dropdown.Item
                                                        key={service.id}
                                                        as={Link}
                                                        state={{ bookingType: 'servicesBook', senderServiceId: service.id }}
                                                        to={`/service/${service.treatmentServiceName}`}
                                                    >
                                                        {service.treatmentServiceName}
                                                    </Dropdown.Item>
                                                )
                                            })
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                                <Dropdown onMouseEnter={() => { toggleMenuOpen(true); }} onMouseLeave={() => { toggleMenuOpen(false); }} show={menuOpen}>
                                    <Dropdown.Toggle id="servces-dropdown" as={Link} to='/services'>Treatments</Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {props && props.services
                                            .filter(serv => serv.serviceType === 1)
                                            .map((service) => {
                                                return (
                                                    <Dropdown.Item
                                                        key={service.id}
                                                        as={Link}
                                                        state={{ bookingType: 'servicesBook', senderServiceId: service.id }}
                                                        to={`/service/${service.treatmentServiceName}`}
                                                    >
                                                        {service.treatmentServiceName}
                                                    </Dropdown.Item>
                                                )
                                            })
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                                <Dropdown onMouseEnter={() => { toggleMenuOpenSe(true); }} onMouseLeave={() => { toggleMenuOpenSe(false); }} show={menuOpenSe}>
                                    <Dropdown.Toggle id="classes-dropdown" as={Link} to='/classes'>Motion Studio Classes</Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {
                                            allAvailableClasses.map((cls) => {
                                                return (
                                                    <NavDropdown.Item key={cls.id} as={Link} to={`/class/${cls.className}`}>{cls.className}</NavDropdown.Item>
                                                )
                                            })
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                                <Nav.Link as={Link} to="/packages">Packages</Nav.Link>
                                <Nav.Link as={Link} to="/membership">Memberships</Nav.Link>
                                <Nav.Link as={Link} to="/about-us">About Us</Nav.Link>
                            </Nav>

                            {/* End Desktop Nav */}

                            {/* Mobile Navigation */}

                            <div className="menuMobile navbar-nav">
                                <Accordion>
                                    <Card>
                                        <Card.Header>
                                            <Nav.Link as={Link} to="/services" onClick={() => setExpanded(false)}>Tech-Therapies</Nav.Link>
                                            <CustomToggle eventKey="0"><IoIosArrowDown /></CustomToggle>
                                        </Card.Header>
                                        <Accordion.Collapse eventKey="0">
                                            <Card.Body>
                                                {props && props.services
                                                    .filter(serv => serv.serviceType === 2)
                                                    .map((service) => {
                                                        return (
                                                            <Nav.Link onClick={() => setExpanded(false)} key={service.id} as={Link} state={{ bookingType: 'servicesBook', senderServiceId: service.id }} to={`/service/${service.treatmentServiceName}`}>
                                                                {service.treatmentServiceName}
                                                            </Nav.Link>
                                                        )
                                                    })
                                                }
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                    <Card>
                                        <Card.Header>
                                            <Nav.Link onClick={() => setExpanded(false)} as={Link} to="/services">Treatments</Nav.Link>
                                            <CustomToggle eventKey="1"><IoIosArrowDown /></CustomToggle>
                                        </Card.Header>
                                        <Accordion.Collapse eventKey="1">
                                            <Card.Body>
                                                {props && props.services
                                                    .filter(serv => serv.serviceType === 1)
                                                    .map((service) => {
                                                        return (
                                                            <Nav.Link onClick={() => setExpanded(false)} key={service.id} as={Link} state={{ bookingType: 'servicesBook', senderServiceId: service.id }} to={`/service/${service.treatmentServiceName}`}>
                                                                {service.treatmentServiceName}
                                                            </Nav.Link>
                                                        )
                                                    })
                                                }
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                    <Card>
                                        <Card.Header>
                                            <Nav.Link onClick={() => setExpanded(false)} as={Link} to="/classes">Motion Studio Classes</Nav.Link>
                                            <CustomToggle eventKey="2"><IoIosArrowDown /></CustomToggle>
                                        </Card.Header>
                                        <Accordion.Collapse eventKey="2">
                                            <Card.Body>
                                                {
                                                    allAvailableClasses.map((cls) => {
                                                        return (
                                                            <Nav.Link onClick={() => setExpanded(false)} key={cls.id} as={Link} to={`/class/${cls.className}`}>{cls.className}</Nav.Link>
                                                        )
                                                    })
                                                }
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                </Accordion>
                                <Nav.Link onClick={() => setExpanded(false)} as={Link} to="/packages">Packages</Nav.Link>
                                <Nav.Link onClick={() => setExpanded(false)} as={Link} to="/membership">Memberships</Nav.Link>
                                <Nav.Link onClick={() => setExpanded(false)} as={Link} to="/about-us">About Us</Nav.Link>
                            </div>

                            {/* End Mobile Navigation */}

                            <div className="d-flex align-items-center mt-3 mt-lg-0">
                                <Link to='/book-now' className="btn btn-outline-primary rounded-pill px-4">Book Now <GoArrowRight /></Link>
                            </div>
                        </Navbar.Collapse>

                        <div className="header-right ms-auto d-flex">
                            {user === null && <Link to='/login' className='btn userlogin ms-3 me-2 me-xl-0'><FiUser /></Link>}
                            <Navbar.Toggle className="" aria-controls="basic-navbar-nav" onClick={() => setExpanded(expanded ? false : "expanded")} />
                            {user !== null &&
                                <div className="ms-auto d-flex">
                                    {/* <Dropdown className="profile-dropdown"> */}
                                    {/* <Dropdown.Toggle id="dropdown-basic"> */}
                                    <Link to={'/my-profile'} className="no-decoration">
                                        <img src={user.profileImage ? user.profileImage : userPlaceholder} alt={user.firstName} width={30} height={30} className="rounded-circle mx-auto d-block me-0 me-lg-2" />
                                        <p className="my-auto capitalize"> {user?.userName || user?.firstName} </p>
                                    </Link>

                                    {/* </Dropdown.Toggle> */}
                                    {/* <Dropdown.Menu align={"end"} className="">
                    <Dropdown.Item as={Link} to="/my-profile">Profile</Dropdown.Item> */}
                                    {/* <Dropdown.Item as={Link} to="/appointments">Appointments</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/settings">Settings</Dropdown.Item> */}
                                    {/* <Dropdown.Item as={'button'} onClick={logoutUser}><FiLogOut /> Logout</Dropdown.Item>
                  </Dropdown.Menu> */}
                                    {/* </Dropdown> */}
                                </div>}
                        </div>
                    </Container>
                </Navbar>
            </header>
        </div>
    )
}

export default Header