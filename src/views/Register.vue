<template>
<div class="register">
  <div class="two-panel">
    <div class="register-form-container">
      <h2>Sign Up With Us</h2>
      <div v-for="(error, index) in formErrors" v-bind:key="index">
        <p class="register-form-errors">{{ error }}</p>
      </div>
      <p v-if="initialUser" class="admin-message"><i class="fas fa-info-circle"></i> You are registering as an Admin</p>
      <form v-on:submit.prevent="registerUser">
        <div v-if="!isAdmin" class="input-group">
          <label>First Name:</label>
          <input type="text" v-model="firstName"/>
        </div>
        <div v-if="!isAdmin" class="input-group">
          <label>Last Name:</label>
          <input type="text" v-model="lastName"/>
      </div>
        <div class="input-group">
          <label>Email:</label>
          <input type="email" v-model="email"/>
      </div>
         <div class="input-group">
          <label>Password:</label>
          <input type="password" v-model="password"/>
      </div>
      <div class="register-button-container">
        <button><i class="fas fa-user-plus"></i> Register</button>
      </div>
      </form>
    </div>
    <div class="register-img-container">
      <img src="../assets/register.jpg" alt="sushi"/>
      <div class="register-img-overlay">
        <h1>Discover <span>Exciting</span> New Restaurants</h1>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { firebase } from '@firebase/app';
import '@firebase/firestore';
import '@firebase/auth';

  export default {
    name: 'Register',
    data() {
      return {

        firstName: '',
        lastName: '',
        email: '',
        password: '',
        db: firebase.firestore(),
        formErrors: [],
        isAdmin: false,
        reviews: [],
        initialUser: false,
        prevUserTotal: '',

      }
    },

    mounted() {

      this.showAdminMessage();



    },
    methods: {

      showAdminMessage() {

          this.db.collection('users')
          .get()
          .then(
            (querySnapshot) => {

            if (querySnapshot.empty) {

              this.initialUser = true;

              this.isAdmin = true;

            } else {

              this.initialUser = false;

              this.isAdmin = false;
            }
        });
      },
      registerUser() {

        this.formErrors = [];

        this.validateForm();

        if (!this.formErrors.length) {

            this.createUser();
        }
      },

      updateTotalUsers(collection, field) {

          let docID;


        return  this.db
          .collection(collection)
          .orderBy(field)
          .limit(1)
          .get()
          .then(
            (querySnapshot) => {

              querySnapshot.forEach((doc) => {

                 docID = doc.id;
                this.prevUserTotal = doc.data().total + 1;


              });
            }
          ).then(() => {

            const docRef = this.db.collection(collection).doc(docID);

              docRef.update(
                {
                  total: this.prevUserTotal,
                }
              );
          });
      },

      createUser() {

        firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
        .then(
          (userData) => {
          const {user} = userData;

          if (user) {

            if (this.isAdmin) {

              this.addAdminUser(user.uid);

            } else {

              this.updateTotalUsers('num_of_users', 'total').then(() => {

                  this.addUserToCollection(user.uid);
              });


            }
          }
        })
        .catch(
          (error) => {

          this.formErrors.push(error.message);
        });

        setTimeout(() => {

          this.formErrors = [];
        }, 5000);

        this.$router.push({name: 'Home'});
      },

      addUserToCollection(id) {

       const date = new Date();

       const seconds = Math.round(date.getTime() / 1000);

      this.db.collection('users').doc(id).set(
            {

            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            userId: id,
            createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
            isAdmin: this.isAdmin,
            reviews: this.reviews,
            id: this.prevUserTotal,
            createdAtSeconds: seconds,

          }
        )
      },
      addAdminUser(id) {

        this.db.collection('users').doc(id).set(
            {
              email: this.email,
              isAdmin: this.isAdmin,
              userId: id
            }
        ).then(
          () => {

          this.email = '';
          this.password = '';
          this.isAdmin = false;
        }
        );
      },
       validateForm() {
        if (!this.initialUser)  {

            if (this.firstName.length === 0) {

            this.formErrors.push('First Name cannot be empty');
          } else if (this.firstName.length > 25) {

            this.formErrors.push('First Name may not be longer than 25 characters');
          } else if (this.checkFormFieldForDigits(this.firstName)) {

            this.formErrors.push('First Name cannot include any numbers');
          }

          if (this.lastName.length === 0) {

            this.formErrors.push('Last Name cannot be empty');
          } else if (this.lastName.length > 40) {

            this.formErrors.push('Last Name may not be longer than 40 characters');
          } else if (this.checkFormFieldForDigits(this.lastName)) {

            this.formErrors.push('Last Name cannot include any numbers');
          }

          if (this.password.length === 0) {

            this.formErrors.push('Password cannot be empty');
          } else if (this.password.length < 6) {

            this.formErrors.push('Password must be a minimum of 6 characters');
          } else if (!this.passwordValidation()) {

            this.formErrors.push('Password must include a number, lowercase, and uppercase character');
          }

        }
      },



      passwordValidation () {

        let uppercase = false,
            lowercase = false,
            number = false;

        this.password
        .split('')
        .forEach(
            (character) => {

                if (character === character.toUpperCase()
                    && isNaN(character)
                  ) {

                    uppercase = true;
                }

                if (character === character.toLowerCase()
                    && isNaN(character)
                    ) {

                    lowercase = true;
                }

                if (!isNaN(parseInt(character))) {

                    number = true;
                }
            }
        );

        if (uppercase && lowercase && number) {

          return true;
        } else {

          return false;
        }
      },




      checkFormFieldForDigits(field) {
        let threshold = 0;

        [...field].forEach((char) => {

          if (!isNaN(char)) {

            threshold = threshold + 1;
          }
        });

        return threshold >= 1;
      }
    }
  }

