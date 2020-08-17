// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Uimini from 'uimini/dist/css/uimini.css'

import App from './App'
import router from './router'
import store from './store'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/messaging'
import 'firebase/storage'

Vue.config.productionTip = false
Vue.use(
  Vuelidate,
  Uimini
)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created () {
    // Initialize Firebase
    var config = {
      apiKey: 'AIzaSyBgZe6-QE04sReFIRC7imRlilhoPsDBHY4',
      authDomain: 'film-library-416bf.firebaseapp.com',
      databaseURL: 'https://film-library-416bf.firebaseio.com',
      projectId: 'film-library-416bf',
      storageBucket: 'film-library-416bf.appspot.com',
      messagingSenderId: '448176473335'
    }
    firebase.initializeApp(config)
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch('loggedUser', user)
      }
      this.$store.dispatch('loadTasks')
    })
  }
})
