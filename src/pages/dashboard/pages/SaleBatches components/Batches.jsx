import { collection, getDocs } from 'firebase/firestore';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { fireStore } from '../../../../firebase/sdk';
import { BatchContext } from '../SaleBatches';
import Batch from './Batch';

export const batchesContext = React.createContext()
const Batches = () => {
    const [selected, setSelected] = useState(0);
    const { setLoading } = useContext(BatchContext);
    const [batchesArray, setBatchesArray] = useState([]);

    const fetchBatches = async () => {
        setLoading(true);
        const collectionSnap = await getDocs(collection(fireStore, "Token_Sale_Batches"));

        const tempArray = [];

        collectionSnap.forEach(element => {
            const data = element.data();
            const id = element.id;

            const newData = {...data, id}
            tempArray.push(newData);
        });
        tempArray.sort((a, b) => a.startDate - b.startDate);

        setBatchesArray(tempArray.reverse());
        setLoading(false);
    }
    const ref = useRef(null);
    
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setSelected(0);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref]);

    useEffect(()=>{
        fetchBatches();
    }, []);

    let ids = 1;

    return (
        <batchesContext.Provider value={{ selected, setSelected }}>
            <div className="grided" ref={ref}>
                {batchesArray.length > 0  && batchesArray.map(i=> (<Batch id={ids++} data={i} key={i.id} />))}
                {batchesArray.length === 0 && <div className="no-data">
                    No data
                    <div className="img">
                        <div><img src="https://gineousc.sirv.com/Images/icons/external-ghost-halloween-vitaliy-gorbachev-lineal-vitaly-gorbachev.png" alt="" /></div>
                    </div>
                </div> }
                <div className="floor" onClick={() => setSelected(0)}></div>
            </div>
        </batchesContext.Provider>
    );
}

export default Batches;