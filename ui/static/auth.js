// Authentication functions
let AUTH_TOKEN = localStorage.getItem("auth_token")

// Check if user is authenticated
function isAuthenticated() {
  return !!AUTH_TOKEN
}

// Login function
async function login(email, password) {
  try {
    const response = await fetch("/api/v1/tokens/authentication", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (response.ok) {
      AUTH_TOKEN = data.authentication.token
      localStorage.setItem("auth_token", AUTH_TOKEN)
      return { success: true }
    } else {
      return { success: false, error: data.error }
    }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Logout function
async function logout() {
  if (!AUTH_TOKEN) return { success: true }

  try {
    const response = await fetch("/api/v1/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
    })

    if (response.ok) {
      AUTH_TOKEN = null
      localStorage.removeItem("auth_token")
      return { success: true }
    } else {
      const data = await response.json()
      return { success: false, error: data.error }
    }
  } catch (error) {
    console.error("Logout error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Register function
async function register(name, email, password) {
  try {
    const response = await fetch("/api/v1/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await response.json()

    if (response.status === 202) {
      return { success: true }
    } else {
      return { success: false, error: data.error }
    }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Activate account function
async function activateAccount(token) {
  try {
    const response = await fetch("/api/v1/users/activated", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })

    if (response.ok) {
      return { success: true }
    } else {
      const data = await response.json()
      return { success: false, error: data.error }
    }
  } catch (error) {
    console.error("Activation error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Add authentication header to fetch requests
function fetchWithAuth(url, options = {}) {
  if (!options.headers) {
    options.headers = {}
  }

  if (AUTH_TOKEN) {
    options.headers["Authorization"] = `Bearer ${AUTH_TOKEN}`
  }

  return fetch(url, options)
}

// Export the authentication functions
window.auth = {
  isAuthenticated,
  login,
  logout,
  register,
  activateAccount,
  fetchWithAuth,
}
