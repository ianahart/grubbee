# grubbee

## Overview

This application is for people who want to explore restaurants in different areas.

## **Features**

### **User:**

**No account**

* Browse through restaurants and see ratings and read reviews.

Account

* Search for restaurants by name, state or both.
* Add reviews to restaurants
* Delete reviews to restaurants
* Add ratings that go towards average review rating
* Add restaurants to your favorites. Doing so will let you see the restaurant's menu (if listed) and you can filter through reviews by different filters
* Remove restaurants from your favorites
* You can change your password, you have to wait 24 hours in order to do so again.
* If forgotten password you will be emailed a verification code and you fill that in along with your new password
* Delete **Account** (all user-related data will be removed)

Customer Account

* Everything Account member can do
* Add your own restaurant to be displayed on grubbee for a fee.
* All transactions via stripe will send emails to the customer (cancelled, refunded, signup)
* Update restaurant information to keep up-to-date location, image, etc
* Cancel your restaurant on grubbee will result in your restaurant being removed
* A refund within a 7 day window will be offered to customers, resulting in your money back and restaurant being removed
* Write a testimonial for grubbee to be displayed with permission from customer (only one testimonial per customer)
* Can only add one restaurant per account
* Flag other's reviews/comments if you think it is necessary

#### Admin:

* Cannot add restaurant, reviews, or favorites.
* Access to dashboard
* A chart to display the number of reviews/comments in the past 30 days
* A chart to show the number of users signed up per season
* A list of users (minimal information shown)
* Access to all reviews/comments listed. Can filter by a user account's email
* Can delete reviews/comments will also be removed from the corresponding restaurant in a users favorites list
* Access to flagged reviews/comments by users. admin can mark them as read and flagged reviews/comment will be un flagged. admin can delete the flagged reviews/comment.
* If flagged review/comment is marked as read, you can optionally move the review/comment to archived page. Although the review/comment will be deleted from that particular restaurant it will still be available for records in archived.
* In archived review/comments you can delete the review/comment entirely from everywhere in the database or you can move the review/comment back to flagged review/comments page, and it will be marked as read.
* In transactions page you have a charges table of data and a transactions table of data.
* charges table lists every charge that went through grubbee listed newest to oldest and shows total amount charged
* payments table shows shows current overall payments and marks them as **completed, refunded, cancelled** newest to oldest. you can also filter payments based on their status.
* in the payments table you can select which payments to include in a PDF copy and then download that PDF copy.
* Access to a user's list page where you can view user data with pagination, filtering, sorting, searching.

<br>
## Technologies Used

* Vue.js
* Node.js
* Sass
* Firebase firestore, storage, and cloud functions

#### 3rd-party-apis

* Stripe
* PositionStack
* Mapbox
* World Wide Restaurants (rapid API)
* Nodemailer

<br>
## To use:

This application was just made for demonstration and learning purposes and is in no way a real company or able to take payments from users.
In order to test the stripe functionalities you must repeat **4242 i**n the stripe form until the form is completely filled, because the stripe functionality is in test mode and **NOT** in production mode.

To test/explore the Admin functionality of the website feel free to email me at <b>[ianhart7790@gmail.com](mailto:ianhart7790@gmail.com)</b> and I will be happy to give you the credentials to log in as administrator.

##
Installation

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### **Compiles** and minifies for production

```
yarn build
```

### Lints and fixes files

```
yarn lint
```