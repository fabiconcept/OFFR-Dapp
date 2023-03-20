import React from 'react'
import { useState } from 'react'

const GridCard = ({ ico, detail, p, type, animated }) => {
    const [icon, setIcon] = useState(ico);
    const [dataCopy, setDataCopy] = useState("click to copy")

    const goToBuyPageHandler = () => {
        window.location.href = "/dashboard/wallet";
    }

    const copyToClipboard = (str) => {
        const el = document.createElement('textarea');  // create a textarea element
        el.value = str;  // set the value of the textarea to the string
        el.setAttribute('readonly', '');  // make the textarea readonly
        el.style.position = 'absolute';  // move the textarea offscreen
        el.style.left = '-9999px';
        document.body.appendChild(el);  // add the textarea to the DOM
        const selected =
            document.getSelection().rangeCount > 0   // check if there is any content selected previously
                ? document.getSelection().getRangeAt(0)   // store selection if found
                : false;  // else create a range object
        el.select();  // select the content inside the textarea
        document.execCommand('copy');  // copy the selected text
        document.body.removeChild(el);  // remove the textarea from the DOM
        if (selected) {   // if a selection was made before copying
            document.getSelection().removeAllRanges();  // unselect everything on the HTML document
            document.getSelection().addRange(selected);  // restore the original selection
        }
        setDataCopy("copied");
    }

    const mouseLeaveHandler = () =>{
        type === "btn" && setIcon(ico);
        type === "address" && setDataCopy("click to copy");
    }


    return (
        <div className={`kard`} onMouseOver={() => type === "btn" && setIcon(animated)} onMouseLeave={mouseLeaveHandler}>
            <div className="tag">{p}<img src={icon} alt="" /></div>

            {type !== "btn" && <div data-alert={dataCopy} className={`value ${type === "address" ? "address" : "info"} ${type === "status" ? "good" : "info"}`} onClick={() => type === "address" && copyToClipboard(detail)}>
                {detail ? `${detail}` : <img src="https://gineousc.sirv.com/Images/sp.gif" alt="" />}
            </div>}
            {type === "btn" && <div className={`value ${type === "address" ? "address" : "info"} ${type === "status" ? "good" : "info"}`}>
                {<div className="btnx" onClick={goToBuyPageHandler}>Buy Token</div>}
            </div>}
        </div>
    )
}

export default GridCard;