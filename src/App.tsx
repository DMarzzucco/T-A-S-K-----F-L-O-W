import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages";
import { Footer, HeaderLR } from "./components/Common";
import Register from "./pages/Auth/Register";
import { AuthProvider } from "./context/Auth.context";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<>
            <HeaderLR />
            <Home />
            <Footer />
          </>}>
          </Route>
          {/*  */}
          <Route path="/Register" element={<>
            <HeaderLR />
            <Register />
            <Footer />
          </>}></Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App;