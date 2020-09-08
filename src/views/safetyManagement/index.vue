<template>
  <section class="video-box">
    <videoPlayer class="vjs-custom-skin videoPlayer" :options="playerOptions" width="70%"></videoPlayer>
  </section>
</template>
<script>
import "video.js/dist/video-js.css";
import { videoPlayer } from "vue-video-player";
import { mqttConfig } from '../../../static/mqtt-config.js'
import "videojs-flash";
export default {
  components: {
    videoPlayer
  },
  data () {
    return {
        playerOptions : {
          language: 'zh-CN',
          height: "600",//播放器高度
          sources: [
            {
              type: "rtmp/flv",//视频流协议，如果是hls，需要后端开启跨域
              // 内测地址
              src: mqttConfig.videoUrl
            }
          ],
          techOrder: ["flash"],
          autoplay: true,//自动播放
          controls: true//编辑器控件
        },          
    }
  },
  mounted(){
    console.log("video url:",mqttConfig.videoUrl);
  }
}
</script>
<style scoped>
.video-box {
  width: 1000px;
  padding: 20px;
}
</style>