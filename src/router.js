import Vue from "vue";
import Router from "vue-router";
import firebase from "firebase";
import Landing from "./views/Landing.vue";
import Login from "./views/Login.vue";
import SignUp from "./views/SignUp.vue";
import Profile from "./views/Profile.vue";
import ResetPassword from "./views/ResetPassword.vue";
import MainNavbar from "./layout/MainNavbar.vue";
import MainFooter from "./layout/MainFooter.vue";
import ExploreListing from "./views/ExploreListing.vue";
import RequestListing from "./views/RequestListing.vue";
import CreateAccount from "./views/CreateAccount.vue";
import CreateListing from "./views/CreateListing.vue";
import FoodDetail from "./views/FoodDetail.vue";
import ModifyAccount from "./views/ModifyAccount.vue";
import ModifyListing from "./views/ModifyListing.vue";

Vue.use(Router);

let router = new Router({
  routes: [
    {
      path: "/",
      name: "landing",
      components: {
        default: Landing,
        header: MainNavbar,
        footer: MainFooter
      },
      props: {
        header: { colorOnScroll: 5 },
        footer: { backgroundColor: "black" }
      }
    },
    {
      path: "/login",
      name: "login",
      components: {
        default: Login,
        header: MainNavbar,
        footer: MainFooter
      },
      props: {
        header: { colorOnScroll: 400 }
      }
    },
    {
      path: "/resetpassword",
      name: "resetpassword",
      components: {
        default: ResetPassword,
        header: MainNavbar,
        footer: MainFooter
      },
      props: {
        header: { colorOnScroll: 400 }
      }
    },
    {
      path: "/signup",
      name: "signup",
      components: {
        default: SignUp,
        header: MainNavbar,
        footer: MainFooter
      },
      props: {
        header: { colorOnScroll: 400 }
      }
    },
    {
      path: "/createaccount",
      name: "createaccount",
      components: {
        default: CreateAccount,
        header: MainNavbar,
        footer: MainFooter
      },
      props: {
        header: { colorOnScroll: 400 }
      }
    },
    {
      path: "/modifyaccount",
      name: "modifyaccount",
      components: {
        default: ModifyAccount,
        header: MainNavbar,
        footer: MainFooter
      },
      props: {
        header: { colorOnScroll: 400 }
      }
    },
    {
      path: "/profile/:userID",
      name: "profile",
      components: {
        default: Profile,
        header: MainNavbar,
        footer: MainFooter
      },
      meta: {
        authRequired: true
      },
      props: {
        header: { colorOnScroll: 200 },
        footer: { backgroundColor: "black" },
        default: true
      }
    },
    {
      path: "/createlisting",
      name: "createlisting",
      components: {
        default: CreateListing,
        header: MainNavbar,
        footer: MainFooter
      },
      props: {
        header: { colorOnScroll: 400 }
      }
    },
    {
      path: "/modifylisting/:listingID",
      name: "modifylisting",
      components: {
        default: ModifyListing,
        header: MainNavbar,
        footer: MainFooter
      },
      props: {
        header: { colorOnScroll: 400 },
        default: true
      }
    },
    {
      path: "/explorelisting/:user",
      name: "explorelisting",
      components: {
        default: ExploreListing,
        header: MainNavbar,
        footer: MainFooter
      },
      props: {
        header: { colorOnScroll: 5 },
        footer: { backgroundColor: "black" },
        default: true
      }
    },
    {
      path: "/requestlisting/:userID",
      name: "requestlisting",
      components: {
        default: RequestListing,
        header: MainNavbar,
        footer: MainFooter
      },
      props: {
        header: { colorOnScroll: 5 },
        footer: { backgroundColor: "black" },
        default: true
      }
    },
    {
      path: "/fooddetail/:userID/:donorID/:foodID",
      name: "fooddetail",
      components: {
        default: FoodDetail,
        header: MainNavbar,
        footer: MainFooter
      },
      props: {
        header: { colorOnScroll: 5 },
        footer: { backgroundColor: "black" },
        default: true
      }
    }
  ],
  scrollBehavior: to => {
    if (to.hash) {
      return { selector: to.hash };
    } else {
      return { x: 0, y: 0 };
    }
  }
});

router.beforeEach((to, from, next) => {
  if (to.name == "profile" && from.name == "profile") {
    next();
    location.reload();
  }
  if (to.name == "profile" && from.name == null) {
    next();
  } else if (to.matched.some(record => record.meta.authRequired)) {
    if (!firebase.auth().currentUser) {
      alert("Access Denied. Please Login In.");
      next({
        path: "/"
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
