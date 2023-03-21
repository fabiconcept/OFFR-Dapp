import React, { useContext, useEffect, useState } from 'react';
import { tokenSaleContext } from '../../card/startTokenSale';

const DividendAmount = () => {
    const { setDividendPercentage, dividendPercentage, setDividendIntializationPeriodTime } = useContext(tokenSaleContext);
    const [amount, setAmount] = useState(dividendPercentage);
    const [selectedPeriod, setSelectedPeriod] = useState(0);

    /**
     * "If the selectedPeriod is 0, set the dividendIntializationPeriodTime to 30 * 24 * 60 * 60,
     * otherwise if the selectedPeriod is 1, set the dividendIntializationPeriodTime to 60 * 24 * 60 *
     * 60, otherwise if the selectedPeriod is 2, set the dividendIntializationPeriodTime to 90 * 24 *
     * 60 * 60, otherwise if the selectedPeriod is 3, set the dividendIntializationPeriodTime to 120 *
     * 24 * 60 * 60, otherwise if the selectedPeriod is 4, set the dividendIntializationPeriodTime to
     * 150 * 24 * 60 * 60, otherwise if the selectedPeriod is 5, set the
     * dividendIntializationPeriodTime to 180 * 24 * 60 * 60, otherwise set the
     * dividendIntializationPeriodTime to 30 * 24 * 60 * 60."</code>
     */
    function generateTimpstampValue () {
        switch (parseInt(selectedPeriod)) {
            case 0:
                setDividendIntializationPeriodTime(30 * 24 * 60 * 60)
                break;
            case 1:
                setDividendIntializationPeriodTime(60 * 24 * 60 * 60)
                break;
            case 2:
                setDividendIntializationPeriodTime(90 * 24 * 60 * 60)
                break;
            case 3:
                setDividendIntializationPeriodTime(120 * 24 * 60 * 60)
                break;
            case 4:
                setDividendIntializationPeriodTime(150 * 24 * 60 * 60)
                break;
            case 5:
                setDividendIntializationPeriodTime(180 * 24 * 60 * 60)
                break;
        
            default:
                setDividendIntializationPeriodTime(30 * 24 * 60 * 60)
                break;
        }
    }

    /* Setting the dividendIntializationPeriodTime to the selectedPeriod. */
    useEffect(()=>{
        generateTimpstampValue();
    }, [selectedPeriod]);

    /* Setting the dividendPercentage to the amount. */
    useEffect(()=>{
        if (amount > 0) {
            setDividendPercentage(amount);
        }
    }, [amount]);


    return (
        <div className="div-carosel">
            <div className="flex-form">
                <label>Dividend Intialization Period</label>
                <div className="inp-box">
                    <select className='inp' onChange={(e)=>setSelectedPeriod(e.target.value)}>
                        <option value="0">30 Days ~ (1 Month)</option>
                        <option value="1">60 Days ~ (2 Months)</option>
                        <option value="2">90 Days ~ (3 Months)</option>
                        <option value="3">120 days ~ (4 Months)</option>
                        <option value="4">150 days ~ (5 Months)</option>
                        <option value="5">180 days ~ (6 Months)</option>
                    </select>
                </div>
                <label>Dividend Percent</label>
                <div className={`inp-box`}>
                    <input type="number" value={amount}  onChange={(e)=>setAmount(Number(e.target.value <= 100 ? e.target.value : 1))} name="" placeholder='100%' id="" className="inp" />
                </div>
            </div>
            <br />
        </div>
    )
}

export default DividendAmount;