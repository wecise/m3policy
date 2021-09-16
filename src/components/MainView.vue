<template>
  <PolicyView :global="global"></PolicyView>
</template>

<script>

import PolicyView from './policy/PolicyView';

export default {
  name: "MainView",
  props: {
    global: Object
  },
  components:{
    PolicyView
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
