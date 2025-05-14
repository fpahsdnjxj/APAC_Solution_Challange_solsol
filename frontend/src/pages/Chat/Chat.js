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
        content_text: '제주 서귀포시 유채꽃 축제는 언제 열리니?',
        image_urls: []
      };
    
      const DUMMY_AI_RESPONSE = {
        sender_role: 'ai',
        content_text: '제주 유채꽃 축제는 매년 4월에 열립니다. [[출처1]]',
        links: ['https://kto.or.kr/festival/jeju_canola']
      };

    //
  
    const handleMessageChange = (e) => {
      setUserMessage(e.target.value);
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
      setTimeout(() => {
        const aiResponse = {
          // ... 
          //여기는 더미, 위에 ...을 실제 사용
          sender_role: 'ai',
          content_text: "제주 유채꽃 축제는 매년 4월에 열립니다. [[출처1]]",
          links: ["https://kto.or.kr/festival/jeju_canola"],
        };
        setMessages([...newMessages, aiResponse]);
        setLoading(false);
      }, 1500);

      //백엔드 연결 시 사용
        /*
        try {
            const response = await axios.post(`/chat/${chat_id}`, {
                content_text: userMessage,
                image_urls: [] 
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json',
                }
            });

            const { content_text, links } = response.data; 
            const aiResponse = {
                sender_role: 'ai',
                content_text,
                links: links || [],
            };
            setMessages([...newMessages, aiResponse]);
          } catch (error) {
            console.error('error:', error);

            if (error.response && error.response.status === 401) {
                setError('Access token is missing or invalid');
            }
            else if (error.response && error.response.status === 404) {
                setError(`Chat with id '${chat_id}' not found.`);
            }    
            else if (error.response && error.response.status === 500) {
                setError('An error occurred while retrieving export list');
            }
            else {
                setError('AI response failed. Please try again later.');
            }
        }
        */
      setLoading(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && userMessage.trim() !== "") {
          e.preventDefault();
          handleSendMessage();
        }
    };

    useEffect(() => {
        const fetchMessages = async () => {
            try {
            /*
              const response = await axios.get(`/chat/${chat_id}`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                  'Content-Type': 'application/json',
                },
              });
              setMessages(response.data.message_list);
              */

              //더미임
              if(chat_id != 123412412) {
                setMessages(DUMMY_MESSAGE_LIST);
              }
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
      
          // 메시지가 없다면 API 호출
          if (messages.length === 0) {
            fetchMessages();
          }
      
          if (messages.length > 0) {
            messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }
    }, [messages]);

    const handleChatComplete = async () => {
        //더미
        setTimeout(() => {
            alert(`Chat ${chat_id} is completed successfully!`);
            navigate(`/plan/${chat_id}`, {
                state:{ type:"planning", title: "유채꽃 관광상품 기획", keywords: ["한옥", "전통음식"] },
            });
        }, 1500);
        
        //백엔드 연결시 사용
        /*
        try {
          const response = await axios.post(`/chat/${chat_id}/chat_complete`, {}, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
              'Content-Type': 'application/json',
            }
          });
    
          const { type, title, keyword } = response.data;

          navigate(`/plan/${chat_id}`, {
            state: {
              type,            // 핵심 포인트
              title,
              keywords: keyword,
            }
          });
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
          */
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
              {loading && <div className="loading">AI가 답변을 준비 중입니다...</div>}
              <div className="chat-buttons">
                <button className="finish-button" onClick={handleChatComplete}>
                    <img src="/check.png" alt="icon" />
                </button>
              </div>
            </div>
          )}
        </div>
      );
  };

export default Chat;