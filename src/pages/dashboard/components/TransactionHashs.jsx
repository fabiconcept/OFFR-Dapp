import { collection, getDocs } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { fireStore } from '../../../firebase/sdk';
import { contextData } from '../dashboard';
import TdTime from '../token/components/transsactions/TdTime';
import Td from '../token/components/transsactions/TdType';

const TransactionHashs = ({methods, maxL}) => {
    const [transactions, setTransactions] = useState([]);
    const [loadingData, setLoadingData] = useState(false);

    const { coinBase, batchData } = useContext(contextData);

    const fetchTransactions = async () => {
        setLoadingData(true);
        const collectionSnap = await getDocs(collection(fireStore, "user_transactions"));
        let tempArray = [];
        let refinedArray = [];

        collectionSnap.forEach(element => {
            const data = element.data();

            if (data.batch === batchData.batch_name) {
                tempArray.push(data);
            }
        });

        !methods && tempArray.forEach(element => {
            refinedArray.push(element);
        });
        
        const arr = []
        methods && tempArray.forEach(element => {
            if (methods.includes(element.type)) {
                refinedArray.push(element);
            }
        });

        refinedArray.sort((a, b) => {
            let timestampA = new Date(a.timestamp);
            let timestampB = new Date(b.timestamp);
            if (timestampA < timestampB) {
                return -1;
            }
            if (timestampA > timestampB) {
                return 1;
            }
            return 0;
        }).reverse();

        const max = maxL ? maxL : 10;
        const total = refinedArray.length - max;

        if (total > 0) {
            refinedArray.splice(-total, total);
        }

        setTransactions(refinedArray);
        setLoadingData(false);
    }

    useEffect(() => {
        if (coinBase) {
            if (batchData !== null) {
                fetchTransactions();
            }
        }
    }, [coinBase, batchData]);

    return (
        <div className="div-table">
            {loadingData && <div className="pending">
                <img src="https://gineousc.sirv.com/Images/sp.gif" alt="" />
            </div>}
            <label>Last {maxL ? maxL : "10"} Transactions</label>
            <table>
                <thead>
                    <tr>
                        <td>Hash</td>
                        <td className='mb'>Sender</td>
                        <td className='mb amt'>Method</td>
                        <td className='amt'>Amount</td>
                        <td className='mb'>Date</td>
                    </tr>
                </thead>
                <tbody>
                    {transactions.length > 0 && transactions.map(transaction => (
                        <tr key={transaction.hash}>
                            <td className='ad'><a href={`https://sepolia.etherscan.io/tx/${transaction.hash}`} target="_blank" rel="noopener noreferrer">{transaction.hash}</a></td>
                            <td className='ad mb'>{transaction.from}</td>
                            <Td type={(transaction.type)} />
                            <td className='amt'>{transaction.type === 1 ? (Number((transaction.amount / (10 ** 18)).toFixed(2)).toLocaleString()): `${(Number(transaction.amount))} gwei`}</td>
                            <TdTime timestamp={(transaction.timestamp)} />
                        </tr>
                    ))}
                </tbody>
            </table>
            {transactions.length === 0 && <div className="empty">No Transactions...</div>}
        </div>
    )
}

export default TransactionHashs;