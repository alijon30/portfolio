import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Article from './pages/Article';
import Editor from './pages/Editor';
import Admin from './pages/Admin';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Writer pages — outside Layout for distraction-free editing */}
        <Route path="write" element={
          <ProtectedRoute>
            <Editor />
          </ProtectedRoute>
        } />
        <Route path="edit/:category/:slug" element={
          <ProtectedRoute>
            <Editor />
          </ProtectedRoute>
        } />

        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:category/:slug" element={<Article />} />
          <Route path="login" element={<Login />} />

          {/* Protected Routes */}
          <Route path="admin" element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
