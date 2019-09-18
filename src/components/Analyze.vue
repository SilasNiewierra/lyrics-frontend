<template>
    <div v-bind:class="{'img-bg': !checkTracks && !searched}">
      <div v-bind:class="{ 'container': !checkTracks && !searched}">
        <div v-bind:class="{ 'vertical-center': !checkTracks && !searched }">
          <el-row>
              <el-col :span='6' :offset='9'>
                  <el-input placeholder='Enter Artist Name' autofocus v-model='input' @keyup.enter.native='search'></el-input>
              </el-col>
              <el-col :span='1'>
                  <el-button icon='el-icon-right' circle @click='search'></el-button>
              </el-col>
          </el-row>
        </div>
      </div>

      <div v-if='checkTracks'>
        <p></p>
        <el-row :gutter='20' class='fixed-track-list'>
          <el-col :md='{span: 8, offset: 8}' :sm='{span: 12, offset: 6}' :xs='{span: 16, offset: 4}'>
            <Track v-for='track in track_data' v-bind:key='track.track_id' :track_info='track' v-on:click.native='selectTrack(track.track_id)'/>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='24' class='scroll-down'>
              <p @click='scrollToBottom'>
                <i class='el-icon-arrow-down'></i>
              </p>
          </el-col>
        </el-row>
        <p></p>
        <el-button @click='updatePage'>Load More Songs</el-button>
        <el-button v-if='this.selected_tracks.length > 0' @click='getLyricsCombinedMusix'>Analyze Lyrics</el-button>
      </div>

      <div class='no-content' v-if='!checkTracks && searched'>
          <div class='no-results'>
              <p class='empty-result-text'>Sorry. We couldn't find any songs related to the artist you entered. Please try a different one.</p>
              <div class='img-banner'></div>
          </div>
      </div>

      <div v-if='word_data.length > 0'>
        <wordcloud
        :data='word_data'
        nameKey='name'
        valueKey='count'
        :showTooltip='true'>
        </wordcloud>
      </div>

      <img v-for='lyric in lyrics' v-bind:key='lyric.tracking_url' v-bind:src='lyric.tracking_url'/>
      <img v-if='checkTracks' class="bottom-image" src="../assets/ship-low-bg.png"/>
    </div>
</template>

<script>
import { bus } from '../main'
import Track from './TrackItem'
import wordcloud from 'vue-wordcloud'

const axios = require('axios')

export default {
  name: 'Analyze',
  components: {
    Track,
    wordcloud
  },
  data () {
    return {
      input: '',
      searched: false,
      track_data: [],
      lyrics: [],
      word_data: [],
      tracks: [],
      selected_tracks: [],
      base_url: 'http://localhost:3000',
      current_page: 1
    }
  },
  methods: {
    load () {
      this.count += 2
    },
    search () {
      this.track_data = []
      this.lyrics = []
      this.word_data = []
      this.tracks = []
      this.selected_tracks = []
      this.current_page = 1

      this.getData()
    },
    updatePage () {
      this.current_page += 1
      this.getData()
    },
    scrollToBottom () {
      var container = this.$el.querySelector('.fixed-track-list')
      container.scrollTop = container.scrollHeight
    },
    getData () {
      if (this.input !== '') {
        this.toggleLoading(true)
        var url = this.base_url + '/tracks/' + this.input + '/' + this.current_page
        axios.get(url)
          .then(response => {
            var combinedList = [...new Set([...this.track_data, ...response.data])]
            this.track_data = combinedList

            if (this.track_data.length <= 0) {
              this.searched = true
            } else {
              this.searched = false
            }

            this.toggleLoading(false)
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    selectTrack (trackId) {
      var index = this.selected_tracks.indexOf(trackId)
      if (index > -1) {
        this.selected_tracks.splice(index, 1)
      } else {
        this.selected_tracks.push(trackId)
      }
      var found = this.track_data.find(function (track) {
        return track['track_id'] === trackId
      })
      found['selected'] = !found['selected']
    },
    getLyricsCombinedMusix () {
      if (this.selected_tracks.length > 0) {
        this.toggleLoading(true)
        this.word_data = []
        var url = this.base_url + '/all_lyrics/' + this.selected_tracks
        axios.get(url)
          .then(response => {
            window.console.log(response)
            for (var wordObj in response.data) {
              this.word_data.push({'name': wordObj, 'count': response.data[wordObj]['count']})
            }
            this.toggleLoading(false)
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    toggleLoading (state) {
      bus.$emit('loading', state)
    }
  },
  computed: {
    checkTracks: function () {
      return this.track_data.length
    }
  }
}
</script>

<style>
.el-input__inner{
    text-align: center;
    border: none;
    border-radius: 0px;
    border-bottom: 2px solid var(--dark-text-color);
    font-size: 2em;
    background-color: inherit;
}
.el-input__inner:focus{
    border-bottom: 2px solid var(--accent-color);
}

.el-button.el-button--default.is-circle{
    border:none;
    font-size: 30px;
    color:var(--dark-text-color);
    background-color:inherit;
}
.el-button.el-button--default.is-circle:focus{
    border:none;
    font-size: 30px;
    color: var(--accent-color);
    background: none;
}
</style>

<style scoped>
body, html{
  margin: 0px;
  padding: 0px;
}
.img-bg{
  background-image: url('../assets/ship-low-bg.png');
  width: 100%;
  background-position: bottom;
  background-repeat: no-repeat;
  background-size: contain;
  margin-bottom: -10px;
  padding-bottom: 0px;
}
.bottom-image{
  width: 100%;
  background-position: bottom;
  background-repeat: no-repeat;
  background-size: contain;
  margin-bottom: -10px;
  padding-bottom: 0px;
}
.container {
  height: 90%;
  width:100%;
  position: relative;
}

.vertical-center {
  margin: 0;
  position: absolute;
  width: 100%;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}

@keyframes fontbulger {
  0%, 100% {
    color: var(--dark-text-color);
    margin-top: 0px;
    margin-bottom: 10px;
  }
  50% {
    color: var(--accent-color);
    margin-top: 10px;
    margin-bottom: 0px;
  }
}

.scroll-down {
  font-size: 2em;
  animation: fontbulger 2s infinite;
  margin-top: 10px;
  margin-bottom: 0px;
}

.fixed-track-list{
  height: 300px;
  overflow: hidden;
  overflow-y:scroll;
}
.center-div{
  margin-left:auto;
  margin-right:auto;
  background-color: brown;
}
.empty-result-text{
    font-size: 20px;
    color:var(--dark-text-color);
}

.no-results{
    height: 70%;
    padding-top: 20vh;
}

.img-banner{
  height: 70%;
  background-image: url('../assets/empty-results.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  margin-top: -5vh;
}
.no-content{
    height: 90%;
}

</style>
