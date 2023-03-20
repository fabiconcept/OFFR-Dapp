import React from 'react'
import { useState } from 'react';
import { fireStore } from '../../../firebase/sdk';
import { getDoc, collection, doc, setDoc } from 'firebase/firestore';
import { useRef } from 'react';
import { createSession, isValidEmail } from '../../../useful/useful_tool';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getDataFromLogin } from '../../../store/reducers/userDetails';
import getWeb3 from '../../../util/getWeb3';
import ConnectionModal from "./connectionModal"
const FormPart = () => {
    const emailRef = useRef();
    const nameRef = useRef();
    const checkBoxRef = useRef();
    const contRef = useRef();
    const dispatch = useDispatch();


    const [emailText, setEmailText] = useState('');
    const [nameText, setNameText] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const [walletAddress, setWalletAddress] = useState('');
    const [gender, setGender] = useState(0);
    const [connected, setConnected] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [proceeding, setProceeding] = useState(false);
    const [hasError, setHasError] = useState({
        email: false,
        name: false,
        agree: false
    });

    const [coin, setCoin] = useState({});
    const [userInfo, setUserInfo] = useState({});

    const [accountExist, setAccountExist] = useState(false);


    const createAccountHandler = async () => {
        if (!proceeding) {
            if (checkBoxRef.current.checked) {
                const lenName = (nameRef.current.value).split(' ');
                if (lenName.length > 1) {
                    if (isValidEmail(emailRef.current.value)) {
                        setProceeding(true);

                        let genderTxt = '';
                        switch (gender) {
                            case 1:
                                genderTxt = "female";
                                break;
                            case 2:
                                genderTxt = "non-binary";
                                break;

                            default:
                                genderTxt = 'male';
                                break;
                        }

                        const transactionDate = new Date();
                        const timeStamp = transactionDate.toISOString().slice(0, 19).replace('T', ' ');

                        const userRef = collection(fireStore, "user_credentials");


                        await setDoc(doc(userRef, `${walletAddress}`), {
                            name: nameRef.current.value,
                            email: emailRef.current.value,
                            gender: genderTxt,
                            profile_picture: dp(),
                            wallet_Address: walletAddress,
                            date: timeStamp,
                        });
                        setProceeding(false);
                        proceedHandler();
                    } else {
                        setHasError({ email: true });
                    }
                } else {
                    setHasError({ name: true });
                }
            } else {
                setHasError({ agree: true });
            }
        }
    }

    const fetchCredentials = async () => {
        setProceeding(true);
        const docRef = doc(fireStore, "user_credentials", `${walletAddress}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setAccountExist(true);
            const userInfo = docSnap.data();
            setEmailText(userInfo.email);
            setNameText(userInfo.name);
            setImageUrl(userInfo.profile_picture);
            switch (userInfo.gender) {
                case "female":
                    setGender(1);
                    break;
                case "non-binary":
                    setGender(2);
                    break;

                default:
                    setGender(0);
                    break;
            }
            checkBoxRef.current.checked = true;
        } else {
            // doc.data() will be undefined in this case
            setAccountExist(false);
        }
        setProceeding(false);

    }

    function dp() {
        const dps = ["https://gineousc.sirv.com/Images/profile_pictures/icons8-sheep-on-bike-96.png", "https://gineousc.sirv.com/Images/profile_pictures/icons8-bear-96.png", "https://gineousc.sirv.com/Images/profile_pictures/icons8-cat-head-96.png", "https://gineousc.sirv.com/Images/profile_pictures/icons8-cow-96.png", "https://gineousc.sirv.com/Images/profile_pictures/icons8-crab-96.png", "https://gineousc.sirv.com/Images/profile_pictures/icons8-doge-96.png", "https://gineousc.sirv.com/Images/profile_pictures/icons8-fish-96.png", "https://gineousc.sirv.com/Images/profile_pictures/icons8-giraffe-96.png", "https://gineousc.sirv.com/Images/profile_pictures/icons8-octopus-96.png", "https://gineousc.sirv.com/Images/profile_pictures/icons8-racoon-96.png"];
        return (dps[Math.floor(Math.random() * (dps.length - 1))]);
    }

    const connectWallet = async () => {
        setConnecting(true);

        const web3Conneect = getWeb3;

        await web3Conneect.then(result =>{
            setWalletAddress(result.coinbase);
        })
        
        setConnecting(false);
        setConnected(true);
    }

    useEffect(() => {
        if (walletAddress !== '') {
            fetchCredentials();
        }
    }, [walletAddress]);

    useEffect(() => {
        const data = {
            email: emailText,
            name: nameText,
            gender: gender,
            dp: imageUrl,
        }
        setUserInfo(data);
    }, [emailText, nameText, gender, imageUrl]);

    const proceedHandler = () => {
        if (!proceeding) {
            setProceeding(true);
            dispatch(getDataFromLogin({ coinInfo: coin, userInfo }));

            createSession(walletAddress, { coinInfo: coin });

            setTimeout(() => {
                contRef.current.click();
            }, 200);
        }
    }


    return (
        <section className="formPart">
            {/* <ConnectionModal /> */}
            <div className="title">Proceed to Dashboard</div>
            <section>
                <div className="form-g">
                    <label>
                        {connected ? "Connected to:" : "Connect your wallet!"}
                    </label>
                    {!connected && <div className={`btnx`} onClick={connectWallet}>
                        {!connecting && "Connect wallet"}
                        {connecting && <img src="https://gineousc.sirv.com/Images/Circles-menu-3.gif" alt="" />}
                    </div>}
                    {connected && <input type="Text" className="inp" placeholder={`${walletAddress}`} disabled />}
                </div>
                <div className={`limit ${connected ? 'connected' : 'notConnected'}`}>
                    <div className={`form-g ${hasError.email && 'error'}`}>
                        <label>Email:</label>
                        <input type="email" name='email' disabled={accountExist} ref={emailRef} value={emailText} onChange={e => setEmailText(e.target.value)} autoComplete='on' className="inp" placeholder='Enter email address' />
                    </div>
                    <div className={`form-g ${hasError.name && 'error'}`}>
                        <label>Full Name:</label>
                        <input type="Text" className="inp" disabled={accountExist} ref={nameRef} value={nameText} onChange={e => setNameText(e.target.value)} name='name' placeholder="What's your name?" />
                    </div>
                    <div className="form-g">
                        <label>Gender:</label>
                        <div className={`r-3 ${accountExist && 'exist'}`}>
                            <div className={`${gender === 0 && 'active'}`} onClick={() => setGender(0)}>
                                <div className="p">Male</div>
                            </div>
                            <div className={`${gender === 1 && 'active'}`} onClick={() => setGender(1)}>
                                <div className="p">Female</div>
                            </div>
                            <div className={`${gender === 2 && 'active'}`} onClick={() => setGender(2)}>
                                <div className="p">Non-binary</div>
                            </div>
                        </div>
                    </div>
                    <div className={`form-g ${hasError.agree && 'error'}`}>
                        <br />
                        <div className="r">
                            <input type="checkbox" disabled={accountExist} ref={checkBoxRef} />
                            <div className="p" onClick={() => checkBoxRef.current.click()}>I agree to OffrToken's Terms & Conditions</div>
                        </div>
                        <br />
                        {!accountExist && <div className={`btnx`} onClick={createAccountHandler}>
                            {!proceeding && "Create account"}
                            {proceeding && <img src="https://gineousc.sirv.com/Images/Spinner-2.gif" alt="" />}
                        </div>}
                        {accountExist && <div className={`btnx`} onClick={proceedHandler}>
                            {!proceeding && "Proceed"}
                            {proceeding && <img src="https://gineousc.sirv.com/Images/Spinner-2.gif" alt="" />}
                        </div>}
                    </div>
                </div>
            </section>
            <Link to={"/dashboard"} ref={contRef} style={{ display: 'none' }} >to Dashboard</Link>
        </section>
    )
}

export default FormPart;