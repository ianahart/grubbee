<template>
  <div class="add-restaurant-form">
    <div class="add-restaurant-top-form-border"></div>
    <div class="add-restaurant-top-form-icon">
      <transition name="fade-continue-msg">
        <p v-if="isFormTopFilled && !isContinueMessageShowing">Click pen to continue<i class="fas fa-arrow-alt-circle-right arrow-icon"></i></p>
      </transition>
        <div @click=" `${isFormTopFilled  ? handleFirstStepForm() : ''}`" class="add-restaurant-top-form-btn">
            <i v-if="!isContinueClicked" class="fas fa-pen"></i>
            <i v-if="isContinueClicked" class="fas fa-times"></i>
        </div>
    </div>
    <form @submit.prevent="handleAddRestaurantSubmit">
      <div class="add-restaurant-form-fields">
          <div class="add-first-name-group i-group">
            <label>
              First Name:
          </label>
          <input @keyup="checkFormTopFilled " type="text" v-model="form.firstName"/>
          <AddRestaurantFieldError
            v-if="formErrors.firstName"
            :formFieldError="formErrors.firstName"
          />
          </div>
          <div class="add-last-name-group i-group">
            <label>
              Last Name:
          </label>
          <input @keyup="checkFormTopFilled"  type="text" v-model="form.lastName"/>
          <AddRestaurantFieldError
             v-if="formErrors.lastName"
             :formFieldError="formErrors.lastName"
           />
          </div>
          <div class="add-email-group i-group">
            <label>
              Your Email:
            </label>
            <input @keyup=" checkFormTopFilled"  type="email" v-model="form.email"/>
            <AddRestaurantFieldError
             v-if="formErrors.email"
             :formFieldError="formErrors.email"
           />
            <AddRestaurantFieldError />
        </div>
        <transition name="slide-bottom-form">
          <div  v-if="isFormTopFilled && isContinueMessageShowing" class="restaurant-form-information">
               <AddRestaurantFormField
                  styles="add-restaurant-name-group"
                  label="Restaurant Name:"
                  inputType="text"
                  inputField="restaurantName"
                  :error="formErrors.restaurantName"
                  @change="validateCurrentField"
                  @current="setCurrentField"
               />

                <AddRestaurantFormField
                  styles="add-restaurant-phone-group"
                  label="Restaurant Phone Number:"
                  inputType="text"
                  inputField="restaurantPhone"
                  :error="formErrors.restaurantPhone"
                  @change="validateCurrentField"
                  @current="setCurrentField"
               />
              <div class="add-restaurant-location-information">
                <div class="add-restaurant-col-1">

                  <AddRestaurantFormField
                    styles="add-restaurant-address i-group"
                    label="Address:"
                    inputType="text"
                    inputField="address"
                    :error="formErrors.address"
                    @change="validateCurrentField"
                    @current="setCurrentField"
                  />

                  <AddRestaurantFormField
                    styles="add-restaurant-city-group i-group"
                    label="City:"
                    inputType="text"
                    inputField="city"
                    :error="formErrors.city"
                    @change="validateCurrentField"
                    @current="setCurrentField"
                  />
              </div>
              <div class="add-restaurant-col-2">
                  <AddRestaurantFormField
                  styles="add-restaurant-state-group i-group"
                  label="State:"
                  inputType="text"
                  inputField="state"
                  :error="formErrors.state"
                  @change="validateCurrentField"
                  @current="setCurrentField"
                />
                <AddRestaurantFormField
                  styles="add-restaurant-zip-group i-group"
                  label="Zip Code:"
                  inputType="text"
                  inputField="zip"
                  :error="formErrors.zip"
                  @change="validateCurrentField"
                  @current="setCurrentField"
                />
              </div>
            </div>
              <AddRestaurantImageUpload
                @upload="handleImageUpload"
                @cancelupload="handleCancelUpload"
                :error="file.imageError"
                @dismissError="clearError"
              />
              <div class="add-restaurant-submit-btn-container">
                <p v-if="submitFormError" class="submit-form-error">{{ submitFormError }}</p>
                <button><i class="fas fa-credit-card"></i> Continue To Payment</button>
            </div>
          </div>
       </transition>
      </div>
    </form>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import {firebase} from '@firebase/app';
