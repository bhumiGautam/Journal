import { useState } from "react"
import EntryForm from "./components/EntryForm"
import EntryList from "./components/EntryList"
import AnalyzeBox from "./components/AnalyzeBox"
import InsightsBox from "./components/InsightsBox"


function App() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-slate-50 to-sky-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800">
            Mindful Journal
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Capture your thoughts, then let AI help you understand them.
          </p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <EntryForm onEntryCreated={handleRefresh} />
          <AnalyzeBox onAnalyzeComplete={handleRefresh} />
          <EntryList refreshKey={refreshKey} />
          <InsightsBox refreshKey={refreshKey} />
        </main>
      </div>
    </div>
  )
}

export default App
