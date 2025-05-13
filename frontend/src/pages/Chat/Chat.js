import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Chat.css';


const Chat = () => {
    const navigate = useNavigate();
    const { chat_id } = useParams(); 
    const [chatDetails, setChatDetails] = useState(null);
    const [userMessage, setUserMessage] = useState('');

    const localChats = [
        { chat_id: 1, title: '채팅 1', keywords: ['키워드1', '키워드2'] },
        { chat_id: 2, title: '채팅 2', keywords: ['키워드3', '키워드4'] },
        { chat_id: 3, title: '채팅 3', keywords: ['키워드5', '키워드6'] },
    ];
    
    useEffect(() => {
        // chat_id에 맞는 데이터를 로컬에서 찾아서 상태 업데이트
        const chatData = localChats.find(chat => chat.chat_id === parseInt(chat_id));
        if (chatData) {
            const keywords = Array.isArray(chatData.keywords) ? chatData.keywords : [];
          setChatDetails({...chatData, keywords});
        }
    }, [chat_id]);


    // 메시지 입력 핸들러
    const handleMessageChange = (e) => {
        setUserMessage(e.target.value);
    };

    // 메시지 전송 핸들러
    const handleSendMessage = () => {
        if (userMessage.trim() === '') {
            alert('메시지를 입력하세요.');
            return;
        }
        // 메시지 전송 후 처리 (예: 메시지 리스트에 추가, 서버로 전송 등)
        console.log('전송된 메시지:', userMessage);
        setUserMessage(''); // 입력란 비우기
    };

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
                <img src="/image.png" alt="icon" className='image'/>
                <input
                    type="text"
                    placeholder="채팅을 입력해주세요"
                    className="chat-input"
                    value={userMessage}
                    onChange={handleMessageChange}
                />
                <button className="chat-submit" onClick={handleSendMessage}>
                    <img src="/send.png" alt="icon" />
                </button>
            </div>

            {chatDetails && (
                <div className='chat-details'>
                    <h3>{chatDetails.title}</h3>
                    <div className="keywords">
                        <h4>키워드</h4>
                        {Array.isArray(chatDetails.keywords) && chatDetails.keywords.length > 0 ? (
                            chatDetails.keywords.map((keyword, index) => (
                                <span key={index} className="keyword-tag">{keyword}</span>
                            ))
                        ) : (
                            <span>키워드가 없습니다.</span>
                        )}
                    </div>
                </div>
            )}
        </div>
  );
};

export default Chat;