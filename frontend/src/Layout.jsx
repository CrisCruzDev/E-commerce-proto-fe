import Navbar from './components/navbar';
import Footer from './components/footer';
import { Outlet } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';
import RequestAdminKeyModal from './components/adminKeyModal/RequestAdminKeyModal';
import AdminKeyInputModal from './components/adminKeyModal/AdminKeyInputModal';
import { useUIStore } from './store/ui';

export default function Layout() {
  const { requestKeyOpen, verifyKeyOpen, closeRequestKey, closeVerifyKey } =
    useUIStore();
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <RequestAdminKeyModal isOpen={requestKeyOpen} onClose={closeRequestKey} />
      <AdminKeyInputModal isOpen={verifyKeyOpen} onClose={closeVerifyKey} />
      <Outlet /> {/* renders nested routes */}
      <Footer />
    </>
  );
}
