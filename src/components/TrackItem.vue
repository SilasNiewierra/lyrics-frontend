<template>
    <el-row class='track_row'>
        <!-- Track Cover Art - API doesnt provide it anymore -->
        <!-- <el-col :span='4' class='image_col'>
            <img class='track_image' v-bind:src='track_info.image_url' />
        </el-col> -->
        <!-- Track name and artist name -->
        <el-col :span='22'>
            <p align='left' class='row_paragraph'>
                <span class='track_name'>{{track_info.track_name}} <br></span>
                <span> {{track_info.artist_name}}</span>
            </p>
        </el-col>
        <!-- Check icon -->
        <el-col :span='2'>
            <p>
              <i v-if='track_info.selected' class='el-icon-check'></i>
            </p>
        </el-col>
    </el-row>
</template>

<script>
export default {
  name: 'Track',
  props: ['track_info']
}
</script>

<style scoped>
.el-icon-check{
    color:  var(--accent-color);
}
p{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
span{
    font-size: 0.9em;
}
.row_paragraph{
    margin: 0px;
    margin-top: 10px;
}
.track_name{
    color: var(--accent-color);
    font-weight: bold;
    font-size: 1em;
}
.track_row_selected > el-col > p > .track_name{
    color: rgb(123,174,127);
}
.track_row{
    border-bottom: 1px solid rgba(0,0,0,0.22);
    height: 60px;
}
.track_row:hover{
    background-color: var(--subtle_hover-color);
}
.image_col{
    height: 100%;
    margin: 0px;
    padding: 0px;
    margin: 0px;
    padding: 0px;
}
.track_image{
    width: 50px;
    object-fit: fill;
    height: 50px;
    margin-top: 5px;
}
</style>
