import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log('로컬 테스트용 로그인 정보:', formData);

        //백엔드 연결 시 이쪽 코드 사용
        /*
        try {
            const response = await axios.post('/auth/login', {
                email: formData.email,
                password: formData.password,
            }, {
                headers: { 'Content-Type': 'application/json' }
            });

            const { access_token, user_name } = response.data;
            console.log('로그인 성공:', user_name);

            // 토큰 저장
            localStorage.setItem('access_token', access_token);

            navigate('/');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert('이메일 또는 비밀번호가 올바르지 않습니다.');
            } else {
                alert('로그인 중 오류가 발생했습니다.');
                console.error(error);
            }
        }
        */

        navigate('/');
    };
    const handleGoogleLogin = async () => {
        const id_token = prompt('구글에서 받은 id_token을 입력하세요:');
    
        if (!id_token) return;
    
        //구글 로그인 연동 코드
        /*
        try {
          const response = await axios.post('/auth/google', {
            id_token: id_token
          }, {
            headers: { 'Content-Type': 'application/json' }
          });
    
          const { access_token, user_name, email } = response.data;
          console.log('구글 로그인 성공:', user_name, email);
    
          localStorage.setItem('access_token', access_token);
    
          navigate('/');
        } catch (error) {
          if (error.response && error.response.status === 401) {
            alert('유효하지 않은 google 토큰입니다.');
          } else {
            alert('구글 로그인 중 오류가 발생했습니다.');
            console.error(error);
          }
        }
        */
        navigate('/');
    };

  return (
    <div className="login-container">
      {/* 좌측 로고 영역 */}
      <div className="logo-box">
        <img src="/logo.png" alt="로고" className="logo-image" />
      </div>

      {/* 우측 로그인 폼 */}
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">이메일</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">비밀번호</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <div className='button-group'>
            <button type="submit" className="login-button">
            로그인
            </button>

            <button type="button" className="google-button">
            구글 계정으로 로그인
            </button>
        </div>

        {/* 하단 링크: 회원가입 및 비번 찾기 */}
        <div className="link-row">
          <span className="link-text">비밀번호 찾기</span>
          <span
            className="link-text"
            onClick={() => navigate('/signup')} // 회원가입 페이지로 이동
          >
            회원가입
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;
