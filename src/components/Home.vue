<template lang="pug">
  .content-wrapper
    section
      .container
        h1.ui-title-1 Home
        .form-item(:class="{ errorTaskTitle: $v.taskTitle.$error }")
          input(
            type="text"
            placeholder="What we will watch?"
            v-model="taskTitle"
            @keyup.enter="onSubmit"
            :class="{ error: $v.taskTitle.$error }"
            @change="$v.taskTitle.$touch()"
          )
          .error(v-if="!$v.taskTitle.required") Field is required
        textarea(
          type="text"
          v-model="taskDescription"
          @keyup.enter="onSubmit"
        )
        .option-list
          input.what-watch--radio(
            type="radio"
            id="radioFilm"
            value="Film"
            v-model="whatWatch"
          )
          label(
            for="radioFilm"
          ) Film
          input.what-watch--radio(
            type="radio"
            id="radioSerial"
            value="Serial"
            v-model="whatWatch"
          )
          label(
            for="radioSerial"
          ) Serial
        .total-time
          .total-time__film(
            v-if="whatWatch === 'Film'"
          )
            span.time-title Hours
            input.time-input(
              type="number"
              v-model="filmHours"
            )
            span.time-title Minutes
            input.time-input(
              type="number"
              v-model="filmMinutes"
            )
            p {{ filmTime }}

        .total-time
          .total-time__serial(
            v-if="whatWatch === 'Serial'"
          )
            span.time-title How many season?
            input.time-input(
              type="number"
              v-model="serialSeason"
            )
            span.time-title How many series?
            input.time-input(
              type="number"
              v-model="serialSeries"
            )
            span.time-title How long is one series? (minutes)
            input.time-input(
              type="number"
              v-model="serialMinutes"
            )
            p {{ serialTime }}
        .tag-list.tag-list--add
          .ui-tag__wrapper(
            @click="tagMenuShow = !tagMenuShow"
          )
            .ui-tag
              span.tag-title Add new
              span.button-close(
                :class="{ active: !tagMenuShow }"
              )
        .tag-list.tag-list--menu(
          v-if="tagMenuShow"
        )
          input.tag-add--input(
            type="text"
            placeholder="New tag"
            v-model="tagTitle"
            @keyup.enter="newTag"
          )
          .button.button-default(
            @click="newTag"
          ) Send

        .tag-list
          transition-group(
            enter-active-class="animated fadeInRight"
            leave-active-class="animated fadeOutDown"
          )
            .ui-tag__wrapper(
              v-for="tag in tags"
              :key="tag.title"
            )
              .ui-tag(
                @click="addTagUsed(tag)"
                :class="{used: tag.use}"
              )
                span.tag-title {{ tag.title }}
                span.button-close(
                  @click="deleteTag(tag.id)"
                )
        .tag-end
          .button.button-default(
            @click="onSubmit"
          ) Send
</template>

<script>
import { required } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      submitStatus: null,
      taskTitle: '',
      taskDescription: '',
      whatWatch: 'Film',
      filmHours: 1,
      filmMinutes: 30,
      serialSeason: 1,
      serialSeries: 11,
      serialMinutes: 40,
      tagTitle: '',
      tagMenuShow: false,
      tagsUsed: []
    }
  },
  validations: {
    taskTitle: {
      required
    }
  },
  methods: {
    newTag () {
      if (this.tagTitle === '') {
        return
      }
      const tag = {
        title: this.tagTitle,
        use: false
      }
      this.$store.dispatch('newTag', tag)
    },
    addTagUsed (tag) {
      tag.use = !tag.use
      if (tag.use) {
        this.tagsUsed.push({
          title: tag.title
        })
      } else {
        this.tagsUsed.splice(tag.title, 1)
      }
    },
    deleteTag (id) {
      this.$store.dispatch('deleteTag', id)
        .then(() => {
          console.log('tag deleted')
          this.$store.dispatch('loadTags')
        })
    },
    onSubmit () {
      // Initialize Vuelodate
      this.$v.$touch()
      // Invalid
      if (this.$v.$invalid) {
        console.log('ERROR')
        this.submitStatus = 'ERROR'
      // Valid
      } else {
        // Time (What Watch)
        let time
        if (this.whatWatch === 'Film') {
          time = this.filmTime
        } else {
          time = this.serialTime
        }
        // Task
        const task = {
          title: this.taskTitle,
          description: this.taskDescription,
          whatWatch: this.whatWatch,
          time,
          tags: this.tagsUsed,
          completed: false,
          editing: false
        }
        this.$store.dispatch('newTask', task)
          .then(() => {
            this.submitStatus = 'OK'
          })
          .catch(err => {
            this.submitStatus = err.message
          })
        // Reset
        this.taskTitle = ''
        this.taskDescription = ''
        // Reset $v (validate)
        this.$v.$reset()
        // Reset for Tags
        this.tagMenuShow = false
        this.tagsUsed = []
        this.tagTitle = ''
        // Reset tags.use + class used
        for (let i = 0; i < this.tags.length; i++) {
          this.tags[i].use = false
        }
      }
    },
    getHoursandMinutes (minutes) {
      let hours = Math.trunc(minutes / 60)
      let min = minutes % 60
      return hours + ' Hours ' + min + ' Minutes'
    }
  },
  computed: {
    tags () {
      return this.$store.getters.tags
    },
    filmTime () {
      let min = (this.filmHours * 60) + (this.filmMinutes * 1)
      return this.getHoursandMinutes(min)
    },
    serialTime () {
      let min = this.serialSeason * this.serialSeries * this.serialMinutes
      return this.getHoursandMinutes(min)
    }
  }
}
</script>

<style lang="stylus" scoped>
.option-list
  display flex
  .what-watch--radio
    margin-right 12px
  label
    margin-right 20px
    &:last-child
      margin-bottom 0

.total-time
  margin-bottom 20px

.time-title
  display block
  margin-bottom 6px

.time-input
  max-width: 80px
  margin-bottom 10px

//TAGS
.tag-list
  margin-bottom 20px

.ui-tag__wrapper
  margin-right 18px
  margin-bottom 10px
  &:last-child
    margin-right 0

.ui-tag
  .button-close
    &.active
      transform rotate(45deg)
  &.used
    background-color #444ce0
    color #fff
    .button-close
      &:before,
      &:after
        background-color #fff

input
  &.error
    border-color: tomato
    animation shake .6s

.form-item
  .error
    display none
    margin-bottom 8px
    font-size 13px
    color tomato
  &.errorTaskTitle
    .error
      display block

//TAG MENU SHOW
.tag-list--menu
  display flex
  justify-content space-space-between
  align-items center

.tag-add--input
  margin-bottom 0
  margin-right 10px
  height 42px

.tag-end
  display flex
  justify-content flex-end
  .button
    background-color #444ce0
    color: #fff
    border-radius 6px
</style>
