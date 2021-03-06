<template>
  <md-card id="explore-card">
    <md-card-content>
      <div class="md-layout">
        <div class="md-layout-item" v-if="!processing">
          <i
            class="material-icons close"
            v-on:click="deleteCard"
            v-if="data.status == 'declined'"
            >close</i
          >
          <div>
            <img
              v-bind:src="this.getImg()"
              v-on:click="pushToDetails"
              class="rounded"
              :class="{ 'responsive-image': responsive }"
            />
            <div class="text text-description">
              <div class="listingName" v-on:click="pushToDetails">
                <strong>{{ data["listingName"] }}</strong>
              </div>
              <div class="username">
                <div v-if="!requestView">
                  <small
                    class="text-description"
                    v-on:click="pushToSaviorProfile()"
                    >Savior's Name:</small
                  >
                  <span v-on:click="pushToSaviorProfile()">
                    {{
                      firstName.charAt(0).toUpperCase() +
                        firstName.slice(1).toLowerCase() +
                        " " +
                        lastName.charAt(0).toUpperCase() +
                        lastName.slice(1).toLowerCase()
                    }}<br />
                  </span>
                </div>
                <div v-if="requestView">
                  <small
                    class="text-description"
                    v-on:click="pushToDonorProfile()"
                    >Donor's Name:</small
                  >
                  <span v-on:click="pushToDonorProfile()">
                    {{
                      firstName.charAt(0).toUpperCase() +
                        firstName.slice(1).toLowerCase() +
                        " " +
                        lastName.charAt(0).toUpperCase() +
                        lastName.slice(1).toLowerCase()
                    }}<br />
                  </span>
                </div>
              </div>
              <small class="text-description">Time Requested:</small>
              {{ data["timeRequested"].toString().slice(0, 21) }}<br />
              <div v-if="data.status == 'accepted'" class="contact-info">
                <div v-if="requestView">
                  <small class="text-description">Donor's Number:</small>
                  {{ phoneNumber }}<br />
                  <div v-if="telegramHandle">
                    <small class="text-description">Donor's Telegram:</small>
                    {{ telegramHandle }}<br />
                  </div>
                </div>
                <div v-if="!requestView">
                  <small class="text-description">Savior's Number:</small>
                  {{ phoneNumber }}<br />
                  <div v-if="telegramHandle">
                    <small class="text-description">Savior's Telegram:</small>
                    {{ telegramHandle }}<br />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <md-button
            class="md-success first-button"
            v-on:click="updateStatus('accepted')"
            v-if="data.status == 'pending' && requestView == false"
            >Accept</md-button
          >
          <md-button
            class="md-success"
            v-on:click="updateStatus('declined')"
            v-if="data.status == 'pending' && requestView == false"
            >Decline</md-button
          >
          <badge
            type="success first-button status"
            v-if="data.status == 'accepted'"
            >Accepted</badge
          >
          <md-button
            class="md-warning first-button"
            v-on:click="cancelRequest"
            v-if="data.status == 'pending' && requestView == true"
            >Cancel Request</md-button
          >
          <badge
            type="rose first-button status"
            v-if="data.status == 'declined'"
            >Declined</badge
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
  name: "explore-card",
  data() {
    return {
      imgRef: null,
      firstName: "",
      lastName: "",
      contactNumer: "",
      telegramHandle: "",
      responsive: false,
      processing: true,
      unknown: require("@/assets/img/unknown.jpg")
    };
  },
  props: {
    data: { type: Object },
    requestView: { type: Boolean }
  },
  methods: {
    fetchItems: function() {
      // get image
      var storage = firebase.storage();
      let imgPath = storage.ref(
        this.data.donorID + "/donationImages/" + this.data.foodID
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

      var database = firebase.firestore();

      let id = !this.requestView ? this.data.saviorID : this.data.donorID;
      database
        .collection("users")
        .doc(id)
        .get()
        .then(items => {
          let item = items.data();
          this.firstName = item["firstName"];
          this.lastName = item["lastName"];
          this.phoneNumber = item["phoneNumber"];
          this.telegramHandle = item["telegramHandle"];
          this.processing = false;
        });
    },
    getImg() {
      if (this.imgRef == null) {
        return this.unknown;
      } else {
        return this.imgRef;
      }
    },
    updateStatus(statusMsg) {
      this.processing = true;
      var database = firebase.firestore();
      let donorCollect = "donorRequest/" + this.data.donorID + "/foodDonated";
      let saviorCollect =
        "donorRequest/" + this.data.saviorID + "/foodRequested";

      database
        .collection(donorCollect)
        .doc(this.data.foodID)
        .update({
          status: statusMsg
        });

      database
        .collection(saviorCollect)
        .doc(this.data.foodID)
        .update({
          status: statusMsg
        });

      let newStatus = statusMsg === "accepted" ? "unavailable" : "available";

      database
        .collection("donationData")
        .doc(this.data.foodID)
        .update({
          status: newStatus
        })
        .then(() => {
          this.processing = false;
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

        var donorDoc = database.collection("users").doc(this.data.donorID);
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

        var saviorDoc = database.collection("users").doc(this.data.saviorID);

        saviorDoc.get().then(doc => {
          doc = doc.data();
          requestDates = doc.requestDates;
          request = doc.donationRequested;
          requestDates[date] =
            date in requestDates ? requestDates[date] + 1 : 1;

          requestDates.push(firebase.firestore.Timestamp.now());
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
    cancelRequest() {
      var db = firebase.firestore();

      let collectDonate = "donorRequest/" + this.data.donorID + "/foodDonated";

      db.collection(collectDonate)
        .doc(this.data.foodID)
        .delete();

      let collectRequest =
        "donorRequest/" + this.data.saviorID + "/foodRequested";

      db.collection(collectRequest)
        .doc(this.data.foodID)
        .delete();

      db.collection("donationData")
        .doc(this.data.foodID)
        .update({
          status: "available"
        })
        .then(() => {
          this.$toaster.info(
            "Your request for " + this.data.listingName + " has been cancelled!"
          );
        });
    },
    pushToDetails() {
      let path = `/fooddetail/${this.data.userID}/${this.data.donorID}/${this.data.foodID}`;
      this.$router.push({
        path: path
      });
    },
    deleteCard() {
      var db = firebase.firestore();

      let cardPath = this.requestView
        ? "donorRequest/" + this.data.userID + "/foodRequested"
        : "donorRequest/" + this.data.userID + "/foodDonated";

      db.collection(cardPath)
        .doc(this.data.foodID)
        .delete();
    },
    onResponsiveInverted() {
      if (window.innerWidth < 600) {
        this.responsive = true;
      } else {
        this.responsive = false;
      }
    },
    pushToDonorProfile: function() {
      let path = `/profile/${this.data.donorID}`;
      this.$router.push({
        path: path
      });
    },
    pushToSaviorProfile: function() {
      let path = `/profile/${this.data.saviorID}`;
      this.$router.push({
        path: path
      });
    }
  },
  components: {
    Badge
  },
  mounted() {
    this.onResponsiveInverted();
    this.fetchItems();
    window.addEventListener("resize", this.onResponsiveInverted);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResponsiveInverted);
  }
};
</script>
<style scoped>
.contact-info {
  color: #4caf50;
  font-weight: 500;
}

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
  margin-bottom: 95px !important;
}

img:hover {
  cursor: pointer;
}

.text {
  display: inline-block;
  max-width: 70%;
  padding: 26px 0;
  padding-left: 30px;
}

#explore-card {
  min-width: 430px !important;
  max-width: 450px !important;
}

.status {
  font-size: small;
  padding: 8px 10px;
}

.md-success {
  margin: 0 5px !important;
}

.first-button {
  margin-left: 35px !important;
}

.close {
  float: right;
}

.close:hover {
  color: #f44336;
  cursor: pointer;
}

.username {
  cursor: pointer;
}

.username:hover {
  color: #4caf50;
}

.listing-name:hover {
  color: #4caf50;
  cursor: pointer;
}
</style>
