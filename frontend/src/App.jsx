import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, GuestRoute } from './components/common/RouteGuards';
import DashboardLayout from './layouts/DashboardLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import PublicPortfolio from './pages/PublicPortfolio';
import NotFound from './pages/NotFound';
import Overview from './pages/dashboard/Overview';
import ProfilePage from './pages/dashboard/ProfilePage';
import SkillsPage from './pages/dashboard/SkillsPage';
import { EducationPage, ProjectsPage, ExperiencePage, CertificationsPage, AchievementsPage } from './pages/dashboard/SectionPages';
import TemplatesPage from './pages/dashboard/TemplatesPage';
import PreviewPage from './pages/dashboard/PreviewPage';
import SettingsPage from './pages/dashboard/SettingsPage';

const router = createBrowserRouter([
  { path: '/', element: <Landing /> },
  { element: <GuestRoute />, children: [{ path: '/login', element: <Login /> }, { path: '/register', element: <Register /> }] },
  { path: '/portfolio/:slug', element: <PublicPortfolio /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Overview /> },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'education', element: <EducationPage /> },
          { path: 'skills', element: <SkillsPage /> },
          { path: 'projects', element: <ProjectsPage /> },
          { path: 'certifications', element: <CertificationsPage /> },
          { path: 'experience', element: <ExperiencePage /> },
          { path: 'achievements', element: <AchievementsPage /> },
          { path: 'templates', element: <TemplatesPage /> },
          { path: 'preview', element: <PreviewPage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFound /> },
]);

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" toastOptions={{ style: { background: 'rgb(var(--surface))', color: 'rgb(var(--ink))', border: '1px solid rgb(var(--line))' } }} />
      </AuthProvider>
    </ThemeProvider>
  );
}
