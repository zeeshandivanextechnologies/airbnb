import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Home from './pages/guest/Home';
import HomeSecond from './pages/guest/HomeSecond';
import Experiences from './pages/guest/Experiences';
import Services from './pages/guest/Services';
import ListingDetails from './pages/guest/ListingDetails';
import ExperienceDetails from './pages/guest/ExperienceDetails';
import SearchResults from './pages/guest/SearchResults';
import HostSetup from './pages/host/HostSetup';
import HostStep1 from './pages/host/HostStep1';
import HostStep2 from './pages/host/HostStep2';
import HostStep3 from './pages/host/HostStep3';
import HostHome from './pages/host/HostHome';
import ServiceDetails from './pages/guest/ServiceDetails';
import HostLayout from './components/HostLayout';
import HostCalendar from './pages/host/HostCalendar';
import FindCostHost from './pages/guest/FindCostHost';
import Refer from './pages/guest/Refer';
import BecomeHost from './pages/guest/BecomeHost';
import Notification from './pages/guest/Notification';
import Profile from './pages/guest/Profile';
import EditMode from './pages/guest/EditMode';
import Trips from './pages/guest/Trips';
import BookingConfirmation from './pages/guest/BookingConfirmation';
import Wishlists from './pages/guest/Wishlists';
import WishlistDetail from './pages/guest/WishlistDetail';
import AccountSettings from './pages/guest/AccountSettings';
import HostLayoutSecond from './components/HostLayoutSecond';
import HostExperience from './pages/host/HostExperience';
import HostToday from './pages/host/HostToday';
import HostListings from './pages/host/HostListings';
import HostListingEditor from './pages/host/HostListingEditor';
import HostAllPhotos from './pages/host/HostAllPhotos';
import HostMessage from './pages/host/HostMessage';
import IntroToHost from './pages/host/IntroToHost';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { applyGoogleTranslate } from './i18n.js';
import { LoadingProvider } from './context/LoadingContext';

// Route change listener to instantly apply translation without flicker
function TranslationRouteListener() {
  const location = useLocation();

  useEffect(() => {
    const saved = localStorage.getItem('airbnb_preferred_language') || 'English';
    if (saved && saved !== 'English') {
      applyGoogleTranslate(saved);
    }
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <LoadingProvider>
        <TranslationRouteListener />
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='/home' element={<HomeSecond />} />
            <Route path='/experiences' element={<Experiences />} />
            <Route path='/services' element={<Services />} />
            <Route path='/service/:id' element={<ServiceDetails />} />
            <Route path='/listing/:id' element={<ListingDetails />} />
            <Route path='/experience/:id' element={<ExperienceDetails />} />
            <Route path='/search/:location' element={<SearchResults />} />
            <Route path='/profile' element={<Profile />} /> 
            <Route path='/find-cost-host' element={<FindCostHost />} />   
            <Route path='/become-host' element={<BecomeHost />} />   
            <Route path='/notification' element={<Notification />} />   
            <Route path='/edit-mode' element={<EditMode />} />   
            <Route path='/trips' element={<Trips />} />    
            <Route path='/booking-confirmed/:code' element={<BookingConfirmation />} />    
            <Route path='/wishlists' element={<Wishlists />} />    
            <Route path='/wishlists/:id' element={<WishlistDetail />} />    
            <Route path='/account-settings' element={<AccountSettings />} />    
          </Route> 

          <Route path="/host" element={<HostSetup />} />
          <Route path="step1" element={<HostStep1 />} />
          <Route path="step2" element={<HostStep2 />} />
          <Route path="step3" element={<HostStep3 />} />

          <Route path="/hosting" element={<HostLayout />}>
            <Route index element={<Navigate to="/hosting/listings" replace />} />
            <Route path="today" element={<HostToday />} />
            <Route path="calendar" element={<HostCalendar />} />
            <Route path="listings" element={<HostListings />} />
            <Route path="listing-editor" element={<HostListingEditor />} />
            <Route path="listing-editor/:id" element={<HostListingEditor />} />
            <Route path="listing-editor/all-photos" element={<HostAllPhotos />} />
            <Route path="listing-editor/:id/all-photos" element={<HostAllPhotos />} />
            <Route path="all-photos" element={<HostAllPhotos />} />
            <Route path="all-photos/:id" element={<HostAllPhotos />} />
            <Route path="messages" element={<HostMessage />} />
            <Route path="intro-to-host" element={<IntroToHost />} />
            <Route path='refer' element={<Refer />} />   
            <Route path="profile" element={<Profile />} />
            <Route path="edit-mode" element={<EditMode />} />
          </Route>

          <Route path="/hosting"  element={<HostLayoutSecond />}>
            <Route path="home" element={<HostHome />} />
            <Route path="host-experience" element={<HostExperience />} />
          </Route>
        </Routes>
      </LoadingProvider>
    </BrowserRouter>
  );
}

export default App;
