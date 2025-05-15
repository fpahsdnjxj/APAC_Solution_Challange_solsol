import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);  // 모달 상태 관리
    const modalRef = useRef(null);
    const iconRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (
            modalRef.current &&
            !modalRef.current.contains(event.target) &&
            iconRef.current &&
            !iconRef.current.contains(event.target)
          ) {
            setIsModalOpen(false);
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    
    const toggleModal = () => {
        setIsModalOpen(prev => !prev);
    };

  // 스타일을 JS 객체로 설정
  const headerStyle = {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '60px',
    backgroundColor: 'white',
    padding: '0 20px',
    boxSizing: 'border-box', // padding이 element 크기에 포함되도록 설정
    borderBottom: '1px solid #FFD2D2'
  };

  const logoStyle = {
    width: '60px',
    height: '24px',
    objectFit: 'contain',
    marginLeft: '60px',
  
  };

  const iconStyle = {
    fontSize: '24px', 
    marginRight: '60px',
  };

  const modalWrapperStyle = {
    position: 'absolute',
    top: '50px',
    right: '40px',
    visibility: isModalOpen ? 'visible' : 'hidden',
    opacity: isModalOpen ? 1 : 0,
    transition: 'opacity 0.2s ease, visibility 0.2s ease',
    backgroundColor: 'white',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    zIndex: 1000,
    minWidth: '250px',
    boxSizing: 'border-box'
  };

  const logoutStyle = {
    backgroundColor:'#FF6449',
    border:'none',
    borderRadius: "10px",
    width:'200px',
    height:'35px',
    color: 'white',
    alignItems: 'center',

  }

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/');
  };

  return (
        <header style={headerStyle}>
            <div>
                {/* public 폴더에 있는 로고 이미지 삽입 */}
                <Link to ="/home">
                    <img src="/logo.png" alt="Logo" style={logoStyle} />
                </Link>
            </div>
            <div style={{ position: 'relative' }}>
                <img
                src="/person.png"
                alt="mypage"
                style={iconStyle}
                onClick={toggleModal}
                />
                <div ref={modalRef} style={modalWrapperStyle}>
                    <h3 style={{ margin: '0 0 10px 0' }}>Mypage</h3>
                    <p>Name: 홍길동</p>
                    <p>Email: hong@example.com</p>
                    <button className="logout" style={(logoutStyle)} onClick={handleLogout}>로그아웃</button>
                </div>
            </div>
        </header>      
    );
};

export default Header;
