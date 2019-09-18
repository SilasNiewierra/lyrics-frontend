<template>
  <div class='img-banner'>
    <div class='content'>
      <!-- App title -->
      <p class='title'>LYRICS</p>
      <!-- Introduction text -->
      <p class='intro-text'>Always wondering which words are used most in a specific song?
        Wondering which words your favorite artist uses the most?
      Just enter a track title or artist name and find out.</p>
      <!-- Start button -->
      <el-button round class='start-button' @click='onLogin'>Start</el-button>
    </div>
  </div>
</template>

<script>
import { bus } from '../main'

export default {
  name: 'Hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      image: '../assets/bg_placeholder.png'
    }
  },
  methods: {
    onLogin () {
      bus.$emit('navigate', 'Analyze')
      this.$router.push({name: 'Analyze'})
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Abril+Fatface&display=swap');
h1, h2 {
  font-weight: normal;
}
.img-banner{
  height: 100%;
  background-image: url('../assets/background-start.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

}
.content{
  width: 20vw;
  margin-left: 5vw;
  margin-top: 20vh;
}
.intro-text{
  text-align: left;
}
.title{
  font-family: 'Abril Fatface', cursive;
  font-size: 5em;
  margin-bottom: 0em;
}
.start-button:hover{
  background-color: var(--accent-color);
  color: var(--main-bg-color);
  border: 2px solid var(--accent-color);
}
.start-button{
  color: var(--accent-color);
  border: 2px solid var(--accent-color);
  background-color: inherit;
}
</style>
