
// Your web app's Firebase configuration

const firebaseConfig = {

    apiKey: "YOUR_API_KEY",
    
    authDomain: "AUTH_DOMAIN",
  
    projectId: "PROJECT_ID",
  
    storageBucket: "STORAGE_BUCKET",
  
    messagingSenderId: "SENDER_ID",
  
    appId: "APP_ID",

};


// Initialize Firebase

firebase.initializeApp(firebaseConfig);
console.log(firebase);



// Listen to messages from app.js
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received request: ", request);
    
    // Check the user's auth status
    if (request.command == "user-auth") {

        let user = firebase.auth().currentUser;
        console.log("There is a current user: ", user);
        
        if (user) {
            //const updateViewedProducts = firebase.functions().httpsCallable('updateViewedProducts');
            //updateViewedProducts({asin: request.asin}).then(() => {
            sendResponse({type: "auth", status: "success", data: true});
            //});
        } else {
            sendResponse({type: "auth", status: "no-auth", data: false});
        }
        return true;
    }
    
    // Get the amazon product info (firebase)
    if (request.command == "get-amazon-info") {
        
        let user = firebase.auth().currentUser;
        
        if (user) {
            console.log("Get Amazon Info, there is a current user!");
            const getAmazonProdInfo = firebase.functions().httpsCallable('getAmazonProdInfo');
            getAmazonProdInfo({asin: request.asin}).then((result) => {
                console.log(result.data);
                sendResponse({data: result.data});
            }).catch((error) => {
                console.log(error);
            });
        } else {
            console.log("No current User, Amazon product info");
            sendResponse({data: "No User authed"});
        }
        return true;
    }
    
    // Get the upc info (firebase)
    if (request.command == "get-upc") {
        
        let user = firebase.auth().currentUser;
        
        if (user) {
            console.log("Get UPC Info, there is a current user!");
            const getUpc = firebase.functions().httpsCallable('getUpc');
            getUpc({asin: request.asin}).then((result) => {
                console.log(result.data);
                sendResponse({data: result.data});
            }).catch((error) => {
                console.log(error);
            });
        } else {
            console.log("No current User, UPC info");
            sendResponse({data: "No User authed"});
        }
        return true;
    }
    
    // Get the walmart product info (firebase)
    if (request.command == "get-walmart-info") {
        
        let user = firebase.auth().currentUser;
        
        if (user) {
            console.log("Get Walmart Info, there is a current user!");
            const getWalmartProdInfo = firebase.functions().httpsCallable('getWalmartProdInfo');
            getWalmartProdInfo({upcCode: request.upc}).then((result) => {
                console.log(result.data);
                sendResponse({data: result.data});
            }).catch((error) => {
                console.log(error);
                errResponseMap = new Map();
                errResponseMap.set("rating", 0);
                errResponseMap.set("ratingsTotal", 0);
                const errResponseObj = Object.fromEntries(errResponseMap);
                sendResponse({data: errResponseObj});
            });
        } else {
            console.log("No current User, Amazon product info");
            sendResponse({data: "No User authed"});
        }
        return true;
    }
    
    // Get the google product info (firebase)
    if (request.command == "get-google-info") {
        
        let user = firebase.auth().currentUser;
        
        if (user) {
            console.log("Get Google Info, there is a current user!");
            const getGoogleProdInfo = firebase.functions().httpsCallable('getGoogleProdInfo');
            getGoogleProdInfo({upcCode: request.upc}).then((result) => {
                console.log(result.data);
                sendResponse({data: result.data});
            }).catch((error) => {
                console.log(error);
                errResponseMap = new Map();
                errResponseMap.set("rating", 0);
                errResponseMap.set("ratingsTotal", 0);
                const errResponseObj = Object.fromEntries(errResponseMap);
                sendResponse({data: errResponseObj});
            });
        } else {
            console.log("No current User, Google product info");
            sendResponse({data: "No User authed"});
        }
        return true;
    }

    
    // Create a user auth with auth-signup
    if (request.command == "auth-signup") {
        let email = request.e;
        let password = request.p;
        
        firebase.auth().signOut();
        
        firebase.auth().createUserWithEmailAndPassword(email, password).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            sendResponse(false);
        }).then(() => {
            // Check the auth state change
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    // User is signed in
                    console.log(user);
                    sendResponse({type: "auth", status: "success", data: true});
                } else {
                    // No user signed in
                    sendResponse({type: "auth", status: "no-auth", data: false});
                }
            });
        });
        return true;
    }
    
    // Log a user in with auth-login
    if (request.command == "auth-login") {
        let email = request.e;
        let password = request.p;
        
        firebase.auth().signInWithEmailAndPassword(email, password).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log('error with login');
            sendResponse({data: false});
        }).then(() => {
            // Check the auth state change
            firebase.auth().onAuthStateChanged(function(user) {
                
                if (user) {
                    // User is signed in
                    console.log(user);
                    sendResponse({type: "auth", status: "success", data: true});
                } else {
                    // No user signed in
                    sendResponse({type: "auth", status: "no-auth", data: false});
                }
            });
        });
        return true;
    }

    // Sign a user out with auth-logout
    if (request.command == "auth-logout") {
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
            console.log('User signed out!');
            sendResponse({data: false});
          }).catch((error) => {
            // An error happened.
            console.log('User was not signed out properly!')
            sendResponse({data: false});
        });
        return true;
    }
});