</script>

<style lang="scss">
 $black: #293241;
 $blue: #3D5A80;
 $offwhite: #E0FBFC;
 $red: #EE6C4D;
 $gray: #eee;

 .register {
   height: 100vh;
   width: 100%;
 }
 .register-img-container {
   position: relative;
   height: 100vh;
   img {
    height: 100vh;
    width: 100%;
   }
 }

 .register-form-errors {
   text-align: center;
   color: $red;
   font-weight: bold;
   margin: 0;
   padding:0;
 }

 .register-img-overlay {
   position: absolute;
   top: 0;
   left:0;
   width: 100%;
   height:100%;
   background-color: rgba(0, 0,0, 0.4);
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;

   h1 {
     color: $offwhite;
     font-size: 4rem;
     padding: 1rem;
     span {
       color: $red;
     }
   }
 }

 .admin-message {
   text-align: center;
   color: $offwhite;
 }

 .register-button-container {
   margin: 2rem;
   text-align: right;

   button {
     width: 100px;
     padding: 0.4rem 0.3rem;
     background-color: $red;
     border:none;
     color: $offwhite;
     cursor: pointer;
     border-radius: 11px;
     transition: all 0.5s ease-in-out;

     &:hover {
     background-color: darken($red, 10);
   }
   }
 }

 .two-panel {
   height: 100%;
   display: grid;
   grid-template-columns: 1fr 1fr;
   grid-template-rows: 1fr;
 }
 .register-form-container {
   height: 100%;
   background-color: $blue;
   h2 {
     text-align: center;
     color: $red;
     font-size: 2.4rem;
   }
 }

 .input-group {
   display: flex;
   flex-direction: column;
   margin: 1.5rem;
   label {
     margin-bottom: 0.2rem;
     color: $offwhite;
   }
   input {
     background-color: transparent;
     border: 1px solid $offwhite;
     height:30px;
     border-radius: 11px;
     color: $offwhite;
   }
 }

 @media (max-width: 600px) {
   .two-panel {
     grid-template-columns: 1fr;

     h1 {
       font-size: 2rem;
     }
   }

   .register-form-container {
     grid-row-start: 1;
   }

  .register-img-container {
    height:50vh;
    img {
      height: 50vh;
    }
  }
  .register-button-container {
    text-align: center;
  }
 }
</style>