import { useEffect, useState } from "react"
import { getInsights } from "../api"


export default function InsightsBox({ refreshKey }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    setError(null)
    getInsights("1")
      .then(setData)
      .catch(() => setError("Could not load insights."))
  }, [refreshKey])

  if (!data && !error) {
    return (
      <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 flex items-center justify-center h-full">
        <p className="text-xs text-gray-500">Loading insights...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 flex flex-col h-full">
      <h2 className="font-semibold text-lg mb-3 text-gray-800">
        Mood Insights
      </h2>

      {error && (
        <p className="text-xs text-red-500">
          {error}
        </p>
      )}

      {data && (
        <div className="space-y-1 text-sm text-gray-700">
          <p>
            <span className="font-medium">Total entries:</span>{" "}
            {data.totalEntries}
          </p>
          <p>
            <span className="font-medium">Most common emotion:</span>{" "}
            {data.topEmotion || "n/a"}
          </p>
          <p>
            <span className="font-medium">Most used ambience:</span>{" "}
            {data.mostUsedAmbience || "n/a"}
          </p>
          <p>
            <span className="font-medium">Recent keywords:</span>{" "}
            {(data.recentKeywords && data.recentKeywords.length > 0)
              ? data.recentKeywords.join(", ")
              : "n/a"}
          </p>
        </div>
      )}
    </div>
  )
}