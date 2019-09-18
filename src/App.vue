<template>
  <div id='app'>
    <el-container class='full-screen'>
      <!-- Loading overlay -->
      <loading :active.sync='isLoading'
        :is-full-page=true></loading>
      <!-- Navigation header -->
      <el-header>
        <el-menu
          :default-active='activeIndex'
          class='el-menu-demo'
          mode='horizontal'
          :router='true'
          @select='handleSelect'>
          <el-menu-item class='menu-item' index='About'>About</el-menu-item>
          <el-menu-item class='menu-item' index='Analyze'>Analyze</el-menu-item>
          <el-menu-item class='menu-item' index='/'>Start</el-menu-item>
        </el-menu>
      </el-header>
      <!-- Transistion between site changes -->
      <transition
        name='fade'
        mode='out-in'>
        <!-- Router displaying the different sites -->
        <router-view class='full-screen'></router-view>
      </transition>
    </el-container>
  </div>
</template>

<script>
import { bus } from './main'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'

export default {
  name: 'App',
  data () {
    return {
      activeIndex: '/',
      isLoading: false
    }
  },
  components: {
    Loading
  },
  methods: {
    handleSelect (key, keyPath) {
      this.activeIndex = key
    }
  },
  created () {
    bus.$on('navigate', obj => {
      this.activeIndex = obj
    })
    bus.$on('loading', obj => {
      this.isLoading = obj
    })
  }
}
</script>

<style>
/* define colors used in the whole app */
:root {
  --main-bg-color: white;
  --dark-text-color: #2c3e50;
  --accent-color: #C3453A;
  --subtle_hover-color: #eeeeee;
}

body {
  margin: 0 !important;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--dark-text-color);
  background-color: var(--main-bg-color);

}

.full-screen{
  height: 100vh;
}

.el-menu.el-menu--horizontal{
  border-bottom: none;
  padding-right: 2vw;
  padding-left: 2vw;
  background-color: var(--main-bg-color);
}

.el-menu--horizontal>.el-menu-item.is-active{
  border-bottom: none;
  background-color: var(--main-bg-color);
}

.el-menu--horizontal>.el-menu-item{
  border-bottom: none;
  background-color: var(--main-bg-color);

}
.el-menu-item.menu-item{
  float: right;
  font-size: 1.5em;
  margin-right: 2vw;
  background-color: var(--main-bg-color);
}
.el-menu-item.menu-item.is-active{
  float: right;
  font-size: 1.5em;
  margin-right: 2vw;
  background-color: var(--main-bg-color);
}
.el-menu-item:hover{
  float: right;
  font-size: 1.5em;
  margin-right: 2vw;
  background-color: var(--main-bg-color);

}
.el-menu--horizontal>.el-menu-item:not(.is-disabled):focus{
  background-color: var(--main-bg-color);
}

.el-menu--horizontal>.el-menu-item:not(.is-disabled):hover{
  background-color: var(--main-bg-color);
}
.el-menu--horizontal>.el-menu-item{
  background-color: var(--main-bg-color);
}

</style>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}
</style>
