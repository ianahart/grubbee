<template>
  <div class="edit-restaurant-form-container">
    <h1><i class="fas fa-store-alt"></i> Edit Restaurant</h1>
    <div class="edit-flex-row">
    <div v-if="dataIsLoaded" class="edit-image-uploader">
        <h2 class="edit-subtitles"><i class="far fa-image"></i> Change Photo</h2>
      <EditRestaurantImageUploader
        :uploadFileSucess="uploadFileSucess"
        :image="inputFields.imageUpload.imgFile"
        @fileupload="handleCurrentFile"
        :error="inputFields.imageUpload.error"
      />
    </div>
    <form v-if="dataIsLoaded" class="edit-restaurant-form">
      <h2 class="edit-subtitles"><i class="far fa-newspaper"></i> Change Information</h2>

      <EditRestaurantFormInput
          @update="updateFormInputs"
          :inputModel="inputFields.firstName.inputModel"
          :inputType="inputFields.firstName.inputType"
          :inputError="inputFields.firstName.inputError"
          :inputTitle="inputFields.firstName.title"
          :dbName="inputFields.firstName.dbName"
          :objName="inputFields.firstName.objName"

      />
      <EditRestaurantFormInput
          @update="updateFormInputs"
          :inputModel="inputFields.lastName.inputModel"
          :inputType="inputFields.lastName.inputType"
          :inputError="inputFields.lastName.inputError"
          :inputTitle="inputFields.lastName.title"
          :dbName="inputFields.lastName.dbName"
          :objName="inputFields.lastName.objName"

      />
      <EditRestaurantFormInput
          @update="updateFormInputs"
          :inputModel="inputFields.restaurantName.inputModel"
          :inputType="inputFields.restaurantName.inputType"
          :inputError="inputFields.restaurantName.inputError"
          :inputTitle="inputFields.restaurantName.title"
          :dbName="inputFields.restaurantName.dbName"
          :objName="inputFields.restaurantName.objName"

      />
      <EditRestaurantFormInput
          @update="updateFormInputs"
          :inputModel="inputFields.restaurantPhone.inputModel"
          :inputType="inputFields.restaurantPhone.inputType"
          :inputError="inputFields.restaurantPhone.inputError"
          :inputTitle="inputFields.restaurantPhone.title"
          :dbName="inputFields.restaurantPhone.dbName"
          :objName="inputFields.restaurantPhone.objName"

      />
      <EditRestaurantFormInput
          @update="updateFormInputs"
          :inputModel="inputFields.restaurantAddress.inputModel"
          :inputType="inputFields.restaurantAddress.inputType"
          :inputError="inputFields.restaurantAddress.inputError"
          :inputTitle="inputFields.restaurantAddress.title"
          :dbName="inputFields.restaurantAddress.dbName"
          :objName="inputFields.restaurantAddress.objName"

      />
      <EditRestaurantFormInput
          @update="updateFormInputs"
          :inputModel="inputFields.state.inputModel"
          :inputType="inputFields.state.inputType"
          :inputError="inputFields.state.inputError"
          :inputTitle="inputFields.state.title"
          :dbName="inputFields.state.dbName"
          :objName="inputFields.state.objName"

      />
      <EditRestaurantFormInput
          @update="updateFormInputs"
          :inputModel="inputFields.zipCode.inputModel"
          :inputType="inputFields.zipCode.inputType"
          :inputError="inputFields.zipCode.inputError"
          :inputTitle="inputFields.zipCode.title"
          :dbName="inputFields.zipCode.dbName"
          :objName="inputFields.zipCode.objName"

      />

      <div  class="update-restaurant-container">
        <p v-if="formUpdated" class="updated-form-success">Your Changes Have Been Saved!</p>
        <p class="form-submit-error" v-if="formErrorsExist">There are errors present in some fields</p>
        <button @click.prevent="handleUpdate">Update Information</button>
      </div>
    </form>
  </div>
</div>
</template>



<script>
import axios from 'axios';
import { nanoid } from 'nanoid';
import { firebase } from '@firebase/app';

