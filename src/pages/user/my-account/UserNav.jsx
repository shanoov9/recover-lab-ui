import React, { useContext } from "react"
import { Link, useNavigate } from "react-router-dom";
import { Nav } from 'react-bootstrap';
import { GoArrowRight } from "react-icons/go";
import { FiUser } from "react-icons/fi";
import { RiMenu3Fill } from "react-icons/ri";
import UserContext from "../../../contexts/UserContext";

function UserNav() {

    const { logoutUser, user } = useContext(UserContext);

    const [status, setStatus] = React.useState(false)

    return (

        <div className="usernav">
            <div className="UserproName d-flex p-3">
                <div className="userprIcon me-3"><FiUser /></div>
                <div className="userprotxt">
                    <span>Welcome</span>
                    <div>{user?.firstName} {user?.lastName}</div>
                </div>
                <span className="ms-auto usermobileNav" onClick={()=>setStatus(!status)}><RiMenu3Fill/></span>
            </div>
                <ul className="list-unstyled mobilenavHide">
                    <li>
                        <Nav.Link as={Link} to={`/my-profile`}><GoArrowRight /> My Profile</Nav.Link>
                    </li>
                    <li>
                        <Nav.Link as={Link} to={`/my-services`}><GoArrowRight /> My Services</Nav.Link>
                    </li>
                    <li>
                        <Nav.Link as={Link} to={`/my-classess`}><GoArrowRight /> Classes</Nav.Link>
                    </li>
                    <li>
                        <Nav.Link as={Link} to={`/my-membership`}><GoArrowRight /> Membership</Nav.Link>
                    </li>
                    <li>
                        <Nav.Link as={Link} to={`/my-packages`}><GoArrowRight /> Packages</Nav.Link>
                    </li>
                    <li>
                        <Nav.Link as={Link} to={`/payment-details`}><GoArrowRight /> My Transactions</Nav.Link>
                    </li>
                    <li>
                        <Nav.Link as={Link} to={`/`} onClick={logoutUser}><GoArrowRight /> Logout</Nav.Link>
                    </li>
                </ul>
            
            {
                status? <ul className="list-unstyled">
                    <li>
                        <Nav.Link as={Link} to={`/my-profile`}><GoArrowRight /> My Profile</Nav.Link>
                    </li>
                    <li>
                        <Nav.Link as={Link} to={`/my-services`}><GoArrowRight /> My Services</Nav.Link>
                    </li>
                    <li>
                        <Nav.Link as={Link} to={`/my-classess`}><GoArrowRight /> Classes</Nav.Link>
                    </li>
                    <li>
                        <Nav.Link as={Link} to={`/my-membership`}><GoArrowRight /> Membership</Nav.Link>
                    </li>
                    <li>
                        <Nav.Link as={Link} to={`/my-packages`}><GoArrowRight /> Packages</Nav.Link>
                    </li>
                    <li>
                        <Nav.Link as={Link} to={`/payment-details`}><GoArrowRight /> My Transactions</Nav.Link>
                    </li>
                    <li>
                        <Nav.Link as={Link} to={`/`}><GoArrowRight /> Logout</Nav.Link>
                    </li>
                </ul>: null
            }
        </div>
    )

}

export default UserNav