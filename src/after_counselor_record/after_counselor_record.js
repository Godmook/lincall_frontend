import React, {useEffect, useState, Component, useRef, FontAwesomeIcon} from "react";
import {useNavigate} from "react-router-dom";
import "../counselor/counselor_mainpage.css";
import axios from "axios";
import {useLocation} from "react-router-dom";
import URLsetting from "../Setting/URLsetting";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

var stun_config ={
    'iceServers': [
        {
            "urls": "stun:stun.l.google.com:19302"
        },
        {
            "urls": "turn:211.202.222.162:8080",
            'credential' : '1234',
            'username' : 'admin'
        },
        {
            "urls": "stun1:stun.l.google.com:19302"
        },
    ]
}

const AfterCounselor = () => {

    const location = useLocation();
    const roomID = location.state.Room;
    const senderID= location.state.Id;

    var flag=0;
    let audio = new MediaStream();
    let remoteVideo = new MediaStream();
    useEffect(()=>{
        
    })
    
    return(
        <div className="calling_center">
            <div className="calling_center_top">
                <div className="calling_center_top_left">
                    <div className="left1"><p className="left1_text">고객 감정</p><p className="emotion"></p></div>
                    <div className="left2"><p className="left2_text">목소리 크기<p className="volume"></p><p className="volume_db"></p></p></div>
                    <div className="left3"><p className="left3_text">말 빠르기<p className="speed"></p><p className="speed_s_m"></p></p></div>
                </div>
                <div className="calling_center_top_right">
                    <div className="calling_center_top_right_question">
                        <p className="right1">Q. 주문 취소는 어떻게 해야 하나요?</p>
                    </div>
                    <div className="calling_center_top_right_answer">
                    <div className="right2">
                        1. 가게에서 주문을 접수하기 전<br/>
                        App 에서 직접 취소할 수 있습니다.<br/>
                        -경로 : 주문내역 &#8594; '취소할 주문' 클릭 &#8594; '주문 취소' 버튼 클릭<br/>
                    </div>
                    </div>                    
                </div>
            </div>
            <div className="calling_center_bottom">
                <div className="calling_center_bottom_left">
                    <div className="search_box">
                        <input type="text" className="search_txt" name=""placeholder="검색할 것을 입력하세요 !"></input>
                    </div>
                    <div className="chatting">
                        <div className="chat_bubble">
                            <div className="chat_text"></div>
                        </div>
                    </div>
                </div>
                <div className="calling_center_bottom_right">
                    <div className="changeEmotion"></div>
                </div>
            </div>
        </div> 
    )
}

export default AfterCounselor