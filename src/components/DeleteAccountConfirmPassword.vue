
<template>
  <div class="delete-account-confirm-password">

    <label for="password">To continue, please re-enter your password</label>
    <div>
    <p v-if="error">{{ error }}</p>
    <input @keyup.enter="onEnter" id="password" type="password" v-model="password" @blur="onClickAway" />
    </div>
  </div>
</template>

<script>

  import { firebase } from '@firebase/app';

  export default {

    name: 'DeleteAccountConfirmPassword',

    props: {
      currentUser: Object,
    },

    components: {

    },

    data () {

      return {
        password: '',
        error: '',
      }
    },

    created () {

    },

    mounted () {

    },

    methods: {

       async onEnter() {

         await this.confirmPassword();
      },

      async onClickAway () {

        await this.confirmPassword();
      },

      async confirmPassword () {

          const credential = firebase
            .auth.EmailAuthProvider
            .credential(this.currentUser.email, this.password);

          try {

              this.error = '';

              const reauthenticated = await this.currentUser.reauthenticateWithCredential(credential);

              if (reauthenticated.user.uid) {

                this.$emit('passwordconfirmed', true);
              }

          } catch (e) {

            this.error = 'Password is incorrect';

            this.$emit('passwordconfirmed', false);
            console.log(e.a);
          }
      }
    },
  }
</script>

<style lang="scss">
$black: #293241;
$blue: #3d5a80;
$offwhite: #e0fbfc;
$red: #ee6c4d;
$gray: #eee;

.delete-account-confirm-password {

  margin: 3rem auto;

  display: flex;
  align-items: center;
  justify-content: space-between;

  p {
    color: $red;
    font-weight: bold;
  }

  div {
    width: 40%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
  }

  label {
    font-size: 1rem;
    font-weight: 900;
  }

  input {
    height: 35px;
    border-radius: 0.25rem;
    border: none;
    border: 1px solid lighten($blue, 7);
    background-color: transparent;
  }
}


@media (max-width: 600px) {
  .delete-account-confirm-password {
    flex-direction: column;

    label {
      margin-bottom: 1.5rem;
    }

    div {
      width: 90%;
      margin: 0 auto;
    }
  }
}

</style>