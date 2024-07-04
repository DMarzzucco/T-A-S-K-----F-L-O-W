import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AllesUsers, Home } from "./pages";
import { Footer, Header } from "./components/Common";
import Register from "./pages/Auth/Register";
import { Form, Profile, Task } from "./pages/Tasks";
import Login from "./pages/Auth/Login";
import AuthRoutes from "./token/AuthRoutes";
import { AuthProvider, TaskProvider } from "./context";
import { UpdateUser } from "./pages/Tasks/User";

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<> <Home /></>} />
            <Route path="/Users" element={<> <AllesUsers /></>} />
            {/* Register */}
            <Route path="/Register" element={<><Register /></>} />
            {/* Login */}
            <Route path="/Login" element={<><Login /></>} />
            {/* AuthTask*/}
            <Route element={<AuthRoutes />}>
              <Route path="/task" element={<><Task /></>} />
              <Route path="/add-task" element={<><Form /></>} />
              <Route path="/task/:id" element={<><Form /></>} />
              <Route path="/profile/:id" element={<><Profile /></>} />
              {/* <Route path="/profile/:id" element={<><DeleteUser /></>} /> */}
              <Route path="/update/:id" element={<><UpdateUser /></>} />
            </Route>
            {/*  */}
          </Routes>
          <Footer />
        </Router>
      </TaskProvider>
    </AuthProvider>
  )
}

export default App;