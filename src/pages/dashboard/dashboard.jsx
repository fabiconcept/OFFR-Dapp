import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fireStore } from '../../firebase/sdk';
import { destroySession, disconnectWallet, formatNum, isSessionSet } from '../../useful/useful_tool';
import getContract from '../../util/getContract';
import getWeb3 from '../../util/getWeb3';
import ChangeProfilePicture from './components/ChangeProfilePicture';
import Mobile_navBar from './components/mobile_navBar';
import NavArea from './components/navArea';
import UserCard from './components/userCard';
import HomePage from './pages/Home';
import Settings from './pages/Settings';
import Wallet from './pages/Wallet';
import Owner from './pages/Owner';
import DividendManagement from './pages/Dividend Management';
import SaleBatches from './pages/SaleBatches';

export const contextData = React.createContext();

const Dashboard = () => {
  const { id } = useParams()
  const [settingDp, setSettingDp] = useState(false);
  const [storeDataUser, setStoreDataUser] = useState(null);
  const [coinBase, setCoinbase] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [contract, setContract] = useState(null);
  const [logOut, setLogOut] = useState(false);
  const [batchData, setBatchData] = useState(null);
  const [newSaleState, setNewSaleState] = useState(0);


  /**
   * ConnectWallet() is a function that calls getContract() and getWeb3() and then sets the state of
   * contract and coinbase.
   */
  const connectWallet = async () => {
    const fetchContracts = getContract; 
    fetchContracts.then(i => setContract(i));
    const web3Instance = getWeb3;
    await web3Instance.then(i => {
      setCoinbase(i);
    });
  }

  /**
   * This function fetches all the documents in the collection 'Token_Sale_Batches' and then checks if
   * the status of the document is true, if it is, it sets the data of the document to the state
   * 'batchData'.
   */
  const fetchActiveSalesBatch = async() =>{
    const collectionSnap = await getDocs(collection(fireStore, "Token_Sale_Batches"));
    
    collectionSnap.forEach(element => {
      const data = element.data();
      const batchStatus = data.status;

      if (batchStatus) {
        setBatchData(data);
      }
    });
  }

  /**
   * It takes a new sale value, gets the collection of batches, and then updates the sold value of the
   * batch that matches the batch name of the new sale.
   * </code>
   */
  const updateTokenSoldToBatchData = async(newSale) =>{
    const userRef = collection(fireStore, `Token_Sale_Batches`);
    const collectionSnap = await getDocs(userRef);

    /* Updating the sold value of the document in the collection. */
    collectionSnap.forEach(async(snap) => {
      const data = snap.data()

      if (data.batch_name === batchData.batch_name) {
        const obj = data;
        const soldValue = Number(Number(data.sold) + Number(newSale));
        const adjustObj = {...obj, sold: soldValue};
        await setDoc(doc(userRef, `${snap.id}`), adjustObj);
      }
    });
  }
  
  /**
   * If coinBase is true, then for each element in the transactions array, set the document in the
   * user_transactions collection to the value of the element.
   */
  const updateTransactionList = async () => {
    if (coinBase) {
      const userRef = collection(fireStore, "user_transactions");

      transactions.forEach(async (element) => {
        await setDoc(doc(userRef, `${element.hash}`), element);
      });
    }
  }

  useEffect(() => {
    if (transactions.length > 0) {
      updateTransactionList();
    }
  }, [transactions]);


  /**
   * It fetches user data from firestore and returns it.
   * </code>
   * @returns An object with the following properties: email, name, gender, dp
   */
  const fetchCredentials = async (e) => {
    const docRef = doc(fireStore, "user_credentials", `${e}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userInfo = docSnap.data();
      const email = (userInfo.email);
      const name = (userInfo.name);
      const img = (userInfo.profile_picture);
      let gender;
      switch (userInfo.gender) {
        case "female":
          gender = 1;
          break;
        case "non-binary":
          gender = 2;
          break;

        default:
          gender = 0;
          break;
      }
      const data = {
        email: email,
        name: name,
        gender: gender,
        dp: img,
      }

      return data;
    } else {
      return false;
    }

  }

  useEffect(() => {
    if (!isSessionSet()) {
      window.location = "/";
    } else {
      const loginSession = JSON.parse(localStorage.getItem('loginSession'));
      const addr = loginSession.username;
      if (fetchCredentials(addr) !== false) {
        fetchCredentials(addr).then(i=>setStoreDataUser(i))
      }
      connectWallet();
    }

  }, []);

  useEffect(()=>{
    fetchActiveSalesBatch();
  }, [newSaleState]);

  useEffect(()=>{
    if (!isSessionSet()) {
      window.location = "/";
    } else {
      const loginSession = JSON.parse(localStorage.getItem('loginSession'));
      const addr = loginSession.username;
      if (fetchCredentials(addr) !== false) {
        fetchCredentials(addr).then(i=>setStoreDataUser(i));
      }
    }
  }, [settingDp]);

  useEffect(() => {
    if (logOut) {
      if (window.confirm("Are you sure you want to disconnect?")) {
        destroySession();
        disconnectWallet();
        window.location = "/";
      }else{
        setLogOut(false);
      }
    }
  }, [logOut]);

  return (
    <contextData.Provider value={{ setNewSaleState, updateTokenSoldToBatchData, batchData, storeDataUser, coinBase, contract, setStoreDataUser, setLogOut, transactions, setTransactions }}>
      <div className="dashboard">
        <NavArea />
        <Mobile_navBar />
        {settingDp && <ChangeProfilePicture setSettingDp={setSettingDp} />}
        {id === '' && <HomePage />}
        {id === undefined && <HomePage />}
        {id === "wallet" && <Wallet />}
        {id === "owner" && <Owner />}
        {id === "dividend" && <DividendManagement />}
        {id === "settings" && <Settings />}
        {id === "batch history" && <SaleBatches />}
        <UserCard setSettingDp={setSettingDp} />
      </div>
    </contextData.Provider>
  )
}

export default Dashboard;