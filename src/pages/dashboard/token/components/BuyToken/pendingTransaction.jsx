import { ethers } from 'ethers';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { formatNumFreeStyle, moneyFormat, toEth } from '../../../../../useful/useful_tool';
import { ABI2, address2 } from '../../../../../util/constants/usdcContract';
import { contextData } from '../../../dashboard';
import { buyData } from '../../card/BuyToken';
import { ABI3, address3 } from '../../../../../util/constants/tokenHandlerContract';
import { toast } from 'react-hot-toast';

const PendingTransaction = () => {
    const { buyArr, setCurrentPage, setPending, setBuyTokenData, setApproved, currency} = useContext(buyData);
    const { updateTokenSoldToBatchData, contract, coinBase, setTransactions, transactions, batchData } = useContext(contextData);

    const [offr, setOffr] = useState(null);
    const [coin, setCoin] = useState("");
    const [coinInfo, setCoinInfo] = useState(null);
    const [bought, setBought] = useState(false);

    useEffect(() => {
        if (contract !== null) {
            setOffr(contract[0]);
        }
    }, [contract]);


    /**
     * If coinBase is true, then set the coinInfo state to the data object.
     */
    const fetchOFFR = async () => {

        if (coinBase) {
            const name = await offr.name();
            const symbol = await offr.symbol();
            const max = await offr.totalSupply();
            const decimals = await offr.decimals();
            const totalSupply = await offr.totalSupply()
            const beneficiaryAddress = await offr._beneficiary();
            const myBalance = await offr.balanceOf(coinBase?.coinbase);

            const data = {
                name,
                symbol,
                max,
                decimals,
                totalSupply,
                beneficiaryAddress,
                myBalance
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
        switch (buyArr.crypto) {
            case 1:
                setCoin("USDC");
                break;
            case 2:
                setCoin("ETH");
                break;

            default:
                break;
        }
    }, [buyArr]);

    /**
     * It takes the amount of ETH the user wants to spend, and the amount of tokens they want to buy,
     * and sends it to the contract. 
     * 
     * The contract then sends the tokens to the user, and sends the ETH to the contract owner. 
     **/
    const handleBuyTokenEth = async () => {
        setPending(true);

        try {
            // Request the user's Ethereum accounts
            const provider = new ethers.providers.Web3Provider(window.ethereum);

            const amountETH = (buyArr.offrValue);
            const amountOFFR = buyArr.amount;

            // Get the contract signer
            const signer = await provider.getSigner();

            // Connect to the contract
            const OffrTokenHandler = new ethers.Contract(address3, ABI3, signer);

            const saleOpen = await OffrTokenHandler.tokensale_open();
            const value = toEth(amountETH.toFixed(8));

            const transactionDate = new Date();
            const timeStamp = transactionDate.toISOString().slice(0, 19).replace('T', ' ');
            let fromAddress;

            await (signer.getAddress()).then((result)=>{
                fromAddress = result;
            });

            if (saleOpen) {
                const BuyTokensTransaction = await OffrTokenHandler.buyTokens(toEth(amountOFFR), { 
                    from: signer.getAddress(), 
                    value: value,
                });

                await BuyTokensTransaction.wait().then(i=>{
                    setTransactions([...transactions, {hash: BuyTokensTransaction.hash,  type: 1, amount: toEth(amountOFFR), from: fromAddress, timestamp: timeStamp, batch: batchData.batch_name}]);
                    updateTokenSoldToBatchData(toEth(amountOFFR));
                    const bal = formatNumFreeStyle(coinInfo.myBalance/(10**18));
                    const symbol = coinInfo.symbol;
                    setBuyTokenData({amountOFFR, bal, symbol, failed: false});
                    setBought(true);
                });

            }
            // Reset the usdc state to 0
 
        } catch (error) {
            const msg = error.reason;
            const type = 2;
            // Handle any errors that may occur when calling the buyTokens method
            console.log(error.message);
            setBought(true);
            setBuyTokenData({failed: true});
        }
        setPending(false);
    }
    
    /**
     * It takes the amount of USDC the user wants to spend, and the amount of tokens they want to buy,
     * and then it calls the buyTokens() function on the contract.
     * 
     * The buyTokens() function is defined in the contract as follows:
     * 
     * function buyTokens(uint256 _usdcAmount) public payable {
     *         require(tokensale_open);
     *         require(msg.value == _usdcAmount);
     *         require(msg.sender == usdc_address);
     *         require(usdc_address.allowance(msg.sender) &gt;= _usdcAmount);
     *         require(token_address.balanceOf(msg.sender) &lt;=
     * token_address.balanceOf(address(this)));
     * 
     *         uint256 tokens = _usdcAmount.mul(token_price);
     */
    const handleBuyTokenUSDC = async () => {
        setPending(true);

        try {
            // Request the user's Ethereum accounts
            const provider = new ethers.providers.Web3Provider(window.ethereum);

            const amountUSDC = (buyArr.offrValue);
            const amountOFFR = buyArr.amount;

            // Get the contract signer
            const signer = await provider.getSigner();

            // Connect to the contract
            const OffrToken = new ethers.Contract(address3, ABI3, signer);
            const USDCInstance =  new ethers.Contract(address2, ABI2, signer);
            
            const saleOpen = await OffrToken.tokensale_open();
            const value = toEth(amountUSDC.toFixed(8));

            
            const transactionDate = new Date();
            const timeStamp = transactionDate.toISOString().slice(0, 19).replace('T', ' ');
            let fromAddress;
            
            await (signer.getAddress()).then((result)=>{
                fromAddress = result;
            });

            if(saleOpen){
                const approveUSDC_Transaction = await USDCInstance.approve(address3, value);

                await approveUSDC_Transaction.wait().then(async()=>{
                    const BuyTokensTransaction = await OffrToken.buyTokens(value, {
                        from: fromAddress
                    });

                    await BuyTokensTransaction.wait().then((i)=>{
                        setTransactions([...transactions, {hash: BuyTokensTransaction.hash, type: 1, amount: toEth(amountOFFR), from: fromAddress, timestamp: timeStamp, batch: batchData.batch_name}]);
                        updateTokenSoldToBatchData(toEth(amountOFFR));
                        const bal = formatNumFreeStyle(coinInfo.myBalance/(10**18));
                        const symbol = coinInfo.symbol
                        setBuyTokenData({amountOFFR, bal, symbol, failed: false});
                        setBought(true);
                    });
                });

            }

            
            // Reset the usdc state to 0
 
        } catch (error) {
            const msg = error.reason;
            const type = 2;
            // Handle any errors that may occur when calling the buyTokens method
            console.log(error.message);
            setBought(true);
            setBuyTokenData({failed: true});
        }
        setPending(false);
    }

    useEffect(()=>{
        if(bought){
            setApproved(bought);
            setCurrentPage(3);
        }
    }, [bought]);



    /**
     * If the user has selected a currency, then call the appropriate function to buy the token.
     */
    const approveHandler = async () => {
        if (coinInfo && coinBase) {
            if (currency === 2) {
                const buying = handleBuyTokenEth();
                toast.promise(buying,{
                    loading: "Purchasing Token",
                    success: "Purchase Complete",
                    error: 'An error occurred'
                })
            }else if (currency === 1){
                const buying = handleBuyTokenUSDC();
                toast.promise(buying,{
                    loading: "Purchasing Token",
                    success: "Purchase Complete",
                    error: 'An error occurred'
                })
            }
        }
    }

    return (
        <div className="div-carosel">
            <div className="c">
                <div className="title">~{moneyFormat(buyArr.amount, 1)} ({coinInfo && coinInfo.symbol})</div>
                <div className="p">≈ {moneyFormat(buyArr.offrValue, 1)} {coin}</div>
            </div>
            <section className='inf'>
                <div>
                    <span>Asset:</span>
                    <span>{coinInfo ? `${coinInfo.name} (${coinInfo.symbol})` : <img src="https://gineousc.sirv.com/Images/sp.gif" alt="" />}</span>
                </div>
                <div>
                    <span>From:</span>
                    <span>Token Sale</span>
                </div>
                <div>
                    <span>To:</span>
                    <span>{coinBase ? coinBase.coinbase : <img src="https://gineousc.sirv.com/Images/sp.gif" alt="" />}</span>
                </div>
            </section>

            <div className="r">
                <div onClick={approveHandler} className="btnx">Approve</div>
                <div onClick={() => setCurrentPage(1)} className="btnx c">Cancel</div>
            </div>
        </div>
    )
}

export default PendingTransaction;
