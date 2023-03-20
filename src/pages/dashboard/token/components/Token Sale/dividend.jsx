import React, { useContext, useEffect, useState } from 'react';
import { tokenSaleContext } from '../../card/startTokenSale';

const Dividend = () => {
    const { divData, setDivData, setDividends } = useContext(tokenSaleContext);
    const [temp, setTemp] = useState({
        period: 0,
        interval: 0
    });

    const genData = () =>{
        let obj = {
            period: 0,
            interval: 0
        }

        switch (parseInt(temp.period)) {
            case 0:
                obj.period = 30 * 24 * 60 * 60;
                break;
            case 1:
                obj.period = 90 * 24 * 60 * 60;
                break;
            case 2:
                obj.period = 180 * 24 * 60 * 60;
                break;
            case 3:
                obj.period = 365 * 24 * 60 * 60;
                break;
            case 4:
                obj.period = 545 * 24 * 60 * 60;
                break;
            case 5:
                obj.period = 730 * 24 * 60 * 60;
                break;
                
            default:
                obj.period = 30 * 24 * 60 * 60;
                break;
        }
        switch (parseInt(temp.interval)) {
            case 0:
                obj.interval = 7 * 24 * 60 * 60;
                break;
            case 1:
                obj.interval = 30 * 24 * 60 * 60;
                break;
            case 2:
                obj.interval = 60 * 24 * 60 * 60;
                break;
            case 3:
                obj.interval = 90 * 24 * 60 * 60;
                break;
            case 4:
                obj.interval = 180 * 24 * 60 * 60;
                break;
        
            default:
                obj.interval = 30 * 24 * 60 * 60;
                break;
        }
        
        setDividends(obj);
        setDivData(temp);
    }

    useEffect(()=>{
        genData();
    },[temp]);

    return (
        <div className="div-carosel">
            <div className="flex-form">
                <label>Dividend Period</label>
                <div className="inp-box">
                    <select className='inp' defaultValue={temp.period} onChange={(e)=>setTemp({...temp, period: e.target.value})}>
                        <option value="0">30 Days ~ (1 Month)</option>
                        <option value="1">90 Days ~ (3 Months)</option>
                        <option value="2">180 Days ~ (6 Months)</option>
                        <option value="3">365 days ~ (1 Year)</option>
                        <option value="4">545 days ~ (1 Year, Six Months)</option>
                        <option value="5">730 days ~ (2 Year)</option>
                    </select>
                </div>
                <label>Dividend Intervals</label>
                <div className="inp-box">
                    <select className='inp' defaultValue={temp.interval} onChange={(e)=>setTemp({...temp, interval: e.target.value})}>
                        <option value="0">7 Days ~ (Weekly)</option>
                        {temp.period >=1 && <option value="1">30 Days ~ (Monthly)</option>}
                        {temp.period >=2 &&<option value="2">60 Days ~ (Every 2 Months)</option>}
                        {temp.period >=2 && <option value="3">90 Days ~ (Every 3 Months)</option>}
                        {temp.period >=4 && <option value="4">180 Days ~ (Every 6 Months)</option>}
                    </select>
                </div>
            </div>
            <br />
        </div>
    )
}

export default Dividend;