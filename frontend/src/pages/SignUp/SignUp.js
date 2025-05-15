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
            alert('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('/api/auth/signup', formData, {
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
<<<<<<< HEAD
                alert('회원가입이 완료되었습니다.');
                navigate('/');
            } else {
                alert('회원가입은 완료되었으나 토큰을 받지 못했습니다.');
=======
                alert('Registration completed');
                navigate('/');
            } else {
                alert('Registration completed, but failed to receive token');
>>>>>>> 019c2c056f4e60d4777da9541a118c6bd539037b
            }
        } catch(error) {
            if(error.response) {
                switch(error.response.status) {
                    case 400:
<<<<<<< HEAD
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
=======
                        alert(error.response.data.error || 'Please check your input');
                        break;
                    case 409:
                        alert('This email already exists');
                        break;
                    default:
                        alert('An error occurred during registration');
                }
            } else {
                alert('Unable to connect to the server');
>>>>>>> 019c2c056f4e60d4777da9541a118c6bd539037b
            }
        }
    };

    const handleGoogleSignUp = () => {
<<<<<<< HEAD
      window.location.href = "/api/auth/google";
=======
      window.location.href = "http://localhost:8080/auth/google";
>>>>>>> 019c2c056f4e60d4777da9541a118c6bd539037b
    };

    return (
        <div className="sign-up-wrapper">
          <div className="logo-box">
            <img src="/logo.png" alt="logo" className="logo-image" />
          </div>
    
          <div className="sign-up-form">
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-field">
                  <label>name</label>
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
                  <label>phone number</label>
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
                  <label>email</label>
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
                  <label>birth date</label>
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
                  <label>password</label>
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
                  <label>password confirmation</label>
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
<<<<<<< HEAD
                <button type="submit" className="signup-button">회원가입</button>
                <button type="button" className="google-signup-button" onClick={handleGoogleSignUp}>구글로 회원가입하기</button>
=======
                <button type="submit" className="signup-button">Sign Up</button>
                <button type="button" className="google-signup-button" onClick={handleGoogleSignUp}>Sign Up with Google</button>
>>>>>>> 019c2c056f4e60d4777da9541a118c6bd539037b
              </div>
    
              <div className="login-link">
                <a href="/">Login</a>
              </div>
            </form>
          </div>
        </div>
    );
};
    


export default SignUp;