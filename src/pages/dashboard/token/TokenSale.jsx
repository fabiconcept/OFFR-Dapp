import { ethers } from 'ethers';
import React, { useContext, useEffect, useState } from 'react';
import { bigNum, formatNum } from '../../../useful/useful_tool';
import { address } from '../../../util/constants/tokenContract';
import { ABI3, address3 } from '../../../util/constants/tokenHandlerContract';
import { contextData } from '../dashboard';
import { walletData } from '../pages/Wallet';
import BuyToken from './card/BuyToken';
import TranferTokens from './card/TranferTokens';
import Clock from './components/BuyToken/clock';
import SendToken from './sendToken';

const TokenSale = ({buyRef, transferRef}) => {
    const { setMini, setOnSale, setLoading } = useContext(walletData);
    const [buying, setBuying] = useState(false);
    const [transfering, setTransfering] = useState(false);
    const { contract, coinBase } = useContext(contextData);
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
    }, [offr, coinBase, buying, transfering]);


    function formatDate(date) {
        const months = [
            "january",
            "february",
            "march",
            "april",
            "may",
            "june",
            "july",
            "august",
            "september",
            "october",
            "november",
            "december"
        ];

        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();

        const monthName = months[monthIndex];

        return `${day} ${monthName}, ${year}`;
    }

    const fetchOFFR = async () => {
        setLoading(true);
        if (coinBase) {
            const name = await offr.name();
            const symbol = await offr.symbol();
            const max = await offr.totalSupply();
            const decimals = await offr.decimals();
            const totalSupply = await offr.totalSupply();
            let cap = await offr.cap();
            cap = bigNum(cap);
            const beneficiaryAddress = await offr._beneficiary();
            const contractAdress = address;
            const myBalance = await offr.balanceOf(coinBase?.coinbase);

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = await provider.getSigner();

            const OffrToken = new ethers.Contract(address3, ABI3, signer);
            const tokenSale = await OffrToken.tokensale_open();
            const salesEndDate = Number(await OffrToken.getSaleEndDate());
            const salesStartDate = Number(await OffrToken.startTimestamp());

            const txtEndDate = formatDate(new Date(salesEndDate));
            const txtStartDate = formatDate(new Date(salesStartDate));

            setMini({
                startDate: txtStartDate,
                endDate: txtEndDate,
                status: tokenSale
            });

            setOnSale(tokenSale);

            const data = {
                name,
                symbol,
                max,
                decimals,
                totalSupply,
                beneficiaryAddress,
                contractAdress,
                myBalance,
                cap,
                tokenSale,
                txtEndDate,
            }

            setCoinInfo(data);
            setLoading(false);
        }
    }

    return (
        <div className="grid-card tk">
            {buying && <BuyToken setBuying={setBuying} />}
            {transfering && <TranferTokens setTransfering={setTransfering}/>}
            <div className="sec">
                <div className="p">Token Sale</div>
                <div className="s">{coinInfo ? `${coinInfo.tokenSale ? coinInfo.txtEndDate: "Sale Has Ended"}` : "-- --- ---"}</div>
            </div>

            <div className="sec st">
                <section>
                    <div className="p">Max Supply</div>
                    <div className="m">{formatNum(coinInfo?.cap)}</div>
                </section>
                <section>
                    <div className="p">Total Supply</div>
                    <div className="m">{formatNum(coinInfo?.totalSupply)}</div>
                </section>
            </div>

            <div className="rng">
                <div className="ld" data-hover={`${((100/(coinInfo?.cap)) * (coinInfo?.totalSupply)).toFixed(8)}%`} style={{width: `${(100/(coinInfo?.cap)) * (coinInfo?.totalSupply)}%`}}></div>
            </div>
            
            <Clock endDate={coinInfo ? `${coinInfo.tokenSale ? coinInfo.txtEndDate: null}` : null} />
            
            <input style={{display: "none"}} type="hidden" ref={buyRef} onClick={()=>setBuying(true)} />
            <input style={{display: "none"}} type="hidden" ref={transferRef} onClick={()=>setTransfering(true)} />

            <SendToken buyRef={buyRef} transferRef={transferRef} />
        </div>
    )
}

export default TokenSale;