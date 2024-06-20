import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages";
import { Footer, HeaderLR } from "./components/Common";
import Register from "./pages/Auth/Register";
import { AuthProvider } from "./context/Auth.context";
import { Form, Profile, Task } from "./pages/Tasks";
import Login from "./pages/Auth/Login";
import AuthRoutes from "./token/AuthRoutes";

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
          {/* AuthTask*/}
          <Route element={<AuthRoutes/>}>
            <Route path="/task" element={
              <>
                <Task />
                <Footer />
              </>
            } />
            <Route path="/add-task" element={
              <>
                <Form />
                <Footer />
              </>
            } />
            <Route path="/tasks/:id" element={
              <>
                <Form />
                <Footer />
              </>
            } />
            <Route path="/profile" element={
              <>
                <Profile />
                <Footer />
              </>
            } />
          </Route>

          {/*  */}
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App;