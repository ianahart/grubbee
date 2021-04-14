<template>
  <div class="add-restaurant-image-upload-container">
    <label v-if="!isImageDropped && !error" for="upload">
      Please upload a picture of your restaurant
    </label>
      <transition name="fade-upload-icon" appear>
        <div v-if="error" class="image-error-msg">
          <p>{{ error }}</p>
          <button @click.prevent="clearError">Try Again</button>
        </div>
    </transition>
    <div v-if="isImageDropped && !error" class="completed-msg">
      <p><i class="far fa-check-circle"></i> Upload completed</p>
      <div class="cancel-upload">
        <transition name="fade-upload-icon" appear>
          <p v-if="isCancelBtnActive">Cancel</p>
        </transition>
       <div
        @click="sendCancel(true)"
        @mouseenter="revealToolTip"
        @mouseleave="dismissToolTip"
       >
        <i  class="far fa-times-circle"></i>
      </div>
      </div>
    </div>
    <div class="upload-box">
      <div
        @dragenter=" !isImageDropped ? handleDragOnBox($event) : ''"
        @dragover=" !isImageDropped ? handleDragOnBox($event) : ''"
        @dragleave="handleDragOffBox($event)"
        @drop=" !isImageDropped ? handleDropOnBox($event) : ''"
        class="upload-border"
      >
        <transition name="fade-upload-icon" appear>
          <i v-if="isBoxActive" class="fas fa-plus add-picture-icon"></i>
        </transition>
        <transition name="fade-upload-icon" appear>
          <i v-if="!isBoxActive" class="far fa-image picture-icon"></i>
        </transition>
          <input ref="fileInput" accept="image/*" type="file" id="upload"/>
      </div>
    </div>
  </div>
</template>

<script>

export default {

  name: 'AddRestaurantImageUpload',

  components: {

  },

  props: {
    error: String,
  },

  data () {

    return {
      isBoxActive: false,
      isImageDropped: false,
      isCancelBtnActive: false,
    }
  },

  created () {

  },

  mounted () {

  },

  methods: {

    clearError() {

      this.isImageDropped = false;

      this.$emit('dismissError', {

      });
    },

    revealToolTip () {

      this.isCancelBtnActive = true;

    },

    dismissToolTip () {

      this.isCancelBtnActive = false;
    },

    sendCancel (bool) {

      this.isBoxActive = false;

      this.isImageDropped = false;

      this.$emit('cancelupload', {

        bool
      });

    },

    handleDragOnBox (event) {

        this.setEventDefaults(event);

        if (this.isBoxActive) {
          return ;
        } else {

         this.isBoxActive = true;
        }
    },

    handleDragOffBox (event) {

      this.setEventDefaults(event);

      this.isBoxActive = false;

    },

    handleDropOnBox (event) {

      this.isBoxActive = false;

      this.setEventDefaults(event);

      const file = event.dataTransfer.files;

       if (file) {

         this.isImageDropped = true;
       }

      this.$emit('upload', {

        file,
      });
    },

    setEventDefaults (e) {

        e.preventDefault();

        e.stopPropagation();
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
.fade-upload-icon-enter-active, .fade-upload-icon-leave-active {
  transition: all 0.5s;
}


.fade-upload-icon-enter, .fade-upload-icon-leave-to {
  opacity: 0;

}
//****END TRANSITIONS****/

#upload {
  opacity: 0;
  width: 0px;
  height: 0px;
}

.add-restaurant-image-upload-container {

  width: 50%;
  margin: 2rem 0;
  height: 200px;
  max-width: 400px;

  label {
    color: $lightBlue;
    margin-bottom: 0.2rem;
    display: block;
  }
}

.image-error-msg {
  color: $red;
  font-size: 0.7rem;
  margin-bottom: 1rem;

  button {
    background-color: $blue;
    color: $offwhite;
    cursor: pointer;
    transition: all 0.5s ease-in-out;
    border: none;
    border-radius: 11px;
    padding: 0.2rem 0.3rem;
    width: 100px;
    &:hover {
      background-color: lighten($blue, 10);
      transform: scale(1.05);
    }

  }
}

.completed-msg {
  display: flex;
  align-items: center;
  justify-content: space-between;
  p {
  color: $lightBlue;
  font-weight: bold;
  font-style: italic;
  }
}

.cancel-upload {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  margin-bottom: 1rem;

  p {
    color:$black;
    background-color: $gray;
    border-radius: 0.5rem;
    padding: 0.2rem 0.3rem;
    font-weight: 900;
    font-style: normal;
    font-size: 0.8rem;
    margin: 0;
  }

  i {
    margin-top: 0.5rem;
    font-size: 1.5rem;
    color: $blue;
    transition: all 0.5s ease-in-out;
    cursor: pointer;
    &:hover {
      font-size: 2rem;
      transform: rotate(30deg);
      color: $red;
    }
  }
}

.upload-box {
    background-color: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 90%;
    border-radius: 11px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.upload-border {
  border: 1px dashed $lightBlue;
  border-radius: 11px;
  height: 92%;
  width: 92%;
  margin: 0 auto;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.picture-icon,
.add-picture-icon {
  font-size:3rem;
  color: $offwhite;
  position: absolute;
  z-index: 2;
  pointer-events: none;
}

</style>