<template>
  <div class="wrapper">
    <parallax class="section header-filter" :style="headerStyle"> </parallax>
    <div class="main main-raised">
      <div class="section">
        <div class="container">
          <div class="md-layout">
            <div class="md-layout-item md-size-80 md-xsmall-size-100 mx-auto">
              <h2 class="text-center title">
                Create a New Listing
              </h2>
              <div
                class="md-layout-item md-medium-size-33 md-small-size-100 mx-auto"
              >
                <div class="info text-center" style="padding: 0px 0 30px">
                  <h4
                    class="info-title"
                    style="font-size: 20px; text-align: center"
                  >
                    Add an image for your listing!
                  </h4>
                  <div class="icon icon-info text-center">
                    <img
                      v-bind:src="this.getImage"
                      @error="onImageLoadFailure()"
                      class="img-raised rounded img-fluid"
                      style="width: 50%"
                    />
                    <br /><br />
                    <input
                      class="text-center"
                      id="listingpic"
                      type="file"
                      v-on:change="onFileChange"
                    />
                  </div>
                </div>
              </div>

              <form class="contact-form">
                <div class="md-layout">
                  <div class="md-layout-item md-size-50">
                    <md-field>
                      <label>Listing Name</label>
                      <md-input
                        v-model="listingName"
                        type="text"
                        required
                      ></md-input>
                    </md-field>
                  </div>

                  <div class="md-layout-item md-size-50">
                    <md-field>
                      <label>Quantity Available</label>
                      <md-input
                        v-model="quantity"
                        type="text"
                        required
                      ></md-input>
                    </md-field>
                  </div>
                  <div class="md-layout-item md-size-50">
                    <md-field>
                      <label>Expiry Date & Time</label>
                      <md-input
                        v-model="expiry"
                        type="text"
                        required=""
                        onfocus="this.type='datetime-local'"
                        onblur="if(this.value==='')this.type='text'"
                      ></md-input>
                    </md-field>
                  </div>

                  <div class="md-layout-item md-size-50">
                    <md-field>
                      <label>Collection Location</label>
                      <md-select
                        class="dropdown"
                        v-model="collectionLocation"
                        multiple
                        required
                      >
                        <md-option value="Central">Central</md-option>
                        <md-option value="East">East</md-option>
                        <md-option value="North">North</md-option>
                        <md-option value="South">South</md-option>
                        <md-option value="West">West</md-option>
                      </md-select>
                    </md-field>
                  </div>

                  <div class="md-layout-item md-size-50">
                    <md-field>
                      <label>Phone Number</label>
                      <md-input
                        v-model="phoneNumber"
                        type="number"
                        required
                        :min="0"
                      ></md-input>
                    </md-field>
                  </div>

                  <div class="md-layout-item md-size-50">
                    <md-field>
                      <label>Telegram Handle</label>
                      <md-input v-model="telegramHandle" type="text"></md-input>
                    </md-field>
                  </div>

                  <div class="md-layout-item md-size-50">
                    <md-field>
                      <label>Dietary Restriction(s)</label>
                      <md-select v-model="dietaryRestrictions" multiple>
                        <md-option value="Halal">Halal</md-option>
                        <md-option value="Vegetarian">Vegetarian</md-option>
                        <md-option value="Vegan">Vegan</md-option>
                        <md-option value="Contains Dairy"
                          >Contains Dairy</md-option
                        >
                        <md-option value="Contains Peanuts"
                          >Contains Peanuts</md-option
                        >
                        <md-option value="Contains Shellfish"
                          >Contains Shellfish</md-option
                        >
                        <md-option value="Others">Others</md-option>
                      </md-select>
                    </md-field>
                  </div>

                  <div class="md-layout-item md-size-50">
                    <md-field>
                      <label>Food Category</label>
                      <md-select v-model="foodCategory" required multiple>
                        <md-option value="Bento Boxes">Bento Boxes</md-option>
                        <md-option value="Canned Food">Canned Food</md-option>
                        <md-option value="Dairy">Dairy</md-option>
                        <md-option value="Drinks">Drinks</md-option>
                        <md-option value="Proteins">Proteins</md-option>
                        <md-option value="Carbohydrates"
                          >Carbohydrates</md-option
                        >
                        <md-option value="Vegetables and Fruits"
                          >Vegetables/Fruits</md-option
                        >
                        <md-option value="Snacks">Snacks</md-option>
                        <md-option value="Others">Others</md-option>
                      </md-select>
                    </md-field>
                  </div>
                </div>

                <md-field maxlength="5">
                  <label>Remarks</label>
                  <md-textarea
                    v-model="remarks"
                    md-autogrow
                    required
                  ></md-textarea>
                </md-field>

                <div class="md-layout">
                  <div class="md-layout-item md-size-33 mx-auto text-center">
                    <md-button
                      class="md-success"
                      v-on:click="checkRequiredFields"
                      >Create Listing</md-button
                    >
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";

var database = firebase.firestore();