import EditRestaurantFormInput from './EditRestaurantFormInput.vue';
import EditRestaurantImageUploader from './EditRestaurantImageUploader.vue';



  export default {

    name: 'EditRestaurantForm',

    props: {
      currentUserId: String,
    },

    components: {

      EditRestaurantFormInput,
      EditRestaurantImageUploader,
    },

    data () {

      return {
        restaurantId: null,
        uploadFileSucess: '',
        formUpdated: false,
        dataIsLoaded: false,
        timerID: '',
        fileReader: new FileReader(),
        formErrorsExist: false,
        serverErrorsExist: false,
        inputFields: {

          imageUpload: {
            dbName: 'image_url',
            imgFile: '',
            fileName: '',
            error: '',
            fileType: '',
          },
          firstName: {
            title: 'Make changes to your first name',
            inputModel: '',
            inputType: 'text',
            inputError: '',
            dbName: 'firstName',
            objName: 'firstName',
          },
          lastName: {
            title: 'Make changes to your last name',
            inputModel: '',
            inputType: 'text',
            inputError: '',
            dbName: 'lastName',
            objName: 'lastName',
          },
          restaurantName: {
            title: 'Make changes to your restaurant\'s name',
            inputModel: '',
            inputType: 'text',
            inputError: '',
            dbName: 'name',
            objName: 'restaurantName',
          },
          restaurantPhone: {
            title: 'Make changes to your restaurant\'s phone number',
            inputModel: '',
            inputType: 'text',
            inputError: '',
            dbName: 'phone',
            objName: 'restaurantPhone',
          },
          restaurantAddress: {
            title: 'Make changes to your restaurant\'s address',
            inputModel: '',
            inputType: 'text',
            inputError: '',
            dbName: 'address',
            objName: 'restaurantAddress',
          },
          state: {
            title: 'Make changes to your restaurant\'s state',
            inputModel: '',
            inputType: 'text',
            inputError: '',
            dbName: 'state',
            objName: 'state',
          },
          zipCode: {
            title: 'Make changes to your restaurant\'s zip code',
            inputModel: '',
            inputType: 'text',
            inputError: '',
            dbName: 'zip_code',
            objName: 'zipCode',
          },
        }
      }
    },

    async created () {

      await this.getRestaurantInformation();
    },

    mounted () {
    },

    beforeDestroy () {

      clearTimeout(this.timerID);
    },


    methods: {

      async  handleCurrentFile ({ file }) {


        if (file) {

          this.inputFields.imageUpload.error = '';

          this.uploadFileSucess = '';

          if(file.size > 2000000) {

            this.inputFields.imageUpload.error = 'Please use an image that is less than 2MB';

            return;
          }

          await this.createBase64Img(file);
        }
      },

      async createBase64Img (fileObj) {

        this.inputFields.imageUpload.fileName = fileObj.name;

        this.inputFields.imageUpload.fileType = fileObj.type;

        this.fileReader.onload = async (e) => {

          this.inputFields.imageUpload.file = e.target.result;

          await this.uploadImageFile();
        }

        this.fileReader.readAsDataURL(fileObj);
      },

      async uploadImageFile() {

      const idToken = await firebase
      .auth()
      .currentUser
      .getIdToken(true);

        let response;

        const url = process.env.VUE_APP_UPLOAD_FILE;

        try {

           const file =  this.inputFields.imageUpload.file;

          response = await axios(
            {
            method: 'POST',
            url,
            headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json',
               Authorization: `Bearer ${idToken}`


            },
            data: {

               base64EncodedImg:file,
               restaurantId: this.restaurantId,
               fileName: `${nanoid()}-${this.inputFields.imageUpload.fileName}`,
               fileType: this.inputFields.imageUpload.fileType,
            }
           }
          );

          const { data } =  response;

          if (data) {

            if (data.body.UR !== null && data.body.error === null) {

              this.inputFields.imageUpload.imgFile = data.body.URL;

              this.uploadFileSucess = 'Your restaurant photo has been updated';

              this.timerID = setTimeout(
                () => {
                 this.uploadFileSucess = '';

              }, 2500);

            } else if (data.body.URL === null && data.body.error !== null) {

              this.inputFields.imageUpload.error = data.body.error;

            }
          }

        } catch (err) {

          console.log(`Error: ${err}`);

          console.log(`Error Message: ${err.message}`);
        }
      },

      async getRestaurantInformation () {

        let response;

      const idToken = await firebase
      .auth()
      .currentUser
      .getIdToken(true);

        const FIREBASE_FUNCTION_URL = process.env.VUE_APP_GET_RESTAURANT_INFORMATION;

        try {

          response = await axios(
            {
              method: 'POST',
              url: FIREBASE_FUNCTION_URL,
              headers: {

                'Content-Type': 'application/json',
                 Accept: 'application/json',
                 Authorization: `Bearer ${idToken}`

              },
              data: {
                currentUserId: this.currentUserId,
              }
            }
          );

          const { body } = response.data;

          if (body.restaurant.data === null && !body.restaurant.exists) {

          if (!body.isAdmin) {

            this.$router.back();
          } else{

            return;
          }

          } else {

            const { data }  = body.restaurant;

            this.populateFormInputs(data);

            this.dataIsLoaded = true;
          }

        } catch (err) {

          console.log(err, err.message);
        }
      },

      checkIfInputEmpty ({ inputModel }) {

        let str = inputModel.replace(/[^\w.-]+/g, "");

        return str.length > 0 ? true: false;
      },

      updateFormInputs ({ inputChange }) {

       const inputText = this.checkIfInputEmpty(inputChange);

       if (!inputText) {

         this.inputFields[inputChange.objName]['inputError'] = 'Field cannot be empty';

       } else {

         this.inputFields[inputChange.objName]['inputError'] = '';
       }

        for (let field in this.inputFields) {

              if (this.inputFields[field]['dbName'] === inputChange.dbName) {

                 this.inputFields[field]['inputModel'] = inputChange.inputModel.trim();
              }
        }
      },

      populateFormInputs (data) {

          this.restaurantId = data['id'];

          this.inputFields.imageUpload.imgFile = data['image_url'];

          for (let field in this.inputFields) {

            for (let prop in this.inputFields[field]) {

              if (prop === 'dbName') {

                  const fieldName = this.inputFields[field][prop];

                  this.inputFields[field]['inputModel'] = data[fieldName];
              }
            }
          }
      },

      constructUpdateObj(formData) {

        for (let obj in formData) {

          for (let prop in formData[obj]) {

            const allowedFormKeys = ['inputModel', 'dbName'];

            if (!allowedFormKeys.includes(prop)) {

              delete formData[obj][prop];

            }
           }
          }

        const updateObj = {};

        for (let fieldName in formData) {

          if (fieldName !== 'imageUpload') {

            const dbName =   formData[fieldName]['dbName'];

            updateObj[dbName] = this.formatInformation(formData[fieldName]['inputModel']);
          }
        }

        const update = {updateObj, formData};

        return update;
      },

      checkForErrors () {

        for (let field in this.inputFields) {

          for (let property in this.inputFields[field]) {

              if (property === 'inputError') {

                 const error = this.inputFields[field][property];

                 if (error.length > 0 && !this.serverErrorsExist) {

                    this.formErrorsExist = true;
                 }
              }
          }
        }
      },

      async sendRequest(url, data) {

        let response;

        const idToken = await firebase
        .auth()
        .currentUser
        .getIdToken(true);

        try {

          response = await axios(
            {
              method: 'POST',
              url,
              headers: {

                'Content-Type': 'application/json',
                'Accept':       'application/json',
                 Authorization: `Bearer ${idToken}`
              },
              data: {
                updateObj: data.updateObj,
                formData: data.formData,
                currentUserId: this.currentUserId,
              },
            }
          );

          return response;

        } catch (err) {

          console.log(err.message);
          console.log(err);
        }
      },

      updateFormErrors(errorObj) {

          for (let field in errorObj) {

            for (let property in errorObj[field]) {

                if (property === 'inputError') {

                  const formError = errorObj[field][property];

                  this.inputFields[field][property] = formError;


                }
            }
          }
      },

      formatInformation(fieldInput) {

          const formatted = fieldInput
          .split(' ')
          .map(
            (text) => {

             return text.toUpperCase().slice(0, 1) + text.toLowerCase().slice(1);
            }
          )
          .join(' ');

          return formatted;
      },

      async handleUpdate () {

          const url = process.env.VUE_APP_VALIDATE_FORM_DATA;

          this.formErrorsExist = false;

          this.serverErrorsExist = false;

          this.formUpdated = false;

          const form = JSON.parse(JSON.stringify(this.inputFields));

          this.checkForErrors();

          if (this.formErrorsExist === false) {

            const data = this.constructUpdateObj(form);

           const response = await this.sendRequest(url, data);

           if (response.data.body.statusCode === 200) {

              this.formUpdated = true;
           } else if (response.data.body.statusCode === 400) {

                const errors = response.data.body.errors;

                this.formUpdated = false;

                this.updateFormErrors(errors);

                this.serverErrorsExist = true;
           }

          } else {

            return;
          }
      },
    }
  }
