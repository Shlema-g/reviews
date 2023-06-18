
// Get the ASIN of current product
let url = window.location.pathname
var splitPath = url.split("/dp/");
var secondSplitPath = splitPath[1].split("/");
let asin = secondSplitPath[0];

// Store the product information
var prodTitle;
var prodBrand;
var prodPrice;
var prodImageUrl;
var amazonRating;
var amazonRatingCount;
var walmartRating;
var walmartRatingCount;
var googleRating;
var googleRatingCount;
var ratingsReturned = 0;
var zeroRatings = 0;
var totalReviews = 0;
var averageScore = 0.0;
const greenColor = "rgba(48, 182, 88, 1)";
const yellowColor = "rgba(238, 195, 54, 1)";
const redColor = "rgba(198, 37, 37, 1)";
const backGreenColor = "linear-gradient(277.5deg, #6ACF7A -11.61%, #16AA48 107.27%)";
const backYellowColor = "linear-gradient(277.25deg, #FCD34D -5.24%, #E1B523 109.38%)";
const backRedColor = "linear-gradient(97.43deg, #B81B1B 0%, #EF4444 100%)";

// Determine what page to display based on user's auth status
const pageDisplay = function(userAuth) {
    if (userAuth == false) {
        document.querySelector('._wyzer__homescreen').style.display = 'none';
        document.querySelector('._auth__screen').style.display = 'block';
    } else{
        document.querySelector('._auth__screen').style.display = 'none';
        document.querySelector('._wyzer__homescreen').style.display = 'block';
    }
};

// Send message to check auth status
browser.runtime.sendMessage({command:'user-auth', asin: asin}, (response) => {
    console.log(response.type, response.status, response.data);
    if (response.data == true) {
        getProdInfo();
        pageDisplay(response.data);
    }
});

