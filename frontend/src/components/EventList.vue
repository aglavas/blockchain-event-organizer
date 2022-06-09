<template>
  <div class="row">
    <div class="col-sm-12">
      <h2>Events</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Admin</th>
            <th>Name</th>
            <th>Date</th>
            <th>Price</th>
            <th>Ticket remaining</th>
            <th>Total tickets</th>
            <th>Buy</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(event, index) in eventOrganizerStore.events" :key="index">
            <td>{{ event[0] }}</td>
            <td>{{ event[1] }}</td>
            <td>{{ event[2] }}</td>
            <td>
              {{ (new Date(parseInt(event[3]))).toLocaleString() }}
            </td>
            <td>{{ event[4] }}</td>
            <td>{{ event[5] }}</td>
            <td>{{ event[6] }}</td>
            <td>
              <form @submit="buyTicket($event, event.id)">
                <div class="form-group">
                  <label for="amount">Amount</label>
                  <input type="text" class="form-control" id="amount" />
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
              </form>
            </td>
          </tr>
        </tbody>
      </table>
      <ValidationErrors :errors="errors"></ValidationErrors>
      <p class="h3">{{ result }}</p>
    </div>
  </div>
</template>

<script>
import { mapStores } from 'pinia'
import { useStore } from '../store/eventOrganizer.js'
import ValidationErrors from './ValidationErrors.vue';

export default {
  name: 'EventList',
  components: {
    ValidationErrors
  },
  data() {
    return {
      result: null,
      errors: []
    }
  },
  computed: {
    ...mapStores(useStore)
  },
  methods: {
    buyTicket: async function (e, eventId) {
      e.preventDefault();
      let amount = e.srcElement[0].value;
      let error = false;
      this.errors = [];

      if (!amount) {
        this.errors.push('Amount is required.');
        error = true;
      }

      if (error) {
        return false;
      }

      let ticketPriceTotal = this.eventOrganizerStore.ticketPriceTotal(eventId, amount);

      let buyTicketPromise = this.eventOrganizerStore.contract.methods.buyTicket(eventId, amount).send({from: this.eventOrganizerStore.currentAccount, gas: 3000000, value: ticketPriceTotal});

      buyTicketPromise.then(() => {
        this.result = `Ticket bought.`;
        this.eventOrganizerStore.refreshEvents();
      }).catch((error) => {
        this.result = error;
      });
    }
  }
}
</script>