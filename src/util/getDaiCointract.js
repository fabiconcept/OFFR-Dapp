import { ethers } from 'ethers';
import {address2, ABI2} from './constants/usdcContract'


let getDaiContract = new Promise(async function (resolve, reject) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const daiContractInstance = new ethers.Contract(address2, ABI2, provider);
  resolve (daiContractInstance);
})

export default getDaiContract;