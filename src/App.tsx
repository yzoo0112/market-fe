
import { AppBar, Container, CssBaseline, Toolbar, Typography } from '@mui/material'
import './App.css'
import Login from './pages/Login'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SignUpPage from './pages/SignUpPage'
import Header from './pages/Header'
import MyPage from './pages/MyPage'
import PostPage from './pages/PostPage'
import PostWrite from "./pages/PostWrite";
import TableView from './components/TableView'
import { SearchProvider } from './contexts/SearchProvider'
import PostEdit from './pages/PostEdit'
import AdminUserList from './pages/AdminUserList'
import TrashPage from './pages/TrashPage'
import ManagePage from './pages/ManagePage'
import ManageFileSetting from './components/ManageFileSetting'
import AdminRoute from './components/AdminRoute'
import { AuthProvider } from './contexts/AuthProvider'
import AdminPostList from './pages/AdminPostList'




export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SearchProvider>
          <CssBaseline />
          <AppBar position="fixed" color="transparent" elevation={0}>
            <Toolbar>
              <Typography variant="h6">
                <Header />
              </Typography>
            </Toolbar>
          </AppBar>

          {/* ✅ AppBar 높이만큼 여백 확보 */}
          <Toolbar />
          <Container maxWidth="xl">
            <Routes>
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/post/:id" element={<PostPage />} />
              <Route path="/post/edit/:id" element={<PostEdit />} />
              <Route path="/post" element={<PostWrite />} />
              <Route path="/" element={<TableView />} />



              {/* ADMIN에서만 쓸수 있는 페이지: path랑 컴포넌트만 바꿔서 쓰면 됨 */}
              <Route
                path="/manage/fileSetting"
                element={
                  <AdminRoute>
                    <ManageFileSetting /> {/* <- 여기만 수정 */}
                  </AdminRoute>
                }
              />
              <Route
                path="/manage/users"
                element={
                  <AdminRoute>
                    <AdminUserList />  {/* <- 여기만 수정 */}
                  </AdminRoute>
                }
              />
              <Route
                path="/manage/trash"
                element={
                  <AdminRoute>
                    <TrashPage />  {/* <- 여기만 수정 */}
                  </AdminRoute>
                }
              />
              <Route
                path="/manage/visit"
                element={
                  <AdminRoute>
                    <ManagePage />  {/* <- 여기만 수정 */}
                  </AdminRoute>
                }
              />
              <Route
                path="/manage/posts"
                element={
                  <AdminRoute>
                    <AdminPostList />  {/* <- 여기만 수정 */}
                  </AdminRoute>
                }
              />





            </Routes>
          </Container>
        </SearchProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

