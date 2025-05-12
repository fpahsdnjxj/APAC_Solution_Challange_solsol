import {useEffect, useRef} from 'react'
import {useNavigate} from 'react-router-dom'

const OAuthSuccess=()=>{
    const navigate= useNavigate();
    const processed = useRef(false);

    useEffect(()=>{
        if(processed.current) return;
        processed.current=true;
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get("accessToken");

        if (accessToken) {
            localStorage.setItem("accessToken", accessToken);
            alert(`환영합니다.`);
            navigate("/"); // 홈으로 이동
        } else {
            alert("인증 실패");
            navigate("/login");
        }
    }, [])

    return <div>로그인 처리 중...</div>;
}

export default OAuthSuccess;