import { useEffect, useState } from "react"
import { getEntries } from "../api"


export default function EntryList({ refreshKey }) {
  const [data, setData] = useState([])
  const [error, setError] = useState(null)

  const loadEntries = () => {
    setError(null)
    getEntries("1")
      .then(setData)
      .catch(() => setError("Could not load entries."))
  }

  useEffect(() => {
    loadEntries()
  }, [refreshKey])


  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 flex flex-col h-full">
      <h2 className="font-semibold text-lg mb-3 text-gray-800">
        Your Entries
      </h2>

      {error && (
        <p className="text-xs text-red-500">
          {error}
        </p>
      )}

      {data.length === 0  && !error && (
        <p className="text-xs text-gray-500">
          No entries yet. Create one on the left.
        </p>
      )}

      <div className="space-y-2 overflow-y-auto max-h-64 pr-1">
        {data.map((e) => (
          <div
            key={e._id}
            className="border border-gray-200 rounded-md p-2 text-sm bg-gray-50"
          >
            <p className="text-gray-800 line-clamp-2">
              {e.text}
            </p>

            {e.emotion && (
              <p className="text-[11px] text-slate-600 mt-1">
                <span className="font-medium">Emotion:</span> {e.emotion}
              </p>
            )}

            {e.summary && (
              <p className="text-[11px] text-slate-600">
                <span className="font-medium">Summary:</span> {e.summary}
              </p>
            )}

            {Array.isArray(e.keywords) && e.keywords.length > 0 && (
              <p className="text-[11px] text-slate-600">
                <span className="font-medium">Keywords:</span> {e.keywords.join(", ")}
              </p>
            )}

            <div className="flex items-center justify-between gap-2 mt-2">
              <div className="text-[10px] text-gray-500">
                ID: {e._id}
                <br />
                Ambience: {e.ambience}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}