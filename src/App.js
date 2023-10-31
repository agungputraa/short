import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Agung from './components/Agung';
import Coba from './components/Coba';
import Welcome from './components/Welcome';

function App() {
  return (
    <Router>
      <Routes>
      <Route path='/:parameters' element={<Agung/>} />
      <Route path='/' element={<Welcome/>} />
      <Route path='*' element={<Coba/>} />
      </Routes>
    </Router>
  );
}

export default App;
