<template>
  <div>
    <h1 class="text-center">Event Organization</h1>
      <div class="row">
        <div class="col-sm-12">
          <h2>Create event</h2>
          <form @submit="createEvent">
            <div class="form-group">
              <label for="name">Name</label>
              <input v-model="event.name" type="text" class="form-control" id="name" />
            </div>
            <div class="form-group">
              <label for="date">Date</label>
              <input v-model="event.date" type="date" class="form-control" id="date" />
            </div>
            <div class="form-group">
              <label for="price">Price</label>
              <input v-model="event.price" type="text" class="form-control" id="price" />
            </div>
            <div class="form-group">
              <label for="ticketCount">Ticket count</label>
              <input v-model="event.count" type="text" class="form-control" id="ticketCount" />
            </div>
            <p class="h3">{{ event.result }}</p>
            <ValidationErrors :errors="event.errors"></ValidationErrors>
            <button type="submit" class="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia'
import { useStore } from '../store/eventOrganizer.js'
import ValidationErrors from './ValidationErrors.vue';

export default {
  name: 'CreateEvent',
  components: {
    ValidationErrors
  },
  data() {
    return {
      event: {
        name: null,
        date: null,
        price: null,
        count: null,
        result: null,
        errors: [],
      }
    }
  },
  computed: {
    ...mapStores(useStore)
  },
  methods: {
    createEvent: async function (e) {
      e.preventDefault();

      let error = false;
      this.event.errors = [];

      if (!this.event.name) {
        this.event.errors.push('Event name is required.');
        error = true;
      }

      if (!this.event.date) {
        this.event.errors.push('Event date is required.');
        error = true;
      }

      let eventDate = null;

      try {
        eventDate = new Date(this.event.date).getTime();
      } catch (exception) {
        this.event.errors.push('Event date in wrong format.');
        error = true;
      }

      if (!this.event.price) {
        this.event.errors.push('Ticket price is required.');
        error = true;
      }

      if (!this.event.count) {
        this.event.errors.push('Event ticket count is required.');
        error = true;
      }

      if (error) {
        return false;
      }

      let createEventPromise = this.eventOrganizerStore.contract.methods.createEvent(this.event.name, eventDate, this.event.price, this.event.count).send({from: this.eventOrganizerStore.currentAccount, gas: 3000000});

      createEventPromise.then(() => {
        this.event.result = `Event has been created.`;
        this.event.name = '';
        this.event.date = '';
        this.event.price = '';
        this.event.count = '';
        this.eventOrganizerStore.refreshEvents();
      }).catch((error) => {
        this.event.result = error;
      });
    }
  }
}
</script>