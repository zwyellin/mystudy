<template>
  <div class="home1">
    <div id="test1">
      wer<br />wer<br />wer<br />wer<br />wer<br />
      wer<br />wer<br />wer<br />wer<br />wer<br />wer<br />wer
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "AppHome",
  beforeCreate() {
    this.$emit("clicks", function() {
      console.log("appHome clicks");
    });
  }
};
</script>
<style scoped>
#test1 {
  width: 100px;
  height: 100px;
}
</style>
