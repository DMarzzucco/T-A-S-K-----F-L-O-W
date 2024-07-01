import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages";
import { Footer, Header } from "./components/Common";
import Register from "./pages/Auth/Register";
import { Form, Profile, Task } from "./pages/Tasks";
import Login from "./pages/Auth/Login";
import AuthRoutes from "./token/AuthRoutes";
import { AuthProvider } from "./context";
import { DeleteUser, UpdateUser } from "./pages/Tasks/User";

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
            <Route path="/delete/:id" element={<><DeleteUser /></>} />
            <Route path="/update/:id" element={<><UpdateUser /></>} />
          </Route>
          {/*  */}
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  )
}

export default App;