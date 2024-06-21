export const FIXED_PAGES = {
    HOME: "HOME",
    ABOUTUS: "ABOUT US",
    SETTINGS: "SETTINGS",
    CORPORATE_WELLNESS: "CORPORATE WELLNESS"
}

export const CENTER_LIST = [
    {
        id: 1,
        name: "Recovery Lab Qatar",
        address: "BIN TOWAR CENTER, P.O.Box: 10662",
    },
    {
        id: 2,
        name: "Recovery Lab Doha",
        address: "BIN TOWAR CENTER, P.O.Box: 10662",
    },
]

const TRANSACTION_STATUS_LIST = [
    "DONE",
    "CANCELLED",
    "REFUNDED",
]

export const getTrasanctionIdAndStatus = () => {
    let charaters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let transactionId = "";
    for (let i = 0; i < 10; i++) {
        transactionId += charaters.charAt(Math.floor(Math.random() * charaters.length));
    }
    // let transactionStatus = TRANSACTION_STATUS_LIST[Math.floor(Math.random() * TRANSACTION_STATUS_LIST.length)];
    let transactionStatus = "DONE"
    return { transactionId, transactionStatus };
}

// Preparetion time in minutes
export const PREPARATION_TIME = 15;
// export const IMAGE_BASE_URL = 'http://localhost:8080/images/' // Local
export const IMAGE_BASE_URL = 'https://api.recoverylabqatar.com/images/' // Cloud


// Languages
export const ALL_LANGUAGES = [
    "Afrikaans",
    "Arabic",
    "Bengali",
    "Bulgarian",
    "Catalan",
    "Cantonese",
    "Croatian",
    "Czech",
    "Danish",
    "Dutch",
    "Lithuanian",
    "Malay",
    "Malayalam",
    "Panjabi",
    "Tamil",
    "English",
    "Finnish",
    "French",
    "German",
    "Greek",
    "Hebrew",
    "Hindi",
    "Hungarian",
    "Indonesian",
    "Italian",
    "Japanese",
    "Javanese",
    "Korean",
    "Norwegian",
    "Polish",
    "Portuguese",
    "Romanian",
    "Russian",
    "Serbian",
    "Slovak",
    "Slovene",
    "Spanish",
    "Swedish",
    "Telugu",
    "Thai",
    "Turkish",
    "Ukrainian",
    "Vietnamese",
    "Welsh",
    "Sign language",
    "Algerian",
    "Aramaic",
    "Armenian",
    "Berber",
    "Burmese",
    "Bosnian",
    "Brazilian",
    "Bulgarian",
    "Cypriot",
    "Corsica",
    "Creole",
    "Scottish",
    "Egyptian",
    "Esperanto",
    "Estonian",
    "Finn",
    "Flemish",
    "Georgian",
    "Hawaiian",
    "Indonesian",
    "Inuit",
    "Irish",
    "Icelandic",
    "Latin",
    "Mandarin",
    "Nepalese",
    "Sanskrit",
    "Tagalog",
    "Tahitian",
    "Tibetan",
    "Gypsy",
    "Wu",
]