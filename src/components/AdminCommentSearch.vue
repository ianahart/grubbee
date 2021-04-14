<template>
  <div class="admin-comment-search-bar">
    <form @submit.prevent="search(email)">
      <p v-if="!errors.length">Enter email address to retrieve their comments</p>
      <p class="form-error" v-for="(error, index) in errors" :key="index">{{ error }}</p>
      <input @keyup="checkIfValidEmail" name="email" v-model="email"/>
      <transition name="reveal-button">
          <button v-if="isEmailValid && !errors.length" type="submit">Search</button>
      </transition>
    </form>
  </div>
</template>
<script>
  import {firebase} from '@firebase/app';

export default {

  name: 'AdminCommentSearch',

  data () {
    return {
      email: '',
      errors: [],
      isEmailValid: false,
      db: firebase.firestore(),
    }
  },

  methods: {
    checkIfValidEmail() {

      this.errors = [];

      const regExp = /\S+@\S+\.\S+/;

      if (regExp.test(this.email)) {

        this.isEmailValid = true;
      } else {

        this.isEmailValid = false;
      }
    },

    search(email) {

      this.db.collection('users')
      .where('email', '==', this.email)
      .get()
      .then(
        (querySnapshot) => {

        if (querySnapshot.docs.length <= 0) {

          this.errors.push('That email address does not exist');
        } else {

          this.$emit('search',
            {
              email,
            }
          )
        }
      })
      .then(
        () => {

          this.email = '';
      });
    }
  },
}
</script>


<style lang="scss">
$lightBlue: #45aebf;
$black: #293241;
$blue: #3D5A80;
$offwhite: #E0FBFC;
$red: #EE6C4D;
$gray: #eee;

//****TRANSITIONS****/
.reveal-button-enter-active, .reveal-button-leave-active {
  transition: all 0.7s ease-in-out;
}

.reveal-button-enter {
  opacity: 0;
  transform:scale(0.3);
}

.reveal-button-leave-to {
  opacity: 0;
}


//****END TRANSITIONS****/

.admin-comment-search-bar {
  width: 100%;
  form {
    position: relative;
    text-align: center;
  }

  p {
    text-align: center;
    color: $black;
    font-weight: bold;
  }

  input {
    width: 85%;
    height:30px;
    border-radius: 11px;
    outline: none;
    border-color: $gray;
    border: none;
    border: 2px solid $gray;
  }

  button {
    border-radius: 11px;
    background-color: $red;
    border:none;
    width: 15%;
    position: absolute;
    right: 7%;
    height:35px;
    color: #fff;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.5s ease-in-out;
    &:hover {
      background-color: darken($red, 10);
    }

  }

  .form-error {
    color: $red;
    font-size: 0.9rem;
    margin-bottom: 0.3rem;
  }
}

@media (max-width: 600px) {
  .admin-comment-search-bar {
    button {
      width: 20%;
    }
  }
}

</style>