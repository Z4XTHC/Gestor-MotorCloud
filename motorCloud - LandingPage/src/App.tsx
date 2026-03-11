import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
import { Services } from './components/Services';
import { About } from './components/About';
import { Brands } from './components/Brands';
import { Testimonials } from './components/Testimonials';
import { QuoteForm } from './components/QuoteForm';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { WhatsAppFAB } from './components/WhatsAppFAB';

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
