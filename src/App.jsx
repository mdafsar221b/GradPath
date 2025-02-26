import Layout from "./Componants/Layout";
import Header from "./Componants/Header";
import About from "./Componants/About";
import HeaderYT from "./Componants/HeaderYT";
import YoutubeResources from "./Componants/YoutubeResources";
import Footer from "./Componants/Footer/Footer";
import ChatbotButton from "./Componants/ChatbotButton";
function App() {
 
  return (
    <div className="h-screen w-screen flex flex-col">
      <Header />
      <div className="max-w-4xl mt-4 mx-auto p-4 sm:p-8 flex items-center justify-center flex-col">
        <About />
          <ChatbotButton/>
        <Layout />
        <HeaderYT />
        <div className="flex items-center justify-center gap-2 mt-1 sm:mt-2 flex-col">
          <div className="flex justify-center items-center">
            <YoutubeResources />
          </div>
        </div>
      </div>
        <Footer />
    </div>
  );
}

export default App;
