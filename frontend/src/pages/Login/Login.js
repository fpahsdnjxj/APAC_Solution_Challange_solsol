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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/auth/login', {
                email: formData.email,
                password: formData.password,
            }, {
                headers: { 'Content-Type': 'application/json' }
            });

            const { accessToken, refreshToken } = response.data;
            if (accessToken) {
                localStorage.setItem('accessToken', accessToken);
                if (refreshToken) {
                    localStorage.setItem('refreshToken', refreshToken);
                }
                alert('로그인 성공');
                navigate('/');
            }
        } catch (error) {
            if (error.response) {
                switch(error.response.status) {
                    case 401:
                        alert('이메일 또는 비밀번호가 올바르지 않습니다.');
                        break;
                    case 400:
                        alert(error.response.data.error || '입력값을 확인해주세요.');
                        break;
                    default:
                        alert('로그인 중 오류가 발생했습니다.');
                }
            } else {
                alert('서버와 연결할 수 없습니다.');
            }
            console.error('Login error:', error);
        }
    };

    const handleGoogleLogin = () => {
      window.location.href = "http://localhost:8080/auth/google";
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

            <button type="button" className="google-button" onClick={handleGoogleLogin}>
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
