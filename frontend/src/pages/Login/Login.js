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
                alert('login success');
                navigate('/');
            }
        } catch (error) {
            if (error.response) {
                switch(error.response.status) {
                    case 401:
                        alert('The email or password is incorrect');
                        break;
                    case 400:
                        alert(error.response.data.error || 'Please check your input');
                        break;
                    default:
                        alert('An error occurred during login');
                }
            } else {
                alert('Unable to connect to the server');
            }
            console.error('Login error:', error);
        }
    };

    const handleGoogleLogin = () => {
      window.location.href = "http://ttarang.com/auth/google";
    };

  return (
    <div className="login-container">
      {/* 좌측 로고 영역 */}
      <div className="logo-box">
        <img src="/logo.png" alt="logo" className="logo-image" />
      </div>

      {/* 우측 로그인 폼 */}
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <div className='button-group'>
            <button type="submit" className="login-button">
            Login
            </button>

            <button type="button" className="google-button" onClick={handleGoogleLogin}>
            Sign in with Google
            </button>
        </div>

        {/* 하단 링크: 회원가입 및 비번 찾기 */}
        <div className="link-row">
          <span className="link-text">Forgot password</span>
          <span
            className="link-text"
            onClick={() => navigate('/signup')} // 회원가입 페이지로 이동
          >
            Sign Up
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;
