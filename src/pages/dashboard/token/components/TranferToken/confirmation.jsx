import React, { useContext, useEffect } from 'react';
import { formatNumFreeStyle } from '../../../../../useful/useful_tool';
import { transferData } from '../../card/TranferTokens';

const Confirmation = () => {
  const { transData } = useContext(transferData);

  return (
    <div className="div-carosel c">
      {transData.status && <div className="con">
        <img className='ld' src="https://gineousc.sirv.com/Images/icons/animated/1103-confetti-outline.gif" alt="" />
        <div className="title">Transaction Complete</div>
        <div className="p">You transfered {formatNumFreeStyle(transData.sendAmount)} {transData.symbol} to {transData.toAddress}, your new balance is {formatNumFreeStyle(transData.oldBalance - parseFloat(transData.sendAmount))} {transData.symbol}</div>
      </div>}
      {!transData.status && <div className="con">
        <img className='ld' src="https://gineousc.sirv.com/Images/icons/animated/1140-error-outline.gif" alt="" />
        <div className="title">An Error Occured</div>
        <div className="p">This maybe as a result of an Insuffient Balance or User rejected the transaction.</div>
      </div>}

    </div>
  )
}

export default Confirmation;