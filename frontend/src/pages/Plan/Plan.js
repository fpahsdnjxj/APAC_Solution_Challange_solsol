import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Plan.css';

const Plan = () => {
  const { chat_id } = useParams(); // Get the chat ID from the URL
  const [planData, setPlanData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        setPlanData(DUMMY_PLAN_DATA);
        // 백엔드 연결 시 사용
        /*
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Login required.');
        return;
      }

      try {
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
      // Replace this with the actual API request
      /*
      const response = await axios.post(`/export/${chat_id}/marketing_chat`, bodyData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      });
      */

      // Simulate successful response
      const response = {
        data: {
          chatid: 123456,
          title: "유채꽃 마케팅 기획서",
          keyword: ["한옥", "전통음식", "관광"]
        }
      };

      console.log('Marketing Chat Created:', response);

      // Navigate to the new chat page with the new chat ID and other details
      navigate(`/chat/${response.data.chatid}`, {
        state: { title: response.data.title, keywords: response.data.keyword },
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
  const handleButtonClick = () => {
    if (planData?.type === 'planning') {
      handleMarketingChat(); 
    } else {
      //pdf 생성 안 넣어요?
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!planData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="plan-wrapper">
        <button className="home-button" onClick={() => navigate('/')}>
            <img src="/home.png" alt="홈" />
        </button>
        <div>
            <h1>{planData.title}</h1>
            <p className='time'>{new Date(planData.created_at).toLocaleString()}</p>   
        </div>
      <div className="content">
        <h2>Content</h2>
        <div
          className="content-text"
          dangerouslySetInnerHTML={{ __html: planData.content }}
        />
      </div>

      <div className="button-wrapper">
        <button onClick={handleButtonClick}>
          {planData.type === 'marketing' ? 'Generate PDF' : <img src="/doc.png" alt="icon" />}
        </button>
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
  );
};

export default Plan;
