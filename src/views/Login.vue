<template>
  <div class="login">
    <div class="login-row">
      <div class="login-img-container">
        <img src="../assets/login.jpg" />
        <div class="login-img-overlay">
          <h1>&quot;Bring <span>Home</span> The Bacon.&quot;</h1>
        </div>
      </div>
      <div class="login-form-container">
        <h2>Login To Grubbee</h2>
        <p class="form-error" v-for="(error, index) in formErrors" v-bind:key="index">
          {{ error }}
        </p>
      <form @submit.prevent="userLogin">
        <div class="input-group">
          <label>Email:</label>
          <input @focus="resetErrors" type="email" v-model="email" />
        </div>
        <div class="input-group">
          <label>Password:</label>
          <input type="password" v-model="password"/>
        </div>
        <div class="login-btn-container">
          <button>Login <i class="fas fa-sign-in-alt"></i></button>
          <p>Not registered?</p>
          <router-link :to="{name: 'Register'}">Create Account</router-link>
        </div>
          <router-link
            :to="{name: 'ForgotPassword'}"
            class="forgot-password-link"
          >
            Forgot password?
          </router-link>
      </form>
    </div>
     </div>
  </div>
</template>

<script>
import { firebase } from '@firebase/app';

  export default {
    name: 'Login',
    data () {
      return {
        email: '',
        password: '',
        formErrors: [],
        db: firebase.firestore(),
      }
    },




    mounted() {

      if (this.$route.query.email !== undefined) {

         this.email = this.$route.query.email;
      }

    },


    methods: {
      resetErrors() {

        this.formErrors = [];
      },
    userLogin() {

      this.validateForm();

       this.db.collection('users')
       .where('email', '==', this.email)
       .get()
       .then(
         (querySnapshot) => {

          if (querySnapshot.docs.length === 0) {

            this.formErrors.push('Email address does not exist');

          }

          querySnapshot.forEach((doc) => {

            if (doc.data().isAdmin) {

              this.formErrors.push('Please use the Admin Login');


            } else {

             this.initiateLogin();
            }
          });
        });
      },

      async initiateLogin () {

        try {

          const auth = firebase.auth;

          await auth().signInWithEmailAndPassword(this.email, this.password);

          if (auth().currentUser) {

            await this.addLastLogin(auth().currentUser.uid, 'users');

            this.$router.push({ name: 'Home' });
          } else {

            throw new Error('The password is invalid or the user does not have a password.');
          }

        } catch (err) {

          this.formErrors.push(err.message);
        }
      },


      async addLastLogin (currentUserId, collection) {

        let docIDToUpdate;

        try {

          const documents = await this.db
          .collection(collection)
          .where('userId', '==', currentUserId)
          .get();

          if (documents.docs.length === 1) {

            for (const document of documents.docs) {

              docIDToUpdate = document.id;
            }
          }

          const docRef = this.db.collection(collection).doc(docIDToUpdate);

          const date = new Date();

          const rightNowSeconds = Math.round(date.getTime() / 1000);

          await docRef.update(
            {
              lastLogin: rightNowSeconds,
            }
          );

        } catch (err) {

          console.log('Error: ', err);

          console.log('Error Message: ', err.message);
        }
      },

      validateForm () {

        if (this.email.length === 0) {
          this.formErrors.push('Email field cannot be empty');
        }

        if (this.password.length === 0) {
          this.formErrors.push('Password field cannot be empty');
        }
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

.login-form-container, .login-img-container {
  height: 100vh;
}
.login-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.login-img-overlay {
  background-color: rgba(0,0,0,0.5);
  height: 100%;
  width: 100%;
  top:0;
  left:0;
  position: absolute;
  h1 {
    margin-top: 10rem;
    color: $offwhite;
    font-size: 3rem;
    span {
      color: $red;
    }
  }
}

.login-form-container {
  background-color: $blue;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  h2 {
    color: $red;
  }

  form {
    width: 100%;
  }
}

.form-error {
  color: $red;
  font-weight: bold;
  margin: 0.1rem;
}

.login-btn-container {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 3rem;

  a {
    color: $gray;
    font-size: 0.8rem;
  }

  p {
    font-size: 0.8rem;
    color: $offwhite;
  }
  button {
    color: $offwhite;
    background-color: $red;
    padding: 0.4rem 0.3rem;
    border-radius: 11px;
    border: none;
    transition: all 0.5s ease-in-out;
    width: 100px;
    cursor: pointer;
    &:hover {
      background-color: darken($red, 15);
    }
  }
}

.login-img-container {
  position: relative;
  img {
    height: 100%;
    width: 100%;
  }
}

.forgot-password-link {
  text-align: center;
  display: block;
  padding: 1rem 0 5rem 0;
  font-size: 0.8rem;
  color: $offwhite;
}

@media (max-width:600px) {
  .login-row {
    grid-template-columns: 1fr;
  }
  .login-form-container {
    height: 50vh;
  }
  .login-img-container {
    height: 50vh;
  }

  .login-btn-container{
    width: 90%;
    margin: 0 auto;
  }
}

</style>