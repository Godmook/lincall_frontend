import React, {useEffect, useState, Component, useRef} from "react";
import {useNavigate} from "react-router-dom";
import "./after_counselor_record.css"
import "../counselor/counselor_mainpage.css";
import axios from "axios";
import {useLocation} from "react-router-dom";
import URLsetting from "../Setting/URLsetting";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
import {faMeh, faAngry, faSmile} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

var stun_config = {
    'iceServers': [
        {
            "urls": "stun:stun.l.google.com:19302"
        }, {
            "urls": "turn:211.202.222.162:8080",
            'credential': '1234',
            'username': 'admin'
        }, {
            "urls": "stun1:stun.l.google.com:19302"
        }
    ]
}
function Abcd({type, time, emotion, text}) {
    console.log(type);
    const [facetype, setFaceType] = useState(faMeh);
    const [chatcolor, setChatColor] = useState("chat_normal");
    useEffect(() => {
        if (emotion === "angry") {
            setChatColor("chat_angry")
            setFaceType(faAngry);
        } else if (emotion === "happy") {
            setChatColor("chat_happy");
            setFaceType(faSmile);
        }
    }, [])
    if (type == "client") {
        return (
            <div className="chat_left_container">
                <FontAwesomeIcon icon={facetype} size="3x"/>
                <div className={chatcolor}>{text}</div>
            </div>
        )
    } else if (type == "counselor") {
        return (
            <div className="chat_right_container">
                <div className={chatcolor}>{text}</div>
                <FontAwesomeIcon icon={facetype} size="3x"/>
            </div>
        )
    } else if (type == "notice") {
        return (
            <div className="chat_container_center">
                <div className="chat_center">{text}</div>
            </div>
        )
    } else {
        return (<div>HELLO</div>)
    }
}
const AfterCounselor = () => {
    function TESTTT() {
        console.log(talkmessage);
        setTalkmessage(talkmessage => [
            ...talkmessage,
            ""
        ])
    }
    const location = useLocation();
    const start = location.state.start;
    const counselorName = location.state.counselorName;
    const clientName = location.state.clientName;
    const time = location.state.time;
    const Roomid = location.state.id;
    const counselorID = location.state.ccid;
    const counselorEmail = location.state.email;
    const [ptImg, setPositiveImg] = useState();
    const [ntImg, setNegativeImg] = useState();
    const [talkmessage, setTalkmessage] = useState([]);
    const [getangerpoint, setAngerPoint] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        axios
            .all([
                axios.get(
                    URLsetting.LOCAL_API_URL + "consulting/wordcloud/angry",
                    {
                        params: {
                            id: Roomid
                        }
                    }
                ),
                axios.get(
                    URLsetting.LOCAL_API_URL + "consulting/wordcloud/happy",
                    {
                        params: {
                            id: Roomid
                        }
                    }
                ),
                axios.get(URLsetting.LOCAL_API_URL + "main/dialogue", {
                    params: {
                        roomId: Roomid
                    }
                }),
                axios.get(URLsetting.LOCAL_API_URL + "main/angerPoint", {
                    params: {
                        roomId: Roomid
                    }
                })
            ])
            .then(axios.spread((res1, res2, res3, res4) => {
                setNegativeImg(res1.data);
                setPositiveImg(res2.data);
                setTalkmessage(res3.data);
                setAngerPoint(res4.data);
            }))
    }, [])
    return (
        <div className="after_calling_center">
            <div className="after_calling_center_bars">
                <button
                    className="after_calling_go_back"
                    onClick={() => navigate('/counselormain', {
                        state: {
                            Name: counselorName,
                            Id: counselorID,
                            Email: counselorEmail

                        }
                    })}>back</button>
                <div className="after_calling_info_bar">
                    <p className="after_calling_info_text">상담 일시 : {start}
                        {time}분</p>
                </div>
            </div>
            <div className="after_calling_center_top">
                <div className="after_calling_keywords">
                    <div className="positive_keyword" onClick={TESTTT}>긍정 키워드
                        <img
                            src={`data:image/jpeg;base64,${ptImg}`}
                            alt="My Image"
                            className="wordcloud_img"></img>
                    </div>
                    <div className='v-line'></div>
                    <div className="negative_keyword">부정 키워드
                        <img
                            src={`data:image/jpeg;base64,${ntImg}`}
                            alt="My Image"
                            className="wordcloud_img"></img>
                    </div>
                </div>
            </div>
            <div className="after_calling_center_bottom">
                <div className="after_calling_center_bottom_left">
                <div className="big_text">상담 내용</div>
                    <div className="chatting">
                        {
                            talkmessage.map((tmp) => (
                                <Abcd type={tmp.type} time={tmp.time} emotion={tmp.emotion} text={tmp.text}/>
                            ))
                        }
                    </div>
                </div>
                <div className="after_calling_center_bottom_right">
                    <div className="after_changeEmotion"></div>
                </div>
            </div>
        </div>
    )
}

export default AfterCounselor