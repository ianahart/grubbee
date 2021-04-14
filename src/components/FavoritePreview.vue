<template>
  <div class="favorite-preview-container">
    <div
        @click="showFavoritesPreview"
        class="preview-trigger-container"
    >
      <h1 class="preview-trigger">Favorites <span>({{this.totalNumFavorites}})</span></h1>
      <img src="../assets/chevron-down.png" />
    </div>
    <transition name="fade-favorites">
      <div v-if="isPreviewOpen" class="preview-favorites">
        <div class="preview-favorite" v-for="favorite in favorites" v-bind:key="favorite.randomKey">
          <div class="preview-header">
            <p><i class="fas fa-star"></i> {{ favorite.avg_rating }}</p>
            <h3>{{ favorite.name }}</h3>
          </div>
          <div class="image-preview-container">
            <img :src="favorite.image_url" :alt="favorite.name" />
          </div>
        </div>
        <div class="view-more-favorites">
          <!-- REPLACE WITH ROUTER-LINK -->
          <router-link :to="{name: 'Favorites'}"><i class="far fa-eye eye"></i> See All</router-link>
        </div>
      </div>
    </transition>
  </div>
</template>



<script>

import { firebase } from '@firebase/app';
import { v4 as uuidv4 } from 'uuid';

  export default {
    name: 'FavoritePreview',
    props: {
      currentUserId: String,

    },
    data() {
      return {

        isPreviewOpen:     false,
        db:                firebase.firestore(),
        favorites:         [],
        totalNumFavorites: null
      }
    },

    mounted() {

      this.getTotalFavorites();


    },

    methods: {
      showFavoritesPreview() {

        this.isPreviewOpen = !this.isPreviewOpen;

        if (this.isPreviewOpen) {

          if (this.favorites.length <= 0) {

               this.fetchFavorites();
          }
        }
      },

      getTotalFavorites () {

        this.db.collection('favorites')
        .where('userId', '==', this.currentUserId)
        .get()
        .then(
          (querySnapshot) => {

          this.totalNumFavorites = querySnapshot.docs.length;
         }
        );
      },

      fetchFavorites() {

        this.db.collection('favorites')
          .where('userId', '==', this.currentUserId)
          .orderBy('name')
          .startAt(0)
          .limit(2)
          .get()
          .then(
            (querySnapshot) => {

              querySnapshot.forEach((doc) => {

                this.favorites.push(
                  {
                    name:       doc.data().name,
                    avg_rating: doc.data().avg_rating,
                    image_url:  doc.data().image_url,
                    randomKey:  uuidv4(),
                  }
                );
              });
        })
      }
    }
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

.fade-favorites-enter-active, .fade-favorites-leave-active {

  transition: all 0.5s ease;
}

.fade-favorites-enter, .fade-favorites-leave-to {
  opacity: 0;
}

//****END TRANSITIONS****/


.view-more-favorites {
  padding: 0.5rem;
  text-align: center;
  a {
    color: $lightBlue;
    text-decoration: none;
  }
  .eye {
    color: darken($lightBlue, 12);
  }
}

.favorite-preview-container {
  width: 100%;
  margin-left: 1rem;
}

.preview-trigger-container {
  border: 1px solid $gray;
  border-radius: 0.25rem;

  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  img {
    margin-left: 0.3rem;
  }
}

.preview-header {
  display: flex;
  justify-content: center;


  h3 {
    font-size:1rem;
  }
}

.preview-favorite {
  border-bottom: 1px solid $gray;
}

.preview-favorites {
  border: 1px solid $gray;
  p {
    display: flex;
    align-items: center;
    margin-right: 0.5rem;
  }
  i {
    color: orange;
  }
}

.image-preview-container {
  text-align: center;
  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
}

.preview-trigger {
  margin: 0;
  color: $blue;
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    font-size: 1.3rem;
    color: $lightBlue;
    display: block;
    margin: 0 0.5rem;
  }
}

@media (max-width: 1200px) {
  .favorite-preview-container {
    margin: 0 auto;
  }
}
</style>