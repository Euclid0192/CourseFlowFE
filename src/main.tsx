import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ReactFlowProvider } from 'reactflow'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <ReactFlowProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/*' element={<App />} />          
        </Routes>
      </BrowserRouter>    
    </ReactFlowProvider>
  // </React.StrictMode>,
)
