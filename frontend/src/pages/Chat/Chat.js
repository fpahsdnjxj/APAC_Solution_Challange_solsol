import React, { useState, useRef,useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Chat.css';



const Chat = () => {
    const navigate = useNavigate();
    const { chat_id } = useParams();
    const [userMessage, setUserMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');  
    const messageEndRef = useRef(null); 

    //더미 부분
    const DUMMY_MESSAGE_LIST = [
        {
          sender_role: 'user',
          content_text: '제주 서귀포시 유채꽃 축제는 언제 열리니?',
          links: [],
          image_urls: [],
        },
        {
          sender_role: 'ai',
          content_text: '제주 유채꽃 축제는 매년 4월에 열립니다. [[출처1]]',
          links: ['https://kto.or.kr/festival/jeju_canola'],
          image_urls: [],
        },
        {
          sender_role: 'user',
          content_text: '해당 축제랑 이 상품을 어떻게 연결시킬 수 있을까? 이건 내 민박집에 유채꽃이 핀 사진이야. [[사진1]]',
          links: [],
          image_urls: ['https://cdn.example.com/uploads/2025/04/jeju-canola-field-01.jpg'],
        },
    ];

    const DUMMY_USER_MESSAGE = {
        sender_role: 'user',
        content_text: '제주 서귀포시 유채꽃 축제는 언제 열리니?',
        image_urls: []
      };
    
      const DUMMY_AI_RESPONSE = {
        sender_role: 'ai',
        content_text: '제주 유채꽃 축제는 매년 4월에 열립니다. [[출처1]]',
        links: ['https://kto.or.kr/festival/jeju_canola']
      };
  
    const handleMessageChange = (e) => {
      setUserMessage(e.target.value);
    };

    const fetchMessages = async () => {
            try {
              const response = await axios.get(`/api/chat/${chat_id}`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                  'Content-Type': 'application/json',
                },
              });
              setMessages(response.data.message_list);
              

              //더미임
              //if(chat_id != 123412412) {
                //setMessages(DUMMY_MESSAGE_LIST);
              //}
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    setError('Access token is missing or invalid');
                } else if (error.response && error.response.status === 404) {
                    setError(`Chat with id ${chat_id} not found`);
                } else if (error.response && error.response.status === 500) {
                    setError('An error occurred while retrieving messages');
                } else {
                    setError('An unexpected error occurred. Please try again later.');
                }
        }
      };
  
    const handleSendMessage = async () => {
      if (!userMessage.trim()) return; 
  
      const newMessages = [
        ...messages,
        { sender_role: 'user', content_text: userMessage },
      ];
      setMessages(newMessages);
      setUserMessage('');
  
      setLoading(true);

      //더미임
      // setTimeout(() => {
      //   const aiResponse = {
      //     sender_role: 'ai',
      //     content_text: "제주 유채꽃 축제는 매년 4월에 열립니다. [[출처1]]",
      //     links: ["https://kto.or.kr/festival/jeju_canola"],  // 추가된 URL
      //   };
      //   setMessages([...newMessages, aiResponse]);
      //   setLoading(false);
      // }, 1500);

        try {
            const response = await axios.post(`/api/chat/${chat_id}`, {
                content_text: userMessage,
                image_urls: []  // 이미지가 필요하면 여기에 추가
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json',
                }
            });

            const { content_text, links } = response.data;
            setMessages([
              ...newMessages,
              {
                sender_role: 'ai',
                content_text: content_text,
                links: links || [],
              },
            ]);

            fetchMessages();

        } catch (error) {
            console.error('error:', error);

            // 401 Unauthorized 처리
            if (error.response && error.response.status === 401) {
                setError('Access token is missing or invalid');
            }
            else if (error.response && error.response.status === 404) {
                setError(`Chat with id '${chat_id}' not found.`);
            }    
            // 500 Internal Server Error 처리
            else if (error.response && error.response.status === 500) {
                setError('An error occurred while retrieving export list');
            }
            // 그 외의 오류 처리
            else {
                setError('AI response failed. Please try again later.');
            }
        }
      setLoading(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && userMessage.trim() !== "") {
          e.preventDefault();  // 기본 엔터 동작(줄바꿈)을 방지
          handleSendMessage();
        }
    };

    useEffect(() => {
    
        fetchMessages();
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chat_id]);

    const handleChatComplete = async () => {
        //더미
        setTimeout(() => {
            alert(`Chat ${chat_id} is completed successfully!`);
            navigate(`/plan/${chat_id}`, {
                state:{ type:"planning", title: "유채꽃 관광상품 기획", keywords: ["한옥", "전통음식"] },
            });
        }, 1500);
        
        
        
        try {
          const response = await axios.patch(`/api/chat/${chat_id}/chat_complete`, {}, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              'Content-Type': 'application/json',
            }
          });
    
          if (response.data.message) {
            alert(`Chat ${chat_id} is completed successfully!`);
            navigate(`/plan/${chat_id}`); 
          }
        } catch (error) {
          console.error('Error completing chat:', error);
          if (error.response && error.response.status === 401) {
            setError('Access token is missing or invalid');
          } else if (error.response && error.response.status === 404) {
            setError(`Chat with id '${chat_id}' not found.`);
          } else if (error.response && error.response.status === 500) {
            setError('An error occurred while completing the chat');
          } else {
            setError('An unexpected error occurred. Please try again later.');
          }
        }
          
    };
  
    return (
        <div className="chat-wrapper">
          <button className="home-button" onClick={() => navigate('/')}>
            <img src="/home.png" alt="홈" />
          </button>
  
          {messages.length === 0 ? (
            <>
              <div className="chat-logo-box">
                <img src="/logo.png" alt="로고" className="logo-image" />
              </div>
              <p className="chat-prompt">What kind of plan would you like to create? Feel free to share in the chat!</p>
              <div className="question-list">
                {Array(3).fill("Q. I want to run this kind of marketing — how should I structure it?").map((q, i) => (
                  <div className="question-card" key={i}>
                    {q}
                  </div>
                ))}
              </div>
              <div className="chat-input-wrapper">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="chat-input"
                  value={userMessage}
                  onChange={handleMessageChange}
                  onKeyDown={handleKeyDown} 
                />
                <button className="chat-submit" onClick={handleSendMessage}>
                  <img src="/send.png" alt="icon" />
                </button>
              </div>
            </>
          ) : (
            <div className="chat-container">
              <div className="message-list">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`message ${message.sender_role === 'user' ? 'user-message' : 'ai-message'}`}
                  >
                    {message.content_text}
                    {message.links && message.links.length > 0 && (
                      <div className="ai-links">
                        {message.links.map((link, idx) => (
                          <a href={link} target="_blank" key={idx}>
                            {link}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                 <div ref={messageEndRef} />
              </div>
              <div className="chat-input-wrapper">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="chat-input"
                  value={userMessage}
                  onChange={handleMessageChange}
                  onKeyDown={handleKeyDown} 
                />
                <button className="chat-submit" onClick={handleSendMessage}>
                  <img src="/send.png" alt="icon" />
                </button>
              </div>
              {loading && <div className="loading">The AI is generating a response...</div>}
              <div className="chat-buttons">
                <button className="finish-button" onClick={handleChatComplete}>
                    <img src="/check.png" alt="icon" />
                </button>
              </div>
            </div>
          )}
        </div>
      );
  }
  
export default Chat;