import React, {useEffect, useState, useRef} from "react";
import {useNavigate} from 'react-router-dom'
import "./loginform.css"
import "./api.js"
import axios from 'axios'
const LoginForm = () => {
    const navigate = useNavigate();
    const goToRegister = () => {
        var ID1 = document
            .getElementById('id')
            .value;
        navigate('/signin', {
            state: {
                id: ID1
            }
        });
    };
    const goToCustomerMain = () => {
        navigate('/customermain', {
            state: {
                Name: userID.current
            }
        });
    }
    const userID = useRef();
    const [popupStyle, showPopup] = useState("hide")
    const popup = () => {
        showPopup("login-popup")
        setTimeout(() => showPopup("hide"), 1500)
    }
    const loginCheck = () => {
        var ID = document
            .getElementById('id')
            .value;
        var pw = document
            .getElementById('pw')
            .value;
        if (ID == "") {
            setAlertwarn("아이디를 입력해주세요!");
        } else if (pw == "") {
            setAlertwarn("비밀번호를 입력해주세요!");
        } else {
            setAlertwarn(<br/>);
            let body = {
                id: ID,
                password: pw
            };
            if (btnActive == false) {
                axios
                    .post("http://localhost:8080/user/client/logIn", JSON.stringify(body), {
                        headers: {
                            "Content-Type": 'application/json'
                        }
                    })
                    .then((response) => {
                        if (response.data) {
                            userID.current = response.data;
                            goToCustomerMain();
                        }
                        if (!response.data) {
                            popup();
                        }
                    });
            } else {
                console.log("상담사");
                axios
                    .post("http://localhost:8080/user/counselor/logIn", JSON.stringify(body), {
                        headers: {
                            "Content-Type": 'application/json'
                        }
                    })
                    .then((response) => {
                        if (response.data) {
                            console.log("로그인");
                            userID.current = response.data;
                            goToCustomerMain();
                        }
                        if (!response.data) {
                            console.log("로그인 실패");
                        }
                    });
            }
            //통신
        }
    }
    const [alertwarn, setAlertwarn] = useState(<br/>);
    const [btnActive, setBtnActive] = useState(false);/*btnActive 는 true 이면 안누른 상태 */
    const [customerActive, setCustomer] = useState(false);/*customerActive 는 true 이면 누른 상태 */
    const toggleActive = (e) => {
        console.log(btnActive);
        if (btnActive == true) {
            setBtnActive((prev) => !prev);
            setCustomer((prev) => !prev);
        }
    };
    const toggle2Active = (e) => {
        console.log(customerActive);
        console.log(btnActive);
        if (customerActive == false) {
            setBtnActive((prev) => !prev);
            setCustomer((prev) => !prev);
        }
    };
    return (
        <div className="cover">
            <h1>LINCALL</h1>
            <input type="text" id="id" placeholder="ID"/>
            <input type="password" id="pw" placeholder="PASSWORD"/>
            <div className="alt-login">
                <div className="login-btn" onClick={loginCheck}>로그인</div>
                <div className="login-btn" onClick={goToRegister}>회원가입</div>
            </div>
            <p className="warning">{alertwarn}</p>
            <div className="alt-login">
                <button
                    className={(
                        btnActive
                            ? "customer2"
                            : "customer"
                    )}
                    onClick={toggleActive}>
                    고객
                </button>
                <button
                    className={(
                        customerActive
                            ? "customer"
                            : "customer2"
                    )}
                    onClick={toggle2Active}>
                    상담사
                </button>
            </div>

            <div className={popupStyle}>
                <h3>로그인 실패</h3>
                <p>아이디 혹은 비밀번호가 옳지 않습니다</p>
            </div>

        </div>
    )
}

export default LoginForm