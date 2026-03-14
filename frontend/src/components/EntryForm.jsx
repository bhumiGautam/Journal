import { useState } from "react"
import { createEntry } from "../api"


export default function EntryForm({ onEntryCreated }) {
  const [text, setText] = useState("")
  const [ambience, setAmbience] = useState("forest")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const submit = async () => {
    if (!text.trim()) {
      setMessage("Please write something in your journal first.")
      return
    }
    try {
      setLoading(true)
      setMessage(null)
      await createEntry({
        userId: "1",
        ambience,
        text,
      })
      setText("")
      setMessage("Entry saved successfully.")

      // Notify parent to refresh the list and insights immediately
      if (typeof onEntryCreated === "function") {
        onEntryCreated()
      }
    } catch (e) {
      setMessage("Could not save entry. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 flex flex-col h-full">
      <h2 className="font-semibold text-lg mb-3 text-gray-800">
        New Journal Entry
      </h2>

      <label className="text-xs font-medium text-gray-500 mb-1">
        Ambience
      </label>
      <select
        className="border border-gray-200 rounded-md p-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={ambience}
        onChange={(e) => setAmbience(e.target.value)}
      >
        <option>forest</option>
        <option>ocean</option>
        <option>mountain</option>
        <option>city</option>
      </select>

      <label className="text-xs font-medium text-gray-500 mt-3 mb-1">
        Your thoughts
      </label>
      <textarea
        className="border border-gray-200 rounded-md p-2 w-full text-sm min-h-30 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={text}
        placeholder="Write about your day, feelings, or anything on your mind..."
        onChange={(e) => setText(e.target.value)}
      />

      {message && (
        <p className="text-xs mt-2 text-gray-600">
          {message}
        </p>
      )}

      <button
        className="mt-3 inline-flex items-center justify-center rounded-md bg-blue-600 text-white text-sm font-medium px-4 py-2 disabled:bg-blue-300"
        onClick={submit}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save entry"}
      </button>
    </div>
  )
}