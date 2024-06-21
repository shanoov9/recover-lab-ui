import React, { useEffect, useState } from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import './App.css';
import { Route, Routes, useLocation } from "react-router-dom";
import WOW from 'wowjs';
import './style.scss';
import Home from "./pages/home/Home";
import BookNow from "./pages/book-now/BookNow";
import Header from "./pages/shared/header/Header";
import Footer from "./pages/shared/footer/Footer";
import ServiceDetailPage from "./pages/cms/services/ServiceDetailPage";
import Services from "./pages/cms/services/Services";
import Classes from "./pages/cms/classes/Classes";
import ClassesDetails from "./pages/cms/classes/ClassesDetails";
import Membership from "./pages/membership/Membership";
import Packages from "./pages/packages/Packages";
import { TreatmentServiceApis } from "./services/apiService";
import PageNotFound from "./pages/not-found/PageNotFound";
import Register from "./pages/user/register/Register";
import Login from "./pages/user/login/Login";
import VerifyUser from "./pages/user/verify-user/VerifyUser";
import About from "./pages/about/About";
import Contact from "./pages/contact/Contact";
import UserContextProvider from "./contexts/UserContextProvider";
import { Toaster } from "react-hot-toast";
import MyProfile from "./pages/user/my-account/MyProfile";
import MyServices from "./pages/user/my-account/MyServices";
import MyClassess from "./pages/user/my-account/MyClassess";
import MyMembership from "./pages/user/my-account/MyMembership";
import MyPackages from "./pages/user/my-account/MyPackages";
import PaymentDetails from "./pages/user/my-account/PaymentDetails";
import Corporate from "./pages/corporateWellness/Corporate";


function App() {

    const pathname = useLocation().pathname
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    const [allServices, setAllServices] = useState([])

    useEffect(() => {
        getAllServices()
        new WOW.WOW({
            live: false
        }).init();
    }, [])


    const getAllServices = () => {
        TreatmentServiceApis.getAllServices().then(response => {
            const allServicesResponseData = response.data.data
            console.log('app.js', allServicesResponseData)
            const publishedServices = allServicesResponseData.filter(services => services.status === true)
            // console.log(publishedServices)
            setAllServices(publishedServices)
            // allServicePagesHandler(allServicesResponseData)

            // console.log(allServices)
        })
    }


    return (
        <div className="rlq-container">
            <Toaster
                toastOptions={{
                    style: {
                        background: '#11182788',
                        color: '#fff',
                        border: '1px solid #4b5563',
                        backdropFilter: 'blur(20px)',
                        boxShadow: 'inset 0 0 10px #fff2'
                    }
                }} />
            <UserContextProvider>
                <Header services={allServices} />

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about-us" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/book-now" element={<BookNow />} />
                    <Route path="/service/:title" element={<ServiceDetailPage />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/classes" element={<Classes />} />
                    {/* <Route path="/classes-details" element={<ClassesDetails />} /> */}

                    <Route path="/packages" element={<Packages />} />
                    <Route path="/membership" element={<Membership />} />

                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/verify-user" element={<VerifyUser />} />

                    <Route path="*" element={<PageNotFound />} />
                    <Route path="/class/:title" element={<ClassesDetails />} />

                    <Route path="/my-profile" element={<MyProfile />} />
                    <Route path="/my-services" element={<MyServices />} />
                    <Route path="/my-classess" element={<MyClassess />} />
                    <Route path="/my-membership" element={<MyMembership />} />
                    <Route path="/my-packages" element={<MyPackages />} />
                    <Route path="/payment-details" element={<PaymentDetails />} />
                    <Route path="/corporate-wellness" element={<Corporate />} />


                </Routes>

                <Footer />
            </UserContextProvider>
        </div>

    );
}

export default App;
