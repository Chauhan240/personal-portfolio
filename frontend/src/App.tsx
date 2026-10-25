import { lazy, Suspense } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { NavBar } from './components/layout/NavBar'
import { Footer } from './components/layout/Footer'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { motion } from 'framer-motion'
import { SmoothScroll } from './components/motion/SmoothScroll'
import { colors } from './theme/theme'

const BlogList = lazy(() => import('./pages/BlogList').then((m) => ({ default: m.BlogList })))
const BlogPost = lazy(() => import('./pages/BlogPost').then((m) => ({ default: m.BlogPost })))
const AdminLogin = lazy(() => import('./pages/AdminLogin').then((m) => ({ default: m.AdminLogin })))
const AdminDashboard = lazy(() =>
  import('./pages/AdminDashboard').then((m) => ({ default: m.AdminDashboard })),
)
const AdminEditor = lazy(() => import('./pages/AdminEditor').then((m) => ({ default: m.AdminEditor })))

function RouteFallback() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', pt: 24 }}>
      <CircularProgress sx={{ color: colors.red }} />
    </Box>
  )
}

function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SmoothScroll />
      {!isAdmin && (
        <a className="skip-link" href="#main">
          Skip to content
        </a>
      )}
      {!isAdmin && <NavBar />}
      <Box component="main" id="main" tabIndex={-1} sx={{ flexGrow: 1, outline: 'none' }}>
        <motion.div key={location.pathname.startsWith('/admin') ? 'admin' : location.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45 }}>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/new"
              element={
                <ProtectedRoute>
                  <AdminEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/edit/:id"
              element={
                <ProtectedRoute>
                  <AdminEditor />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        </motion.div>
      </Box>
      {!isAdmin && <Footer />}
    </Box>
  )
}

export default App
