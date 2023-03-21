import React from 'react';
import { useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { navdata } from './navArea';

const NavBar = () => {
  const { expand } =  useContext(navdata);
  const { id } = useParams();
  const [navPosition, setNavPosition]= useState(0);
  
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
        setNavPosition(3);
        break;
      case "settings":
        setNavPosition(5);
        break;
      case "dividend":
        setNavPosition(4);
        break;
      case "batch history":
        setNavPosition(2);
        break;
    
      default:
        setNavPosition(0);
        break;
    }
  }, [id]);


  return (
    <div className={`navBar ${expand === 3 && "open"} ${expand === 2 && ""} ${expand === 1 && "hide"}`}>
      <section className='logo'><img src="https://gineousc.sirv.com/Images/loader-ico.png" alt="" /></section>
      <section>
        <Link to={"/dashboard"}><div onClick={()=>setNavPosition(0)} data-text={'overview'} className={`overview ${navPosition === 0 && 'active'}`}><img src="https://gineousc.sirv.com/Images/icons/home.svg" alt="" /> {expand === 3 && <span className="txt" data-name={"overview"}>overview</span>}</div></Link>
        <Link to={"/dashboard/wallet"}><div onClick={()=>setNavPosition(1)} data-text={'Token Sale'} className={`wallet ${navPosition === 1 && 'active'}`}><img src="https://gineousc.sirv.com/Images/icons/usd-circle.svg" alt="" /> {expand === 3 && <span className="txt" data-name={"OFFR"}>Buy OFFR</span>}</div></Link>
        <Link to={"/dashboard/batch history"}><div onClick={()=>setNavPosition(2)} data-text={'Batch History'} className={`batch ${navPosition === 2 && 'active'}`}><img src="https://gineousc.sirv.com/Images/icons/list-alt.svg" alt="" /> {expand === 3 && <span className="txt" data-name={"transactions"}>transactions</span>}</div></Link>
        <Link to={"/dashboard/owner"}><div onClick={()=>setNavPosition(3)} data-text={'Token Management'} className={`transactions ${navPosition === 3 && 'active'}`}><img src="https://gineousc.sirv.com/Images/icons/mgt.png" alt="" /> {expand === 3 && <span className="txt" data-name={"transactions"}>transactions</span>}</div></Link>
        <Link to={"/dashboard/dividend"}><div onClick={()=>setNavPosition(4)} data-text={'dividend'} className={`dividend ${navPosition === 4 && 'active'}`}><img src="https://gineousc.sirv.com/Images/icons/div2.png" alt="" /> {expand === 3 && <span className="txt" data-name={"Dividend"}>Dividend</span>}</div></Link>
      </section>

      <section>
        <Link to={"/dashboard/settings"}><div onClick={()=>setNavPosition(5)} data-text={'setting'} className={`setting ${navPosition === 5 && 'active'}`}><img src="https://gineousc.sirv.com/Images/icons/set.png" alt="" /> {expand === 3 && <span className="txt">settings</span>}</div></Link>
      </section>
    </div>
  )
}

export default NavBar;