export default {
  bodyClass: "landing-page",
  props: {
    header: {
      type: String,
      default: require("@/assets/img/food4.jpg")
    }
  },
  data() {
    return {
      UID: null,
      listingName: null,
      quantity: null,
      expiry: null,
      collectionLocation: null,
      phoneNumber: null,
      telegramHandle: null,
      dietaryRestrictions: null,
      foodCategory: null,
      remarks: null,
      file: null,
      currID: null,
      allIDs: null,
      datePosted: new Date(),
      listingPic: require("@/assets/img/unknown.jpg"),
      imgErr: false,
      unknown: require("@/assets/img/unknown.jpg"),
      siteStatistics: null
    };
  },
  computed: {
    headerStyle() {
      return {
        backgroundImage: `url(${this.header})`
      };
    },
    getImage() {
      if (this.imgErr) {
        return this.unknown;
      } else {
        return this.listingPic;
      }
    }
  },
  methods: {
    getUID: function() {
      this.UID = firebase.auth().currentUser.uid;
    },
    getAllIDs: function() {
      database
        .collection("donationIDs")
        .doc(this.UID)
        .get()
        .then(doc => {
          this.allIDs = doc.data().imageIDs;
        });
    },
    createListing: function() {
      if (this.checkExpiry(this.expiry)) {
        alert("Your food has expired, please key in a valid expiry date.");
      } else {
        database
          .collection("donationData")
          .add({
            listingName: this.listingName,
            quantity: this.quantity,
            expiry: this.expiry,
            collectionLocation: this.collectionLocation,
            phoneNumber: this.phoneNumber,
            telegramHandle: this.telegramHandle,
            dietaryRestrictions: this.dietaryRestrictions,
            remarks: this.remarks,
            datePosted: this.datePosted,
            userID: this.UID,
            status: "available",
            foodCategory: this.foodCategory
          })
          .then(doc => {
            this.currID = doc.id;
            this.allIDs.push(this.currID);
            this.updateImageIDs();
            this.pushListingImage();
          });
      }
    },
    // when file changes, create image on site
    onFileChange: function(e) {
      this.file = e.target.files[0];
      var reader = new FileReader();
      reader.onload = ev => {
        this.listingPic = ev.target.result;
      };
      reader.readAsDataURL(this.file);
    },
    // when create listing button pressed, push listing image to firebase storage
    pushListingImage: function() {
      var storageRef = firebase
        .storage()
        .ref(this.UID + "/donationImages/" + this.currID);
      storageRef.put(this.file).then(() => {
        alert("Your listing has been created!");
        this.updateSiteStatistics();
        this.pushToProfile();
      });
    },
    updateImageIDs: function() {
      database
        .collection("donationIDs")
        .doc(this.UID)
        .update({
          imageIDs: this.allIDs
        });
    },
    checkExpiry: function(expiryDate) {
      var today = new Date();
      var yy = parseInt(expiryDate.slice(0, 4));
      var mm = parseInt(expiryDate.slice(5, 7)) - 1;
      var dd = parseInt(expiryDate.slice(8, 10));
      var hh = parseInt(expiryDate.slice(11, 13));
      var min = parseInt(expiryDate.slice(14, 16));
      var expiry = new Date(yy, mm, dd, hh, min);
      this.expiry = expiry;
      return expiry < today;
    },
    onImageLoadFailure() {
      this.imgErr = true;
    },
    checkPath() {
      window.onpopstate = event => {
        if (
          this.$route.path == "/login" ||
          this.$route.path == "/createaccount"
        ) {
          let path = `/createlisting`;
          this.$router.push({
            path: path
          });
        }
      };
    },
    checkRequiredFields() {
      if (this.file == null) {
        alert("Please upload an image of your listing");
      } else if (this.listingName == "") {
        alert("Please enter a name for your listing");
      } else if (this.quantity == "") {
        alert("Please enter a quantity for your listing");
      } else if (this.expiry == "") {
        alert("Please enter an expiry date for your listing");
      } else if (this.collectionLocation == "") {
        alert("Please enter a collection location for your listing");
      } else if (
        this.phoneNumber == "" ||
        this.phoneNumber.toString().length != 8
      ) {
        alert("Please enter a valid phone number for your listing");
      } else if (this.foodCategory == "") {
        alert("Please enter a food category for your listing");
      } else if (this.remarks == null) {
        alert("Please enter some remarks about your listing");
      } else {
        this.createListing();
      }
    },
    pushToProfile() {
      let path = `/profile/${this.UID}`;
      this.$router.push({
        path: path
      });
    },
    getSiteStatistics() {
      database
        .collection("overallData")
        .doc("website")
        .get()
        .then(doc => {
          var data = doc.data();
          this.siteStatistics = data["numListings"];
        });
    },
    updateSiteStatistics() {
      this.foodCategory.forEach(cat => {
        this.siteStatistics[cat] += 1;
      });
      database
        .collection("overallData")
        .doc("website")
        .update({
          numListings: this.siteStatistics
        });
    }
  },
  created() {
    this.getUID();
    this.getAllIDs();
    this.getSiteStatistics();
  },
  mounted() {
    this.checkPath();
  }
};
</script>

<style lang="scss" scoped>
.md-card-actions.text-center {
  display: flex;
  justify-content: center !important;
}

.contact-form {
  margin-top: 30px;
}

.md-has-textarea + .md-layout {
  margin-top: 15px;
}

.md-select {
  .md-option {
    font-size: 10px;
  }
}
</style>
