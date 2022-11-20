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
const callingPage = () => {
    return(
        <div>상담 진행 중 화면</div>
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
    /*
    return (
        <>
        <div className="mode2_top">
            대기중인 고객
        </div>
        <div className="mode2_grid">
            <MakeWaitingList/>
        </div>
        </>
    )*/
    var toggler = document.querySelector('.toggle-switch');
    toggler.onclick = function(){
        toggler.classList.toggle('active');
    }
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
                    <div class="search_box">
                        <input type="text" class="search_txt" name=""placeholder="검색할 것을 입력하세요 !"></input>
                    </div>
                    <div className="chatting">
                            
                        </div>
                </div>
                <div className="calling_center_bottom_right">
                    <div className="mute">
                        <p className="buttonMame">고객 음성 차단</p>
                        <span class="toggle-switch">
                            <span class="toggle-knob"></span>
                        </span>
                    </div>
                    <div className="changeEmotion"></div>
                </div>
            </div>
        </div> 
    )
}
const CounselorMainPage = () => {
    const [current_mode, setMode] = useState(2);
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