import React, { useContext, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { ownerContext } from '../../pages/Owner';
import Confirmation from '../components/Token Sale/confirmation';
import Dividend from '../components/Token Sale/dividend';
import DividendAmount from '../components/Token Sale/dividendAmount';
import SetDate from '../components/Token Sale/SetDate';
import VerifyStart from '../components/Token Sale/verifyStart';

export const tokenSaleContext = React.createContext();
const StartTokenSale = () => {
    const { setInitiateTokenSale, setSalesStarted } = useContext(ownerContext);
    const [divData, setDivData] = useState({
        period: 0,
        interval: 0
    });
    const [pending, setPending] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [dividendIntializationPeriodTime, setDividendIntializationPeriodTime] = useState(0);
    const [dividendPercentage, setDividendPercentage] = useState(0);
    const [batchNameTxt, setBatchNameTxt] = useState("");
    const [dividend, setDividends] = useState({
        period: 0,
        interval: 0
    });
    const [dates, setDates] = useState(null);
    const [canProceed, setCanProceed] = useState(false);
    const [transactionStatus, setTransactionStatus] = useState(false);
    const [steps, setSteps] = useState({
        _step1: false,
        _step2: false,
        _step3: false,
        _step4: false
    });

    useEffect(() => {
        if (dates !== null) {
            setSteps({ ...steps, _step1: true });
            setCanProceed(true);
        } else {
            setSteps({ ...steps, _step1: false });
            setCanProceed(false);
        }
    }, [dates]);

    useEffect(() => {
        if (currentPage === 2) {
            if (dividendPercentage !== 0) {
                setSteps({ ...steps, _step3: true });
                setCanProceed(true);
            } else {
                setSteps({ ...steps, _step3: false });
                setCanProceed(false);
            }
        }
    }, [currentPage, dividendPercentage]);

    const closeBtnHandler = () =>{
        transactionStatus && setSalesStarted(true);
        setInitiateTokenSale(false);
    }

    return (
        <tokenSaleContext.Provider value={{ dividendIntializationPeriodTime, setDividendIntializationPeriodTime, dividendPercentage, divData, setDivData, setDividendPercentage, setPending, dividend, setDividends, batchNameTxt, setBatchNameTxt, dates, setDates, transactionStatus, setTransactionStatus, setCurrentPage }}>
            <div className="cover">
                <Toaster/>
                <div className="div wide">
                    {pending && <div className="pending">
                        <div className="loadingio-spinner-gear-abqyc1i9wu"><div className="ldio-r68llg26yv">
                            <div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                        </div></div>
                    </div>}
                    {!pending && <div className="close" onClick={closeBtnHandler}>x</div>}
                    <div className="title">Token Sale Information</div>
                    {transactionStatus !== true && <div className="carosel">
                        {<div onClick={() => setCurrentPage(0)} className={`cnt ${currentPage === 0 && "active"} ${steps._step1 && "good"}`}><div></div></div>}
                        {steps._step1 && <div onClick={() => setCurrentPage(1)} className={`cnt ${currentPage === 1 && "active"} good`}><div></div></div>}
                        {steps._step3 && <div onClick={() => setCurrentPage(2)} className={`cnt ${currentPage === 2 && "active"} good`}><div></div></div>}
                        {steps._step3 && <div onClick={() => setCurrentPage(3)} className={`cnt ${currentPage === 3 && "active"} good`}><div></div></div>}
                    </div>}
                    {currentPage == 0 && <SetDate />}
                    {currentPage == 1 && <Dividend />}
                    {currentPage == 2 && <DividendAmount />}
                    {currentPage == 3 && <VerifyStart />}
                    {currentPage == 4 && <Confirmation />}
                    {currentPage <= 3 && <div className="next">
                        {!pending && <div className={`btnx l ${currentPage <= 0 && "hide"}`} onClick={() => setCurrentPage(currentPage - 1)}>
                            <img src="https://gineousc.sirv.com/Images/icons/angle-right.svg" alt="" />
                        </div>}
                        {!pending && currentPage <= 2 && <div className={`btnx ${currentPage >= 4 && "hide"} ${!canProceed && "hide"}`} onClick={() => setCurrentPage(currentPage + 1)}>
                            <img src="https://gineousc.sirv.com/Images/icons/angle-right.svg" alt="" />
                        </div>}
                    </div>}
                </div>
            </div>
        </tokenSaleContext.Provider>
    )
}

export default StartTokenSale;