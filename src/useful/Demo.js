if (saleOpen) {
    const approveUSDC_Transaction = await USDCInstance.approve(address, 10);
    await approveUSDC_Transaction.wait().then( async () =>{
        const BuyTokensTransaction = await OffrToken.buyTokens(1, {
            from: fromAddress
        });


        BuyTokensTransaction.wait().then(() =>{
            setTransactions([...transactions, {hash: BuyTokensTransaction.hash, type: 1, amount: toEth(amountOFFR), from: fromAddress, timestamp: timeStamp, batch: batchData.batch_name}]);
            
            const bal = formatNumFreeStyle(coinInfo.myBalance/(10**18));
            const symbol = coinInfo.symbol
            setBuyTokenData({amountOFFR, bal, symbol, failed: false});
            setBought(true);
        });
    });
}else{
    throw { message: "Token isn't Currently on sale!" };
}