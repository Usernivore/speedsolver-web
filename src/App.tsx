import { useAppStore } from './store'
import { MainLayout } from './components/MainLayout'
import { ProgressView } from './views/ProgressView'
import { ResultsView } from './views/ResultsView'
import { SetupView } from './views/SetupView'
import { QuizView } from './views/QuizView'
import { ProfileView } from './views/ProfileView'
import { ToolsView } from './views/ToolsView'
import { RankineView } from './views/RankineView'
import { InterpolatorView } from './views/InterpolatorView'
import { UnitConverterView } from './views/UnitConverterView'
import { PrivacyView, TermsView } from './views/LegalViews'
import { Analytics } from './components/Analytics'

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
      case 'tools':
        return <ToolsView />
      case 'rankine':
        return <RankineView />
      case 'interpolator':
        return <InterpolatorView />
      case 'unit-converter':
        return <UnitConverterView />
      case 'privacy':
        return <PrivacyView />
      case 'terms':
        return <TermsView />
      default:
        return <SetupView />
    }
  }

  return (
    <MainLayout>
      <Analytics />
      {renderView()}
    </MainLayout>
  )
}

export default App
