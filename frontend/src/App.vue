<template>
  <div id="app" v-if="ready">
    <div class="container">
      <CreateEvent></CreateEvent>
      <hr/>
      <EventList></EventList>
    </div>
  </div>
</template>

<script>
import CreateEvent from './components/CreateEvent.vue';
import EventList from './components/EventList.vue';
import { mapStores } from 'pinia'
import { useStore } from './store/eventOrganizer.js'

export default {
  name: 'App',
  components: {
    CreateEvent,
    EventList
  },
  data() {
    return {
      ready: false
    }
  },
  computed: {
    ...mapStores(useStore)
  },
  async mounted() {
    await this.eventOrganizerStore.registerWeb3();
    this.ready = true;
  }
}
</script>