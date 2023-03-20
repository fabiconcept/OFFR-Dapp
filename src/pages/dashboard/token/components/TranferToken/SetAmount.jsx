import React, { useContext, useEffect } from 'react';
import { useState } from 'react';
import { formatNum, formatNumFreeStyle, moneyFormat } from '../../../../../useful/useful_tool';
import { contextData } from '../../../dashboard';
import { transferData } from '../../card/TranferTokens';

const SetAmount = () => {
    const { contract, coinBase } = useContext(contextData);
    const {setSendAMount, setSymbol, setCurrentPage, setPending, setOldBalance} = useContext(transferData);

    const [scr, setScr] = useState('0');
    const [offr, setOffr] = useState(null);

    const [coinInfo, setCoinInfo] = useState(null);


    useEffect(() => {
        if (contract !== null) {
            setOffr(contract[0]);
        }
    }, [contract]);


    const keyPressHandler = (e) => {
        if(coinInfo){
            let str = `${scr}${e}`;
            if (str.startsWith("0.")) {
                str = `${scr}${e}`;
            } else if (scr > 0) {
                str = `${scr}${e}`;
            } else {
                str = `${e}`;
            }

            const tkn = parseFloat(coinInfo.myBalance / (10**18));
            const test = parseFloat(str) < tkn;

            if(test) {
                setScr(str);
            }
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
            const tkn = parseFloat(e / (10**18)) - 1;
            setScr(tkn);
        }
    }

    const proceedHandler = () => {
        const amountToSend = scr;
        setSendAMount(amountToSend);
        setSymbol(coinInfo.symbol);
        setCurrentPage(2);
        const bal = (coinInfo?.myBalance / (10**18));
        setOldBalance(bal);
    }


    const fetchOFFR = async () => {
        if (coinBase) {
            const symbol = await offr.symbol();
            const myBalance = await offr.balanceOf(coinBase?.coinbase);

            const data = {
                symbol,
                myBalance,
            }
            setCoinInfo(data);
        }
    }

    useEffect(() => {
        if (offr !== null) {
            fetchOFFR();
        }
    }, [offr, coinBase]);

    useEffect(() => {
        if(coinInfo){
            setPending(false);
        }else{
            setPending(true);
        }
    }, [coinInfo]);




    return (
        <div className="div-carosel">
            <div className="calc">
                {coinInfo && <div className="tagger">
                    <div className="tag" onClick={()=>setMaxHandler((coinInfo?.myBalance))}>
                        {<span>{coinInfo && coinInfo?.symbol}: {coinInfo && formatNum(coinInfo?.myBalance)}</span>}
                    </div>
                </div>}
                <div className="offr"></div>
                <label>Enter Amount</label>
                <div className="screen">
                    <div className={`num`} data-symbol={` ${coinInfo && coinInfo?.symbol}`}><span>{moneyFormat(scr)}</span></div>
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