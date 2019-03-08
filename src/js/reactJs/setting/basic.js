let APIPath;

if (process.env.REACT_APP_NODE_ENV === "uat") {
APIPath = "http://uat.api.ccafe.bibsolution.net/public/pos";
} else {
APIPath = "https://api.365soup.com.hk/public/pos";
}

export default {
    testingBasic: {
        testing: "testingValue"
    },
    APIs: {
        orderDetails: `${APIPath}/order/selectTimeslotDetail`,
    }
}