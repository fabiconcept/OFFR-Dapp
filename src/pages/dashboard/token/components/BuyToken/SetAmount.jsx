import React, { useEffect } from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import { formatNum, formatNumFreeStyle, moneyFormat } from '../../../../../useful/useful_tool';
import { contextData } from '../../../dashboard';
import { buyData } from '../../card/BuyToken';

const SetAmount = () => {
    const { toUsd, currency,  setBuyArr, setCurrentPage } = useContext(buyData);
    const { coinBase, contract } = useContext(contextData);
    const [scr, setScr] = useState('0');
    const [offr, setOffr] = useState(0);
    const [offrC, setOffrC] = useState(null);
    const [bal, setBal] = useState("");
    const [coinInfo, setCoinInfo] = useState(null);


    useEffect(() => {
        if (contract !== null) {
            setOffrC(contract[0]);
        }
    }, [contract]);

    const fetchOFFR = async () => {
        if (coinBase) {
            const symbol = await offrC.symbol();
            const myBalance = await offrC.balanceOf(coinBase?.coinbase);

            const data = {
                symbol,
                myBalance,
            }
            setCoinInfo(data);
        }
    }

    useEffect(() => {
        if (offrC !== null) {
            fetchOFFR();
        }
    }, [offr, coinBase, offrC]);

    const keyPressHandler = (e) => {
        let str = `${scr}${e}`;
        if (str.startsWith("0.")) {
            str = `${scr}${e}`;
        } else if (scr > 0) {
            str = `${scr}${e}`;
        } else {
            str = `${e}`;
        }

        let testOffr = parseFloat(str)/(toUsd / 1);
        let testParam;
        if (currency === 2) {
            testParam = parseFloat(coinBase.balance) / (10**18);
        }else{
            testParam = parseFloat(bal);
        }
        const testValue = testOffr <= testParam;

        
        if(testValue){
            setScr(str);
        }
    }

    const backspaceHandler = () => {
        let str = (scr).toString();
        str = str.slice(0, -1);
        if (parseFloat(str) > 0) {
            setScr(parseFloat(str));
        } else {
            setScr(0);
        }
    }

    const setMaxHandler = (e) => {
        if (e) {
            setScr(Math.floor(e*(toUsd/1))-0.005);
        }
    }

    const proceedHandler = () => {
        const amount = parseFloat(scr);
        const crypto = currency;
        const offrValue = offr;

        
        let testOffr = parseFloat(scr)/(toUsd / 1);
        let testParam;
        if (currency === 2) {
            testParam = parseFloat(coinBase.balance) / (10**18);;
        }else{
            testParam =parseFloat(bal);
        }
        const testValue = testOffr <= testParam;


        if (scr > 0 && testValue) {
            setBuyArr({ amount, crypto, offrValue });
            setScr(0);
            setCurrentPage(2);
        }
    }

    useEffect(() => {
        if (scr > -1) {
            setOffr(scr/(toUsd / 1));
        }
    }, [scr]);

    const getUSDC = async() =>{
        const userBalance = await contract[1].balanceOf(coinBase.coinbase);
        setBal(Number(userBalance) / (10**18));
    }

    useEffect(()=>{
        if (currency === 1) {
            getUSDC();
        }else{
            setBal((formatNum(coinBase.balance)));
        }
    }, [contract]);

    return (
        <div className="div-carosel">
            <div className="calc">
                <div className="tagger">
                    <div className="tag">
                        {<span onClick={() => setMaxHandler(bal)}>{currency === 1 && "USDC"}{currency === 2 && "ETH"}: {formatNumFreeStyle(bal)}</span>}
                    </div>
                </div>
                {offr !== "0" &&<div className="offr">~ It'll cost you <b>{moneyFormat((offr), 2)}</b> {`${toUsd && (currency === 1 ? 'USDC' : 'ETH')}`}.</div>}
                <div className="screen">
                    <div className={`num`} data-symbol={` ${coinInfo && coinInfo.symbol}`}><span>{moneyFormat(scr)}</span></div>
                </div>
                <div className="btns">
                    <div onClick={() => keyPressHandler(1)} className="b">1</div>
                    <div onClick={() => keyPressHandler(2)} className="b">2</div>
                    <div onClick={() => keyPressHandler(3)} className="b">3</div>
                    <div onClick={() => keyPressHandler(4)} className="b">4</div>
                    <div onClick={() => keyPressHandler(5)} className="b">5</div>
                    <div onClick={() => keyPressHandler(6)} className="b">6</div>
                    <div onClick={() => keyPressHandler(7)} className="b">7</div>
                    <div onClick={() => keyPressHandler(8)} className="b">8</div>
                    <div onClick={() => keyPressHandler(9)} className="b">9</div>
                    <div onClick={backspaceHandler} className="bl"><img src="https://gineousc.sirv.com/Images/icons/bks.png" alt="" /></div>
                    <div className="b" onClick={() => keyPressHandler(0)}>0</div>
                    <div onClick={proceedHandler} className="bl"><img src="https://gineousc.sirv.com/Images/icons/ch.png" alt="" /></div>
                </div>
            </div>
        </div>
    )
}

export default SetAmount;