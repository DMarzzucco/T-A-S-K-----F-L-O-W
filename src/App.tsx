import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<>
        <h1 className="text-xl text-blue-400 font-bold">Prueba</h1>
        </>}>
        </Route>
      </Routes>
    </Router>
  )
}

export default App;