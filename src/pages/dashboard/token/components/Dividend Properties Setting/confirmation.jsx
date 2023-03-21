import React, { useContext } from 'react';
import { dividendPropertiesSettingContext } from '../../card/DividendSettings';

const Confirmation = () => {
    const { updateStatus,  } = useContext(dividendPropertiesSettingContext);

  return (
    <div className="div-carosel c">
      {updateStatus && <div className="con">
        <br />
        <img className='ld' src="https://gineousc.sirv.com/Images/icons/animated/1103-confetti-outline.gif" alt="successful" />
        <div className="title">Update Sucessfull</div>
        <div className="p">You've sucessfully updated the Dividend Properties.</div>
      </div>}
      {!updateStatus && <div className="con">
        <br />
        <img className='ld' src="https://gineousc.sirv.com/Images/icons/animated/1140-error-outline.gif" alt="failed" />
        <div className="title">An Error Occured</div>
        <div className="p">This maybe as a result of an Insuffient Balance or User rejected the transaction.</div>
      </div>}

    </div>
  )
}

export default Confirmation;