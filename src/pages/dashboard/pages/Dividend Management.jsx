import { ethers } from 'ethers';
import React, { useContext, useEffect, useState } from 'react';
import { daysToText, formatEth, formatLargeNumber, formatNum, greetUser } from '../../../useful/useful_tool';
import { contextData } from '../dashboard';
import { ABI3, address3 } from '../../../util/constants/tokenHandlerContract';
import DividendSettings from '../token/card/DividendSettings';
import { ABI2, address2 } from '../../../util/constants/usdcContract';

export const ownerContext = React.createContext();
const DividendManagement = () => {
  const { storeDataUser, contract, coinBase } = useContext(contextData);
  const [dividendProperties, setDividendProperties] = useState(false);
  const [loading, setLoading] = useState(false);
  const [coin, setCoin] = useState(null);

  const fetchCoinInformation = async () => {
    setLoading(true)
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();

    const OffrToken = new ethers.Contract(address3, ABI3, signer);
    const usdcInstance = new ethers.Contract(address2, ABI2, signer);

    const token = contract[0];

    const tokenSale = await OffrToken.tokensale_open();
    let obj;

    const holdersList = await token.getHolderList();
    const totalSupply = formatEth(await token.totalSupply());
    const tokenCap = formatEth(await token.cap());
    const divPeriod = Number(await OffrToken.getDividendPeriod());
    const divInterval = Number(await OffrToken.getDividendInterval());
    const divIntervalCount = Number(await OffrToken.getDividendIntervalCount());
    const divCount = Number(await OffrToken.getDividendCount());
    const divPercent = Number(await OffrToken.getDividendPercent());

    const divPeriodValue = (divPeriod / (24 * 60 * 60));
    const divIntervalValue = divInterval / (24 * 60 * 60);
    const divIntervalCountValue = divIntervalCount;
    const divCountValue = divCount;
    const contractUSDC = await usdcInstance.balanceOf(address3);

    const adminWallet = await OffrToken.getAdmin();
    const isDividendPaymentPeriod = await OffrToken.isDividendPaymentPeriod();

    const isOwner = String(adminWallet).toLocaleLowerCase() === String(coinBase?.coinbase).toLocaleLowerCase();

    obj = {
      holdersList,
      status: tokenSale,
      tokenCap,
      totalSupply,
      divPeriodValue,
      divIntervalValue,
      divIntervalCountValue,
      divCountValue,
      divPercent,
      divCount,
      contractUSDC,
      isOwner,
      isDividendPaymentPeriod,
    };

    setCoin(obj);
    setLoading(false);
  };

  useEffect(() => {
    if (contract) {
      fetchCoinInformation();
    }
  }, [contract, coinBase]);

  return (
    <ownerContext.Provider value={{ dividendProperties, setDividendProperties }}>
      <div className="dash_section">
        <label>Dividend Management</label>
        {loading && <div className="pending">
          <img src="https://gineousc.sirv.com/Images/sp.gif" alt="" />
        </div>}
        {!storeDataUser && <div className="greet">
          <div className="title">{greetUser()} {storeDataUser ? ((storeDataUser?.name).split(" ")[0]) : "@firstname"}, </div>
          <div className="tags">
            <div className="img">
              {storeDataUser && <img src={storeDataUser?.dp} alt="" />}
              {!storeDataUser && <img src="https://gineousc.sirv.com/Images/Infinite.gif" alt="" />}
            </div>
          </div>
        </div>}

        <div className="dash-row">
          <div className="div-3">
            <div className='kard'>
              <div className="tag">Token Holders <img src="https://gineousc.sirv.com/Images/icons/icons8-client-64.png" alt="" /></div>
              <div className="value">{coin != null && coin.holdersList.length > 0 ? `${coin.holdersList.length > 0 ? coin.holdersList.length : '0.00'}` : `---`}</div>
            </div>
            <div className='kard'>
              <div className="tag">Total Dividend Paid <img src="https://gineousc.sirv.com/Images/icons/icons8-bounced-check-100.png" alt="" /></div>
              <div className="value">{coin != null && coin.divCountValue > 0 ? `${coin.divCountValue > 0 ? coin.divCountValue : '0.00'}` : `---`}</div>
            </div>
            <div className='kard'>
              <div className="tag">Next Pay date<img src="https://gineousc.sirv.com/Images/icons/date-to.png" alt="" /></div>
              <div className="value info">Friday 13th</div>
            </div>
            <div className='kard'>
              <div className="tag">Dividend Period <img src="https://gineousc.sirv.com/Images/icons/icons8-date-span-100.png" alt="" /></div>
              <div className="value info">{coin != null && coin.divPeriodValue > 0 ? `${coin.divPeriodValue > 0 ? `${daysToText(Number(coin.divPeriodValue)) }` : '0.00'}` : `---`}</div>
            </div>
            <div className='kard'>
              <div className="tag">Dividend Intervals<img src="https://gineousc.sirv.com/Images/icons/hourglass-sand-bottom.png" alt="" /></div>
              <div className="value info">{coin != null && coin.divIntervalValue > 0 ? `${coin.divIntervalValue > 0 ? `${daysToText(Number(coin.divIntervalValue)) }` : '0.00'}` : `---`}</div>
            </div>
          </div>

          {dividendProperties && <DividendSettings />}

          {/* You can use the disable class to disable some buttons */}
          <div className="btnx-row">
            <label>Action Buttons</label>
            <div className="row">
              <div className="btnx">
                Edit Dividend Data
              </div>
              <div className="btnx">
                Fund Contract
              </div>
              <div className="btnx">
                Start Dividend Period
              </div>
              <div className="btnx start">
                Pay Dividend
              </div>
            </div>
          </div>

          {coin != null && !coin.isDividendPaymentPeriod && <div className="action-card">
            <div className="img"><img src="https://gineousc.sirv.com/Images/undraw_empty_cart_co35%20(1).svg" alt="" /></div>
            <div className="txt">
              <span>Dividend Payment Period hasn't been activated yet, so Dividend related activities will wait until after *Date String*.</span>
              <span>You can set The Dividend Properties during this time i.e <code>`assign Dividend Period`</code>, <code>`assign Dividend Interval`</code>, <code>assign Dividend Amount</code>.</span>
            </div>
          </div>}

          <div className="div-2">
            <div className="kard exempt">
              <div className="title">Dividend Info</div>
              <div className="r">
                <div className="grided">
                  <div>
                    <span>{coin != null && coin.isDividendPaymentPeriod ? `${coin.holdersList.length > 0 ? formatLargeNumber(coin.holdersList.length) : '0.00'}` : `---`}</span>
                    <span>Eligible Holders</span>
                  </div>
                  <div>
                    <span>{coin != null && coin.isDividendPaymentPeriod ? `${coin.divPercent > 0 ? coin.divPercent : '0.00'}%` : `---`}</span>
                    <span>Dividend percent</span>
                  </div>
                  <div>
                    <span>{coin != null && coin.isDividendPaymentPeriod ? `${coin.divIntervalCountValue > 0 ? coin.divIntervalCountValue : '0.00'}` : `---`}</span>
                    <span>Total Session</span>
                  </div>
                  <div>
                    <span>{coin != null && coin.isDividendPaymentPeriod ? `${coin.divCount > 0 ? coin.divCount : '0'}` : `---`}</span>
                    <span>Session paid</span>
                  </div>
                  <div>
                    <span>{coin != null && coin.isDividendPaymentPeriod ? `${coin.divPercent > 0 ? (coin.divPercent * coin.divIntervalCountValue) : '0.00'}%` : `---`}</span>
                    <span>Total Accumulated Dividend</span>
                  </div>
                </div>
                <div className="grided">
                  <div>
                    <span>{coin != null && coin.divPeriodValue ? `${coin.divPeriodValue > 0 ? `${daysToText(Number(coin.divPeriodValue))}` : '0.00'}` : `---`}</span>
                    <span>Dividend period</span>
                  </div>
                  <div>
                    <span>{coin != null && coin.divIntervalValue ? `${coin.divIntervalValue > 0 ? `${daysToText(Number(coin.divIntervalValue)) }` : '0.00'}` : `---`}</span>
                    <span>Dividend Interval</span>
                  </div>
                  <div>
                    <span>{`---`}</span>
                    <span>Next Dividend Pay Date</span>
                  </div>
                  <div>
                    <span>{coin != null && coin.isDividendPaymentPeriod ? `$ ${coin.contractUSDC > 0 ? formatNum((Number(coin.totalSupply)) / coin.divPercent) : '0.00'}` : `---`}</span>
                    <span>USDC payment per session</span>
                  </div>
                  <div>
                    <span>{coin != null && coin.totalSupply ? `${coin.totalSupply > 0 ? formatNum(coin.totalSupply) : '0.00'}` : `---`}</span>
                    <span>TotalSupply</span>
                  </div>
                  <div>
                    <span>{coin != null && coin.contractUSDC ? `$ ${coin.contractUSDC > 0 ? `${formatNum(coin.contractUSDC)}` : '0.00'}` : `---`}</span>
                    <span>Contract USDC Balance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ownerContext.Provider>
  )
}

export default DividendManagement;
