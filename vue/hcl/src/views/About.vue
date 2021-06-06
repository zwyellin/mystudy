<template>
  <div>
    this is about page
    {{x}}
    <button @click="handleBtnClick">按钮</button>
  </div>
</template>
<script>
export default {
  name:'About',
  props:{
    x:{
      type:Number
    }
  },
  data(){
    return {
      num:10
    }
  },
  created(){
    console.log('listenets',this.$listeners)
  },
  methods:{
    handleBtnClick(){
     this.modeltest.x =2
    }
  }
}
</script>