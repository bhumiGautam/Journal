
const API = "http://localhost:5000"

export const getEntries = async (userId) => {
  const res = await fetch(`${API}/api/journal/${userId}`)
  if (!res.ok) throw new Error("Failed to load entries")
  return res.json()
}

export const createEntry = async (data) => {
  const res = await fetch(`${API}/api/journal`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error("Failed to create entry")
  return res.json()
}

export const analyzeText = async ({ text, journalId, userId } = {}) => {
  const body = {}
  if (journalId) body.journalId = journalId
  if (userId) body.userId = userId
  if (text) body.text = text

  const res = await fetch(`${API}/api/journal/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error("Failed to analyze text")
  return res.json()
}

export const getInsights = async (userId) => {
  const res = await fetch(`${API}/api/journal/insights/${userId}`)
  if (!res.ok) throw new Error("Failed to load insights")
  return res.json()
}