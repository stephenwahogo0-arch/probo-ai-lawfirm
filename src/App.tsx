
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import DashboardPage from '@/pages/DashboardPage';
import NewCasePage from '@/pages/NewCasePage';
import CaseDetailPage from '@/pages/CaseDetailPage';
import ConsultPage from '@/pages/ConsultPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="cases/new" element={<NewCasePage />} />
          <Route path="cases/:id" element={<CaseDetailPage />} />
          <Route path="consult" element={<ConsultPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
