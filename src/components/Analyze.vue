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
        <el-button @click='updatePage'>More Songs</el-button>
        <el-button @click='getLyricsCombinedMusix'>Analyze Lyrics</el-button>
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
const sw = require('stopword')

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
            var i
            for (i = 0; i < response.data.length; i++) {
              // save artist name, track name, album name to do a detailed search in other API (happi api)
              var cleanArtistName = response.data[i].track['artist_name'].split('(')[0]
              var cleanTrackName = response.data[i].track['track_name'].replace(/ *\([^)]*\) */g, '')
              cleanTrackName = cleanTrackName.split(' - ')[0]
              // var albumId = response.data[i].track['album_id']
              var albumCover = response.data[i].track['album_coverart_350x350']
              if (!albumCover) {
                albumCover = '../static/no-cover-placeholder.png'
              }

              // window.console.log(albumCover)
              // remove duplicate tracks
              var trackFound = false
              for (var track of this.track_data) {
                if (cleanTrackName === track['track_name']) {
                  trackFound = true
                  continue
                }
              }
              if (!trackFound) {
                var obj = {
                  'track_name': cleanTrackName,
                  'artist_name': cleanArtistName,
                  'track_id': response.data[i].track['track_id'],
                  'image_url': albumCover,
                  'selected': false
                }
                this.track_data.push(obj)
              }
            }
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
      this.toggleLoading(true)
      this.lyrics = []
      var promises = []

      this.selected_tracks.forEach(track => {
        var url = this.base_url + '/lyrics/' + track
        promises.push(axios.get(url))
      })

      axios.all(promises)
        .then(results => {
          results.forEach(response => {
            this.lyrics.push(response.data)
            this.toggleLoading(false)
          })
          this.createWordMap()
        })
        .catch(error => {
          window.console.log(error)
        })
    },
    createWordMap () {
      var wordCountMap = {}
      this.word_data = []

      for (var song of this.lyrics) {
        var songLyric = song['lyrics']
        var language = song['language']['language']
        // musixmatch remove free version tags in lyrics
        songLyric = songLyric.split('...')[0]

        // remove line breaks
        songLyric = songLyric.replace(/(\r\n|\n|\r)/gm, ' ')

        // song_lyric = song_lyric.replace(/\s+/g,' ')
        songLyric = songLyric.replace('?', '')
        songLyric = songLyric.replace('`', ' ')

        // lower case
        songLyric = songLyric.toString().toLowerCase()

        // stem (combine stems of the words likes/like = like)

        // tokenize (split into single words)
        songLyric = songLyric.split(' ')

        // remove stopwords in the respective language
        songLyric = sw.removeStopwords(songLyric, this.selectStopwordLanguage(language))

        for (var word of songLyric) {
          if (word in wordCountMap) {
            wordCountMap[word].count += 1
          } else {
            wordCountMap[word] = {'count': 1}
          }
        }
      }
      for (var wordObj in wordCountMap) {
        this.word_data.push({'name': wordObj, 'count': wordCountMap[wordObj]['count']})
      }
    },
    toggleLoading (state) {
      bus.$emit('loading', state)
    },
    selectStopwordLanguage (language) {
      switch (language) {
        case 'af':
          return sw.af
        case 'ar':
          return sw.ar
        case 'bn':
          return sw.bn
        case 'br':
          return sw.br
        case 'da':
          return sw.da
        case 'de':
          return sw.de
        case 'en':
          return sw.en
        case 'es':
          return sw.es
        case 'fa':
          return sw.fa
        case 'fi':
          return sw.fi
        case 'fr':
          return sw.fr
        case 'ha':
          return sw.ha
        case 'he':
          return sw.he
        case 'hi':
          return sw.hi
        case 'id':
          return sw.id
        case 'it':
          return sw.it
        case 'lgg':
          return sw.lgg
        case 'lggo':
          return sw.lggo
        case 'nl':
          return sw.nl
        case 'no':
          return sw.no
        case 'pl':
          return sw.pl
        case 'pt':
          return sw.pt
        case 'pa':
          return sw.pa
        case 'ru':
          return sw.ru
        case 'so':
          return sw.so
        case 'st':
          return sw.st
        case 'sv':
          return sw.sv
        case 'sw':
          return sw.sw
        case 'vi':
          return sw.vi
        case 'yo':
          return sw.yo
        case 'zu':
          return sw.zu
      }
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
