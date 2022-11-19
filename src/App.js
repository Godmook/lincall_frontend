import LoginForm from "./components/loginform";
import { Routes, Route } from 'react-router-dom';
import SignInForm from "./components/signinform";
import CustomerMainPage from "./components/customer_mainpage";
import Login from "./components/login";
import CounselorMainPage from "./counselor/counselor_mainpage";
function App() {
  return (
    <div className="page">
    <Routes>
      <Route path='*' element={<CounselorMainPage/>}/>
      <Route path='/signin' element={<SignInForm/>}/>
      <Route path='/customermain' element={<CustomerMainPage/>}/>
    </Routes>
    </div>
  );
}

export default App;






