import React, {useEffect, useState, Component, useRef, FontAwesomeIcon} from "react";
import {useNavigate} from "react-router-dom";
import "../counselor/counselor_mainpage.css";
import "../room/room.css";
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
    const [ptImg, setPositiveImg] = useState();
    const [ntImg, setNegativeImg] = useState();
    var flag=0;
    let audio = new MediaStream();
    let remoteVideo = new MediaStream();
    useEffect(()=>{
        axios
            .get(URLsetting.LOCAL_API_URL+"consulting/wordcloud/angry", {
                params: {
                    id: 155
                }
            })
            .then((response) => {
                setNegativeImg(response.data);
            })
    })
    const Example = ({ ntImg }) => <img src={`data:image/jpeg;base64,${ntImg}`} />
    return(
        <div className="after_calling_center">
            <div className="after_calling_center_bars">
                <button className="after_calling_go_back">back</button>
                <div className="after_calling_info_bar">
                    <p className="after_calling_info_text">상담 일시 : 2022년 09월 29일 19:07:06 30분</p>
                </div>
            </div>
            <div className="after_calling_center_top">
                <div className="after_calling_keywords">
                    <div className="positive_keyword">긍정 키워드
                        <img src={`data:image/jpeg;base64,${ntImg}`} alt="My Image" className="wordcloud_img"></img>
                    </div>
                    <div class='v-line'></div>
                    <div className="negative_keyword">부정 키워드
                        <img src={`data:image/jpeg;base64,${ntImg}`} alt="My Image"className="wordcloud_img"></img>
                    </div>
                </div>
            </div>
            <div className="after_calling_center_bottom">
                <div className="after_calling_center_bottom_left">
                    <div className="after_search_box">
                            <input type="text" className="after_search_txt" name=""placeholder="검색할 것을 입력하세요 !"></input>
                        </div>
                        <div className="chatting"></div>
                    </div>
                    <div className="after_calling_center_bottom_right">
                        <div className="after_changeEmotion"></div>
                    </div>
                </div>
        </div> 
       )
}

export default AfterCounselor