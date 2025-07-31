import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Process from "./pages/Process";
import Portfolio from "./pages/Portfolio";
import Differentiation from "./pages/Differentiation";
import Contact from "./pages/Contact";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

function App() {
  return (
    <BrowserRouter>
      <div className="bg-black text-white min-h-screen">
        {/* Navbar will go here later */}
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/process" element={<Process />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/differentiation" element={<Differentiation />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        {/* Footer will go here later */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