var getProdInfo = function() {
    // Send message for amazon product info (firebase)
    browser.runtime.sendMessage({command:'get-amazon-info', asin: asin}, (response) => {
        console.log(response.data);
        prodTitle = response.data["title"];
        prodBrand = response.data["brand"];
        prodPrice = response.data["price"];
        prodImageUrl = response.data["image"];
        amazonRating = response.data["rating"];
        amazonRatingCount = response.data["ratingsTotal"];
        
        if (amazonRating == 0) {
            zeroRatings += 1;
        }
        
        // Add amazon ratingCount to total number of reviews and update average
        ratingsReturned += 1;
        totalReviews += amazonRatingCount;
        
        if (ratingsReturned == 3) {
            displayTotalReviews(totalReviews);
            // Get average score if last returned
            displayAverage(zeroRatings);
        }
        
        
        // Fill in all of the amazon data
        document.querySelector('.prodTitle').innerHTML = prodTitle;
        document.querySelector('.prodBrand').innerHTML = prodBrand;
        document.getElementById('insert_product_image_here').style.backgroundImage = "url("+prodImageUrl+")";
        document.querySelector('.buy-price').innerHTML = prodPrice;
        document.querySelector('.amazonRatingCount').innerHTML = amazonRatingCount.toLocaleString("en-US");
        document.querySelector('.showAmazonRating').innerHTML = "( "+amazonRating+" )";
        
        // Create the star ratings for amazon
        if (amazonRating >= 4.8) {
            var image = document.createElement("img");
            image.src = browser.runtime.getURL("/assets/images/five-stars.png");
            document.getElementById('insert_amazon_star_ratings_here').appendChild(image);
            document.querySelector('.showAmazonRating').style.color = greenColor;
        }
        if (amazonRating >= 4.3 && amazonRating <= 4.7) {
            var image = document.createElement("img");
            image.src = browser.runtime.getURL("/assets/images/four-half-stars.png");
            document.getElementById('insert_amazon_star_ratings_here').appendChild(image);
            document.querySelector('.showAmazonRating').style.color = greenColor;
        }
        if (amazonRating >= 3.8 && amazonRating <= 4.2) {
            var image = document.createElement("img");
            image.src = browser.runtime.getURL("/assets/images/four-stars.png");
            document.getElementById('insert_amazon_star_ratings_here').appendChild(image);
            document.querySelector('.showAmazonRating').style.color = greenColor;
        }
        if (amazonRating >= 3.3 && amazonRating <= 3.7) {
            var image = document.createElement("img");
            image.src = browser.runtime.getURL("/assets/images/three-half-stars.png");
            document.getElementById('insert_amazon_star_ratings_here').appendChild(image);
            document.querySelector('.showAmazonRating').style.color = greenColor;
        }
        if (amazonRating >= 2.8 && amazonRating <= 3.2) {
            var image = document.createElement("img");
            image.src = browser.runtime.getURL("/assets/images/three-stars.png");
            document.getElementById('insert_amazon_star_ratings_here').appendChild(image);
            document.querySelector('.showAmazonRating').style.color = yellowColor;
        }
        if (amazonRating >= 2.3 && amazonRating <= 2.7) {
            var image = document.createElement("img");
            image.src = browser.runtime.getURL("/assets/images/two-half-stars.png");
            document.getElementById('insert_amazon_star_ratings_here').appendChild(image);
            document.querySelector('.showAmazonRating').style.color = yellowColor;
        }
        if (amazonRating >= 1.8 && amazonRating <= 2.2) {
            var image = document.createElement("img");
            image.src = browser.runtime.getURL("/assets/images/two-stars.png");
            document.getElementById('insert_amazon_star_ratings_here').appendChild(image);
            document.querySelector('.showAmazonRating').style.color = redColor;
        }
        if (amazonRating >= 1.3 && amazonRating <= 1.7) {
            var image = document.createElement("img");
            image.src = browser.runtime.getURL("/assets/images/one-half-stars.png");
            document.getElementById('insert_amazon_star_ratings_here').appendChild(image);
            document.querySelector('.showAmazonRating').style.color = redColor;
        }
        if (amazonRating <= 1.2) {
            var image = document.createElement("img");
            image.src = browser.runtime.getURL("/assets/images/one-star.png");
            document.getElementById('insert_amazon_star_ratings_here').appendChild(image);
            document.querySelector('.showAmazonRating').style.color = redColor;
        }
        if (amazonRating <= 0.7) {
            var image = document.createElement("img");
            image.src = browser.runtime.getURL("/assets/images/no-stars.png");
            document.getElementById('insert_amazon_star_ratings_here').appendChild(image);
            document.querySelector('.showAmazonRating').style.color = redColor;
        }
        
        // Change displays from loading to content
        document.querySelector('.product-image-loading').style.display = "none";
        document.querySelector('.product-image').style.display = "block";
        document.querySelector('.prodTitleLoading').style.display = "none";
        document.querySelector('.prodTitle').style.display = "block";
        document.querySelector('.prodBrandLoading').style.display = "none";
        document.querySelector('.prodBrand').style.display = "block";
        document.querySelector('.buy-button-loading').style.display = "none";
        document.querySelector('.buy-button').style.display = "inline-block";
        document.querySelector('.amazonRatingCountLoading').style.display = "none";
        document.querySelector('.amazonRatingCount').style.display = "block";
    });
    
    // Send message for asin to upc
    browser.runtime.sendMessage({command:'get-upc', asin: asin}, (response) => {
        const upc = response.data["upc"];
        // Use upc to get walmart prod info
        browser.runtime.sendMessage({command:'get-walmart-info', upc: upc}, (response) => {
            console.log("walmart response: ", response.data);
            // Update rating and ratingsTotal from walmart data
            walmartRating = response.data["rating"];
            walmartRatingCount = response.data["ratingsTotal"];
            console.log("walmart rating: ", walmartRating);
            console.log("walmart rating count", walmartRatingCount);
            
            if (walmartRating == 0) {
                zeroRatings += 1;
            }
            
            
            // Add walmart ratingCount to total number of reviews and update average
            ratingsReturned += 1;
            totalReviews += walmartRatingCount;
            
            if (ratingsReturned == 3) {
                displayTotalReviews(totalReviews);
                // Get average score if last returned
                displayAverage(zeroRatings);
            }
            
            // Display the walmart rating count
            if (walmartRatingCount != 0) {
                document.querySelector('.walmartRatingCount').innerHTML = walmartRatingCount.toLocaleString("en-US");
                document.querySelector('.showWalmartRating').innerHTML = "( "+walmartRating+" )";
            } else {
                document.querySelector('.walmartRatingCount').innerHTML = "Not sold here";
                document.querySelector('.showWalmartRating').style.display = "none";
            }
            
            
            document.querySelector('.walmartRatingCountLoading').style.display = "none";
            document.querySelector('.walmartRatingCount').style.display = "block";
            
            // Create the walmart star rating
            if (walmartRating >= 4.8) {
                var image = document.createElement("img");
                image.src = browser.runtime.getURL("/assets/images/five-stars.png");
                document.getElementById('insert_walmart_star_ratings_here').appendChild(image);
                document.querySelector('.showWalmartRating').style.color = greenColor;
            }
            if (walmartRating >= 4.3 && walmartRating <= 4.7) {
                var image = document.createElement("img");
                image.src = browser.runtime.getURL("/assets/images/four-half-stars.png");
                document.getElementById('insert_walmart_star_ratings_here').appendChild(image);
                document.querySelector('.showWalmartRating').style.color = greenColor;
            }
            if (walmartRating >= 3.8 && walmartRating <= 4.2) {
                var image = document.createElement("img");
                image.src = browser.runtime.getURL("/assets/images/four-stars.png");
                document.getElementById('insert_walmart_star_ratings_here').appendChild(image);
                document.querySelector('.showWalmartRating').style.color = greenColor;
            }
            if (walmartRating >= 3.3 && walmartRating <= 3.7) {
                var image = document.createElement("img");
                image.src = browser.runtime.getURL("/assets/images/three-half-stars.png");
                document.getElementById('insert_walmart_star_ratings_here').appendChild(image);
                document.querySelector('.showWalmartRating').style.color = greenColor;
            }
            if (walmartRating >= 2.8 && walmartRating <= 3.2) {
                var image = document.createElement("img");
                image.src = browser.runtime.getURL("/assets/images/three-stars.png");
                document.getElementById('insert_walmart_star_ratings_here').appendChild(image);
                document.querySelector('.showWalmartRating').style.color = yellowColor;
            }
            if (walmartRating >= 2.3 && walmartRating <= 2.7) {
                var image = document.createElement("img");
                image.src = browser.runtime.getURL("/assets/images/two-half-stars.png");
                document.getElementById('insert_walmart_star_ratings_here').appendChild(image);
                document.querySelector('.showWalmartRating').style.color = yellowColor;
            }
            if (walmartRating >= 1.8 && walmartRating <= 2.2) {
                var image = document.createElement("img");
                image.src = browser.runtime.getURL("/assets/images/two-stars.png");
                document.getElementById('insert_walmart_star_ratings_here').appendChild(image);
                document.querySelector('.showWalmartRating').style.color = redColor;
            }
            if (walmartRating >= 1.3 && walmartRating <= 1.7) {
                var image = document.createElement("img");
                image.src = browser.runtime.getURL("/assets/images/one-half-stars.png");
                document.getElementById('insert_walmart_star_ratings_here').appendChild(image);
                document.querySelector('.showWalmartRating').style.color = redColor;
            }
            if (walmartRating >= 0.8 && walmartRating <= 1.2) {
                var image = document.createElement("img");
                image.src = browser.runtime.getURL("/assets/images/one-star.png");
                document.getElementById('insert_walmart_star_ratings_here').appendChild(image);
                document.querySelector('.showWalmartRating').style.color = redColor;
            }
            if (walmartRating <= 0.7) {
                var image = document.createElement("img");
                image.src = browser.runtime.getURL("/assets/images/no-stars.png");
                document.getElementById('insert_walmart_star_ratings_here').appendChild(image);
                document.querySelector('.showWalmartRating').style.color = redColor;
            }
        });
        
        // Use upc to get google prod info
        browser.runtime.sendMessage({command:'get-google-info', upc: upc}, (response) => {
            console.log("google response: ", response.data);
            // Update rating and ratingsTotal from google data
            googleRating = response.data["rating"];
            googleRatingCount = response.data["ratingsTotal"];
            console.log("google rating: ", googleRating);
            console.log("google rating count: ", googleRatingCount);
            
            if (googleRating == 0) {
                zeroRatings += 1;
            }
            
            // Add google ratingCount to total number of reviews and update average
            ratingsReturned += 1;
            totalReviews += googleRatingCount;
            
            if (ratingsReturned == 3) {
                displayTotalReviews(totalReviews);
                // Get average score if last returned
                displayAverage(zeroRatings);
            }
            
            if (googleRatingCount != 0) {
                document.querySelector('.googleRatingCount').innerHTML = googleRatingCount.toLocaleString("en-US");
                document.querySelector('.showGoogleRating').innerHTML = "( "+googleRating+" )";
            } else {
                document.querySelector('.googleRatingCount').innerHTML = "Not sold here";
                document.querySelector('.showGoogleRating').style.display = "none";
            }
            
            document.querySelector('.googleRatingCountLoading').style.display = "none";
            document.querySelector('.googleRatingCount').style.display = "block";
            
            // Create the google star rating
            if (googleRating >= 4.8) {
                var image = document.createElement("img");
                image.src = browser.runtime.getURL("/assets/images/five-stars.png");
                document.getElementById('insert_google_star_ratings_here').appendChild(image);
                document.querySelector('.showGoogleRating').style.color = greenColor;
            }
            if (googleRating >= 4.3 && googleRating <= 4.7) {
                var image = document.createElement("img");
                image.src = browser.runtime.getURL("/assets/images/four-half-stars.png");
                document.getElementById('insert_google_star_ratings_here').appendChild(image);
                document.querySelector('.showGoogleRating').style.color = greenColor;
            }
            if (googleRating >= 3.8 && googleRating <= 4.2) {
                var image = document.createElement("img");
                image.src = browser.runtime.getURL("/assets/images/four-stars.png");
                document.getElementById('insert_google_star_ratings_here').appendChild(image);
                document.querySelector('.showGoogleRating').style.color = greenColor;
            }
            if (googleRating >= 3.3 && googleRating <= 3.7) {
                var image = document.createElement("img");
                image.src = browser.runtime.getURL("/assets/images/three-half-stars.png");
                document.getElementById('insert_google_star_ratings_here').appendChild(image);
                document.querySelector('.showGoogleRating').style.color = greenColor;
            }
            if (googleRating >= 2.8 && googleRating <= 3.2) {
                var image = document.createElement("img");
                image.src = browser.runtime.getURL("/assets/images/three-stars.png");
                document.getElementById('insert_google_star_ratings_here').appendChild(image);
                document.querySelector('.showGoogleRating').style.color = yellowColor;
            }
            if (googleRating >= 2.3 && googleRating <= 2.7) {
                var image = document.createElement("img");
                image.src = browser.runtime.getURL("/assets/images/two-half-stars.png");
                document.getElementById('insert_google_star_ratings_here').appendChild(image);
                document.querySelector('.showGoogleRating').style.color = yellowColor;
            }
            if (googleRating >= 1.8 && googleRating <= 2.2) {
                var image = document.createElement("img");
                image.src = browser.runtime.getURL("/assets/images/two-stars.png");
                document.getElementById('insert_google_star_ratings_here').appendChild(image);
                document.querySelector('.showGoogleRating').style.color = redColor;
            }
            if (googleRating >= 1.3 && googleRating <= 1.7) {
                var image = document.createElement("img");
                image.src = browser.runtime.getURL("/assets/images/one-half-stars.png");
                document.getElementById('insert_google_star_ratings_here').appendChild(image);
                document.querySelector('.showGoogleRating').style.color = redColor;
            }
            if (googleRating >= 0.8 && googleRating <= 1.2) {
                var image = document.createElement("img");
                image.src = browser.runtime.getURL("/assets/images/one-star.png");
                document.getElementById('insert_google_star_ratings_here').appendChild(image);
                document.querySelector('.showGoogleRating').style.color = redColor;
            }
            if (googleRating <= 0.7) {
                var image = document.createElement("img");
                image.src = browser.runtime.getURL("/assets/images/no-stars.png");
                document.getElementById('insert_google_star_ratings_here').appendChild(image);
                document.querySelector('.showGoogleRating').style.color = redColor;
            }
        });
    });
};

