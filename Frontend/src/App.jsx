import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import About from './containers/About'
import Contact from './containers/Contact'
import Support from './containers/Support'
import Home from '../src/containers/User/Home'
import UniversityAdmin from './containers/Admin/UniversityAdmin'
import DepartmentAdmin from './containers/Admin/DepartmentAdmin'
import UserDepartment from './containers/User/UserDepartment'
import CourseAdmin from './containers/Admin/CourseAdmin'
import UserCourse from './containers/User/UserCourse'
import Main from './containers/User/Main'
import Login from './containers/Login'
import Register from './containers/Register'
import UserAdmin from './containers/Admin/UserAdmin'
import Submit from './containers/Submit'
import FAQ from './containers/Faq'


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Main />}></Route>
        <Route path='/university' element={<Home />}></Route>
        <Route path='/about' element={<About />}></Route>
        <Route path='/contact' element={<Contact />}></Route>
        <Route path='/support' element={<Support />}></Route>
        <Route path='/universityAdmin' element={<UniversityAdmin />}></Route>
        <Route path='/departmentAdmin' element={<DepartmentAdmin />}></Route>
        <Route path='/courseAdmin' element={<CourseAdmin />}></Route>
        <Route path='/userAdmin' element={<UserAdmin />}></Route>
        <Route path='/userDepartment' element={<UserDepartment />}></Route>
        <Route path='/userCourse' element={<UserCourse />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/support-request' element={<Submit />}></Route>
        <Route path='/faq' element={<FAQ />}></Route>
      </Routes>
    </>
  )
}

export default App