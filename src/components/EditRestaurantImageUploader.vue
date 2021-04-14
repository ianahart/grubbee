<template>
  <div class="edit-restaurant-image-uploader">
    <p v-if="uploadFileSucess" class="edit-upload-sucess"><i class="far fa-check-circle"></i> {{ uploadFileSucess }}</p>
    <p class="edit-upload-error" v-if="error">{{ error }}</p>
    <div
      class="edit-uploader-container"
      @dragover.prevent="handleDrag($event)"
      @dragenter="handleDrag($event)"
      @drop.prevent="handleDrop($event)"
      @dragleave.prevent="handleDragLeave($event)"
    >
      <img id="current-image" :src="image" alt="file to upload goes here" />
      <div v-if="isImgInBox" class="edit-uploader-overlay">
        <i class="fas fa-plus"></i>
      </div>
      <input ref="uploadFile" @change="handleChange()" type="file" accept="image/*" id="edit-file-upload" name="editfile">
    </div>
  </div>
</template>


<script>

export default {

    name: 'EditRestaurant-imageUploader',
    props: {

      image: String,
      error: String,
      uploadFileSucess: String,
    },

    components: {

    },

    data () {
      return {
        currentFile: '',
        isImgInBox: false,
      }
    },

    created () {

    },

    mounted () {

    },

    watch: {

      currentFile: function () {

        const file = this.currentFile;

        this.$emit('fileupload', {

          file,
        });
      },
    },

    methods: {

      handleChange() {

         const file = this.$refs.uploadFile.files[0];

         this.currentFile = file;

      },

      handleDrag(event) {

        // console.log('DRAG');
        this.isImgInBox = true;

        console.log(event.detail);

        // console.log('------------------------');
      },

      handleDrop(event) {

        const file = event.dataTransfer.files[0];

        this.currentFile = file;

        this.isImgInBox = false;

      },

      handleDragLeave(event) {

        // console.log('DRAGLEAVE')
        this.isImgInBox = false;
        console.log(event);

        // console.log('------------------------');
      }
    },
}


</script>



<style lang="scss">
$lightBlue: #45aebf;
$black: #293241;
$blue: #3d5a80;
$offwhite: #e0fbfc;
$red: #ee6c4d;
$gray: #eee;

 .edit-restaurant-image-uploader {

    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;

  }


@media (max-width: 600px) {
  .edit-restaurant-image-uploader {

    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;

  }

  #current-image {
    margin-bottom: 5rem;

  }

}


#edit-file-upload {
  outline: none;
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  top: 0;
  left: 0;
  text-align: center;
  height: 100%;
  width: 100%;
  opacity: 0;

  cursor: pointer;
}

.edit-uploader-overlay {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 7px;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;

  i {
    color: $gray;
    font-size: 3rem;
  }

}

.edit-upload-error {
  width: 50%;
  line-height: 1.6;
  color: $red;
  margin: 0 auto;
  margin-bottom: 1rem;
  text-align: left;
}

.edit-upload-sucess {
  width: 50%;
  line-height: 1.6;
  color: darken($gray, 10);
  margin: 0 auto;
  margin-bottom: 1rem;
}

.edit-uploader-container {
  margin: 0 auto;
}

#current-image {
    border-radius: 7px;
}

.edit-uploader-container {
    position: relative;
    height: 300px;

}

</style>