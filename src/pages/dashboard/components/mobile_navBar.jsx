import React, { useEffect } from 'react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const Mobile_navBar = () => {
    const [navPosition, setNavPosition] = useState(0);
    const { id } =useParams();

    useEffect(()=>{
        switch (id) {
          case "":
            setNavPosition(0);
            break;
          case undefined:
            setNavPosition(0);
            break;
          case "wallet":
            setNavPosition(1);
            break;
          case "owner":
            setNavPosition(2);
            break;
          case "settings":
            setNavPosition(4);
            break;
        
          default:
            setNavPosition(0);
            break;
        }
      }, [id]);
    return (
        <div className="mbNav">
            <Link to={'/dashboard'}><div className={`tab ${navPosition === 0 && "active"}`}><img src="https://gineousc.sirv.com/Images/icons/home.svg" alt="" /></div></Link>
            <Link to={'/dashboard/wallet'}><div className={`tab ${navPosition === 1 && "active"}`}><img src="https://gineousc.sirv.com/Images/icons/usd-circle.svg" alt="" /></div></Link>
            <Link to={'/dashboard/owner'}><div className={`tab ${navPosition === 2 && "active"}`}><img src="https://gineousc.sirv.com/Images/icons/list-alt.svg" alt="" /></div></Link>
            <Link to={'/dashboard/dividend'}><div className={`tab ${navPosition === 3 && "active"}`}><img src="https://gineousc.sirv.com/Images/icons/list-alt.svg" alt="" /></div></Link>
            <Link to={'/dashboard/settings'}><div className={`tab ${navPosition === 4 && "active"}`}><img src="https://gineousc.sirv.com/Images/icons/set.png" alt="" /></div></Link>
        </div>
    )
}

export default Mobile_navBar;