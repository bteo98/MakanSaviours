<template>
  <div class="wrapper" style="min-width: 780px;">
    <parallax class="section header-filter" :style="headerStyle"> </parallax>
    <div class="main main-raised" style="min-width: 720px;">
      <div class="section">
        <div class="container">
          <div>
            <div>
              <div class="title">
                <h3>Food Information</h3>
              </div>
              <div>
                <div class="md-layout md-small-size-100">
                  <div v-if="!processing">
                    <img
                      v-bind:src="this.getImg()"
                      class="rounded md-layout-item"
                      :class="{
                        'responsive-image': responsive
                      }"
                    />
                    <div class="text md-layout-item text-description">
                      <h4>
                        <strong>{{ data["listingName"] }}</strong>
                      </h4>
                      <div v-if="isDonor && donorStatus != null">
                        <div v-on:click="userProfile" class="username">
                          <small class="text-description"
                            >Savior's Name:
                          </small>
                          {{
                            data["firstName"].charAt(0).toUpperCase() +
                              data["firstName"].slice(1).toLowerCase() +
                              " " +
                              data["lastName"].charAt(0).toUpperCase() +
                              data["lastName"].slice(1).toLowerCase()
                          }}<br />
                        </div>
                      </div>
                      <div v-if="!isDonor || (isDonor && donorStatus == null)">
                        <div v-on:click="userProfile" class="username">
                          <small class="text-description">Donor's Name: </small>
                          {{
                            data["firstName"].charAt(0).toUpperCase() +
                              data["firstName"].slice(1).toLowerCase() +
                              " " +
                              data["lastName"].charAt(0).toUpperCase() +
                              data["lastName"].slice(1).toLowerCase()
                          }}<br />
                        </div>
                      </div>
                      <small class="text-description"
                        >Collection Location:</small
                      >
                      {{ data["location"].join(", ") }}<br />
                      <small class="text-description"
                        >Quantity Available:</small
                      >
                      {{ data["quantity"] }}<br />
                      <small class="text-description">Expiry Date/Time:</small>
                      {{ data["expiry"].toString().slice(0, 21) }}<br />
                      <div
                        v-if="
                          !isAvailable &&
                            (userRequest == 'accepted' ||
                              (donorStatus == 'accepted' && isDonor))
                        "
                        class="contact-info"
                      >
                        <div v-if="!isDonor">
                          <small class="text-description"
                            >Donor's Number:</small
                          >
                          {{ data["phoneNumber"] }}<br />
                          <div v-if="data['telegramHandle']">
                            <small class="text-description"
                              >Donor's Telegram:</small
                            >
                            {{ data["telegramHandle"] }}<br />
                          </div>
                        </div>
                        <div v-if="isDonor">
                          <small class="text-description"
                            >Savior's Number:</small
                          >
                          {{ data["phoneNumber"] }}<br />
                          <div v-if="data['telegramHandle']">
                            <small class="text-description"
                              >Savior's Telegram:</small
                            >
                            {{ data["telegramHandle"] }}<br />
                          </div>
                        </div>
                      </div>
                      <md-button
                        class="md-success first-button"
                        v-if="isAvailable && !expired && !isDonor"
                        v-on:click="request"
                        >Request</md-button
                      >
                      <md-button
                        class="md-success"
                        v-if="isAvailable && !expired && !isDonor"
                        v-on:click="saveFood"
                        >bookmark</md-button
                      >
                      <md-button
                        class="md-success first-button"
                        v-if="!expired && isDonor && donorStatus == 'pending'"
                        v-on:click="updateStatus('accepted')"
                        >accept</md-button
                      >
                      <md-button
                        class="md-success"
                        v-if="!expired && isDonor && donorStatus == 'pending'"
                        v-on:click="updateStatus('declined')"
                        >decline</md-button
                      >
                      <badge
                        type="rose first-button status"
                        v-if="
                          !isAvailable &&
                            userRequest == null &&
                            !expired &&
                            !isDonor
                        "
                        >unavailable</badge
                      >
                      <badge
                        type="success first-button status"
                        v-if="
                          !isAvailable &&
                            !expired &&
                            (userRequest == 'accepted' ||
                              (donorStatus == 'accepted' && isDonor))
                        "
                        >accepted</badge
                      >
                      <badge
                        type="rose first-button status"
                        v-if="
                          !isAvailable &&
                            !expired &&
                            (userRequest == 'declined' ||
                              (donorStatus == 'declined' && isDonor))
                        "
                        >declined</badge
                      >
                      <md-button
                        class="md-warning first-button cancel-status"
                        v-if="
                          !isAvailable &&
                            !expired &&
                            userRequest === 'pending' &&
                            !isDonor
                        "
                        v-on:click="cancelRequest"
                        >Cancel Request</md-button
                      >
                      <badge
                        type="rose first-button status"
                        v-if="isAvailable && expired"
                        >expired</badge
                      >
                    </div>
                    <div
                      class="text md-layout-item diet-restriction text-description"
                    >
                      <h4 style="font-size: 20px; padding-left: 5%">
                        Dietary Restrictions
                      </h4>
                      <ul
                        v-if="
                          !processing && data.dietaryRestrictions.length > 0
                        "
                        class="md-layout"
                        id="restriction-list"
                      >
                        <li
                          class="md-layout md-layout-item"
                          v-for="(restriction,
                          index) in data.dietaryRestrictions"
                          :key="index"
                        >
                          <div
                            class="md-layout-item"
                            style="padding-bottom: 10px;"
                          >
                            <badge
                              class="restriction-badge"
                              type="info restrict"
                              >{{ restriction }}</badge
                            >
                          </div>
                        </li>
                      </ul>
                      <badge
                        class="restriction-badge"
                        type="info restrict"
                        v-if="data.dietaryRestrictions.length == 0"
                        style="margin-left: 10px;"
                        >None</badge
                      >
                    </div>
                  </div>
                </div>
              </div>
              <div class="details">
                <div class="subtitle">
                  <h4 style="font-size: 25px;">Details</h4>
                </div>
                <p class="text-description">
                  {{ data.remarks }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br /><br /><br />
    </div>
  </div>
</template>

<script>
import firebase from "../firebase.js";
import { Badge } from "@/components";

export default {
  bodyClass: "food-detail",
  data() {
    return {
      data: {},
      isAvailable: false,
      userRequest: null,
      processing: true,
      isDonor: false,
      saviorID: null,
      donorStatus: null,
      imgRef: null,
      expired: false,
      header: require("@/assets/img/food4.jpg"),
      unknown: require("@/assets/img/unknown.jpg")
    };
  },
  props: {
    userID: { type: String },
    donorID: { type: String },
    foodID: { type: String }
  },
  components: {
    Badge
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
        return this.data["imgRef"];
      }
    }
  },
  methods: {
    fetchImgData(storage) {
      var storage = firebase.storage();
      let imgPath = storage.ref(
        this.donorID + "/donationImages/" + this.foodID
      );

      imgPath
        .getDownloadURL()
        .then(url => {
          this.imgRef = url;
        })
        .catch(error => {
          switch (error.code) {
            case "storage/object-not-found":
              // File doesn't exist
              break;
          }
        });
    },
    getImg() {
      if (this.imgRef == null) {
        return this.unknown;
      } else {
        return this.imgRef;
      }
    },
    fetchUserData(db) {
      db.collection("users")
        .doc(this.donorID)
        .get()
        .then(items => {
          let item = items.data();

          this.data["firstName"] = item["firstName"];
          this.data["lastName"] = item["lastName"];
          this.data["phoneNumber"] = item["phoneNumber"];
          this.data["telegramHandle"] = item["telegramHandle"];
          this.processing = false;
        });
    },
    fetchFoodData: function(db) {
      db.collection("donationData")
        .doc(this.foodID)
        .onSnapshot(doc => {
          doc = doc.data();

          this.data["listingName"] = doc.listingName;
          this.data["status"] = doc.status;
          this.data["expiry"] = new Date(
            doc.expiry.toDate().toLocaleString("en-US")
          );
          this.data["donorID"] = doc.userID;
          this.data["quantity"] = doc.quantity;
          this.data["location"] = doc.collectionLocation; // array
          this.data["dietaryRestrictions"] = doc.dietaryRestrictions; // array
          this.data["remarks"] = doc.remarks;
          this.data["foodCategory"] = doc.foodCategory;
          this.isAvailable = doc.status == "available" ? true : false;
          this.isDonor = this.data.donorID == this.userID ? true : false;
          this.expired =
            new Date(doc.expiry.toDate().toLocaleString("en-US")) <= new Date();

          if (!this.isAvailable && !this.isDonor) {
            let collectRequest =
              "donorRequest/" + this.userID + "/foodRequested";

            db.collection(collectRequest)
              .doc(this.foodID)
              .onSnapshot(snapshot => {
                this.userRequest = snapshot.data().status;
              });
          } else if (!this.isAvailable && this.isDonor) {
            let collectDonate = "donorRequest/" + this.userID + "/foodDonated";
            db.collection(collectDonate)
              .doc(this.foodID)
              .onSnapshot(snapshot => {
                this.processing = true;
                var data = snapshot.data();

                this.donorStatus = data.status;
                this.saviorID = data.saviorID;

                db.collection("users")
                  .doc(this.saviorID)
                  .get()
                  .then(items => {
                    let item = items.data();

                    this.data["firstName"] = item["firstName"];
                    this.data["lastName"] = item["lastName"];
                    this.data["phoneNumber"] = item["phoneNumber"];
                    this.data["telegramHandle"] = item["telegramHandle"];

                    this.processing = false;
                  });
              });
          }
        });
    },
    updateStatus(statusMsg) {
      var database = firebase.firestore();
      let donorCollect = "donorRequest/" + this.donorID + "/foodDonated";
      let saviorCollect = "donorRequest/" + this.saviorID + "/foodRequested";

      database
        .collection(donorCollect)
        .doc(this.foodID)
        .update({
          status: statusMsg
        });

      database
        .collection(saviorCollect)
        .doc(this.foodID)
        .update({
          status: statusMsg
        });

      let newStatus = statusMsg == "accepted" ? "unavailable" : "available";

      database
        .collection("donationData")
        .doc(this.foodID)
        .update({
          status: newStatus
        });

      if (statusMsg == "accepted") {
        let made = null;
        let donorDates = null;
        let requestDates = null;
        let request = null;
        let date = firebase.firestore.Timestamp.now();
        date = new Date(date.toDate().toLocaleString("en-US"));
        date = date.toString();
        date = date.slice(4, 8) + " " + date.slice(11, 15);

        var donorDoc = database.collection("users").doc(this.donorID);
        donorDoc.get().then(doc => {
          doc = doc.data();
          donorDates = doc.donationDates;
          made = doc.donationMade;
          donorDates[date] = date in donorDates ? donorDates[date] + 1 : 1;

          this.data.foodCategory.forEach(cat => {
            made[cat] += 1;
          });

          donorDoc.update({
            donationDates: donorDates,
            donationMade: made
          });
        });

        var saviorDoc = database.collection("users").doc(this.saviorID);

        saviorDoc.get().then(doc => {
          doc = doc.data();
          requestDates = doc.requestDates;
          request = doc.donationRequested;

          requestDates[date] =
            date in requestDates ? requestDates[date] + 1 : 1;
          this.data.foodCategory.forEach(cat => {
            request[cat] += 1;
          });

          saviorDoc.update({
            donationRequested: request,
            requestDates: requestDates
          });
        });
      }
    },
    saveFood() {
      let collectSave = "donorRequest/" + this.userID + "/foodSaved";
      var db = firebase.firestore();

      db.collection(collectSave)
        .doc(this.foodID)
        .set({
          listingName: this.data.listingName,
          donorID: this.data.donorID,
          quantity: this.data.quantity,
          location: this.data.location,
          status: this.data.status,
          expiry: this.data.expiry,
          foodCategory: this.data.foodCategory
        })
        .then(() => {
          this.$toaster.info(this.data.listingName + " has been bookmarked!");
        });
    },
    cancelRequest() {
      var db = firebase.firestore();

      let collectDonate = "donorRequest/" + this.donorID + "/foodDonated";

      db.collection(collectDonate)
        .doc(this.foodID)
        .delete();

      let collectRequest = "donorRequest/" + this.userID + "/foodRequested";

      db.collection(collectRequest)
        .doc(this.foodID)
        .delete();

      db.collection("donationData")
        .doc(this.foodID)
        .update({
          status: "available"
        })
        .then(() => {
          this.$toaster.info(
            "Your request for " + this.data.listingName + " has been cancelled!"
          );
        });
    },
    request() {
      var db = firebase.firestore();

      let collectDonate = "donorRequest/" + this.donorID + "/foodDonated";

      db.collection(collectDonate)
        .doc(this.foodID)
        .set({
          listingName: this.data.listingName,
          saviorID: this.userID,
          status: "pending",
          timeRequested: firebase.firestore.Timestamp.now(),
          foodCategory: this.data.foodCategory
        });

      let collectRequest = "donorRequest/" + this.userID + "/foodRequested";

      db.collection(collectRequest)
        .doc(this.foodID)
        .set({
          listingName: this.data.listingName,
          donorID: this.data.donorID,
          status: "pending",
          timeRequested: firebase.firestore.Timestamp.now(),
          foodCategory: this.data.foodCategory
        });

      let saveRequest = "donorRequest/" + this.userID + "/foodSaved";

      db.collection(saveRequest)
        .doc(this.foodID)
        .delete();

      db.collection("donationData")
        .doc(this.foodID)
        .update({
          status: "unavailable"
        });
    },
    onResponsiveInverted() {
      if (window.innerWidth < 600) {
        this.responsive = true;
      } else {
        this.responsive = false;
      }
    },
    userProfile() {
      let path = `/profile/${this.donorID}`;
      this.$router.push({
        path: path
      });
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
          let path = `/fooddetail/${this.donorID}/${this.foodID}`;
          this.$router.push({
            path: path
          });
        }
      };
    }
  },
  mounted() {
    var db = firebase.firestore();
    var storage = firebase.storage();

    this.onResponsiveInverted();
    this.fetchImgData(storage);
    var self = this;
    setTimeout(function() {
      self.fetchFoodData(db);
      self.fetchUserData(db);
    }, 500);
    this.checkPath();
    window.addEventListener("resize", this.onResponsiveInverted);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResponsiveInverted);
  }
};
</script>

<style lang="scss" scoped>
.container {
  padding-left: 50px;
}

.username {
  cursor: pointer;
}

.username:hover {
  color: #4caf50;
}

.contact-info {
  color: #47a44b;
  font-weight: 500;
}

.text-description {
  font-size: 17px;
  float: left;
}

img {
  display: inline-block;
  min-width: 200px;
  max-width: 25% !important;
  float: left;
  padding-top: 25px;
}

small {
  padding-right: 10px;
}

.text {
  display: inline-block;
  max-width: 70%;
  padding: 26px 0;
  padding-left: 50px;
}

#explore-card {
  max-width: 500px !important;
  min-width: 450px !important;
  font-size: 15px;
}

.cancel-status {
  margin-top: 40px;
  font-size: 15px;
}

.status {
  font-size: 15px;
  padding: 10px 12px;
  margin-top: 40px;
}

.restrict {
  font-size: 14px;
  padding: 8px 12px;
}

.md-success {
  margin-top: 40px;
  margin-right: 40px !important;
}

#restriction-list {
  padding-left: 0;
}

.diet-restriction {
  max-width: 24%;
}

.details {
  padding-top: 40px;
}

.restriction-badge {
  width: 180px;
}
</style>
