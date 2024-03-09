import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Index from './frontPage'
import Todolist from './TodoList'
import Createtask from './Createtask'
import Login from './Login'
import AuthProvider from './context/AuthProvider'



function App() {

  return (
    <div>

<Index/>

   <AuthProvider>
 
   <Login/>
   <Todolist/>
   <Createtask/>
   </AuthProvider>
  
    

    </div>
  )
}

export default App
