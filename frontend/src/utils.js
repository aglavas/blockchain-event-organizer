import Web3 from "web3";

function  getWeb3() {
  return new Promise(function (resolve) {
      var provider = Web3.currentProvider
      if (typeof provider === 'undefined') {
          // Use local provider
          provider = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'))
      } else {
          // Use Mist/MetaMask's provider
          provider = new Web3(provider)
      }
      resolve(provider)
  })
}

async function connect() {
  try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'})
      const account = handleAccountsChanged(accounts)
      return account
  } catch (error) {
      if (error.code === 4001) {
          alert('Please connect to metamask to continue')
      } else {
          console.error(error)
      }
  }
}

function handleAccountsChanged(accounts) {
  if (accounts.length === 0 ) {
      console.log("Please connect to metamask")
  } else {

      window.ethereum.on("accountsChanged", () => { window.location.reload() });

      return accounts[0];
  }
}

export { getWeb3, connect }; 