var displayTotalReviews = function(totalReviews) {
    console.log("Display Total Reviews was called");
    // Format the total reviews and display
    totalReviewsString = new Intl.NumberFormat( 'en-US', { maximumFractionDigits: 1,notation: "compact" , compactDisplay: "short" }).format(totalReviews);
    console.log("All Total Reviews", totalReviewsString);
    document.querySelector('.totalReviewsCount').innerHTML = totalReviewsString;
    document.querySelector('.totalReviewsLoading').style.display = "none";
    document.querySelector('.totalReviews').style.display = "inline-block";
};

var roundAverage = function(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

var displayAverage = function(zeroRatings) {
    console.log("Display Average Rating was called");
    var combinedRating = amazonRating + walmartRating + googleRating;
    if (zeroRatings == 0) {
        averageScore = combinedRating / 3;
        // Color the background of average score relative to average rating
        if (averageScore >= 4) {
            document.querySelector('.avgRating').style.background = backGreenColor;
        } else if (averageScore >= 2.5 && averageScore < 4) {
            document.querySelector('.avgRating').style.background = backYellowColor;
        } else if (averageScore < 2.5) {
            document.querySelector('.avgRating').style.background = backRedColor;
        }
        var finalAverage = roundAverage(averageScore, 1).toFixed(1);
    } else if (zeroRatings == 1) {
        averageScore = combinedRating / 2;
        // Color the background of average score relative to average rating
        if (averageScore >= 4) {
            document.querySelector('.avgRating').style.background = backGreenColor;
        } else if (averageScore >= 2.5 && averageScore < 4) {
            document.querySelector('.avgRating').style.background = backYellowColor;
        } else if (averageScore < 2.5) {
            document.querySelector('.avgRating').style.background = backRedColor;
        }
        var finalAverage = roundAverage(averageScore, 1).toFixed(1);
    } else if (zeroRatings == 2) {
        averageScore = combinedRating;
        // Color the background of average score relative to average rating
        if (averageScore >= 4) {
            document.querySelector('.avgRating').style.background = backGreenColor;
        } else if (averageScore >= 2.5 && averageScore < 4) {
            document.querySelector('.avgRating').style.background = backYellowColor;
        } else if (averageScore < 2.5) {
            document.querySelector('.avgRating').style.background = backRedColor;
        }
        var finalAverage = roundAverage(averageScore, 1).toFixed(1);
    } else if (zeroRatings == 3) {
        averageScore = 0.0;
        document.querySelector('.avgRating').style.background = backRedColor;
        finalAverage = 0.0;
        finalAverage = finalAverage.toString();
    }
    
    // Display the average score
    document.querySelector('.displayAverageScore').innerHTML = finalAverage;
    document.querySelector('.avgRatingLoading').style.display = "none";
    document.querySelector('.avgRating').style.display = "inline-block";
    
} // Must get total review number after all review counts are in

// Click events for the page
let createEvents = function() {
    // Click event to open main body
    document.querySelector('._launch__button').addEventListener('click', function(event){
        console.log('The launch button has been clicked!');
        document.querySelector('._launch__button').style.display = "none";
        document.querySelector('._main__body').style.display = "block";
    });

    // Click event to close main body
    document.querySelector('.exit-button').addEventListener('click', function(event){
        document.querySelector('._main__body').style.display = "none";
        document.querySelector('._launch__button').style.display = "block";
    });
    
    // Click event to switch to signup screen
    document.querySelector('.switch-to-signup-screen-button').addEventListener('click', function(event){
        document.querySelector('._login__screen').style.display = "none";
        document.querySelector('._signup__screen').style.display = "block";
    });

    // Click event to switch to login screen
    document.querySelector('.switch-to-login-screen-button').addEventListener('click', function(event){
        document.querySelector('._signup__screen').style.display = "none";
        document.querySelector('._login__screen').style.display = "block";
    });
    
    // Click event for forgot password
    document.querySelector('.forgot-password-button').addEventListener('click', function(event){
        alert('User has forgotten password :(');
    });

    // Click event to signup
    document.querySelector('.signup-button').addEventListener('click', function(event){
        let email = document.querySelector('._signup__screen input[type="email"]').value;
        let firstPass = document.getElementById('password1').value;
        let secondPass = document.getElementById('password2').value;

        // Check if passwords match
        if(firstPass != secondPass) {
            alert('Passwords do not match!');
            console.log('Passwords do not match!');
            return;
        }

        let verifiedPassword = secondPass;

        // Send message to signup user with firebase.js
        console.log('button was pressed to signup. Send to firebase.js');
        browser.runtime.sendMessage({command: "auth-signup", e: email, p: verifiedPassword, asin: asin}, (response) => {
            console.log(response.type, response.status, response.data);
            isauthed = response.data;
            getProdInfo();
            pageDisplay(response.data);
        });
        //userAuth = true;
        //pageDisplay(userAuth);
    });

    // Click event to login
    document.querySelector('.login-button').addEventListener('click', function(event){
        let email = document.querySelector('._login__screen input[type="email"]').value;
        let password = document.querySelector('._login__screen input[type="password"]').value;

        // Send message to login user with firebase.js
        console.log('button was pressed to login. Send to firebase.js');
        browser.runtime.sendMessage({command: "auth-login", e: email, p: password, asin: asin}, (response) => {
            console.log(response.data);
            if (response.data == false) {
                document.querySelector(".incorrect-info").style.display = "block";
            }
            getProdInfo();
            pageDisplay(response.data);
        });
    });
    
    // Press login button on enter keypress
    // Get the input field
    var input = document.querySelector(".password-field");

    // Execute a function when the user releases a key on the keyboard
    input.addEventListener("keyup", function(event) {
      // Number 13 is the "Enter" key on the keyboard
      if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.querySelector(".login-button").click();
      }
    });

    // Click event to logout
    document.querySelector('.logout-button').addEventListener('click', function(event){
        console.log('button was pressed to logout. Send to firebase.js');
        browser.runtime.sendMessage({command: "auth-logout"}, (response) => {
            console.log(response.data);
            isauthed = response.data;
            pageDisplay(response.data);
        });
    });

};

