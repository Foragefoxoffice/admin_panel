import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TestProvider } from './contexts/TestContext.jsx';
import './index.css';

// Import pages
import Login from './pages/Login';
import Register from './pages/Register';
import Test from './pages/Test';
import AdminLayout from './layouts/AdminLayout';

// Admin pages
import UserList from './pages/admin/UserList';
import UserDetail from './pages/admin/UserDetail';
import BannerListPage from './pages/admin/BannerListPage';
import CreateBannerPage from './pages/admin/CreateBannerPage';
import News from './pages/admin/News';
import NewsDetail from './pages/admin/NewsDetail';
import NewsEdit from './pages/admin/NewsEdit';
import AddNews from './pages/admin/AddNews';
import Materials from './pages/admin/Materials';
import MaterialUpload from './pages/admin/MaterialUpload';
import Blocks from './pages/admin/Blocks';
import Types from './pages/admin/Types';
import Upload from './pages/admin/Upload';
import Edit from './pages/admin/Edit';
import Question from './pages/admin/Question';
import Questions from './pages/admin/Questions';
import Reports from './pages/admin/Reports';
import Export from './pages/admin/Export';
import Pdf from './pages/admin/Pdf';
import PdfPremium from './pages/admin/PdfPremium';
import ViewFreeMaterials from './pages/admin/ViewFreeMaterials';
import UploadFreeMaterial from './pages/admin/UploadFreeMaterial';
import SendNotification from './pages/admin/SendNotification';
import Coupons from './pages/admin/Coupons';
import Payments from './pages/admin/Payments';
import NeetPlansPage from './pages/admin/NeetPlansPage';
import CreateNeetPlanPage from './pages/admin/CreateNeetPlanPage';
import EditNeetPlanPage from './pages/admin/EditNeetPlanPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <TestProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/test" element={<Test />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="types" replace />} />
            <Route path="user" element={<UserList />} />
            <Route path="user/:id" element={<UserDetail />} />
            <Route path="banners" element={<BannerListPage />} />
            <Route path="addbanners" element={<CreateBannerPage />} />
            <Route path="news" element={<News />} />
            <Route path="news/:id" element={<NewsDetail />} />
            <Route path="news/edit/:id" element={<NewsEdit />} />
            <Route path="addnews" element={<AddNews />} />
            <Route path="materials" element={<Materials />} />
            <Route path="material-upload" element={<MaterialUpload />} />
            <Route path="blocks" element={<Blocks />} />
            <Route path="types" element={<Types />} />
            <Route path="upload" element={<Upload />} />
            <Route path="edit" element={<Edit />} />
            <Route path="question" element={<Question />} />
            <Route path="questions" element={<Questions />} />
            <Route path="reports" element={<Reports />} />
            <Route path="export" element={<Export />} />
            <Route path="pdf" element={<Pdf />} />
            <Route path="pdf-premium" element={<PdfPremium />} />
            <Route path="free-materials" element={<ViewFreeMaterials />} />
            <Route path="free-material-upload" element={<UploadFreeMaterial />} />
            <Route path="send-notification" element={<SendNotification />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="payments" element={<Payments />} />
            <Route path="neet-plans" element={<NeetPlansPage />} />
            <Route path="neet-plans/create" element={<CreateNeetPlanPage />} />
            <Route path="neet-plans/edit/:id" element={<EditNeetPlanPage />} />
          </Route>

          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </TestProvider>
    </BrowserRouter>
  );
}

export default App;
