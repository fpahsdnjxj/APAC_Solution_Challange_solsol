import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import './Form.css';

const Form = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    photo: null,
    photoUrl: '',
    keywords: '',
    date: '',
    duration: '',
    price: '',
    policy: '',
  });

  const [showExtra, setShowExtra] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo' && files.length > 0) {
      const file = files[0];
      setFormData(prev => ({ ...prev, photo: file }));
      const uploadImage = async () => {
        const token = localStorage.getItem('access_token');
        const formDataToSend = new FormData();
        formDataToSend.append('file', file);

        try {
          const response = await axios.post('/upload/image', formDataToSend, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          });

          const { url } = response.data;
          setFormData(prev => ({ ...prev, photoUrl: url }));
          setUploadError('');
        } catch (error) {
          console.error('이미지 업로드 실패:', error);
          setUploadError('이미지 업로드에 실패했습니다.');
        }
      };
      uploadImage();

    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('제출된 데이터:', formData);
    navigate('/chat/:id');
  };

  
  const weekdays = ['월', '화', '수', '목', '금', '토', '일'];
  
  const [schedule, setSchedule] = useState(
    weekdays.reduce((acc, day) => {
      acc[day] = {
        active: true,
        start: '09:00',
        end: '18:00',
      };
      return acc;
    }, {})
  );
  
  const handleToggle = (day) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        active: !prev[day].active,
      },
    }));
  };
  
  const handleTimeChange = (day, field, value) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handlePriceChange = (e) => {
    let raw = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 추출
    setFormData(prev => ({
      ...prev,
      price: raw,
    }));
  };

  const formatPrice = (num) => {
    if (!num) return '';
    return Number(num).toLocaleString() + ' 원';
  };

  return (
    <div className="form-container">
      <button className="back-button"onClick={() => navigate('/')}>
        <img src="/back.png" alt="돌아가기" />
      </button>
      <h2 className="form-title">폼 작성</h2>
      <form className="main-form" onSubmit={handleSubmit}>
        <label>상품명*</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>상품 설명*</label>
        <input type="text" name="description" value={formData.description} onChange={handleChange} required />

        <label>위치*</label>
        <input type="text" name="location" value={formData.location} onChange={handleChange} required />

        <label>사진 첨부*</label>
        <div className="photo-upload">
          <label className="photo-box">
            +
            <input type="file" name="photo" accept="image/*" onChange={handleChange} required />
          </label>
            {/* 업로드된 이미지 미리보기 */}
            {formData.photoUrl && (
              <img
                src={formData.photoUrl}
                alt="업로드된 사진"
                style={{ width: '200px', height: '200px', objectFit: 'cover', marginTop: '10px' }}
              />
            )}

            {/* 오류 표시 */}
            {uploadError && (
              <p style={{ color: 'red', fontSize: '13px', marginTop: '6px' }}>{uploadError}</p>
            )}
        </div>

        <div className="toggle-extra" onClick={() => setShowExtra(!showExtra)}>
          {showExtra ? '▼ 추가 정보 입력하기' : '▶ 추가 정보 입력하기'}
        </div>

        {showExtra && (
          <div className="extra-fields">
            <label>키워드/태그</label>
              <input type="text" name="keywords" value={formData.keywords} onChange={handleChange}/>
            <label>운영일시</label>
              <div className="weekday-schedule">
                {weekdays.map((day) => (
                  <div className="day-row" key={day}>
                    <input
                      type="checkbox"
                      checked={schedule[day].active}
                      onChange={() => handleToggle(day)}
                    />
                    <label className="day-label">{day}요일</label>

                    <input
                      type="time"
                      className="time-input"
                      value={schedule[day].start}
                      onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
                      disabled={!schedule[day].active}
                    />

                    <span>~</span>

                    <input
                      type="time"
                              className="time-input"
                      value={schedule[day].end}
                      onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
                      disabled={!schedule[day].active}
                    />
                  </div>
                ))}
              </div>

            <div className="extra">
              <label>소요시간</label>
              <div className="extra-row">
                
                <div className="duration-wrapper">
                  <select name="hours">
                    <option value="0">0시간</option>
                    <option value="1">1시간</option>
                    <option value="2">2시간</option>
                    <option value="3">3시간</option>
                  </select>
                  <select name="minutes">
                    <option value="0">0분</option>
                    <option value="15">15분</option>
                    <option value="30">30분</option>
                    <option value="45">45분</option>
                  </select>
                </div>
                
              </div>
              <label>가격</label>
              <input type="text" name="price" value={formatPrice(formData.price)} onChange={handlePriceChange} placeholder="가격을 입력하세요" inputMode="numeric" />
            </div>

            <label>규칙/취소정책</label>
            <input type="text" name="policy" value={formData.policy} onChange={handleChange} />
          </div>
        )}
      </form>
      <button type="submit" className="submit-button">제출하기</button>
    </div>
  );
};

export default Form;
