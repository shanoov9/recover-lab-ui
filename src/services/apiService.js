import axios from "axios"
// const API_BASE_URL = 'http://localhost:8080/v1/api' // Local
const API_BASE_URL = 'https://api.recoverylabqatar.com/v1/api' // Cloud

export const pageDetailApiService = {
    route: 'pageDetail',

    getPageDetails(body) {
        return axios.post(`${API_BASE_URL}/${this.route}/getPageDetails`, body)
    },
}

export const TreatmentServiceApis = {
    route: 'treatmentService',

    // GET ALL TREATMENT SERVICE LIST
    getAllServices() {
        return axios.get(`${API_BASE_URL}/${this.route}/getAllTreatmentService`)
    },

}

export const UserServiceApis = {
    route: 'userService',

    // REGISTER USER
    registerUser(body) {
        return axios.post(`${API_BASE_URL}/${this.route}/createUser`, body)
    },

    // LOGIN USER
    loginUser(body) {
        return axios.post(`${API_BASE_URL}/${this.route}/login`, body)
    },

    // VERIFY USER
    verifyUser(body) {
        return axios.post(`${API_BASE_URL}/${this.route}/verifyUser`, body)
    },

    // GET USER INFO
    getUserInfo(body) {
        return axios.get(`${API_BASE_URL}/${this.route}/getprofile`, {
            headers: {
                "x-access-token": body.token,
            }
        })
    },

    // UPDATE USER INFO
    updateUserInfo(body) {
        return axios.post(`${API_BASE_URL}/${this.route}/updateUser`, body)
    },

    changePassword(body, headers) {
        return axios.post(`${API_BASE_URL}/${this.route}/changePassword`, body, { headers })
    },
}

export const PackagesServiceApis = {
    route: 'package',

    // GET ALL PACKAGES
    getAllPlans(body) {
        return axios.post(`${API_BASE_URL}/${this.route}/getAllplansUser`, body)
    },
}

export const packageTypeApiService = {
    route: 'packageType',

    getAllPackageTypes() {
        return axios.get(`${API_BASE_URL}/${this.route}/getPackageType`)
    },
}

export const NewsletterServiceApis = {
    route: 'newsLatter',

    // SUBSCRIBE NEWSLETTER
    subscribeNewsletter(body) {
        return axios.post(`${API_BASE_URL}/${this.route}/subscribe`, body)
    },
}

export const InstructorServiceApis = {
    route: 'instructor',

    // GET ACTIVE INSTRUCTORS
    getInstructors() {
        return axios.get(`${API_BASE_URL}/${this.route}/getActiveInstructors`)
    },

    // GET INSTRUCTOR IMAGES

    getInstructorImages() {
        return axios.get(`${API_BASE_URL}/${this.route}/getInstructorImages`)
    },
}

export const BookingServiceApis = {
    route: 'booking',

    // bookingType: PLAN, CLASS, MEMBERSHIP, PACKAGE

    // BOOK A SERVICE
    bookService(body, headers) {
        return axios.post(`${API_BASE_URL}/${this.route}/createBooking`, body, { headers })
    },

    // GET USER BOOKINGS
    getUserBookings(body, headers) {
        return axios.post(`${API_BASE_URL}/${this.route}/getBooking`, body, { headers })
    },

    // GET BOOKING TIMINGS
    getBookingTimings(body) {
        return axios.post(`${API_BASE_URL}/${this.route}/getBookingTimings`, body)
    },
    changeBookingStatus(body) {
        return axios.post(`${API_BASE_URL}/${this.route}/update`, body)
    },
    getPreBookedClassesCount(body) {
        return axios.post(`${API_BASE_URL}/${this.route}/getPreBookedClassesCount`, body)
    }
}

export const ClassServiceApis = {
    route: 'classService',

    // GET ALL CLASSES
    getClasses() {
        return axios.get(`${API_BASE_URL}/${this.route}/getAllClasses`)
    },


    getAllClassNames() {
        return axios.get(`${API_BASE_URL}/${this.route}/getAllClassNames`)
    },
}

export const transactionApiService = {
    route: 'transaction',

    getallTransactions(body, headers) {
        return axios.post(`${API_BASE_URL}/${this.route}/getTransaction`, body, { headers })
    }
}

export const instaFeedsApiService = {
    route: 'instaFeed',

    getAllInstaFeeds() {
        return axios.get(`${API_BASE_URL}/${this.route}/getAll`)

    }
}