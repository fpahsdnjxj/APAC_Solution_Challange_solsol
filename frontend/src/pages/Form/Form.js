import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Form.css';

const Form = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    photo: null,
    keywords: '',
    date: '',
    duration: '',
    price: '',
    policy: '',
  });

  const [showExtra, setShowExtra] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo') {
      setFormData({ ...formData, photo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('제출된 데이터:', formData);
    navigate('/chat/:id');
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
        </div>

        <div className="toggle-extra" onClick={() => setShowExtra(!showExtra)}>
          {showExtra ? '▼ 추가 정보 입력하기' : '▶ 추가 정보 입력하기'}
        </div>

        {showExtra && (
          <div className="extra-fields">
            <label>키워드/태그 입력</label>
            <input type="text" name="keywords" value={formData.keywords} onChange={handleChange} />

            <div className="extra-row">
              <input type="text" name="date" placeholder="운영일시" value={formData.date} onChange={handleChange} />
              <input type="text" name="duration" placeholder="소요시간" value={formData.duration} onChange={handleChange} />
              <input type="text" name="price" placeholder="가격" value={formData.price} onChange={handleChange} />
            </div>

            <label>규칙/취소정책</label>
            <input type="text" name="policy" value={formData.policy} onChange={handleChange} />
          </div>
        )}

        <button type="submit" className="submit-button">제출하기</button>
      </form>
    </div>
  );
};

export default Form;
