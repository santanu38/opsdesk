// A small pool of fake users for login
export const mockUsers = [
  { id: 1, username: "agent1", password: "password123", name: "Riya Sharma", role: "agent" },
  { id: 2, username: "agent2", password: "password123", name: "Karan Mehta", role: "agent" },
]

const priorities=["low","medium","high"]
const statuses=["open","in-progess","resolved"]

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Generate a large pool of fake tickets — we'll use this for the
// "thousands of records" virtualization step later too.
export const mockTickets = Array.from({ length: 2000 }, (_, i) => {
  const id = i + 1
  const createdDaysAgo = Math.floor(Math.random() * 60)
  const createdAt = new Date(Date.now() - createdDaysAgo * 86400000).toISOString()

  return {
    id,
    title: `Ticket #${id} — ${randomFrom(["Login issue", "Payment failure", "UI bug", "Feature request", "Performance issue"])}`,
    description: "Auto-generated ticket for testing purposes.",
    status: randomFrom(statuses),
    priority: randomFrom(priorities),
    assignee: randomFrom(mockUsers).name,
    createdAt,
  }
})