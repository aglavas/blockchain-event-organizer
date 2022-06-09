import { defineStore } from 'pinia'
import { getWeb3, connect } from '../utils.js'
import EventOrganizer from '../../../build/contracts/EventOrganizer.json'

export const useStore = defineStore('eventOrganizer', {
  state: () => {
    return {
      web3: null,
      accounts: null,
      contract: null,
      networkId: null,
      currentAccount: null,
      events: []
    }
  },
  getters: {
    ticketPriceTotal: (state) => {
      return (eventId, amount) => (state.events[eventId][4] * amount);
    },
  },
  actions: {
    async registerWeb3() {
        this.web3 = await getWeb3();
        this.accounts = await this.web3.eth.getAccounts();
        this.networkId = await this.web3.eth.net.getId();

        let deployedNetwork = EventOrganizer.networks[this.networkId];        
        this.contract = new this.web3.eth.Contract(
            EventOrganizer.abi,
            deployedNetwork && deployedNetwork.address,
        );
        const [events, connectedAddress] = await Promise.all([
            this.contract.methods.getAllEvents().call(),
            connect()
        ]);

        console.log('Events');
        console.log(events);
        
        this.currentAccount = connectedAddress;
        this.events = events;
    },
    async refreshEvents() {
        this.events = await this.contract.methods.getAllEvents().call();
    }
  }
})