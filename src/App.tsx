import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Blog from './components/Blog';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Experience />
            <Contact />
          </>
        } />
        <Route path="/blog" element={<Blog />} />
      </Routes>
    </Layout>
  );
}

export default App;
