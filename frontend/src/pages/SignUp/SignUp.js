import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

const DUMMY_DATA = {
    user_name: '홍길동',
    email: 'hong@example.com',
    password: 'password123!',
    passwordConfirmation: 'password123!',
    phone_number: '010-1234-5678',
    birth_date: '2000-01-01',
};

const SignUp = () => {
    const [formData, setFormData] = useState({
        user_name: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        phone_number: '',
        birth_date: '',
    });

    const navigate = useNavigate();

    useEffect(() => {
        setFormData(DUMMY_DATA);
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.passwordConfirmation) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const response = await axios.post('/auth/signup', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            const { accessToken, refreshToken } = response.data;
            if (accessToken) {
                localStorage.setItem('accessToken', accessToken);
                if (refreshToken) {
                    localStorage.setItem('refreshToken', refreshToken);
                }
                alert('회원가입이 완료되었습니다.');
                navigate('/');
            } else {
                alert('회원가입은 완료되었으나 토큰을 받지 못했습니다.');
            }
        } catch(error) {
            if(error.response) {
                switch(error.response.status) {
                    case 400:
                        alert(error.response.data.error || '입력값을 확인해주세요.');
                        break;
                    case 409:
                        alert('이미 존재하는 이메일입니다.');
                        break;
                    default:
                        alert('회원가입 중 오류가 발생했습니다.');
                }
            } else {
                alert('서버와 연결할 수 없습니다.');
            }
        }
    };

    const handleGoogleSignUp = () => {
      window.location.href = "http://localhost:8080/auth/google";
    };

    return (
        <div className="sign-up-wrapper">
          <div className="logo-box">
            <img src="/logo.png" alt="로고" className="logo-image" />
          </div>
    
          <div className="sign-up-form">
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-field">
                  <label>이름</label>
                  <input
                    type="text"
                    name="user_name"
                    value={formData.user_name}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>전화번호</label>
                  <input
                    type="text"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>이메일</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>생년월일</label>
                  <input
                    type="date"
                    name="birth_date"
                    value={formData.birth_date}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>비밀번호</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>비밀번호 확인</label>
                  <input
                    type="password"
                    name="passwordConfirmation"
                    value={formData.passwordConfirmation}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>
    
              <div className="button-row">
                <button type="submit" className="signup-button">회원가입</button>
                <button type="button" className="google-signup-button" onClick={handleGoogleSignUp}>구글로 회원가입하기</button>
              </div>
    
              <div className="login-link">
                <a href="/login">로그인</a>
              </div>
            </form>
          </div>
        </div>
    );
};
    


export default SignUp;