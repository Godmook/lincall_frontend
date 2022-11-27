import { Routes, Route } from 'react-router-dom';
import CustomerMainPage from "./components/customer_mainpage";
import Login from "./components/login";
import CounselorMainPage from "./counselor/counselor_mainpage";
import Test from "./components/test";
import Room from './room/room';
import AfterCounselor from './after_counselor_record/after_counselor_record';

function App() {
  return (
    <div className="page">
    <Routes>
      <Route path='*' element={<Login/>}/>
      <Route path='/customermain' element={<CustomerMainPage/>}/>
      <Route path='/counselormain' element={<CounselorMainPage/>}/>
      <Route path='/counselor/room/:id' element={<Room/>}/>
      <Route path='/test' element={<Test/>}/>
      <Route path='/after_counselor_record' element={<AfterCounselor/>}/>
    </Routes>
    </div>
  );
}

export default App;





