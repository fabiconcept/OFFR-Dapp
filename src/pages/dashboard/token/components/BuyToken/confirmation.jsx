import React, { useContext } from 'react';
import { buyData } from '../../card/BuyToken';

const Confirmation = () => {
  const { buyTokenData } = useContext(buyData);

  return (
    <div className="div-carosel c">
      {!buyTokenData.failed && <div className="con">
        <br />
        <img className='ld' src="https://gineousc.sirv.com/Images/icons/animated/1103-confetti-outline.gif" alt="successful" />
        <div className="title">Transaction Complete</div>
        <div className="p">You've sucessfully purchased {Number(buyTokenData.amountOFFR).toLocaleString()} {buyTokenData.symbol} Tokens, your new balance is {Number(buyTokenData.amountOFFR + (parseInt(buyTokenData.bal))).toLocaleString()} {buyTokenData.symbol}</div>
      </div>}
      {buyTokenData.failed && <div className="con">
        <br />
        <img className='ld' src="https://gineousc.sirv.com/Images/icons/animated/1140-error-outline.gif" alt="failed" />
        <div className="title">An Error Occured</div>
        <div className="p">This maybe as a result of an Insuffient Balance or User rejected the transaction.</div>
      </div>}

    </div>
  )
}

export default Confirmation;