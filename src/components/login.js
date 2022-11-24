import React, {useEffect, useState, useRef} from "react";
import {useNavigate} from 'react-router-dom'
import "./login.css"
import axios from 'axios'
import waves from "../assets/wave.png";
import bg from "../assets/bg.svg";
import URLsetting from "../Setting/URLsetting";
import {
    faUser,
    faLock,
    faEnvelope,
    faAddressCard,
    faCheckSquare,
    faSignature,
    faEnvelopeCircleCheck,
    faUserMd
} from "@fortawesome/free-solid-svg-icons";
import {faSquare} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
const Func1 = () => {
    useEffect(() => {
        const inputs = document.querySelectorAll(".input");
        function addcl() {
            let parent = this.parentNode.parentNode;
            parent
                .classList
                .add("focus");
        }

        function remcl() {
            let parent = this.parentNode.parentNode;
            if (this.value == "") {
                parent
                    .classList
                    .remove("focus");
            }
        }
        inputs.forEach(input => {
            input.addEventListener("focus", addcl);
            input.addEventListener("blur", remcl);
        });
    }, []);
}
const Logins = () => {
    const [isClient, setIsClient] = useState(true);
    const [isLogin, setIsLogin] = useState(true);
    const emailTmp = useRef();
    const whichUser=useRef(true);
    const idTmp = useRef(false);
    const userID=useRef();
    const userName=useRef();
    const userEmail=useRef();
    const words = "고객\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0" +
            "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0상담사";

    const Email_Verity_Form = () => {
        var tmp = document
            .getElementById('email_test')
            .value;
        const regex = new RegExp('([\\w-\\.]+)@((?:[\\w]+\\.)+)([a-zA-Z]{2,4})');
        console.log(regex.test(tmp));
        if (regex.test(tmp)) {
            document
                .getElementById('email_input')
                .style
                .display = "block";
        } else {
            document
                .getElementById('email_input')
                .style
                .display = "none";
        }
    }
    const navigate = useNavigate();
    const goToCustomerMain = () => {
        navigate('/customermain', {
            state: {
                Id: userID.current,
                Name:userName.current,
                Email:userEmail.current
            }
        });
    }
    const goToCounselorMain = () => {
        navigate('/counselormain', {
            state: {
                Id: userID.current,
                Name:userName.current,
                Email:userEmail.current
            }
        });
    }
    const LoginSet = () => {
        var ID = document
        .getElementById('id')
        .value;
    var pw = document
        .getElementById('ppppwww')
        .value;
         {
        let body = {
            id: ID,
            password: pw
        };
        if (isClient) {
            axios
                .post(URLsetting.LOCAL_API_URL+"user/client/logIn", JSON.stringify(body), {
                    headers: {
                        "Content-Type": 'application/json'
                    }
                })
                .then((response) => {
                    if (response.data) {
                        userID.current = response.data.id;
                        userName.current=response.data.name;
                        userEmail.current=response.data.email;
                        goToCustomerMain();
                    }
                    if (!response.data) {
                    }
                });
        } else {
            console.log("상담사");
            axios
                .post(URLsetting.LOCAL_API_URL+"user/counselor/logIn", JSON.stringify(body), {
                    headers: {
                        "Content-Type": 'application/json'
                    }
                })
                .then((response) => {
                    if (response.data) {
                        userID.current = response.data.id;
                        userName.current=response.data.name;
                        userEmail.current=response.data.email;
                        goToCounselorMain();

                    }
                    if (!response.data) {
                        console.log("로그인 실패");
                    }
                });
        }
        //통신
    } 
    }
    const Login = () => {
        return (
            <div className="login-content">
                <Func1/>
                <div className="newForm">
                    <h2 className="title">LINCALL</h2>
                    <h1>환영합니다</h1>
                    <div className="input-div one">
                        <div className="i">
                            <FontAwesomeIcon icon={faUser} size="2x"/>
                        </div>
                        <div className="div">
                            <h5>아이디</h5>
                            <input type="text" className="input" id="id"/>
                        </div>
                    </div>
                    <div className="input-div pass">
                        <div className="i">
                            <FontAwesomeIcon icon={faLock} size="2x"/>
                        </div>
                        <div className="div">
                            <h5>비밀번호</h5>
                            <input type="password" className="input" id="ppppwww"/>
                        </div>
                    </div>
                    <div className="checkRegister" onClick={LoginOrRegister}>회원가입</div>
                    <button className="btn" onClick={LoginSet}>로그인</button>
                    <button
                        className={(
                            isClient
                                ? "clientSelect"
                                : "counselorSelect"
                        )}
                        id="id1"
                        onClick={ChangeClientOrCounselor}>{words}</button>
                </div>
            </div>
        )
    }

    const LoginOrRegister = () => {
        console.log(isLogin);
        setIsLogin(!isLogin);
    }
    const ShowWindow = () => {
        if (isLogin) {
            return (<Login/>)
        } else {
            return (<Register/>)
        }
    }
    const openNumberPad = () => {
        var EMAIL = document
            .getElementById("email_test")
            .value;
        document
            .getElementById('numberpad')
            .style
            .display = "grid";
        document
            .getElementById('email_test')
            .disabled = true;
        axios
            .get(URLsetting.LOCAL_API_URL+"user/email-auth", {
                params: {
                    email: EMAIL
                }
            })
            .then((response) => {
                emailTmp.current = response.data;
                console.log(emailTmp);
            })
        ChangeResigerColor();
    }
    const NunmberCheck = () => {
        ChangeResigerColor();
        if (document.getElementById('numberchecking').value) {
            document
                .getElementById('number_open')
                .style
                .display = "block";
        } else {
            document
                .getElementById('number_open')
                .style
                .display = "none";
        }
    }
    const ChangeClientOrCounselor = () => {
        setIsClient(!isClient);
    }
    const isIdOK = () => {
        ChangeResigerColor();
        var ReadID = document
            .getElementById('readid')
            .value;
        if (ReadID == "") {
            document
                .getElementById('iddoubleCheck')
                .style
                .color = "#f04116";
            document
                .getElementById('idWaring')
                .style
                .color = "#f04116";
        } else {
            if(whichUser.current){
            axios
                .get(URLsetting.LOCAL_API_URL+"user/counselor/id-check", {
                    params: {
                        id: ReadID
                    }
                })
                .then((res) => {
                    if (res.data) {
                        idTmp.current = true;
                        document
                            .getElementById('iddoubleCheck')
                            .style
                            .color = "#1ed947";
                        document
                            .getElementById('idWaring')
                            .style
                            .color = "#1ed947";
                    } else {
                        idTmp.current = false;
                        document
                            .getElementById('iddoubleCheck')
                            .style
                            .color = "#f04116";
                        document
                            .getElementById('idWaring')
                            .style
                            .color = "#f04116";
                    }
                })
            }
            else{
                axios
                .get(URLsetting.LOCAL_API_URL+"user/client/id-check", {
                    params: {
                        id: ReadID
                    }
                })
                .then((res) => {
                    if (res.data) {
                        idTmp.current = true;
                        document
                            .getElementById('iddoubleCheck')
                            .style
                            .color = "#1ed947";
                        document
                            .getElementById('idWaring')
                            .style
                            .color = "#1ed947";
                    } else {
                        idTmp.current = false;
                        document
                            .getElementById('iddoubleCheck')
                            .style
                            .color = "#f04116";
                        document
                            .getElementById('idWaring')
                            .style
                            .color = "#f04116";
                    }
                })
            }
        }
    }
    const isSamePw = () => {
        var t1 = document
            .getElementById('pw1')
            .value;
        var t2 = document
            .getElementById('pw2')
            .value;
        if (t1 == t2) {
            document
                .getElementById('pww1')
                .style
                .color = "#1ed947";
            document
                .getElementById('pww2')
                .style
                .color = "#1ed947";
        } else {
            document
                .getElementById('pww1')
                .style
                .color = "#f04116";
            document
                .getElementById('pww2')
                .style
                .color = "#f04116";
        }
        ChangeResigerColor();
    }
    const isSameEmail = () => {
        var e1 = document
            .getElementById('numberchecking')
            .value;
        if (e1 == emailTmp.current) {
            document
                .getElementById('email1')
                .style
                .color = "#1ed947";
            document
                .getElementById('email2')
                .style
                .color = "#1ed947";
        } else {
            document
                .getElementById('email1')
                .style
                .color = "#f04116";
            document
                .getElementById('email2')
                .style
                .color = "#f04116";
        }
        ChangeResigerColor();
    }
    const isNameNull = () => {
        var n1 = document
            .getElementById('name2')
            .value;
        if (n1) {
            document
                .getElementById('name1')
                .style
                .color = "#1ed947";
        } else {
            document
                .getElementById('name1')
                .style
                .color = "#f04116";
        }
        ChangeResigerColor();
    }
    const ChangeResigerColor = () => {
        var t1 = document
            .getElementById('pw1')
            .value;
        var t2 = document
            .getElementById('pw2')
            .value;
        var n1 = document
            .getElementById('name2')
            .value;
        var e1 = document
            .getElementById('numberchecking')
            .value;
        if (n1) {
            if (t1 == t2) {
                if (e1 == emailTmp.current) {
                    if (idTmp.current) {
                        document
                            .getElementById('LastLogin')
                            .style['background-image'] = "linear-gradient(to right, #20a6ff, #20b1ff, #20a6ff)"
                    } else {
                        document
                            .getElementById('LastLogin')
                            .style['background-image'] = "linear-gradient(to right,#ffffff, #ffffff,#ffffff)"
                    }
                } else {
                    document
                        .getElementById('LastLogin')
                        .style['background-image'] = "linear-gradient(to right,#ffffff, #ffffff,#ffffff)"
                }
            } else {
                document
                    .getElementById('LastLogin')
                    .style['background-image'] = "linear-gradient(to right,#ffffff, #ffffff,#ffffff)"
            }
        } else {
            document
                .getElementById('LastLogin')
                .style['background-image'] = "linear-gradient(to right,#ffffff, #ffffff,#ffffff)"
        }
    }
    const LetsGoRegister = () => {
        var t1 = document
            .getElementById('pw1')
            .value;
        var t2 = document
            .getElementById('pw2')
            .value;
        var n1 = document
            .getElementById('name2')
            .value;
        var e1 = document
            .getElementById('numberchecking')
            .value;
        if (n1) {
            if (t1 == t2) {
                if (e1 == emailTmp.current) {
                    if (idTmp.current) {
                        var ID = document
                            .getElementById('readid')
                            .value;
                        var pw = document
                            .getElementById('pw1')
                            .value;
                        var Name = document
                            .getElementById('name2')
                            .value;
                        var Email = document
                            .getElementById('email_test')
                            .value;
                        let body = {
                            id: ID,
                            password: pw,
                            email: Email,
                            name: Name
                        };
                        console.log(whichUser.current);
                        if(whichUser.current){
                        axios
                            .post(URLsetting.LOCAL_API_URL+"user/counselor/signUp", JSON.stringify(body), {
                                headers: {
                                    "Content-Type": 'application/json'
                                }
                            })
                            .then((response) => {
                                LoginOrRegister();
                            });
                        }
                        else{
                            axios
                            .post(URLsetting.LOCAL_API_URL+"user/client/signUp", JSON.stringify(body), {
                                headers: {
                                    "Content-Type": 'application/json'
                                }
                            })
                            .then((response) => {
                                LoginOrRegister();
                            });
                        }
                    }
                }
            }
        }
    }
    const ChangeCC1 = () => {
        whichUser.current=true;
        document.getElementById('cc1').style.color="#555";
        document.getElementById('cc2').style.color="#d9d9d9";
    }
    const ChangeCC2 = () => {
        whichUser.current=false;
        document.getElementById('cc1').style.color="#d9d9d9";
        document.getElementById('cc2').style.color="#555";
    }
    const Register = () => {
        return (
            <div className="login-content">
                <Func1/>
                <div className="newForm">
                    <h2 className="title">LINCALL</h2>
                    <h1>회원가입</h1>
                    <div className="input-div pass">
                        <div className="i" id="iddoubleCheck">
                            <FontAwesomeIcon icon={faUser} size="2x"/>
                        </div>
                        <div className="div">
                            <h5>아이디</h5>
                            <input type="text" className="input" id="readid"/>
                        </div>
                    </div>
                    <div className="notificationBar">
                        <div className="idcheck" onClick={isIdOK}>인증 확인</div>
                    </div>
                    <div className="input-div pass">
                        <div className="i" id="pww1">
                            <FontAwesomeIcon icon={faLock} size="2x"/>
                        </div>
                        <div className="div">
                            <h5>비밀번호</h5>
                            <input type="password" className="input" id="pw1" onChange={isSamePw}/>
                        </div>
                    </div>
                    <div className="input-div pass">
                        <div className="i" id="pww2">
                            <FontAwesomeIcon icon={faCheckSquare} size="2x"/>
                        </div>
                        <div className="div" id="ifemailok">
                            <h5>비밀번호 중복확인</h5>
                            <input type="password" className="input" id="pw2" onChange={isSamePw}/>
                        </div>
                    </div>
                    <div className="input-div pass">
                        <div className="i">
                            <FontAwesomeIcon icon={faEnvelope} id="email1" size="2x"/>
                        </div>
                        <div className="div">
                            <h5>이메일</h5>
                            <input
                                type="text"
                                className="input"
                                id="email_test"
                                onChange={Email_Verity_Form}/>
                        </div>
                    </div>
                    <div className="emailChecking" onClick={openNumberPad} id="email_input">인증 발송</div>
                    <div className="input-div special" id="numberpad">
                        <div className="i">
                            <FontAwesomeIcon icon={faEnvelopeCircleCheck} id="email2" size="2x"/>
                        </div>
                        <div className="div">
                            <h5>이메일 중복 확인</h5>
                            <input
                                type="text"
                                onChange={NunmberCheck}
                                id="numberchecking"
                                className="input"/>
                        </div>
                    </div>
                    <div className="emailChecking" onClick={isSameEmail} id="number_open">인증 확인</div>
                    <div className="input-div pass">
                        <div className="i">
                            <FontAwesomeIcon icon={faAddressCard} id="name1" size="2x"/>
                        </div>
                        <div className="div">
                            <h5>이름</h5>
                            <input type="text" className="input" id="name2" onChange={isNameNull}/>
                        </div>
                    </div>
                        <div className="grouping">
                        <button className="buttonON" onClick={ChangeCC1} id="cc1">
                                <FontAwesomeIcon icon={faUserMd} id="name1" size="2x"/>
                                <p>상담사</p>
                            </button>
                            <button className="buttonOff" onClick={ChangeCC2} id="cc2">
                                <FontAwesomeIcon icon={faUser} id="name1" size="2x"/>
                                <p>고객</p>
                            </button>
                        </div>
                    <button className="registerbtn" onClick={LetsGoRegister} id="LastLogin">회원가입</button>
                </div>
            </div>
        )
    }
    return (
        <div className="my_body">
            <img className="wave" src={waves}/>
            <div className="container">
                <div className="img">
                    <img src={bg}/>
                </div>
                <ShowWindow/>
            </div>
        </div>
    )
}

export default Logins;