<template>
  <div class="home">
    {{modeltest.x}}
    <br>
      this is App home
      <about v-bind="modeltest"></about>
  </div>
</template>
<script>
import about from "./views/About";
/**
 * 总结：
 * v-model="test"
 * 相对于 :value="test" @input="val => test = val"
 * 
 * 子组件
 * 需要value的props
 * 需要手动触发this.$emit('input',xx) 来触发事件
 * 实现双向绑定
 */

/**
 * 总结
 * :modelTest.sync="test"
 * 相对于 :modelTest="test" @updata:modelTest="val => test = val"
 */
export default {
  name: "app",
  props: {
    props1: {
      type: String,
      default: "1"
    }
  },
  data() {
    return {
      modeltest:{
        x:1
      }
    };
  },
  components: {
    about
  },
  created(){
    console.log('listenets',this.$listeners)
  }
};
</script>
<style lang="scss" scoped>
</style>
