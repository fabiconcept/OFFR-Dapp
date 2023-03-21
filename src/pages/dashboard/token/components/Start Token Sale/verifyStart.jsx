import { ethers } from 'ethers';
import { collection, doc, setDoc } from 'firebase/firestore';
import React, { useContext } from 'react';
import { toast } from 'react-hot-toast';
import { fireStore } from '../../../../../firebase/sdk';
import { daysBetween } from '../../../../../useful/useful_tool';
import { ABI3, address3 } from '../../../../../util/constants/tokenHandlerContract';
import { contextData } from '../../../dashboard';
import { tokenSaleContext } from '../../card/startTokenSale';

const VerifyStart = () => {
    const { setTransactions, transactions } = useContext(contextData);
    const {dates, setPending, setTransactionStatus, setCurrentPage, dividendIntializationPeriodTime, dividendPercentage, dividend, batchNameTxt,} = useContext(tokenSaleContext);

    
    /**
     * This function saves the data to the database.
     */
    const saveTokenSaleBatch = async(hash) =>{
        const batchRef = collection(fireStore, `Token_Sale_Batches`);
        const divRef = collection(fireStore, `Dividend_data`);

        const startVal= new Date(dates.start).getTime();
        const endVal= new Date(dates.end).getTime();

        const db_data ={
            batch_name: batchNameTxt,
            startDate: startVal,
            endDate: endVal,
            sold: 0,
            status: true,
        }

        const divObject = {
            DividendPeriod: ((parseFloat(dividend.period)) / (24 * 60 * 60)),
            DividendIntervals: ((parseFloat(dividend.interval)) / (24 * 60 * 60)),
            DividendsPercent: dividendPercentage,
            dividendIntializationPeriodTime,
        }

        /* Saving the data to the database. */
        await setDoc(doc(batchRef, `${hash}`), db_data);
        dividendPercentage > 0 && await setDoc(doc(divRef, `${hash}`), divObject);
    }

    /**
     * It calls the startSale function in the smart contract, then calls the setDividendPeriod,
     * setDividendInterval and setDividendPercent functions in the smart contract.
     * </code>
     */
    const startHandlerHandler = async() =>{
        setPending(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const signer = await provider.getSigner();

        /* Creating a new instance of the smart contract. */
        const tokenHandler = new ethers.Contract(address3, ABI3, signer);

        const startVal= new Date(dates.start).getTime();
        const endVal= new Date(dates.end).getTime();
        
        try {
            const transactionDate = new Date();
            const timeStamp = transactionDate.toISOString().slice(0, 19).replace('T', ' ');

            let fromAddress;
            /* Getting the address of the signer. */
            await (signer.getAddress()).then((result)=>{
                fromAddress = result;
            });
            
            /* Calling the `startSale` function in the smart contract. */
            const startTokenSale = await tokenHandler.startSale(startVal, endVal, batchNameTxt, {
                from: signer.getAddress(),
            });

            await startTokenSale.wait().then(async (result) => {
                /* Adding a new transaction to the transactions array. */
                setTransactions([...transactions, { hash: result.transactionHash, type: 3, amount: `${Number(result.gasUsed)}`, from: fromAddress, timestamp: timeStamp, batch: batchNameTxt }]);
                /* Saving the data to the database. */
                await saveTokenSaleBatch(result.transactionHash);
            });

            const setDividendProperties = await tokenHandler.setDividendProperties(dividend.period, dividend.interval, (dividendPercentage * 1000), {
                from: signer.getAddress(),
            });

            /* Setting the transaction status to true and setting the current page to 4. */
            await setDividendProperties.wait().then(async()=>{
                setTransactionStatus(true);
                setCurrentPage(4);
            });
            setPending(false);
        } catch (error) {
            console.log(error);
            setTransactionStatus(false);
            setPending(false);
            throw "An error Occurred";
        }
    }

    /**
     * It takes a promise and a config object as arguments. The config object has three properties:
     * loading, success and error. The loading property is the message that will be displayed while the
     * promise is pending. The success property is the message that will be displayed when the promise
     * resolves. The error property is the message that will be displayed when the promise rejects.
     */
    const startHandler = () =>{
        const promise = startHandlerHandler();
        toast.promise(promise,{
            loading: "Processing, This could take a few miuntes.",
            success: "✨ Hurray! Sale date set.",
            error: 'An error occurred'
        })
    }

    return (
        <div className="div-carosel">
            <section className='inf'>
                <div>
                    <span>Start Date:</span>
                    <span>{new Date(dates.start).toLocaleString()}</span>
                </div>
                <div>
                    <span>End Date:</span>
                    <span>{new Date(dates.end).toLocaleString()}</span>
                </div>
                <div>
                    <span>Sales Duration: </span>
                    <span>{daysBetween(dates.start, dates.end)} Days</span>
                </div>
                {dividendPercentage > 0 && <div>
                    <span>dividend Percentage: </span>
                    <span>{(parseFloat(dividendPercentage)).toFixed(2)}%</span>
                </div>}
                {dividend.period > 0 && <div>
                    <span>Period: </span>
                    <span>{(parseFloat(dividend.period)) / (24 * 60 * 60)} Days</span>
                </div>}
                {dividend.interval > 0 && <div>
                    <span>Intervals: </span>
                    <span>{(parseFloat(dividend.interval)) / (24 * 60 * 60)} Days</span>
                </div>}
            </section>

            <div className="r">
                <div className="btnx" onClick={startHandler}>Start Sale</div>
            </div>
            <br />
        </div>
    )
}

export default VerifyStart;