import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
// import AudioChat from './Components/AudioChat'
import Debounce from './Components/Debounce'
import Tictoctoe from './Components/Tictoctoy'
import Audiocall from './Components/Audiocall'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<Tictoctoe />} path='/' />
          <Route element={<Audiocall />} path='audio' />
          <Route element={<Debounce />} path='debounce' />
        </Routes>
      </Router>


    </>
  )
}

export default App
