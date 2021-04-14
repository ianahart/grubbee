const configureEmailTemplate = (customer, restaurant) => {
  return `<div style="
  width: 100%;
  height: 100%;">

    <div style="
    background-color: #fafafa;
    padding: 1rem;">
        <p style="margin: 0; padding:10px">Hi, <span style=" font-weight: 900;">${customer.currentUserName}</span>. Here you will find your restaurant details below. Please read the advertising agreement attached as well.</p>
        <h1 style="color: #293241; font-size: 1.3rem;  text-align: center;">${restaurant.name}</h1>
      <div
      style="
        display: flex;
       justify-content: space-around;"
      >
        <img style="
             width: 30%;
             padding-left: 2%;
            height: 150px;" src="${restaurant.image_url}" alt=""/>
         <span
          style="
            display: inline-block;
            width: 40%;
          "
         >
         &nbsp;
         </span>
        <div
         style="
         float:right;
         width:30%;
         margin-right: -5%;
         overflow:hidden;
         text-align: center;
         display: flex;
         padding-right: 2%">
          <div
           style="margin-right: 20px"
          >
            <p>Owner:</p>
            <p>Added:</p>
            <p>Address:</p>
            <p>City:</p>
            <p>State:</p>
            <p>Zip:</p>
            <p>Phone:</p>
          </div>
          <div
          style="margin-left: 20px;"
          >
            <p>${restaurant.firstName} ${restaurant.lastName}</p>
            <p>${restaurant.createdAt}</p>
            <p>${restaurant.address}</p>
            <p>${restaurant.city}</p>
            <p>${restaurant.state}</p>
            <p>${restaurant.zip_code}</p>
            <p>${restaurant.phone}</p>
          </div>
        </div>
        <div>
      </div>
      </div>
      <div style="

          margin: 0 auto;
          text-align: center;
          margin-top: 2rem;">
          <h2>Order Summary</h2>
          <div
            style=" height: 2px;
                    background-color: #45aebf;
                    width: 100%;"
            >
          </div>
          <div>
            <p>1x Restaurant Sign up Fee:</p>
            <p>$10.00</p>
          </div>
         <h2>Thank you</h2>
         <p>We look forward to seeing your business grow!</p>
         <div
          style="
          display: flex;
          margin: 0 auto;
          justify-content: space-around;"
         >
           <div style="
              width: 30%;
             padding-left: 2%;">
             <p style="
              font-weight: bold;
              color:  #293241;">Phone to Reach Us:</p>
             <p
             style="
              font-weight: bold;
              color:  #293241;"
              >362-765-0971</p>
           </div>
                <span
          style="
            display: inline-block;
            width: 40%;">
              &nbsp;
         </span>
           <div style="
             float:right;
              width:30%;
              margin-right: -5%;
              overflow:hidden;
              text-align: center;
              display: flex;
              padding-right: 2%;">
             <p style="
             margin: 0.3rem;
            color: darkslategray;">grubbeefood@zohomail.com</p>
             <p style="
              margin: 0.3rem;
              color: darkslategray;"

             >717 Westbrook Way, Anahiem, CA, 09567</p>
           </div>
         </div>
     </div>
    </div>
</div>
`;
};

module.exports = configureEmailTemplate;