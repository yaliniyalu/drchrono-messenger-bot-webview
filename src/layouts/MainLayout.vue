<template>
  <q-layout view="hHh lpR fFf">

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-white text-center q-pa-md" v-if="footerVisible">
      <q-btn color="primary" :label="buttonLabel" :disable="buttonDisable" unelevated style="width: 50%" @click="buttonClick"></q-btn>
    </q-footer>

  </q-layout>
</template>

<script>
export default {
  name: 'MainLayout',
  components: {  },
  data () {
    return {
      footerVisible: false,
      buttonLabel: "",
      config: null,
        buttonDisable: false
    }
  },

  methods: {
    setConfig(config) {
      this.config = config;
      if (config.visible) {
        this.buttonLabel = config.label;
        this.footerVisible = true;
      }
      else {
        this.footerVisible = false;
      }

      this.buttonDisable = config.disable === true;
    },

    buttonClick() {
      if (this.config.click === 'close') {
        this.closeWebview();
        return;
      }

      this.$root.$emit('global-button:click', this.config.payload)
    },

    closeWebview() {
      MessengerExtensions.requestCloseBrowser(() => {}, () => {})
    }
  },

  created() {
    this.$root.$on('webview:close', () => {
      this.closeWebview();
    });

    this.$root.$on('global-button:config', (config) => {
      this.setConfig(config);
    });
  }
}
</script>

<style lang="scss" scoped>

</style>