// Only show on amazon.com
if (url.includes('/dp/')) {
    // Button to open main app body
    var launchButton = document.createElement('div');
    launchButton.className = '_launch__button';
    launchButton.innerHTML = '<div id="insert_wyzer_logo_image_here" class="logo"></div>';
    launchButton.style.display = "block";
    document.body.appendChild(launchButton);

    // Main body
    var mainBodyElement = document.createElement('div');
    mainBodyElement.className = '_main__body';
    mainBodyElement.innerHTML =
    `<div class="_nav__bar">
        <div class="nav-content-container"><div id="wyzer_heading_here" class="wyzer-heading"></div><div id="mainBodyMinimize" class="exit-button"></div></div>
    </div>`;
    mainBodyElement.style.display = "none";
    document.body.appendChild(mainBodyElement);
    
    // Signed in main body element
    let wyzerHomeScreenElement = document.createElement('div');
    wyzerHomeScreenElement.className = '_wyzer__homescreen';
    wyzerHomeScreenElement.style.display = 'none';
    document.querySelector('._main__body').appendChild(wyzerHomeScreenElement);
    
    // Product card
    var productCardElement = document.createElement('div');
    productCardElement.className = '_product__card';
    productCardElement.innerHTML =
    `<div class="product-image-loading"></div>
    <div id="insert_product_image_here" class="product-image"></div>
    <div class="product-info">
        <div class="prodTitleLoading"></div>
        <h3 class="prodTitle"></h3>
        <div class="prodBrandLoading"></div>
        <p class="prodBrand"></p>
    </div>
    `;
    document.querySelector('._wyzer__homescreen').appendChild(productCardElement);
    
    // Price card
    var priceCardElement = document.createElement('div');
    priceCardElement.className = '_price__card';
    priceCardElement.innerHTML =
    `<div class="price-info">
        <h3>Buy Now
        </h3>
        <p class="affiliate-support">This feature is coming soon!</p>
    </div>
    <div class="buy-button-loading"></div>
    <div class="buy-button">
        <div class="buy-content">
            <div class="cart-image" id="insert_cart_image_here"></div>
            <h3 class="buy-price"></h3>
        </div>
    </div>
    `;
    document.querySelector('._wyzer__homescreen').appendChild(priceCardElement);

    // Ratings card
    var ratingsCardElement = document.createElement('div');
    ratingsCardElement.className = '_ratings__card';
    ratingsCardElement.innerHTML =
    `<div class="avgTotalContainer">
        <div class="avgRatingLoading"></div>
        <div class="avgRating">
            <p>Avg Score</p>
            <h1 class="displayAverageScore"></h1>
        </div>
        <div class="totalReviewsLoading"></div>
        <div class="totalReviews">
            <p>Total Reviews</p>
            <h1 class="totalReviewsCount"></h1>
        </div>
    </div>
    <div class="individualRatingsContainer">
        <div class="firstCompanyRatings">
            <div id="insert_first_company_logo_here" class="company-logo"></div>
            <div class="googleRatingCountLoading"></div>
            <p class="googleRatingCount"></p>
            <div id="insert_google_star_ratings_here" class="star-ratings"></div>
            <p class="showGoogleRating"></p>
        </div>
        <div class="secondCompanyRatings">
            <div id="insert_second_company_logo_here" class="company-logo"></div>
            <div class="walmartRatingCountLoading"></div>
            <p class="walmartRatingCount"></p>
            <div id="insert_walmart_star_ratings_here" class="star-ratings"></div>
            <p class="showWalmartRating"></p>
        </div>
        <div class="thirdCompanyRatings">
            <div id="insert_third_company_logo_here" class="amazon-company-logo"></div>
            <div class="amazonRatingCountLoading"></div>
            <p class="amazonRatingCount"></p>
            <div id="insert_amazon_star_ratings_here" class="star-ratings"></div>
            <p class="showAmazonRating"></p>
        </div>
    </div>
    <div><button class="logout-button">Log Out</button></div>
    `;
    document.querySelector('._wyzer__homescreen').appendChild(ratingsCardElement);
    
    // Show the login/signup screen if user is not authed
    let authScreenElement = document.createElement('div');
    authScreenElement.className = '_auth__screen';
    authScreenElement.innerHTML = ``;
    authScreenElement.style.display = 'block';
    document.querySelector('._main__body').appendChild(authScreenElement);

    // Show login screen
    let loginScreenElement = document.createElement('div');
    loginScreenElement.className = '_login__screen';
    loginScreenElement.innerHTML = `
    <h3>Log In</h3>
    <p class="incorrect-info">Incorrect email or password</p>
    <div class="input-group">
        <input class="email-field" type="email" placeholder="Email Address"/>
    </div>
    <div class = "input-group">
        <input class="password-field" type="password" placeholder="Password"/>
    </div>
    <p class="forgot-password-button">Forgot your password?</p>
    <div><button class="login-button">Sign In</button></div>
    <div class="switch-to-sign-up-container">
        <p class="no-account">Don't have account?
            <span class="switch-to-signup-screen-button">Sign up</span>
        </p>
    </div>
    `;
    loginScreenElement.style.display = 'block';
    document.querySelector('._auth__screen').appendChild(loginScreenElement);

    // Show signup screen
    let signupScreenElement = document.createElement('div');
    signupScreenElement.className = '_signup__screen';
    signupScreenElement.innerHTML = `
    <h3>Sign Up</h3>
    <div class = "input-group">
        <input type="email" placeholder="Email Address"/>
    </div>
    <div class = "input-group">
        <input type="password" id="password1" placeholder="Password"/>
    </div>
    <div class = "input-group">
        <input type="password" id="password2" placeholder="Verify password"/>
    </div>
    <div><button class="signup-button">Sign Up</button></div>
    <div class="switch-to-login-container">
        <p class="has-account">Already have account?
            <span class="switch-to-login-screen-button">Log in</span>
        </p>
    </div>
    `;
    signupScreenElement.style.display = 'none';
    document.querySelector('._auth__screen').appendChild(signupScreenElement);

    createEvents();
    
}

// Get the path to images and insert
var image = document.createElement("img");
image.src = browser.runtime.getURL("/assets/images/wyzer-logo.png");
document.getElementById('insert_wyzer_logo_image_here').appendChild(image);


var image = document.createElement("img");
image.src = browser.runtime.getURL("/assets/images/shopping-cart-icon.png");
document.getElementById('insert_cart_image_here').appendChild(image);


var image = document.createElement("img");
image.src = browser.runtime.getURL("/assets/images/google-logo.png");
document.getElementById('insert_first_company_logo_here').appendChild(image);

var image = document.createElement("img");
image.src = browser.runtime.getURL("/assets/images/walmart_logo.png");
document.getElementById('insert_second_company_logo_here').appendChild(image);

var image = document.createElement("img");
image.src = browser.runtime.getURL("/assets/images/amazon-logo.png");
document.getElementById('insert_third_company_logo_here').appendChild(image);

var image = document.createElement("img");
image.src = browser.runtime.getURL("/assets/images/green-star-rating.png");
document.getElementById('insert_green_star_ratings_here').appendChild(image);


