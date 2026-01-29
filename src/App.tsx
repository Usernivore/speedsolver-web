import { useAppStore } from './store'
import { MainLayout } from './components/MainLayout'
import { ProgressView } from './views/ProgressView'
import { ResultsView } from './views/ResultsView'
import { SetupView } from './views/SetupView'
import { QuizView } from './views/QuizView'
import { ProfileView } from './views/ProfileView'

function App() {
  const currentView = useAppStore((state) => state.currentView)

  const renderView = () => {
    switch (currentView) {
      case 'setup':
        return <SetupView />
      case 'quiz':
        return <QuizView />
      case 'results':
        return <ResultsView />
      case 'dashboard':
        return <ProgressView />
      case 'profile':
        return <ProfileView />
      default:
        return <SetupView />
    }
  }

  return (
    <MainLayout>
      {renderView()}
    </MainLayout>
  )
}

export default App
