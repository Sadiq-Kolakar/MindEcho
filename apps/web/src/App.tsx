import { lazy, Suspense, type ReactNode } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { NotesProvider } from './context/NotesContext'
import { SubscriptionProvider } from './context/SubscriptionContext'
import { ThemeProvider } from './context/ThemeContext'
import { PageLoader } from './components/ui/page-loader'
import { Home } from './pages/Home'
import { Login } from './pages/Login'

const Dashboard = lazy(() =>
  import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })),
)
const EvaluationsPage = lazy(() =>
  import('./pages/EvaluationsPage').then((m) => ({ default: m.EvaluationsPage })),
)
const LLMPayment = lazy(() =>
  import('./pages/LLMPayment').then((m) => ({ default: m.LLMPayment })),
)
const NewConcept = lazy(() =>
  import('./pages/NewConcept').then((m) => ({ default: m.NewConcept })),
)
const NotionWorkspace = lazy(() =>
  import('./pages/NotionWorkspace').then((m) => ({ default: m.NotionWorkspace })),
)
const AdaptiveCalendar = lazy(() =>
  import('./pages/AdaptiveCalendar').then((m) => ({ default: m.AdaptiveCalendar })),
)

function LazyPage({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="theme-page min-h-screen">
          <PageLoader />
        </div>
      }
    >
      <div className="page-enter">{children}</div>
    </Suspense>
  )
}

function AppRoutes() {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <LazyPage>
              <Dashboard />
            </LazyPage>
          }
        />
        <Route
          path="/evaluations"
          element={
            <LazyPage>
              <EvaluationsPage />
            </LazyPage>
          }
        />
        <Route
          path="/llm-payment"
          element={
            <LazyPage>
              <LLMPayment />
            </LazyPage>
          }
        />
        <Route
          path="/concept/new"
          element={
            <LazyPage>
              <NewConcept />
            </LazyPage>
          }
        />
        <Route
          path="/workspace"
          element={
            <LazyPage>
              <NotionWorkspace />
            </LazyPage>
          }
        />
        <Route
          path="/subjects"
          element={
            <LazyPage>
              <NotionWorkspace />
            </LazyPage>
          }
        />
        <Route
          path="/calendar"
          element={
            <LazyPage>
              <AdaptiveCalendar />
            </LazyPage>
          }
        />
        <Route
          path="/review-due"
          element={
            <LazyPage>
              <AdaptiveCalendar />
            </LazyPage>
          }
        />
    </Routes>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SubscriptionProvider>
          <NotesProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </NotesProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
