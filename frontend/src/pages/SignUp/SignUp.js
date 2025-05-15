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
                alert('Registration completed');
                navigate('/');
            } else {
                alert('Registration completed, but failed to receive token');
            }
        } catch(error) {
            if(error.response) {
                switch(error.response.status) {
                    case 400:
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
            }
        }
    };

    const handleGoogleSignUp = () => {
      window.location.href = "http://ttarang.com/auth/google";
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
                <button type="submit" className="signup-button">Sign Up</button>
                <button type="button" className="google-signup-button" onClick={handleGoogleSignUp}>Sign Up with Google</button>
              </div>
    
              <div className="login-link">
                <a href="/login">Login</a>
              </div>
            </form>
          </div>
        </div>
    );
};
    


export default SignUp;