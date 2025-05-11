import React from 'react';

const Footer = () => {
  // 인라인 스타일 객체
  const footerStyle = {
    height: '80px',               // 푸터 높이 80px
    backgroundColor: '#FF6449',   // 배경색 #FF6449
    color: 'white',               // 텍스트 색상 흰색
    display: 'flex',              // Flexbox 활성화
    justifyContent: 'center',     // 텍스트 수평 중앙 정렬
    alignItems: 'center',         // 텍스트 수직 중앙 정렬
    fontSize: '18px',             // 텍스트 크기 18px
  };

  return (
    <footer style={footerStyle}>
      <img src="/GDGoC.png" alt="community" style={{ width: '234px', height: '14px', objectFit: 'contain' }}/>
    </footer>
  );
};

export default Footer;
