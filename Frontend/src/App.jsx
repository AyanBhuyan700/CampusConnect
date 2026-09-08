import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import About from './containers/About'
import Contact from './containers/Contact'
import Support from './containers/Support'
import Home from './containers/User/Home'
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
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <div className="app-wrapper">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/university' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/support' element={<Support />} />
          <Route path='/universityAdmin' element={<UniversityAdmin />} />
          <Route path='/departmentAdmin' element={<DepartmentAdmin />} />
          <Route path='/courseAdmin' element={<CourseAdmin />} />
          <Route path='/userAdmin' element={<UserAdmin />} />
          <Route path='/userDepartment' element={<UserDepartment />} />
          <Route path='/userCourse' element={<UserCourse />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/support-request' element={<Submit />} />
          <Route path='/faq' element={<FAQ />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App