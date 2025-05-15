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
            alert(`Welcome`);
            navigate("/home"); // 홈으로 이동
        } else {
            alert("Authentication failed");
            navigate("/");
        }
    }, [])

    return <div>Logging in...</div>;
}

export default OAuthSuccess;