import React, { useState, useEffect,useRef  } from 'react';
import { useParams, useNavigate , useLocation} from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import html2pdf from 'html2pdf.js';
import './Plan.css';

const Plan = () => {
  const { chat_id } = useParams();
  const location = useLocation();
  const [planData, setPlanData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { type, title, keywords  } = location.state || {};
  const contentRef = useRef();

  //더미임
  const DUMMY_PLAN_DATA = {
    type: "planning",
    title: "유채꽃 관광상품 기획",
    content: "## 유채꽃 관광상품 기획\n\n유채꽃길을 따라 걷는 산책 코스...",
    image_urls: [
    ],
    link_urls: [
      "https://kto.or.kr/festival/jeju_canola"
    ],
    created_at: "2024-02-01 18:00:00"
  };

  useEffect(() => {
    const fetchPlanData = async () => {
      //이건 더미
        setPlanData(DUMMY_PLAN_DATA);


      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setError('Login required.');
          return;
        }
        const response = await axios.get(`/export/${chat_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        setPlanData(response.data);
      } catch (error) {
        console.error('Error fetching plan data:', error);
        if (error.response && error.response.status === 401) {
          setError('Access token is missing or invalid');
        } else if (error.response && error.response.status === 404) {
          setError(`Chat with ID '${chat_id}' not found.`);
        } else {
          setError('An error occurred while retrieving export list');
        }
      }
    };

    fetchPlanData();
  }, [chat_id]);

  const handleMarketingChat = async () => {
    if (!planData) return setLoading(true);

    const bodyData = {
      content: planData.content,
      image_urls: planData.image_urls,
      links: planData.link_urls,
    };

    try {

      // 백엔드 연결 시 이쪽 사용
      const response = await axios.post(`/export/${chat_id}/marketing_chat`, bodyData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });

      const { type, chatid, title, keyword } = response.data;
      navigate(`/chat/${chatid}`, {
        state: { type, title, keywords: keyword },
      });
      setLoading(false);
      
    } catch (error) {
      console.error('Error creating marketing chat:', error);

      if (error.response && error.response.status === 401) {
        setError('Access token is missing or invalid');
      } else if (error.response && error.response.status === 404) {
        setError(`Chat with id '${chat_id}' not found`);
      } else if (error.response && error.response.status === 500) {
        setError('An error occurred while retrieving export list');
      } else {
        setError('An unknown error occurred');
      }

      setLoading(false);
      
    }
  };

  const handlePdfDownload = async () => {
        if (!contentRef.current) return;

        await new Promise(resolve => setTimeout(resolve, 1000));
      
        html2pdf()
          .from(contentRef.current)
          .set({
            margin: 1,
            filename: `${planData.title || 'plan'}.pdf`,
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
          })
          .save();
  };

  const handleButtonClick = () => {
    if (planData?.type === 'planning') {
      handleMarketingChat(); 
    } else {
      handlePdfDownload();
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!planData) {
    return <div>Loading...</div>;
  }

  const markdownString = planData?.content || '';

  const createdAt = new Date(planData.created_at).toLocaleString();

  return (
    <div className="plan-wrapper">
        <button className="home-button" onClick={() => navigate('/')}>
            <img src="/home.png" alt="홈" />
        </button>
        <div>
            <p className="time">Created at: {createdAt}</p>
        </div>
        <div ref={contentRef}>
          <div className="content">
            <div className="content-text">   
              {planData ? (
              <ReactMarkdown>{markdownString}</ReactMarkdown>
            ) : (
              <p>Loading content...</p>
            )}
            </div>
          </div>


          <div className="link-gallery">
            {planData.link_urls.map((link, index) => (
              <a href={link} target="_blank" rel="noopener noreferrer" key={index}>
                {link}
              </a>
            ))}
          </div>
        </div>

        <div className="button-wrapper">
          <button onClick={handleButtonClick}>
            {planData.type === 'marketing' ? 'Generate PDF' : <img src="/doc.png" alt="icon" />}
          </button>
        </div>
      </div>
  );
};

export default Plan;
