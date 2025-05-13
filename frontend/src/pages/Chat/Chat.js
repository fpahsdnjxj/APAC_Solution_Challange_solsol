import React from 'react';
import { useParams, navigate, useNavigate } from 'react-router-dom';
import './Chat.css';


const Chat = () => {
    const navigate = useNavigate();
    const { chat_id } = useParams(); 
    const [chatDetails, setChatDetails] = useState(null);

    const localChats = [
        { chat_id: 1, title: '채팅 1', detail_info: '채팅 1 상세 내용', keywords: ['키워드1', '키워드2'] },
        { chat_id: 2, title: '채팅 2', detail_info: '채팅 2 상세 내용', keywords: ['키워드3', '키워드4'] },
        { chat_id: 3, title: '채팅 3', detail_info: '채팅 3 상세 내용', keywords: ['키워드5', '키워드6'] },
    ];
    
    useEffect(() => {
        // chat_id에 맞는 데이터를 로컬에서 찾아서 상태 업데이트
        const chatData = localChats.find(chat => chat.chat_id === parseInt(chat_id));
        if (chatData) {
          setChatDetails(chatData);
        }
    }, [chat_id]);

    return (
        <div className="chat-wrapper">
            <button className='home-button' onClick={() => navigate('/')}>
                <img src="/home.png" alt="홈" />
            </button>
            <div className="logo-box">
                <img src="/logo.png" alt="로고" className="logo-image" />
            </div>
            <p className="chat-prompt">어떤 기획을 하고 싶으신가요? 자유롭게 채팅으로 말해주세요!</p>

            <div className="question-list">
                {Array(3).fill("Q. 이러이러한 마케팅을 하고 싶은데 어떻게 구성하면 좋을까?").map((q, i) => (
                    <div className="question-card" key={i}>
                        {q}
                    </div>
                ))}
            </div>

            <div className="chat-input-wrapper">
                <img src="/icon-chat-image.png" alt="icon" className="chat-input-icon" />
                <input type="text" placeholder="채팅을 입력해주세요" className="chat-input" />
                <button className="chat-submit">➤</button>
            </div>
      </div>
  );
};

export default Chat;