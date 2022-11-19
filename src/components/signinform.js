import React, {useEffect, useState} from "react";
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'
const SignInForm = () => {
    const [iddouble, setIddouble] = useState("");
    const [pwsame, setPwsame] = useState("");
    const [email_ok, setEmail] = useState("");
    const [email_tmp, setEmailTmp] = useState("");
    const navigate = useNavigate();
    const [canRegister, setCanRegister] = useState(false);
    const goToLogin = () => {
        navigate('/*');
    };
    const email_onoff = () => {
        var text = document
            .getElementById('email_input')
            .value;
        if (text != "") {
            document
                .getElementById('emailon')
                .style
                .visibility = "visible";
        } else {
            document
                .getElementById('emailon')
                .style
                .visibility = "hidden";
            document
                .getElementById("open_if_email_check")
                .style
                .display = "none";
        }
    }
    const email_verity = () => {
        document
            .getElementById("open_if_email_check")
            .style
            .display = "flex";
        var EMAIL = document
            .getElementById("email_input")
            .value;
        axios
            .get("http://localhost:8080/user/email-auth", {
                params: {
                    email: EMAIL
                }
            })
            .then((response) => {
                setEmailTmp(response.data);
                console.log(email_tmp);
            })
    }
    const email_checking = () => {
        var EMAIL = document
            .getElementById("email_input_number")
            .value;
        if (email_tmp == EMAIL) {
            document
                .getElementById('show_email_status')
                .style
                .color = "#00ff00";
            setEmail("인증 완료되었습니다.");
        } else {
            document
                .getElementById('show_email_status')
                .style
                .color = "#FF0000";
            setEmail("인증 실패하였습니다.");
        }
    }
    useEffect(() => {
        const myInterval = setInterval(() => {
            console.log(email_ok);
            console.log(iddouble);
            console.log(pwsame);
            var Name = document
                .getElementById('name')
                .value;
            if ((email_ok == "인증 완료되었습니다.") && (iddouble == "아이디를 사용 가능합니다!") && (pwsame == "비밀번호가 일치합니다!") && (Name !== "")) {
                document
                    .getElementById('register_process')
                    .style['pointer-events'] = 'auto';
                document
                    .getElementById('register_process')
                    .style
                    .color = '#018ad4';
                setCanRegister(true);
            } else {
                document
                    .getElementById('register_process')
                    .style['pointer-events'] = 'none';
                document
                    .getElementById('register_process')
                    .style
                    .color = '#9c9c9c';
                setCanRegister(false);
            }
        }, 1000);
        return() => clearInterval(myInterval);
    }, [email_ok, iddouble, pwsame]);
    const Register = () => {
        if (canRegister) {
            var ID = document
                .getElementById('id')
                .value;
            var pw = document
                .getElementById('pw')
                .value;
            var Name = document
                .getElementById('name')
                .value;
            var Email = document
                .getElementById('email_input')
                .value;
            let body = {
                id: ID,
                password: pw,
                email: Email,
                name: Name
            };
            console.log(body);
            axios
                .post("http://localhost:8080/user/counselor/signUp", JSON.stringify(body), {
                    headers: {
                        "Content-Type": 'application/json'
                    }
                })
                .then((response) => {
                    if (response.data) {
                        console.log("로그인");
                    }
                    if (!response.data) {
                        console.log("로그인 실패");
                    }
                });
        }
    }
    const IdCheck = () => {
        var ID = document
            .getElementById('id')
            .value;
        if (ID == "") {
            setIddouble("아이디를 입력하세요!");
            document
                .getElementById('iddoublebutton')
                .style
                .color = "#FF0000";
        } else {
            axios
                .get("http://localhost:8080/user/client/id-check", {
                    params: {
                        id: ID
                    }
                })
                .then((response) => {
                    if (response.data) {
                        setIddouble("아이디를 사용 가능합니다!");
                        document
                            .getElementById('iddoublebutton')
                            .style
                            .color = "#00ff00";
                    } else {
                        setIddouble("중복된 아이디가 있습니다!");
                        document
                            .getElementById('iddoublebutton')
                            .style
                            .color = "#FF0000";
                    }
                })
        }
    }
    const isSamePw = () => {
        console.log("a");
        var pw1 = document
            .getElementById('pw')
            .value;
        var pw2 = document
            .getElementById('pwcheck')
            .value;
        if (pw1 == "" || pw2 == "") {
            setPwsame("");
        } else {
            if (pw1 == pw2) {
                setPwsame("비밀번호가 일치합니다!");
                document
                    .getElementById('pwsames')
                    .style
                    .color = "#00ff00";
            } else {
                setPwsame("비밀번호가 일치하지 않습니다!");
                document
                    .getElementById('pwsames')
                    .style
                    .color = "#FF0000";
            }
        }
    }
    return (
        <div className="signup_cover">
            <div className="idcheck"></div>
            <h1>회원가입</h1>
            <div className="idcheck"></div>
            <input type="text" id="id" placeholder="ID 입력"/>
            <div className="makeMargin">
                <button className="warning_button" id='iddoublebutton'>{iddouble}</button>
                <button className="idcheck_button" onClick={IdCheck}>ID 중복확인</button>
            </div>
            <input type="password" id="pw" onChange={isSamePw} placeholder="PASSWORD"/>
            <div className="makeMargin"></div>
            <input
                type="password"
                id="pwcheck"
                onChange={isSamePw}
                placeholder="PASSWORD 확인"/>
            <div className="makeMargin2">
                <button className="warning_button" id='pwsames'>{pwsame}</button>
            </div>
            <div className="email_check">
                <input type="text" id="email_input" onChange={email_onoff} placeholder="EMAIL"/>
                <button className="idcheck_button"></button>
                <buttion className="email_button" id="emailon" onClick={email_verity}>인증 요청</buttion>
            </div>
            <div className="makeMargin"></div>
            <div className="email_server" id="open_if_email_check">
                <input type="text" id="email_input_number"/>
                <button className="idcheck_button"></button>
                <button className="email_verify_button" onClick={email_checking}>인증</button>

            </div>
            <div className="makeMargin2">
                <button className="warning_button" id="show_email_status">{email_ok}</button>
            </div>
            <input type="text" id="name" placeholder="이름"/>
            <div className="makeMargin"></div>
            <div className="alt-login">
                <button className="register_button" id="register_process" onClick={Register}>회원가입</button>
            </div>
        </div>

    )
}

export default SignInForm