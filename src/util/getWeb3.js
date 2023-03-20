/**
 * Function to get Web3 object and push it to 
 * @param 
 * @param 
 */
import Web3 from 'web3'
import detectEthereumProvider from '@metamask/detect-provider';

let getWeb3 = new Promise(async function (resolve, reject) {
  const provider = await detectEthereumProvider();
  await window.ethereum.enable();
  if (provider) {
    resolve({
      injectedWeb3: provider.isConnected(),
      web3() {
        return new Web3(provider);
      }
    })
  }
  else {
    reject(new Error('Unable to connect to Metamask'))
  }

}).then(result => {
    return new Promise(function (resolve, reject) {

      // Retrieve network ID
      result.web3().eth.getChainId((err, networkId) => {
        if (err) {
          // If we can't find a networkId keep result the same and reject the promise
          reject(new Error('Unable to retrieve network ID'))
        } else {
          // Assign the networkId property to our result and resolve promise
          result = Object.assign({}, result, { networkId })
          resolve(result)
        }
      })
    })
  }).then(result => {
    return new Promise(function (resolve, reject) {

      // Retrieve coinbase
      result.web3().eth.getCoinbase((err, coinbase) => {
        if (err) {
          reject(new Error('Unable to retrieve coinbase'))
        } else {
          result = Object.assign({}, result, { coinbase })
          resolve(result)
        }
      })
    })
  }).then(result => {
    return new Promise(function (resolve, reject) {
      // Retrieve balance for coinbase
      result.web3().eth.getBalance(result.coinbase, (err, balance) => {
        if (err) {
          reject(new Error('Unable to retrieve balance for address: ' + result.coinbase))
        } else {
          result = Object.assign({}, result, { balance })
          resolve(result)
        }
      })
    })
  })

export default getWeb3;
