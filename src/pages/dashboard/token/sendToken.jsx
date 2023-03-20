import React, { useContext, useState, useEffect } from 'react';
import { contextData } from '../dashboard';
import { walletData } from '../pages/Wallet';

const SendToken = ({ buyRef, transferRef }) => {
  const { coinBase, contract } = useContext(contextData);
  const { onSale } = useContext(walletData);
  const [offr, setOffr] = useState(null);
  const [coinInfo, setCoinInfo] = useState(null);
  
  useEffect(() => {
    if (contract !== null) {
      setOffr(contract[0]);
    }
  }, [contract]);

  useEffect(() => {
    if (offr !== null) {
      fetchOFFR();
    }
  }, [offr, coinBase]);

  const fetchOFFR = async () => {
    if (coinBase) {
      const name = await offr.name();
      const myBalance = await offr.balanceOf(coinBase?.coinbase);

      const data = {
        name,
        myBalance
      }

      setCoinInfo(data);
    }
  }
  return (
    <div className="">
      <div className="flex-form">
        <div className={`sec bt pb ${!onSale && "disable"}`}>
          {coinInfo?.myBalance ? <div className={`btnx ${onSale && "disabled"}`} onClick={() => buyRef?.current.click()}>Buy Token</div> : <img src="https://gineousc.sirv.com/Images/sp.gif" alt="" />}
        </div>
        <div className={`sec bt pb ${!onSale && "disable"}`}>
          {coinInfo?.myBalance ? <div className={`btnx ${onSale && "disabled"}`} onClick={() => transferRef?.current.click()}>Transfer</div> : <img src="https://gineousc.sirv.com/Images/sp.gif" alt="" />}
        </div>
      </div>
    </div>
  )
}

export default SendToken;