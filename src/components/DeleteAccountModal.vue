<template>
  <div class="delete-account-modal">
    <div class="delete-account-inner-modal">
      <h1>Warning</h1>
      <p>When you press the confirm button below, your <span>restaurant information</span>, your <span>favorites</span>, and your <span>customer testimonial</span> will be removed permanently and will not be recoverable. Your <span>reviews</span> will stay as (deleted user) unless you delete them before you remove your account.</p>
      <p>We hope you come back soon - <span>Grubbee</span></p>
      <p>Are you sure?</p>
      <div class="delete-account-modal-btns">
        <button @click="reactToModal('remove')">Remove</button>
        <button @click="reactToModal('cancel')">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>


// 1 Logout user
// 2 update num_of_users collection -> subtract 1 from total field
// 3 delete user from customer_testimonials by CustomerId
// 4 delete 'all favorites documents' from favorites that are related to user by (userId) field
// 5 delete restaurant image from storage by getting user's restaurant "image_file_name" field
// 6 delete restaurant by restaurantOwnerId
// 7 update user's review to (deleted user)
// 8 delete user by userId
// 9 delete user from authentication

  export default {

    name: 'DeleteAccountModal',

    props: {

    },

    components: {

    },

    data () {

      return {

      }
    },

    created () {

    },

    mounted () {

    },

    methods: {

      reactToModal (btn) {

          this.$emit('triggermodalaction', btn);
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


.delete-account-modal {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.delete-account-inner-modal {
  background-color: #ffffff;
  width: 60%;
  box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);
  border-radius: 0.25rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;


  h1 {
    box-sizing: border-box;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    background-color: darken(white, 5);
    color: $red;
    font-weight: 100;
    width: 100%;
    margin: 0 auto;
    margin-bottom: 1.5rem;
    padding: 0.5rem;
  }


  p {
    line-height: 1.6;
    color: $black;
    padding: 0 1rem;
  }

  span {
    font-weight: bold;
    color: $blue;
    font-style: italic;
  }
}

.delete-account-modal-btns {
  display: flex;
  justify-content: space-between;
  width: 50%;
  margin-top: 3rem;
  margin-bottom: 3rem;

  button {
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    color: $offwhite;
    transition: all 0.5s ease-in-out;
    width: 120px;
    height: 35px;

    &:hover {
      opacity: 0.7;
    }

    &:first-of-type {
      background-color: darken($red, 7);
    }

    &:last-of-type {
      background-color: $blue;
    }
  }
}

@media (max-width: 600px) {
  .delete-account-inner-modal {
    width: 90%;
  }

  .delete-account-modal-btns {
    width: 90%;
  }
}



</style>