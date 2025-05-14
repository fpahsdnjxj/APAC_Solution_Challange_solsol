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
      "https://cdn.example.com/uploads/jeju1.jpg",
      "https://cdn.example.com/uploads/jeju2.jpg"
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
        console.log("✅ planData.content:", DUMMY_PLAN_DATA.content); // 여기 추가

        // 백엔드 연결 시 사용
        /*

      try {
        const token = localStorage.getItem('access_token');
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
        */
    };

    fetchPlanData();
  }, [chat_id]);



  const handleMarketingChat = async () => {
    if (!planData) return;
    setLoading(true);

    const bodyData = {
      content: planData.content,
      image_urls: planData.image_urls,
      links: planData.link_urls,
    };

    try {
      // 더미 데이터
      const response = {
        data: {
          type : "marketing",
          chatid: 12432423,
          title: "유채꽃 마케팅 기획서",
          keyword: ["한옥", "전통음식", "관광"]
        }
      };

      // 백엔드 연결 시 이쪽 사용
      /*
      const token = localStorage.getItem('access_token');
      const response = await axios.post(`/export/${chat_id}/marketing_chat`, bodyData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      });
      */

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

  const markdownString = typeof planData.content === 'string'
  ? planData.content
  : planData.content?.value || '';

  

  return (
    <div className="plan-wrapper">
        <button className="home-button" onClick={() => navigate('/')}>
            <img src="/home.png" alt="홈" />
        </button>
        <div>
            <p className='time'>{new Date(planData.created_at).toLocaleString()}</p>   
        </div>
        <div ref={contentRef}>
          <div className="content">
            <div className="content-text">
            {typeof markdownString === 'string' ? (
              <ReactMarkdown>{markdownString}</ReactMarkdown>
            ) : (
              markdownString
            )}
            </div>
          </div>

          <div className="image-gallery">
            {planData.image_urls.map((url, index) => (
              <img src={url} alt={`Image ${index + 1}`} key={index} />
            ))}
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
