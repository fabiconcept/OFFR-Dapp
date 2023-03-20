import { ethers } from 'ethers';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { formatNum, toEth } from '../../../../../useful/useful_tool';
import { ABI, address } from '../../../../../util/constants/tokenContract';
import { contextData } from '../../../dashboard';
import { transferData } from '../../card/TranferTokens';

const VerifyTransfer = () => {
    const { transData, setPending, setStatus, setCurrentPage } = useContext(transferData);
    const { setTransactions, transactions, batchData } = useContext(contextData);
    const [bought, setBought] = useState(false);
    const [tempTransactionHolder, setTempTransactionHolder] = useState([]);

    useEffect(() => {
        setTempTransactionHolder(transactions);
    }, [transactions]); 

    useEffect(() => {
        if (tempTransactionHolder.length > 0) {
            setTransactions(tempTransactionHolder);
        }
    }, [tempTransactionHolder]);

    const approveHandler = async () => {
        setPending(true);
        try {
            // Request the user's Ethereum accounts
            const provider = new ethers.providers.Web3Provider(window.ethereum);

            const amountETH = transData.sendAmount;

            // Get the contract signer
            const signer = await provider.getSigner();

            // Connect to the contract
            const OffrToken = new ethers.Contract(address, ABI, signer);
            const value = toEth(amountETH);

            const approved = await OffrToken.approve(signer.getAddress(), value);
            const transactionDate = new Date();
            const timeStamp = transactionDate.toISOString().slice(0, 19).replace('T', ' ');
            let fromAddress;

            await (signer.getAddress()).then((result) => {
                fromAddress = result;
            });

            await approved.wait().then(async (i) => {
                const to = transData.toAddress;
                const sendTransfer = await OffrToken.transfer(to, value);
                await sendTransfer.wait().then(result => {
                    setTransactions([...transactions, { hash: result.blockHash, type: 2, amount: value, from: fromAddress, timestamp: timeStamp, batch: batchData.batch_name }]);
                    setBought(true);
                    setStatus(true);
                    setCurrentPage(4);
                    setPending(false);
                });
            });

        } catch (error) {
            setCurrentPage(4);
            setBought(true);
            setStatus(false);
            setPending(false);
            throw error;
        }
    };

    useEffect(() => {
        setStatus(bought);
    }, [bought]);


    const approveHandlerWatch = () =>{
        const promise = approveHandler();
        toast.promise(promise, {
            loading: "Sending Tokens...",
            success: "Tokens sent.",
            error: "An error occurred",
        })
    }


    return (
        <div className="div-carosel">
            <div className="c">
                <div className="title">Transfer {formatNum(transData.sendAmount)} ({transData.symbol})</div>
                <div className="p">Do you want to send {formatNum(transData.sendAmount)} ({transData.symbol}) to {transData.toAddress}?</div>
            </div>
            <section className='inf'>
                <div>
                    <span>Asset:</span>
                    <span>{transData.symbol ? transData.symbol : <img src="https://gineousc.sirv.com/Images/sp.gif" alt="" />}</span>
                </div>
                <div>
                    <span>From:</span>
                    <span>{transData.fromAddress ? transData.fromAddress : <img src="https://gineousc.sirv.com/Images/sp.gif" alt="" />}</span>
                </div>
                <div>
                    <span>To:</span>
                    <span>{transData.toAddress ? transData.toAddress : <img src="https://gineousc.sirv.com/Images/sp.gif" alt="" />}</span>
                </div>
                <div>
                    <span>Amount:</span>
                    <span>{formatNum(transData.sendAmount)} </span>
                </div>
            </section>

            <div className="r">
                <div className="btnx" onClick={approveHandlerWatch}>Approve</div>
                <div className="btnx c">Cancel</div>
            </div>
        </div>
    );
}

export default VerifyTransfer;