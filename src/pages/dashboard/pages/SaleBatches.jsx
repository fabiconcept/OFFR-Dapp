import React, { useState } from 'react';
import Batches from './SaleBatches components/Batches';

export const BatchContext = React.createContext();
const SaleBatches = () => {
    const [loading, setLoading] = useState(false);

    return (
        <BatchContext.Provider value={{setLoading}}>
            <div className="dash_section">
                {loading && <div className="pending">
                    <img src="https://gineousc.sirv.com/Images/sp.gif" alt="" />
                </div>}
                <div className="dash-batches">
                    <label>Sales Batches</label>
                    <Batches/>
                </div>
            </div>
        </BatchContext.Provider>
    )
}

export default SaleBatches;