import 'firebase/storage';

import AddRestaurantFormField from './AddRestaurantFormField';
import AddRestaurantFieldError from './AddRestaurantFieldError';
import AddRestaurantImageUpload from './AddRestaurantImageUpload';

  export default {

    name: 'AddRestaurantForm',

    props: {

    },

    components: {

      AddRestaurantFormField,
      AddRestaurantFieldError,
      AddRestaurantImageUpload,
    },

    data () {

      return {
        db: firebase.firestore(),
        storage: firebase.storage(),
        fileReader: new FileReader(),
        file: {
          fileName: '',
          base64Img: '',
          fileID: '',
          imageURL: '',
          imageError: '',
        },
        errorsExist: null,
        currentField: '',
        inputFocused: false,
        form: {
          firstName: '',
          lastName: '',
          email: '',
          restaurantName: '',
          restaurantPhone: '',
          address: '',
          state: '',
          city: '',
          zip: '',
        },
        formErrors :
          {
            firstName: '',
            lastName: '',
            email: '',
            restaurantName: '',
            restaurantPhone: '',
            address: '',
            state: '',
            city: '',
            zip: '',
          },
        restaurantID: uuidv4(),
        submitFormError: '',
        isFormTopFilled: false,
        isBottomFormShowing: false,
        isContinueClicked: false,
        isContinueMessageShowing: false,
      }
    },

    created() {

    },

    mounted() {
      this.capitalizeFirstLetter('the dog is back in town');
    },

    beforeDestroy() {

      this.fileReader.removeEventListener('load', this.handleImageProcessing);
    },

    methods: {

      clearError () {

        this.file.imageError = '';
      },


      handleImageProcessing () {

        this.file.base64Img = this.fileReader.result;

        const imageRef = this.storage.ref().child(this.file.fileName);


        imageRef
        .putString(this.file.base64Img, 'data_url')
        .then(
          () => {

         this.retrieveImageURL();
        })
        .catch(
          (error) => {

            if (error) {

              this.file.imageError = 'Trouble uploading. Please try again.';
            }
        });
      },

      retrieveImageURL() {

      this.storage
        .ref()
        .child(this.file.fileName)
        .getDownloadURL()
        .then(
          (url) => {

            this.file.imageURL = url;
          });
      },

      handleCancelUpload ({ bool }) {

        if (bool) {

          const fileRef = this.storage.ref().child(this.file.fileName);

          fileRef
          .delete()
          .then(
            () => {

            for (let prop in this.file) {

              this.file[prop] = '';
            }

            this.restaurantID = '';

          })
          .catch(
            (error) => {

              if (error) {

                this.file.imageError = 'Something went wrong. Please try again.';
              }
            });
        }
      },


      handleImageUpload ({ file }) {

        const allowedFileTypes = [
                  "image/apng",
                  "image/bmp",
                  "image/gif",
                  "image/jpeg",
                  "image/pjpeg",
                  "image/png",
                  "image/svg+xml",
                  "image/tiff",
                  "image/webp",
                  "image/x-icon"
        ]
        if (file[0].size < 1500000 && allowedFileTypes.includes(file[0].type)) {

          this.fileReader.readAsDataURL(file[0]);

          this.file.fileName = file[0].name;

          this.file.fileID = Math.random().toString().split('.')[1];

          this.file.fileName = this.file.fileID + '-' + this.file.fileName;

          this.fileReader.addEventListener('load', this.handleImageProcessing);

        } else {

          if (!allowedFileTypes.includes(file[0].type)) {

             this.file.imageError = 'Please make sure the file is of an image type';
          }  else {

             this.file.imageError = 'Please use an image less than 1.5MB';
          }
        }



      },

      setCurrentField(payload) {

        this.currentField = payload.name;
      },


      checkFormTopFilled () {

        if (this.form.firstName.length
            &&
            this.form.lastName.length
            && this.validateEmail()
         ) {
          this.isFormTopFilled = true;

          this.clearFormFieldErrors({firstName: this.formErrors.firstName, lastName:this.formErrors.lastName});
        } else {

          this.isFormTopFilled = false;
        }
      },

       handleFirstStepForm () {

         this.validateTopForm();

        this.isContinueClicked = !this.isContinueClicked;

          if (this.isContinueClicked && this.formErrors.firstName === '' && this.formErrors.lastName === '') {

             this.isFormTopFilled = true;

             this.isContinueMessageShowing = true;
          } else {

              this.isFormTopFilled = true;

              this.isContinueMessageShowing = false;
          }
      },

      validateEmail () {

        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (regex.test(String(this.form.email).toLowerCase())) {

          return true;
        }

          return false;
     },

     validateTopForm () {

       const nameRegex =  /^[a-z][a-z\s]*$/;

       this.validateNameFields(this.form.firstName, nameRegex, 'firstName');

       this.validateNameFields(this.form.lastName, nameRegex, 'lastName');

     },

    validateNameFields (field, regex, fieldError) {

    if (field.length > 30) {

      this.formErrors[fieldError] = 'Please do not exceed thirty characters for names';
    } else if (!regex.test(String(field).toLowerCase())) {

      this.formErrors[fieldError] = 'Please use only letters and spaces';
    }
  },

   validateCurrentField({ input }) {

        const regex = {

           stringRegex: /^[\w\s.-]+$/i,

           lettersOnlyRegex: /^[\w\s.-]+$/i,

           numberRegex: /^[0-9-]+$/
        }

        if (input.name === 'restaurantName') {

          this.form.restaurantName = input.value;

          this.initValidationFormBottom(this.form.restaurantName, regex.stringRegex, 'restaurantName');
        } else if (input.name === 'restaurantPhone') {

          this.form.restaurantPhone = input.value;

          this.initValidationFormBottom(this.form.restaurantPhone, regex.numberRegex, 'restaurantPhone');
        } else if (input.name === 'address') {

          this.form.address = input.value;

          this.initValidationFormBottom(this.form.address, regex.stringRegex, 'address');

        } else if (input.name === 'city') {

          this.form.city = input.value;

          this.initValidationFormBottom(this.form.city, regex.stringRegex, 'city');
        } else if (input.name === 'state') {

          this.form.state = input.value;

          this.initValidationFormBottom(this.form.state, regex.lettersOnlyRegex, 'state');
        } else if (input.name === 'zip') {

          this.form.zip = input.value;

          this.initValidationFormBottom(this.form.zip, regex.numberRegex, 'zip');
        }
      },

     initValidationFormBottom (fieldValue, regex, fieldName) {


        if (fieldName === 'restaurantName') {

          if (fieldValue.length === 0) {

             this.formErrors[fieldName] = 'Restaurant Name cannot be empty'

          } else if (fieldValue.length > 40) {

            this.formErrors[fieldName] = 'Please do not exceed forty characters for restaurant name';
          } else if(!regex.test(String(fieldValue).toLowerCase())) {

            this.formErrors[fieldName] = 'Please do not use special characters other than underscores';
          } else {

            this.formErrors[fieldName] = '';
          }
        }

        if (fieldName === 'restaurantPhone') {

           if (fieldValue.length === 0) {

             this.formErrors[fieldName] = 'Restaurant Phone cannot be empty'
           }
          else if (fieldValue.length > 14) {

            this.formErrors[fieldName] = 'Phone number cannot exceed fourteen characters';
          } else if (!regex.test(String(fieldValue))) {

            this.formErrors[fieldName] = 'Phone number can only include numbers and hyphens';
          } else

          this.formErrors[fieldName] = '';
       }

       if (fieldName === 'address') {

         if (fieldValue.length === 0) {

           this.formErrors[fieldName] = 'Address cannot be empty';
         } else if (fieldValue.length > 100) {

           this.formErrors[fieldName] = 'Address cannot exceed forty characters';
         } else if (!regex.test(String(fieldValue).toLowerCase())) {

           this.formErrors[fieldName] = 'Please do not use special characters other than underscores';
         } else {

          this.formErrors[fieldName] = '';
         }
       }

       if (fieldName === 'city') {

         if (fieldValue.length === 0) {

           this.formErrors[fieldName] = 'City cannot be empty';
         } else if (fieldValue.length > 40) {

           this.formErrors[fieldName] = 'City cannot exceed forty characters';
         } else if (!regex.test(String(fieldValue).toLowerCase())) {

           this.formErrors[fieldName] = 'Please do not use special characters other than underscores';
         } else {

            this.formErrors[fieldName] = '';
         }
       }

       if (fieldName === 'state') {

         if (fieldValue.length === 0) {

           this.formErrors[fieldName] = 'State cannot be empty';
         } else if (fieldValue.length > 2) {

           this.formErrors[fieldName] = 'Please use the abbreviation for the state';
         } else if (!regex.test(String(fieldValue)) || fieldValue.toUpperCase() !== fieldValue) {

           this.formErrors[fieldName] = 'Please do not use numbers and make sure to capitalize your abbreviation';
         } else {

            this.formErrors[fieldName] = '';
         }
       }

       if (fieldName === 'zip') {

         if (fieldValue.length === 0) {

           this.formErrors[fieldName] = 'Zip code cannot be empty';
         } else if (fieldValue.length > 10) {

           this.formErrors[fieldName] = 'Zip code cannot exceed 10 numbers';
         } else if (!regex.test(String(fieldValue))) {

           this.formErrors[fieldName] = 'Please use only numbers and hyphens (optional)';
         } else {

           this.formErrors[fieldName] = '';
         }
       }

     },

     capitalizeFirstLetter (string) {

       const formattedString = string.
       split(' ')
       .map(
         (word) => {
         return word.charAt(0).toUpperCase() + word.slice(1);
       });

      return formattedString.join(' ').trim();
     },

      addRestaurantToPending () {

        const document = {
           id: this.restaurantID,
           createdAt:  firebase.firestore.Timestamp.fromDate(new Date()),
           firstName: this.capitalizeFirstLetter(this.form.firstName),
           lastName: this.capitalizeFirstLetter(this.form.lastName),
           email: this.form.email.trim(),
           name: this.capitalizeFirstLetter(this.form.restaurantName),
           phone: this.form.restaurantPhone.trim(),
           image_url: this.file.imageURL,
           image_file_name: this.file.fileName,
           address: this.capitalizeFirstLetter(this.form.address),
           state: this.form.state.trim(),
           city: this.capitalizeFirstLetter(this.form.city),
           zip_code: this.form.zip.trim(),
           reviews: [],
           search: this.form.restaurantName.toLowerCase(),
        }

        this.db.collection('pending_restaurants')
        .add(document)
        .then(
          () => {

            this.$router.push({name: 'RestaurantPayment', query: {pending: this.restaurantID}});
        })
        .catch(
          (err) => {
          console.log('Add Restaurant Error: ', err);
        });



      },

     handleAddRestaurantSubmit () {

        this.validateTopForm();

        let someFieldsEmpty;

        for (let field in this.form) {

          if (!this.form[field]) {

            someFieldsEmpty = true;
          }
        }

        if(!this.checkForExistingErrors() && !someFieldsEmpty && this.file.imageURL) {

           this.addRestaurantToPending();

        } else {

          this.submitFormError = 'Please make sure the entire form is filled out';

          setTimeout(() => {

            this.submitFormError = '';

          }, 3000);
        }
     },

     clearFormFieldErrors (errors) {

        for(const property in errors) {

          this.formErrors[property] = '';
        }
     },

     checkForExistingErrors () {

     const errorsExist = Object.values(this.formErrors).some(
          (error) => {

              if (error === null || error === '') {

                  return false;
              } else {

                return true;
              }
        });

        return errorsExist;
    },

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
.fade-continue-msg-enter-active, .fade-continue-msg-leave-active {
  transition: all 0.5s;
}


.fade-continue-msg-enter, .fade-continue-msg-leave-to {
  opacity: 0;
  transform:translateX(-100px);
}



.fade-underline-enter-active, .fade-underline-leave-active {
  transition: all 0.5s;
  width: 50%;

}


.fade-underline-enter, .fade-underline-leave-to {
  opacity: 0;
  width: 0%;
  transform:translateY(-100px);
}

.slide-bottom-form-enter-active, .slide-bottom-form-leave-active {
  transition: all 0.5s;
  width: 50%;

}


.slide-bottom-form-enter, .slide-bottom-form-leave-to {
  opacity: 0;
  width: 0%;
  transform:translateY(-100px);
}
//****TRANSITIONS****/

.add-restaurant-form {

  height: 100%;
  form {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}

.add-restaurant-top-form-border {
  height:10px;
  background-color: lighten($lightBlue, 10);
  width: 100%;
}

.add-restaurant-top-form-icon {
  text-align: right;
  display: flex;
  justify-content: flex-end;
  cursor: pointer;

  p {
    display: flex;
    justify-content: center;
    align-items: center;
    font-style: italic;
  }

  .arrow-icon {
    height: 15px;
    width: 15px;
    background-color: transparent;
    color: darken($gray, 15);
    padding: 0 1rem;
    &:hover {
      background-color: transparent;
    }



  }
  i {
    color: #fff;
    height: 30px;
    width: 30px;
    padding: 1rem;
    font-size: 1.5rem;
    background-color: lighten($lightBlue, 10);
    transition: all 0.5s ease-in-out;
    &:hover {
      background-color: $lightBlue;
    }
  }

}

.submit-form-error {
  color: $red;
  font-size: 0.85rem;
}

.add-restaurant-form-fields {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
 }

 .i-group {
   display: flex;
   flex-direction: column;
   width: 70%;
   height: 100%;
   margin: 1rem auto;

  label {
    text-align: left;
    margin-bottom: 0.2rem;
    color: $lightBlue;
  }

  input {
    height: 30px;
     border-radius: 11px;
    border: none;
    border: 1px solid darken($gray,3);
    outline: none;
  }
 }


 .restaurant-form-information {
    margin-top: 5rem;
    margin-bottom: 2rem;
    text-align: center;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
 }

 .add-restaurant-phone-group {
   display: flex;
   flex-direction: column;
   width: 70%;
   margin: 1rem auto;
 }

 .add-restaurant-name-group,
 .add-restaurant-phone-group {
   display: flex;
   flex-direction: column;
   width: 70%;
   margin: 1rem auto;

   label {
     text-align: left;
     margin-bottom: 0.2rem;
     color: $lightBlue;
   }
   input {
     height: 30px;
    border-radius: 11px;
    border: none;
    border: 1px solid darken($gray,3);
    outline: none;
   }
 }

 .add-restaurant-location-information {
   width: 100%;
   display: flex;
   justify-content: space-evenly;
   margin-top: 2rem;
   margin: 0 auto;
 }

 .add-restaurant-col-1 {
   display: flex;
   flex-direction: column;
   width: 60%;
   height: 100%;
   input {
    width: 100%;
    border-radius: 11px;
    border: none;
    border: 1px solid black;
    outline: none;
   }

 }

.add-restaurant-col-2 {
   display: flex;
   flex-direction: column;
   justify-content: flex-start;
   align-items: flex-start;
   width: 20%;
   height: 100%;
}

.add-restaurant-address {
  display: flex;
  flex-direction: column;
}

.add-restaurant-city {
  margin: 0;
}

  .add-restaurant-city-group {
    width: 100%;

    input {

        border: 1px solid darken($gray,3);
        outline: none;
    }

 }

 .add-restaurant-address {
    width: 100%;

    input {

      border: 1px solid darken($gray,3);
      outline: none;
    }
 }

 .add-restaurant-submit-btn-container {
   margin-top: 2rem;
   i {
     color: #fff;
   }
   button {
     border: none;
     transition: all 0.5s ease-in-out;
     cursor: pointer;
     background-color: darken($lightBlue, 10);
     height: 30px;
     border-radius: 0.5rem;
     padding: 0.3rem 0.5rem;
     color: $offwhite;

     &:hover {
       background-color: $lightBlue;
     }

   }
 }


@media(max-width: 800px) {

  .add-restaurant-location-information {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .add-restaurant-col-2 {
    width: 40%;
  }

  .add-restaurant-col-1 {
    width: 70%;
  }

  .add-restaurant-city-group {
    width: 100%;

 }

 .add-restaurant-address {
    width: 100%;
 }
}

</style>