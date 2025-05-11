# Project Structure

## 폴더 구조
/
APAC_Solution_Challange_solsol/
├── frontend/ #프론트 엔드 코드
├── backend/ #백엔드 코드
├── ai/      #ai 관련 코드        
├── docs/ #문서 모음
├── design/ #디자인 파일 모음
├── .gitignore        # 공통 무시 규칙
├── docker-compose.yml
└── README.md

## Git 관리 규칙
- `.idea/`, `.env`, `*.iml`, `node_modules/` 등은 `.gitignore`에 명시
- 민감정보 (`firebase-service-account.json`, `application-secret.properties`)는 Git 추적 금지
- push 전 `git status`, `git log` 확인 필수

## 비고
- 구조 변경 시 반드시 팀원과 공유
- 비공개 키 재발급 방법: Firebase 콘솔 → 서비스 계정 → 키 생성