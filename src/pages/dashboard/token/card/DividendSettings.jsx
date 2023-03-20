import React, { useContext, useState } from 'react';
import { ownerContext } from '../../pages/Dividend Management';

export const dividendContext = React.createContext();
const DividendSettings = () => {
    const { setDividendProperties } = useContext(ownerContext);
    const [pending, setPending] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [canProceed, setCanProceed] = useState(false);
    const [transactionStatus, setTransactionStatus] = useState(false);
    const [steps, setSteps] = useState({
        _step1: false,
        _step2: false,
        _step3: false,
        _step4: false
    });

    return (
        <dividendContext.Provider value={{setPending, setCurrentPage}}>
            <div className="cover">
                <div className="div"> 
                    {pending && <div className="pending">
                        <div className="loadingio-spinner-gear-abqyc1i9wu"><div className="ldio-r68llg26yv">
                            <div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                        </div></div>
                    </div>}
                    {!pending && <div className="close" onClick={()=>setDividendProperties(false)}>x</div>}
                    <div className="title">Dividend Properties</div>
                </div>
            </div>
        </dividendContext.Provider>
    )
}

export default DividendSettings;