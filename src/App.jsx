import { Outlet } from "react-router-dom";
import Layout from "./Componants/Layout";
import Header from "./Componants/Header";
import About from "./Componants/About";
import HeaderYT from "./Componants/HeaderYT";
import YoutubeResources from "./Componants/YoutubeResources";
import Footer from "./Componants/Footer/Footer";
import ChatbotButton from "./Componants/ChatbotButton";
import CountdownTimer from "./Componants/CountdownTimer";
import ImportantLinks from "./Componants/ImportantLinks";
import Notice from "./Componants/Notice";
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
      <Header />
      <div className="sm:h-screen w-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
        <CountdownTimer />
        <div className="max-w-4xl mt-4 mx-auto p-4 sm:p-8 flex flex-col items-center justify-center">
          <About />
        <Notice/>
        </div>
      </div>
      <ImportantLinks />

      <div className="max-w-4xl mt-4 mx-auto p-4 sm:p-8 flex items-center justify-center flex-col shadow-xl">
        <Layout />
       {/* render the semester page based on route */}
      </div>

      <div className="max-w-4xl mt-4 mx-auto p-4 sm:p-8 flex items-center justify-center flex-col">
        <HeaderYT />
        <div className="flex justify-center items-center">
          <YoutubeResources />
        </div>
      </div>

      <ChatbotButton />
      <Analytics/>
      <Footer />
    </div>
  );
}

export default App;
