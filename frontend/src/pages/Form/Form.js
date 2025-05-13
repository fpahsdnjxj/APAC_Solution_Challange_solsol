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
    photoUrls: [],
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
      const selectedFiles = Array.from(files);

      //백엔드 연결 시 삭제
      const urls = selectedFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file),
      }));
  
      setFormData(prev => ({
        ...prev,
        photoUrls: [...prev.photoUrls, ...urls]
      }));
  
      setUploadError('');

      /*
      const token = localStorage.getItem('access_token');
      const uploads = selectedFiles.map(async (file) => {
        const formDataToSend = new FormData();
        formDataToSend.append('file', file);
        const res = await axios.post('/upload/image', formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
        return res.data.url;
      });

      const uploadedUrls = await Promise.all(uploads);
      setFormData(prev => ({
        ...prev,
        photoUrls: [...prev.photoUrls, ...uploadedUrls]
      }));
      */

    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRemoveImage = (index) => {
    const newPhotoUrls = [...formData.photoUrls];
    newPhotoUrls.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      photoUrls: newPhotoUrls,
    }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedSchedule = formatSchedule(schedule);
    const payload = {
      title: formData.name,
      detail_info: formData.description,
      location: formData.location,
      image_urls: formData.photoUrls.map(img => img.preview), // 실제는 서버에서 받는 URL
      keywords: formData.keywords.split(',').map(k => k.trim()).filter(Boolean),
      available_dates: formattedSchedule, // 임시 하드코딩
      duration: formatDuration(formData.duration), // TODO: 시간 선택값 연결
      price: Number(formData.price),
      policy: formData.policy,
      operating_schedule:formatSchedule(schedule),
    };
    if (!formData.photoUrls.length) {
      alert('이미지 업로드가 아직 완료되지 않았습니다.');
      return;
    }    
  
    console.log('제출 데이터:',payload);

    /*
    const token = localStorage.getItem('access_token');
    const formToSend = new FormData();

    formToSend.append('title', formData.name);
    formToSend.append('detail_info', formData.description);
    formToSend.append('location', formData.location);
    formToSend.append('image_urls', JSON.stringify([formData.photoUrls]));
    formToSend.append('keywords', JSON.stringify(formData.keywords.split(',')));
    formToSend.append('available_dates', formattedSchedule); // 날짜 추후 가공
    formToSend.append('duration', formatDuration(formData.hours, formData.minutes));
    formToSend.append('price', parsedPrice);
    formToSend.append('policy', formData.policy);

    try {
      const response = await axios.post('/planing_chat', formToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const { chat_id, title, keyword } = response.data;
      navigate(`/chat/${chat_id}`, {
        state: { title, keyword }
      }); // Chat 페이지로 이동
    } catch (error) {
      console.error('제출 오류:', error);
      alert('제출 중 오류가 발생했습니다.');
    }
    */
  
    navigate('/chat');
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

  const formatSchedule = (scheduleObj) => {
    return Object.entries(scheduleObj)
      .map(([day, { active, start, end }]) => {
        return active ? `${day} ${start}~${end}` : `${day} 운영안함`;
      })
      .join(', ');
  };
  
  const formatDuration = (duration) => {
    const [hours, minutes] = duration.split(':').map(val => parseInt(val, 10));
    const parts = [];
    if (hours > 0) parts.push(`${hours}시간`);
    if (minutes > 0) parts.push(`${minutes}분`);
    return parts.join(' ') || '0분';
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
            <span className='plus-sign'>+</span>
            <input type="file" name="photo" accept="image/*" onChange={handleChange} required />
          </label>
            {/* 업로드된 이미지 미리보기 */}
            {formData.photoUrls.length > 0 && (
              <div className="preview-wrapper multi">
                {formData.photoUrls.map((img, index) => (
                  <div key={index} className="preview-box">
                    <img
                      src={img.preview}
                      alt={`업로드 ${index + 1}`}
                      className='preview-image'
                    />
                    <button
                      type="button"
                      className="remove-image-button"
                      onClick={() => handleRemoveImage(index)}
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
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
              <input type="text" name="price" value={formatPrice(formData.price)} onChange={handlePriceChange} inputMode="numeric" />
            </div>

            <label>규칙/취소정책</label>
            <input type="text" name="policy" value={formData.policy} onChange={handleChange} />
          </div>
        )}
      </form>
      <button type="submit" className="submit-button" onClick={handleSubmit}>제출하기</button>
    </div>
  );
};

export default Form;
