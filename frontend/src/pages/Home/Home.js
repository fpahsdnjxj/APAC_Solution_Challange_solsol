import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import axios from 'axios';
import './Home.css';

// 더미 기획서 데이터 (로컬 테스트용)
const DUMMY_EXPORTS = [
    {
      title: '인스타 게시물',
      type: 'planning',
      content: '내용을 한줄만 표시...',
    },
    {
        title: '인스타 게시물',
        type: 'planning',
        content: '내용을 한줄만 표시...',
    },
    {
      title: '인스타 게시물',
      type: 'marketing',
      content: '내용을 한줄만 표시...',
    },
    {
      title: '인스타 게시물',
      type: 'marketing',
      content: '내용을 한줄만 표시...',
    },
    {
        title: '인스타 게시물',
        type: 'marketing',
        content: '내용을 한줄만 표시...',
      },
];
  
const DUMMY_CHATS = Array.from({ length: 10 }, (_, i) => ({
    chat_id: 1000 + i,
    title: `인스타 게시물 ${i + 1}`,
    type: i % 2 === 0 ? 'marketing' : 'planning',
    keywords: [`키워드${i + 1}`, `키워드${i + 2}`],
}));
  
const Home = () => {
    const navigate = useNavigate();
    const [exportList, setExportList] = useState([]);
    const [chatList, setChatList] = useState([]);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('전체');
    const [currentPage, setCurrentPage] = useState(0); 

    const filteredList = exportList.filter(plan => {
        if (filter === '전체') return true;
        if (filter === '마케팅') return plan.type === 'marketing';
        if (filter === '기획') return plan.type === 'planning';
        return true;
    });

    const cardsPerPage = 4;
    const maxPage = Math.ceil(filteredList.length / cardsPerPage) - 1;
    const paginatedList = filteredList.slice(
        currentPage * cardsPerPage,
        currentPage * cardsPerPage + cardsPerPage
    );


    useEffect(() => {
        /*
        const token = localStorage.getItem('access_token');
        if (!token) {
            setError('로그인이 필요합니다.');
            return;
        }
        */
        console.log('로컬 더미 데이터 테스트');
        setExportList(DUMMY_EXPORTS);
        setChatList(DUMMY_CHATS);  

        /*
        const fetchExportList = async () => {
            try {
                const response = await axios.get('/export', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                setExportList(response.data.export_list);
            } catch (err) {
                console.error('기획서 로딩 오류:', err);
                if (err.response && err.response.status === 401) {
                    setError('로그인이 필요합니다.');
                } else {
                    setError('기획서 목록을 불러오는 중 오류가 발생했습니다.');
                }
            }
        };

        fetchExportList();
        */
        const fetchChatList = async () => {
          const token = localStorage.getItem('access_token');
          if (!token) {
            setError('로그인이 필요합니다.');
            return;
          }
    
          try {
            const response = await axios.get('/chatlist', {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
    
            setChatList(response.data.chat_list);
          } catch (err) {
            console.error('채팅 목록 로딩 오류:', err);
            if (err.response && err.response.status === 401) {
              setError('로그인이 필요합니다.');
            } else {
              setError('채팅 목록을 불러오는 중 오류가 발생했습니다.');
            }
          }
        };
    
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
                <h2>나의 기획서</h2>
                <div className="filters">
                  {['전체', '마케팅', '기획'].map(f => (
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
                        onClick={() => navigate('/plan')}
                      >
                        <div className="card-title">{plan.title}</div>
                        <div className="card-description">{plan.content}</div>
                        <div className="card-date">{plan.date}</div>
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
                <h2>나의 채팅</h2>
                <button className="create-button" onClick={handleCreateChat}>
                  채팅 생성
                </button>
              </div>
              <div className="chat-list">
                {chatList.map((chat) => (
                    <div
                        className={`chat-item ${chat.type}`} // ✅ type 클래스 적용
                        key={chat.chat_id || index}
                        onClick={()=> navigate(`/chat/${chat.chat_id}`)}
                    >
                        <div className="chat-title">{chat.title}</div>
                        <div className="chat-keywords">
                            {chat.keywords.map((keyword, i) => (
                                <span className="keyword-tag" key={i}>
                                    {keyword}
                                </span>
                            ))}
                        </div>
                        <div className="chat-date">2025.01.01 19:00</div> {/* 날짜 데이터가 없으니 고정 */}
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