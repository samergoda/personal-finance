import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from '@/hooks/useAppContext'
import { Layout } from '@/components/layout/Layout'
import { Dashboard } from '@/pages/Dashboard'
import { Transactions } from '@/pages/Transactions'
import { Analytics } from '@/pages/Analytics'
import { Categories } from '@/pages/Categories'
import { Budgets } from '@/pages/Budgets'
import { Settings } from '@/pages/Settings'
import { initializeStorage } from '@/services/storage'

initializeStorage()

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index              element={<Dashboard />}    />
            <Route path="transactions" element={<Transactions />} />
            <Route path="analytics"    element={<Analytics />}    />
            <Route path="categories"   element={<Categories />}   />
            <Route path="budgets"      element={<Budgets />}      />
            <Route path="settings"     element={<Settings />}     />
            <Route path="*"            element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
