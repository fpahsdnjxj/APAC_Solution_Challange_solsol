import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home/Home';
import Chat from './pages/Chat/Chat';
import Plan from './pages/Plan/Plan';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import Form from './pages/Form/Form';
import OAuthSuccess from './pages/OAuthSuccess';

function App() {
  console.log({ Header, Footer, Home, Chat, Plan, Login, SignUp, Form });

  return (
    <Router>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/form" element={<Form />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/oauth-success" element={<OAuthSuccess/>}/>
        </Routes>
      </main>
    </Router>
  );
};

export default App;