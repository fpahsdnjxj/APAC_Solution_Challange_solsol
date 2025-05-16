import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import axios from 'axios';
import './Home.css';

// 더미 기획서 데이터 (로컬 테스트용)
const DUMMY_EXPORTS = [
  {
    "chat_id":12342,
     "title": "인스타 게시물",
     "type": "planning",
     "content": "내용을 한줄만 표시..."
   },
   {
      "chat_id":123342,
     "title": "인스타 게시물",
     "type": "marketing",
     "content": "내용을 한줄만 표시..."
   },
   {
      "chat_id":122635632,
     "title": "인스타 게시물",
     "type": "marketing",
     "content": "내용을 한줄만 표시..."
   }
];
  
const DUMMY_CHATS = [
  {
    chat_id: 12342,
    title: "인스타 게시물",
    type: "planning",
    keywords: ["키워드1", "키워드2"],
    update_date: "2025-12-10 19:00:00"
  },
  {
    chat_id: 12343,
    title: "인스타 게시물",
    type: "marketing",
    keywords: ["키워드1", "키워드2"],
    update_date: "2025-12-10 19:00:00"
  },
  {
    chat_id: 12344,
    title: "인스타 게시물",
    type: "marketing",
    keywords: ["키워드1", "키워드2"],
    update_date: "2025-12-10 19:00:00"
  }
];
  
const Home = () => {
    const navigate = useNavigate();
    const [exportList, setExportList] = useState([]);
    const [chatList, setChatList] = useState([]);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(0); 
    const [cardsPerPage, setCardsPerPage] = useState(5); // 기본 카드 수

    const filteredList = exportList.filter(plan => {
        if (filter === 'All') return true;
        if (filter === 'marketing') return plan.type === 'marketing';
        if (filter === 'planning') return plan.type === 'planning';
        return true;
    });

    const maxPage = Math.ceil(filteredList.length / cardsPerPage) - 1;
    const paginatedList = filteredList.slice(
        currentPage * cardsPerPage,
        currentPage * cardsPerPage + cardsPerPage
    );

    useEffect(() => {
      const updateCardsPerPage = () => {
        const width = window.innerWidth;
  
        if (width < 700) {
          setCardsPerPage(1); // 모바일 화면에서는 1개 카드
        } else if (width < 1000) {
          setCardsPerPage(2); // 태블릿에서는 2개 카드
        } else if (width < 1300) {
          setCardsPerPage(3);
        } else if (width < 1600) {
          setCardsPerPage(4);
        }
        else {
          setCardsPerPage(5); // 데스크탑에서는 6개 카드
        }
      };
  
      // 화면 크기 변화시 카드 수 업데이트
      window.addEventListener('resize', updateCardsPerPage);
  
      // 초기 화면 크기 감지
      updateCardsPerPage();
  
      return () => {
        window.removeEventListener('resize', updateCardsPerPage);
      };
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            setError('Login is required');
            navigate('/login');
            return;
        }
        
        //console.log('로컬 더미 데이터 테스트');
        //setExportList(DUMMY_EXPORTS);
        //setChatList(DUMMY_CHATS);  

        
        const fetchExportList = async () => {
            try {
                const response = await axios.get('/api/export/list', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                setExportList(response.data.export_list);
            } catch (err) {
                console.error('error: ', err);
                if (err.response && err.response.status === 401) {
                    setError('Access token is missing or invalid');
                } else {
                    setError('An error occurred while loading the list of plans');
                }
            }
        };

        const fetchChatList = async () => {
            if (!token) {
                setError('Login is required');
                return;
            }
            try {
                const response = await axios.get('/api/chat/chatlist', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                // id → chat_id로 변환
                setChatList(
                  (response.data.chat_list || []).map(chat => ({
                    ...chat,
                    chat_id: chat.id,
                    keywords: Array.isArray(chat.keywords) ? chat.keywords : [],
                  }))
                );
            } catch (err) {
                console.error('error: ', err);
                if (err.response && err.response.status === 401) {
                    setError('Login is required');
                } else {
                    setError('An error occurred while loading the chat list');
                }
            }
        };

        fetchExportList();
        fetchChatList();
    }, []);

    const handleCreateChat = () => {
        navigate('/form');
    };

    return (
        <>
          <Header />
          <div className="home-wrapper">
            <section className="section-document">
              <div className="section-header">
                <h2>My Plan</h2>
                <div className="filters">
                  {['All', 'marketing', 'planning'].map(f => (
                    <span
                      key={f}
                      className={`filter ${filter === f ? 'active' : ''}`}
                      onClick={() => {
                        setFilter(f);
                        setCurrentPage(0);
                      }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
              {error ? (
                <p className="error-text">{error}</p>
              ) : (
                <div className="card-slider">
                  <button
                    className="slide-button"
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                  >
                    {'<'}
                  </button>
                  <div className="card-list">
                    {paginatedList.map((plan, index) => (
                      <div
                        key={index}
                        className={`plan-card ${plan.type}`}
                        onClick={() => navigate(`/plan/${plan.chat_id}`)}
                      >
                        <div className="card-title">{plan.title}</div>
                        <div className="card-description">{plan.content}</div>
                      </div>
                    ))}
                    {Array.from({ length: cardsPerPage - paginatedList.length }).map((_, i) => (
                        <div key={`empty-${i}`} className="plan-card empty-card" />
                    ))}
                  </div>
                  <button
                    className="slide-button"
                    disabled={currentPage === maxPage}
                    onClick={() => setCurrentPage(p => Math.min(maxPage, p + 1))}
                  >
                    {'>'}
                  </button>
                </div>
              )}
            </section>
            <section className="section-chatting">
              <div className="section-header">
                <h2>My Chat</h2>
                <button className="create-button" onClick={handleCreateChat}>
                  create chat
                </button>
              </div>
              <div className="chat-list">
                {chatList.map((chat) => (
                    <div
                        className={`chat-item ${chat.type}`}
                        key={chat.chat_id}
                        onClick={()=> navigate(`/chat/${chat.chat_id}`)}
                    >
                        <div className="chat-title">{chat.title}</div>
                        <div className="chat-keywords">
                          {Array.isArray(chat.keywords) && chat.keywords.map((keyword, i) => (
                            <span className="keyword-tag" key={i}>
                              {keyword}
                            </span>
                          ))}
                        </div>
                        <div className="chat-date">{chat.update_date}</div> 
                    </div>
                ))}
              </div>
            </section>
          </div>
          <Footer />
        </>
    );
};

export default Home;