import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import './Form.css';

//더미. 백엔드 연결시 삭제하기
const DUMMY_FORM_DATA = {
  title: "Canola Flower Tourism Package Planning",
  detail_info: "A walking course along the canola flower path",
  location: "Seogwipo-si, Jeju Island",
  photoUrls: [
    { preview: "https://cdn.example.com/uploads/jeju1.jpg" },
    { preview: "https://cdn.example.com/uploads/jeju2.jpg" },
  ],
  keywords: ["Hanok", "Traditional Food"],
  available_dates: "Mon 09:00 ~ 18:00, Tue 09:00 ~ 18:00, Wed Closed, ...", // 실제 형식대로 처리
  duration: "2시간",
  price: 30000,
  policy: "Cancellable up to one day in advance"
};
//



const Form = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    detail_info: '',
    location: '',
    photoUrls: [],
    keywords: [],
    available_dates: '',
    hours: 0,
    minutes: 0,
    price: '',
    policy: '',
  });

  const [showExtra, setShowExtra] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
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
    let raw = e.target.value.replace(/[^0-9]/g, '');
    setFormData(prev => ({
      ...prev,
      price: raw,
    }));
  };

  const formatPrice = (num) => {
    if (!num) return '';
    return Number(num).toLocaleString() + ' Won';
  };

  const handleChange = async (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo' && files.length > 0) {
      const selectedFiles = Array.from(files);
      const urls = selectedFiles.map(file => ({
        preview: URL.createObjectURL(file),
      }));
      setFormData(prev => ({
        ...prev,
        photoUrls: [...prev.photoUrls, ...urls]
      }));
      setUploadError('');
    } else if ( name === 'keywords') {
      setFormData(prev => ({
        ...prev,
        keywords: value.split(',').map(k => k.trim())
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
      
      //백엔드 연결 시 여기 사용 (이미지 업로드 api)
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


  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      photoUrls: prev.photoUrls.filter((_, i) => i !== index),
    }));
  };

  const formatScheduleFromUI = () => {
    return weekdays
      .filter(day => schedule[day].active)
      .map(day => `${day} ${schedule[day].start} ~ ${schedule[day].end}`)
      .join(', ');
  };

//더미임. 백엔드 연결 시 지우기
  useEffect(() => {
    setFormData(DUMMY_FORM_DATA);
  }, []);
  //

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedSchedule = formatScheduleFromUI();
    const duration = `${formData.hours}시간 ${formData.minutes}분`;
    
    //payload도 더미. 나중에 지우기
    const payload = {
      title: formData.title,
      detail_info: formData.detail_info,
      location: formData.location,
      image_urls: formData.photoUrls.map(img => img.preview),
      keywords: formData.keywords,
      available_dates: formattedSchedule,
      duration: duration,
      price: Number(formData.price),
      policy: formData.policy,
    };
    console.log('로컬 테스트용 제출 데이터:', payload);

    const dummyType = "planning"
    const dummyChatId = 123412412;
    const dummyTitle = "유채꽃 관광상품 기획서";
    const dummyKeywords = ["키워드1", "키워드2", "키워드3"];

    navigate(`/chat/${dummyChatId}`, {
      state: { type: dummyType, title: dummyTitle, keywords: dummyKeywords }
    });

    // 백엔드 연결 시 여기 사용 (폼 제출 api)
    /*
    const token = localStorage.getItem('access_token');
    const formToSend = new FormData();

    formToSend.append('title', formData.title);
    formToSend.append('detail_info', formData.detail_info);
    formToSend.append('location', formData.location);
    formToSend.append('image_urls', JSON.stringify(formData.photoUrls.map(img => img.preview)));
    formToSend.append('keywords', JSON.stringify(formData.keywords.split(',').map(k => k.trim())));
    formToSend.append('available_dates', formattedSchedule);
    formToSend.append('duration', duration);
    formToSend.append('price', Number(formData.price));
    formToSend.append('policy', formData.policy);

    try {
      const response = await axios.post('/planing_chat', formToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const { type, chat_id, title, keyword } = response.data;
      navigate(`/chat/${chat_id}`, {
        state: { type, title, keyword }
      });
    } catch (error) {
      console.error('error:', error);
      if (error.response) {
        if (error.response.status === 401) {
          alert('Access token is missing or invalid');
        } else if (error.response.status === 500) {
          alert('An error occurred while retrieving export list');
        } else {
          alert('An error occurred during submission');
        }
      } else {
        alert('Network error. Please check your internet connection');
      }
    }
    */
  
  };

  return (
    <div className="form-container">
      <button className="back-button"onClick={() => navigate('/')}>
        <img src="/back.png" alt="돌아가기" />
      </button>
      <h2 className="form-title">Form</h2>
      <form className="main-form" onSubmit={handleSubmit}>
        <label>Title*</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required />

        <label>Detail Info*</label>
        <input type="text" name="detail_info" value={formData.detail_info} onChange={handleChange} required />

        <label>Location*</label>
        <input type="text" name="location" value={formData.location} onChange={handleChange} required />

        <label>Photo Upload</label>
        <div className="photo-upload">
          <div className="photo-box">
            <span className='plus-sign'>+</span>
            <input type="file" name="photo" accept="image/*" onChange={handleChange} required />
          </div>
          {formData.photoUrls.length > 0 && (
            <div className="preview-wrapper multi">
              {formData.photoUrls.map((img, index) => (
                <div key={index} className="preview-box">
                  <img
                    src={img.preview}
                    alt={`Upload ${index + 1}`}
                    className="preview-image"
                  />
                  <button
                    type="button"
                    className="remove-image-button"
                    onClick={() => handleRemoveImage(index)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
            {uploadError && (
              <p style={{ color: 'red', fontSize: '13px', marginTop: '6px' }}>{uploadError}</p>
            )}
        </div>

        <div className="toggle-extra" onClick={() => setShowExtra(!showExtra)}>
          {showExtra ? '▼ Add more details' : '▶ Add more details'}
        </div>

        {showExtra && (
          <div className="extra-fields">
            <label>Keyword/Tag</label>
              <input type="text" name="keywords" 
              value={Array.isArray(formData.keywords) ? formData.keywords.join(', ') 
              : formData.keywords} onChange={handleChange}/>
            <label>Operating Hours</label>
              <div className="weekday-schedule">
                {weekdays.map((day) => (
                  <div className="day-row" key={day}>
                    <input
                      type="checkbox"
                      checked={schedule[day].active}
                      onChange={() => handleToggle(day)}
                    />
                    <label className="day-label">{day}</label>

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
              <label>Duration</label>
              <div className="extra-row">
                
                <div className="duration-wrapper">
                  <select name="hours" value={formData.hours} onChange={(e) => setFormData({ ...formData, hours: e.target.value })}>
                    <option value="0">0 hours</option>
                    <option value="1">1 hour</option>
                    <option value="2">2 hours</option>
                    <option value="3">3 hours</option>
                  </select>
                  <select name="minutes" value={formData.minutes} onChange={(e) => setFormData({ ...formData, minutes: e.target.value })}>
                    <option value="0">0 minutes</option>
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                  </select>
                </div>
                
              </div>
              <label>Price</label>
              <input type="text" name="price" value={formatPrice(formData.price)} onChange={handlePriceChange} inputMode="numeric" />
            </div>

            <label>Rules/Cancellation Policy</label>
            <input type="text" name="policy" value={formData.policy} onChange={handleChange} />
          </div>
        )}
      </form>
      <button type="submit" className="submit-button" onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Form;
