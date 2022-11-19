import React, {useEffect, useState, Component, useRef} from "react";
import {useNavigate} from "react-router-dom";
import "./counselor_mainpage.css";
import axios from "axios";
import {useLocation} from "react-router-dom";
import URLsetting from "../Setting/URLsetting";
function Mode1GrayBox ({start,end,time,id,people}){
    return (
        <div className="mode1_grid_gray_box">
            {start}
            {people}
        </div>
    )
}
const Mode1 = () => {
    const [Mode1_data,setMode1Data]=useState([]);
    useEffect(()=> {
        axios
        .get(URLsetting.LOCAL_API_URL+"consulting/list", {
            params: {
                clientID: "cmoh4135"
            }
        })
        .then((response) => {
            setMode1Data(response.data);
        })
    },[])
    return (
        <> < div className = "center_top" > <div className="text_box">
            <p className="center_top_text" id="todayCallCount">오늘 상담 건수
                <span classNane="variable_bold" id="today_call_count"></span>
                건</p>
            <p className="center_top_text" id="todayCallTime">오늘 상담 시간
                <span classNane="variable_bold" id="today_call_time"></span>
            </p>
            <p className="center_top_text" id="todayCallTime">대기 고객
                <span classNane="variable_bold" id="waiting_customer_count"></span>
                명</p>
        </div>
    </div>
    <hr></hr>
    <div className="center_bottom">
        <div className="call_record_list_box">
            <p className="bigText">상담 내역</p>
            <div className="mode1_grid">
            {
                        Mode1_data.map((tmp) => (
                            <Mode1GrayBox
                                start={tmp.start}
                                end={tmp.end}
                                time={tmp.time}
                                id={tmp.id}
                                people={tmp.counselorName}/>
                        ))
                    }
            </div>
        </div>
        <div class='v-line'></div>
        <div className="todayKeyword">
            <p className="emotion_wordcloue_text">happy</p>
            <div className="word_cloud" id="positive_wordcloud">좋아용</div>
            <p className="emotion_wordcloue_text">angry</p>
            <div className="word_cloud" id="negative_wordcloud">안좋아요</div>
        </div>
    </div>
</>
    )
}
function CalculateWaitingTime({ab}){
    const [tmp_time,setTmptime] = useState("");
    useEffect(()=> {
        // 현재 시간 대비 대기 시간 구하기
    },[])
    return parseInt(tmp_time / 60).toString().padStart(2,"0") + ':' + parseInt(tmp_time % 60).toString().padStart(2,"0");
}
function MakeWaitingList ({room,client,time}){
    return (
        <div className="waiting_list_bar">
                <p className="bar_text_name">이름 {client}</p>
                <p className="bar_text_time">대기 시간
                <CalculateWaitingTime
                ab={time}
                />
                </p>
        </div>
    )
}
const Mode2 = () =>{
    const [room_number, setRoomNumber] = useState([]);
    useEffect(()=> {
        axios.get(URLsetting.LOCAL_API_URL+"consulting/room-list")
        .then((response)=> {
            setRoomNumber(response.data);
        })
    },[])
    return (
        <>
        <div className="mode2_top">
            대기중인 고객
        </div>
        <div className="mode2_grid">
        </div>
        </>
    )
}
const CounselorMainPage = () => {
    const [current_mode, setMode] = useState(1);
    const leftbar_backgroundcolor = (number) => {
        for (var i = 1; i < 6; i++) {
            var tmp = "select" + i;
            console.log(tmp);
            if (i != number) {
                document
                    .getElementById(tmp)
                    .style['font-weight'] = "lighter";
                document
                    .getElementById(tmp)
                    .style['background'] = "transparent"
            } else {
                document
                    .getElementById(tmp)
                    .style['font-weight'] = "normal";
                document
                    .getElementById(tmp)
                    .style['background'] = "rgba(53, 157, 217, 0.17)"
            }
        }
        setMode(number);
        console.log(number);
    }
    function ModeChange() {
        if (current_mode == 1) {
            return (<Mode1/>)
        }
        else if(current_mode==2){
            return (<Mode2/>)

        }
    }
    return (
        <div className="counselor_cover">
            <div className="left_bar_counselor_mainpage">
                <p className="lincall">LINCALL</p>
                <p className="counselor_text">상담사</p>
                <p className="nameFontStyle">윤석진</p>
                <div className="left_bar_gray_box_counselor">
                    <div className="currentStateStyle">온라인</div>
                </div>
                <div className="counselor_button_grouping">
                    <button
                        className="left_bar_text_font2"
                        value="1"
                        id="select1"
                        onClick={e => leftbar_backgroundcolor(e.target.value)}>메인 페이지</button>
                    <button
                        className="left_bar_text_font"
                        value="2"
                        id="select2"
                        onClick={e => leftbar_backgroundcolor(e.target.value)}>상담 시작</button>
                    <button
                        className="left_bar_text_font"
                        value="3"
                        id="select3"
                        onClick={e => leftbar_backgroundcolor(e.target.value)}>상담 내역 조회</button>
                    <button
                        className="left_bar_text_font"
                        value="4"
                        id="select4"
                        onClick={e => leftbar_backgroundcolor(e.target.value)}>
                        마이페이지
                    </button>
                    <button
                        className="logout"
                        id="select5"
                        value="5"
                        onClick={e => leftbar_backgroundcolor(e.target.value)}>로그 아웃</button>
                </div>
            </div>
            <div className="center_box">
                <ModeChange/>
            </div>
            <div className="right_bar_counselor_mainpage">
                <p className="bigText" id="memo">
                    MEMO
                </p>
            </div>
        </div>
    );
};
export default CounselorMainPage;