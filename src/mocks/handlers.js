import { http, HttpResponse, delay } from "msw"
import { mockUsers, mockTickets } from "./data"

// In-memory "session" tracking, just for our mock backend's own bookkeeping
let refreshTokenStore = {}

function generateToken(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2)}-${Date.now()}`
}

export const handlers = [
  // LOGIN
  http.post("/api/auth/login", async ({ request }) => {
    await delay(500) // simulate real network latency

    const { username, password } = await request.json()
    const user = mockUsers.find(
      (u) => u.username === username && u.password === password
    )

    if (!user) {
      return HttpResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
      )
    }

    const accessToken = generateToken("access")
    const refreshToken = generateToken("refresh")
    refreshTokenStore[refreshToken] = user.id

    return HttpResponse.json({
      user: { id: user.id, name: user.name, role: user.role },
      accessToken,
      refreshToken,
    })
  }),

  // REFRESH
  http.post("/api/auth/refresh", async ({ request }) => {
    await delay(300)

    const { refreshToken } = await request.json()
    const userId = refreshTokenStore[refreshToken]

    if (!userId) {
      return HttpResponse.json(
        { message: "Invalid refresh token" },
        { status: 401 }
      )
    }

    // rotate tokens, same pattern as SprintDesk
    delete refreshTokenStore[refreshToken]
    const newAccessToken = generateToken("access")
    const newRefreshToken = generateToken("refresh")
    refreshTokenStore[newRefreshToken] = userId

    return HttpResponse.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    })
  }),

  // GET TICKETS (supports basic query params for status/priority filtering later)
  http.get("/api/tickets", async ({ request }) => {
    await delay(400)

    const authHeader = request.headers.get("Authorization")
    if (!authHeader) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(request.url)
    const status = url.searchParams.get("status")
    const priority = url.searchParams.get("priority")
    const search = url.searchParams.get("search")?.toLowerCase()

    let filtered = mockTickets

    if (status) filtered = filtered.filter((t) => t.status === status)
    if (priority) filtered = filtered.filter((t) => t.priority === priority)
    if (search) filtered = filtered.filter((t) => t.title.toLowerCase().includes(search))

    return HttpResponse.json(filtered)
  }),

  // DASHBOARD STATS (used later for the "5 parallel APIs" step)
  http.get("/api/stats", async () => {
    await delay(600)
    return HttpResponse.json({
      total: mockTickets.length,
      open: mockTickets.filter((t) => t.status === "open").length,
      inProgress: mockTickets.filter((t) => t.status === "in-progress").length,
      resolved: mockTickets.filter((t) => t.status === "resolved").length,
    })
  }),
]