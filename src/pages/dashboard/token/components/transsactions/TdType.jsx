import React, { useEffect, useState } from 'react';

const TdType = ({type}) => {
    const [text, setText] = useState('');
    const [classType, setClassType] = useState('');

    useEffect(()=>{
        switch (type) {
            case 1:
                setText("Buytokens");
                setClassType('buy')
                break;
            case 2:
                setText("Transfer");
                setClassType('transfer')
                break;
            case 3:
                setText("contract interaction");
                setClassType('cni');
                break;
        
            default:
                setText("Approve");
                setClassType('approve')
                break;
        }
    }, [type]);
    
  return (
    <td className={`mb`}><div className={`type ${classType}`}>{text}</div></td>
  )
}

export default TdType;