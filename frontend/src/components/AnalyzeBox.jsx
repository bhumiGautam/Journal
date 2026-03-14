import { useState } from "react"
import { analyzeText } from "../api"


export default function AnalyzeBox({ onAnalyzeComplete }) {
  const [text, setText] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const run = async () => {
    if (!text.trim()) {
      setError("Please enter some text to analyze.")
      return
    }
    try {
      setLoading(true)
      setError(null)
      const r = await analyzeText({ text, userId: "1" })
      setResult(r)

      if (typeof onAnalyzeComplete === "function") {
        onAnalyzeComplete()
      }
    } catch (e) {
      setError("Failed to analyze the text. Please try again.")
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 flex flex-col h-full">
      <h2 className="font-semibold text-lg mb-3 text-gray-800">
        Analyze Text
      </h2>

      <p className="text-xs text-gray-500 mb-2">
        Paste some journal text and click Analyze to see emotion, keywords, and a short summary.
      </p>

      <textarea
        className="border border-gray-200 rounded-md p-2 w-full text-sm min-h-22.5 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400"
        placeholder="Type or paste journal text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        className="mt-3 inline-flex items-center justify-center rounded-md bg-emerald-600 text-white text-sm font-medium px-4 py-2 disabled:bg-emerald-300"
        onClick={run}
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {error && (
        <p className="text-xs text-red-500 mt-2">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-4 rounded-md bg-gray-50 border border-gray-100 p-3 text-sm space-y-1">
          <p className="font-medium text-gray-700">
            Emotion: <span className="font-normal">{result.emotion || "n/a"}</span>
          </p>
          <p className="font-medium text-gray-700">
            Summary: <span className="font-normal">{result.summary || "n/a"}</span>
          </p>
          {Array.isArray(result.keywords) && result.keywords.length > 0 && (
            <p className="font-medium text-gray-700">
              Keywords:{" "}
              <span className="font-normal">
                {result.keywords.join(", ")}
              </span>
            </p>
          )}
        </div>
      )}
    </div>
  )
}