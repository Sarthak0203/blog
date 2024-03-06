import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login } from './Pages/Login/Login';
import { Home } from './Pages/Home/Home';
import { Create } from './Pages/Create/Create';
import { PostPage } from './Pages/PostPage/PostPage';
import { UserContextProvider } from './Components/UserContext'; // Import UserContextProvider
import EditPost from './Pages/EditPost/EditPost';

function App() {
  return (
    <UserContextProvider> {/* Wrap your routes with UserContextProvider */}
      <Router>
        <Routes>
          <Route path="/loginsignup" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create/>} />
          <Route path="/post/:id" element={<PostPage/>}/>
          <Route path="/edit/:id" element={<EditPost/>}/>
        </Routes>
      </Router>
    </UserContextProvider>
  );
}

export default App;
