import Vue from 'vue'
import Vuex from 'vuex'
import task from './task'
import tags from './tags'
import user from './user'
import common from './common'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    common,
    user,
    task,
    tags
  }
})
