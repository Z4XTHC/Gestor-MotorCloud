import { Navbar } from "./components/pages/Navbar";
import { Hero } from "./components/pages/Hero";
import { Stats } from "./components/pages/Stats";
import { Services } from "./components/pages/Services";
import { About } from "./components/pages/About";
import { Brands } from "./components/pages/Brands";
import { Testimonials } from "./components/pages/Testimonials";
import { QuoteForm } from "./components/pages/QuoteForm";
import { Contact } from "./components/pages/Contact";
import { Footer } from "./components/pages/Footer";
import { WhatsAppFAB } from "./components/pages/WhatsAppFAB";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Services />
        <About />
        <Brands />
        <Testimonials />
        <QuoteForm />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFAB />
    </div>
  );
}

export default App;
