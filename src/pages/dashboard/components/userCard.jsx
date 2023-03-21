import { ethers } from 'ethers';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import { formatNum, getPercentage, getDateDiff } from '../../../useful/useful_tool';
import { ABI3, address3 } from '../../../util/constants/tokenHandlerContract';
import { contextData } from '../dashboard';

const UserCard = ({ setSettingDp }) => {
    const { storeDataUser, coinBase, setLogOut, contract } = useContext(contextData); 
    const [user, setUser] = useState(null);
    const [coinbase, setCoinbase] = useState(null);
    const [usdc, setUsdc] = useState(0);
    const [tokenSaleEnded, setTokenSaleEnded] = useState(false);
    const [saleDate, setSaleDate] = useState({
        start: null,
        end: null
    });
    const [dividendPercent, setDividendPercent] = useState(0);

    const getUSDC = async () => {
        const userBalance = await contract[1].balanceOf(coinBase.coinbase);
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const signer = await provider.getSigner();

        const tokenHandler = new ethers.Contract(address3, ABI3, signer);

        setTokenSaleEnded(await tokenHandler.isDividendPaymentPeriodActive());
        setDividendPercent(Number(await tokenHandler.getDividendPercent()));
        // console.log(tokenHandler);
        const dat1 = (new Date(Number(await tokenHandler.startTimestamp())));
        const dat2 = (new Date(Number(await tokenHandler.getSaleEndDate())));

        const value = userBalance / (10**18);
        setUsdc(formatNum(value));
    }

    useEffect(() => {
        if (storeDataUser !== null && coinBase) {
            setUser(storeDataUser);
            setCoinbase(coinBase);
            getUSDC();
        }
    }, [storeDataUser, coinBase]);



    return (
        <div className="usercard">
            <div className="top">
                {user ? user.name : "@username"}
            </div>
            <div className="infocard br">
                <div className="profile-circle">
                    <div className="img" onClick={() => user && setSettingDp(true)}>
                        {user && <img src={user?.dp} alt="" />}
                        {!user && <img src="https://gineousc.sirv.com/Images/Infinite.gif" alt="" />}
                    </div>
                </div>
                <div className="info">
                    <div className="">{user ? user.name : "@username"}</div>
                    <div className="bts">
                        <div className="btnx">View profile</div>
                        <div className="btnx d" onClick={() => setLogOut(true)}>disconnect</div>
                    </div>
                </div>
            </div>
            <div className="infocard">
                <div className="top">
                    <div className="card-ico us"><img src="https://gineousc.sirv.com/Images/icons/usd-coin-usdc-logo.svg" alt="" /></div>
                </div>
                <div className="details"><div>{usdc}</div>USDC</div>
                <div className="p">Your USDC Balance</div>
            </div>
            <div className="infocard">
                <div className="top">
                    <div className="card-ico"><img src="https://gineousc.sirv.com/Images/icons/eth.png" alt="" /></div>
                </div>
                <div className="details">{coinbase?.balance ? (formatNum((coinbase?.balance))) : <img src="https://gineousc.sirv.com/Images/sp.gif" alt="" />} ETH</div>
                <div className="p">Your Eth Balance</div>
            </div>
            {<div className="infocard">
                <div className="title">Dividend Pay</div>
                <div className="s">{tokenSaleEnded && <br />}{!tokenSaleEnded ? "Dividend period will commence three months after token sale ends" : "in Progress"}</div>
                {tokenSaleEnded && <div className="prog-bar">
                    <div className="bar" style={{ width: `${saleDate.start === null ? 0 : getPercentage(saleDate.start, saleDate.end)}%` }}></div>
                </div>}
                {dividendPercent && <div className="value">{dividendPercent}%</div>}
                {tokenSaleEnded && <div className="info">
                    <div className="t-s">{saleDate.start === null ? "0" : getPercentage(saleDate.start, saleDate.end)}%</div>
                    <div className="p">{saleDate.start === null ? "Token sales is ongoing" : getDateDiff(saleDate.start, saleDate.end)}</div>
                </div>}
            </div>}
        </div>
    )
}

export default UserCard;