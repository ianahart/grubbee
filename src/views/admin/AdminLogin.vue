<template>
  <div class="login">
      <div class="admin-img-container">
        <div class="admin-img-overlay">
          <header>
            <h1>&quot;People who <span>love</span> to eat are always the best people.&quot;</h1>
          </header>
        </div>
      </div>
      <div v-bind:class="helpDiv">
        <p>Head over to the user <router-link :to="{name: 'Login'}">login</router-link> page</p>
      </div>
      <div class="admin-login-form-container">
        <h2>Admin Login</h2>
        <p class="admin-form-error" v-for="(error, index) in formErrors" v-bind:key="index">
          {{ error }}
        </p>
      <form class="admin-form" @submit.prevent="userLogin">
        <div class="admin-input-group">
          <label>Email:</label>
          <input @focus="resetErrors" type="email" v-model="email" />
        </div>
        <div class="admin-input-group">
          <label>Password:</label>
          <input type="password" v-model="password"/>
        </div>
        <div class="admin-login-btn-container">
          <button>Login <i class="fas fa-sign-in-alt"></i></button>
        </div>
      </form>
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
        helpMessage: false,
        formErrors: [],
        db: firebase.firestore(),
      }
    },
    computed: {
      helpDiv: function () {
        return {
          'help-message': this.helpMessage,
          'hide-help-message': !this.helpMessage
        }
      }
    },

    methods: {
      resetErrors() {

        this.formErrors = [];
        this.helpMessage = false;
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

               this.initiateLogin();

            } else {
                this.helpMessage = true;
               this.formErrors.push('Please use the User Login, You are not authorized');
            }
          });
        });
      },

      initiateLogin() {
          firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password)
          .then(
            () => {

            this.$router.push({name: 'Home'});
          })
          .catch(
            (error) => {
            this.formErrors.push(error.message);
          });
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

  .admin-img-container {
    position: relative;
    height: 200px;
    background-image: url('../../assets/admin.jpg');
    background-position: center;
    background-size: cover;
  }

  .help-message {
    text-align: center;
    margin-top: 2rem;
    a {
      color: $blue;
    }
  }

  .hide-help-message {
    display: none;
  }

  .admin-img-overlay {
    position: absolute;
    background-color: rgba(0, 0,0 ,0.5);
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    header {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
      h1 {
        color: $offwhite;
        margin: 0;
        text-align: center;
         span {
           color: $red;
           text-transform: uppercase;
         }
      }
    }
  }

  .admin-login-form-container {
    background-color: whitesmoke;
      width: 600px;
      margin: 5rem auto 3rem auto;

      h2 {
        background-color: $blue;
        padding: 0.3rem 0;
        text-align: center;
        color: $offwhite;
      }
  }

  .admin-form-error {
    text-align: center;
    color: $red;
    font-size: 0.8rem;
  }

  .admin-input-group {

    display: flex;
   flex-direction: column;
   margin: 1.5rem;
   label {
     margin-bottom: 0.2rem;
     color: $blue;
   }
   input {
     background-color: transparent;
     border: 1px solid $blue;
     height:30px;
     border-radius: 11px;
     color: $black;
   }
  }
  .admin-form {
    width: 100%;
    height: 250px;
  }

  .admin-login-btn-container {
    text-align: right;
    button {
      border-radius: 11px;
      border:none;
      width: 100px;
      background-color: $red;
      color: $offwhite;
      transition: all 0.5s ease-in-out;
      padding: 0.3rem 0.2rem;
      cursor: pointer;

      &:hover {
        background-color: darken($red, 15);
      }
    }
    margin: 2rem;
  }

@media (max-width: 600px) {
  .admin-login-form-container {
    width: 90%;
  }

  .admin-login-btn-container {
      text-align: center;
    }

  .admin-form {
    height: 220px;
  }
}

</style>