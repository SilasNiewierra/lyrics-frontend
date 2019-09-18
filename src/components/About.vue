<template>
  <div>
    <p class="heading">What is Lyrics?</p>
    <!-- App description -->
    <el-row>
      <el-col :span="8" :offset="8" class="col1">
        <p>Lyrics is a pretty straightforward web application.
        It shows the lyrics of selected songs combined in a wordcloud. By simple text preprocessing,
        you see the words with the most impact in these songs.</p>
      </el-col>
    </el-row>
    <!-- Divider image -->
    <el-row>
      <el-col :span="8" :offset="8" class="col2">
        <img class="divider-image" src="../assets/clean-whale-bg.png" />
      </el-col>
    </el-row>
    <!-- Component description -->
    <el-row>
      <el-col :span="8" :offset="8" class="col1">
        <p>Components used in this project:</p>
          <p class="components"> node.js for the backend</p>
          <p class="components"> vue.js for the frontend</p>
          <p class="components"> musixmatch API to retrieve the lyrics</p>
          <p class="components"> Language Detection API to remove relevant stopwords</p>
          <p class="components"> initial images from <a href='https://pngtree.com/so/flat wind'>flat wind png from pngtree.com</a></p>
          <p class="components"> initial images from <a href='https://pngtree.com/so/whale'>whale png from pngtree.com</a></p>
      </el-col>
    </el-row>
    <!-- Bottom image -->
    <img class="bottom-image" src="../assets/sea-floor-trans.png"/>
  </div>
</template>

<script>
export default {
  name: 'About'
}
</script>

<style scoped>
.bottom-image{
  width: 100%;
  background-position: bottom;
  background-repeat: no-repeat;
  background-size: contain;
  margin-bottom: -10px;
  padding-bottom: 0px;
}
.heading{
    font-size: 2em;
}
p{
    font-size: 1.3em;
}
.components{
  font-size: 1em
}
.divider-image{
  height: 30vw;
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
}
</style>