</script>


<style lang="scss">
$lightBlue: #45aebf;
$black: #293241;
$blue: #3d5a80;
$offwhite: #e0fbfc;
$red: #ee6c4d;
$gray: #eee;

.edit-restaurant-form-container {
    box-sizing: border-box;
    border: 1px solid lighten($gray, 1);
    padding: 1.5rem;
    margin: 0 auto;
    margin-bottom: 5rem;
    margin-top: 2.5rem;
    border-radius: 7px;
    width: 95%;
    background-color: darken(white, 4);
    color: lighten($black, 10);

    h1 {
      font-weight: 100;
      text-align: center;
      color: $black;

      i {
        color: $lightBlue;
      }
    }

}

.edit-flex-row {
    display: flex;
    margin: 0 auto;
    margin-top: 4rem;
    justify-content: space-evenly;
}

.edit-subtitles {
  text-align: center;
  font-weight: 400;
  i {
    color: $lightBlue;
  }
}

.form-submit-error {
  font-size: 0.8rem;
  color: $red;
}

.updated-form-success {
  font-size: 0.8rem;
  color: lighten(green, 5);
}

.edit-restaurant-form {
  width: 50%;
}

.edit-restaurant-input-group {
    width: 100%;
}

.edit-image-uploader {
  img {
    width:300px;
    height: 300px;
  }
}

.update-restaurant-container {

  margin-top: 3rem;
  text-align: right;

  button {
    height: 40px;
    width: 50%;
    background-color: $lightBlue;
    color: white;
    transition: all 0.5s ease-out;
    border: none;
    border-radius: 7px;
    cursor: pointer;

    &:hover {
      background-color: darken($lightBlue, 10);
    }
  }
}

@media (max-width: 600px) {
  .edit-flex-row {
    flex-direction: column;
    justify-content: center;
  }
  .update-restaurant-container {
    text-align: center;
  }

  .edit-restaurant-form-container {
    width: 100%;
  }

  .edit-restaurant-form {
    width: 100%;
  }
}

</style>