import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages";
import { Footer, Header } from "./components/Common";
import Register from "./pages/Auth/Register";
import { AuthProvider } from "./context/Auth.context";
import { Form, Profile, Task } from "./pages/Tasks";
import Login from "./pages/Auth/Login";
import AuthRoutes from "./token/AuthRoutes";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<> <Home /></>} />
          {/* Register */}
          <Route path="/Register" element={<><Register /></>} />
          {/* Login */}
          <Route path="/Login" element={<><Login /></>} />
          {/* AuthTask*/}
          <Route element={<AuthRoutes />}>
            <Route path="/task" element={<><Task /></>} />
            <Route path="/add-task" element={<><Form /></>} />
            <Route path="/tasks/:id" element={<><Form /></>} />
            <Route path="/profile" element={<><Profile /></>} />
          </Route>
          {/*  */}
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  )
}

export default App;