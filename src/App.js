import { Routes, Route } from 'react-router-dom';
import CustomerMainPage from "./components/customer_mainpage";
import Login from "./components/login";
import CounselorMainPage from "./counselor/counselor_mainpage";
function App() {
  return (
    <div className="page">
    <Routes>
      <Route path='*' element={<Login/>}/>
      <Route path='/customermain' element={<CustomerMainPage/>}/>
      <Route path='/counselormain' element={<CounselorMainPage/>}/>
    </Routes>
    </div>
  );
}

export default App;






