import './App.css'
import { HomePage } from './pages/HomePage'
import { TeacherPage } from './pages/TeacherPage'
import { JoinPage } from './pages/JoinPage'
import { StudentPage } from './pages/StudentPage'

function App() {
  const path = window.location.pathname

  if (path.startsWith('/teacher')) return <TeacherPage />
  if (path.startsWith('/join')) return <JoinPage />
  if (path.startsWith('/student')) return <StudentPage />

  return <HomePage />
}

export default App
