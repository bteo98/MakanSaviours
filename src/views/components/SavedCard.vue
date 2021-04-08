<template>
  <md-card id="explore-card">
    <md-card-content>
      <div class="md-layout">
        <div class="md-layout-item">
          <i class="material-icons close" v-on:click="deleteSaved">close</i>
          <div>
            <img
              v-bind:src="imgRef"
              v-bind:alt="data['foodName']"
              v-on:click="pushToDetails"
              class="rounded"
              :class="{ 'responsive-image': responsive }"
            />
            <div class="text text-description">
              <small class="text-description">Food Description:</small>
              {{ data["foodName"] }}<br />
              <small class="text-description">Donor Name:</small>
              {{
                firstName.charAt(0).toUpperCase() +
                  firstName.slice(1).toLowerCase() +
                  " " +
                  lastName.charAt(0).toUpperCase() +
                  lastName.slice(1).toLowerCase()
              }}<br />
              <small class="text-description">Collection Locaction:</small>
              {{ data["location"].join(", ") }}<br />
              <small class="text-description">Quantity:</small>
              {{ data["quantity"] }}<br />
            </div>
          </div>
          <md-button
            class="md-success first-button"
            v-if="isAvailable && !expired"
            v-on:click="request"
            >Request</md-button
          >
          <badge type="rose first-button status" v-if="isAvailable && expired"
            >expired</badge
          >
          <badge type="rose first-button status" v-if="!isAvailable && !expired"
            >unavailable</badge
          >
        </div>
      </div>
    </md-card-content>
  </md-card>
</template>

<script>
import firebase from "../../firebase";
import { Badge } from "@/components";

export default {
  name: "saved-card",
  data() {
    return {
      imgRef: "",
      firstName: "",
      lastName: "",
      expired: false,
      isAvailable: false,
      responsive: false
    };
  },
  props: {
    data: { type: Object }
  },
  methods: {
    fetchItems: function() {
      // get image
      var storage = firebase.storage();
      let imgPath = storage.ref(
        this.data.donorID + "/donationImages/" + this.data.foodID
      );

      imgPath.getDownloadURL().then(url => {
        this.imgRef = url;
      });

      var database = firebase.firestore();

      // get user info
      database
        .collection("users")
        .doc(this.data.saviorID)
        .get()
        .then(items => {
          let item = items.data();

          this.firstName = item["firstName"];
          this.lastName = item["lastName"];
        });

      this.expired =
        new Date(this.data.expiry.toDate().toLocaleString("en-US")) <=
        new Date();
      this.isAvailable = this.data.status == "available" ? true : false;

      console.log(this.data);
      console.log(this.expired);
      console.log(this.isAvailable);
    },
    onResponsiveInverted() {
      if (window.innerWidth < 600) {
        this.responsive = true;
      } else {
        this.responsive = false;
      }
    },
    request() {
      var db = firebase.firestore();

      let collectDonate = "donorRequest/" + this.data.donorID + "/foodDonated";

      db.collection(collectDonate)
        .doc(this.data.foodID)
        .set({
          listingName: this.data.foodName,
          saviorID: this.data.saviorID,
          status: "pending",
          timeRequested: firebase.firestore.Timestamp.now()
        });

      let collectRequest =
        "donorRequest/" + this.data.saviorID + "/foodRequested";

      db.collection(collectRequest)
        .doc(this.data.foodID)
        .set({
          listingName: this.data.foodName,
          donorID: this.data.donorID,
          status: "pending",
          timeRequested: firebase.firestore.Timestamp.now()
        });

      let saveRequest = "donorRequest/" + this.data.saviorID + "/foodSaved";

      db.collection(saveRequest)
        .doc(this.data.foodID)
        .delete();

      db.collection("donationData")
        .doc(this.foodID)
        .update({
          status: "unavailable"
        });
    },
    pushToDetails() {
      let path = `fooddetail/${this.data.donorID}/${this.data.foodID}`;
      this.$router.push({
        path: path
      });
    },
    deleteSaved() {
      var db = firebase.firestore();

      let saveRequest = "donorRequest/" + this.data.saviorID + "/foodSaved";
      console.log(saveRequest);
      db.collection(saveRequest)
        .doc(this.data.foodID)
        .delete();
    }
  },
  components: {
    Badge
  },
  mounted() {
    this.fetchItems();
    this.onResponsiveInverted();
    window.addEventListener("resize", this.onResponsiveInverted);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResponsiveInverted);
  }
};
</script>
<style scoped>
.text-description {
  font-size: 15px !important;
}

small,
div {
  font-size: medium;
}

img {
  display: inline-block;
  min-width: 95px;
  width: 20% !important;
  float: left;
  padding-top: 45px;
}

.text {
  display: inline-block;
  max-width: 70%;
  padding: 26px 0;
  padding-left: 30px;
}

#explore-card {
  width: 450px !important;
}

.status {
  font-size: small;
  padding: 8px 10px;
}

.md-success {
  margin: 0 5px !important;
}

.first-button {
  margin-left: 125px !important;
}

.close {
  float: right;
}

.close:hover {
  color: #f44336;
  cursor: pointer;
}
</style>