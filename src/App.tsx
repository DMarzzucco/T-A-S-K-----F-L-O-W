import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages";
import { Footer, HeaderLR } from "./components/Common";
import Register from "./pages/Auth/Register";
import { AuthProvider } from "./context/Auth.context";
import Login from "./pages/Auth/Login";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<>
            <HeaderLR />
            <Home />
            <Footer />
          </>} />
          {/* Register */}
          <Route path="/Register" element={<>
            <HeaderLR />
            <Register />
            <Footer />
          </>} />
          {/* Login */}
          <Route path="/Login" element={
            <>
              <HeaderLR />
              <Login />
              <Footer />
            </>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App;