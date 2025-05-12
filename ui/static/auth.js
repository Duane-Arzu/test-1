let AUTH_TOKEN = localStorage.getItem("auth_token");

function isAuthenticated() {
  return !!AUTH_TOKEN;
}

async function login(email, password) {
  try {
    const response = await fetch("/api/v1/tokens/authentication", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok && data.authentication_token && data.authentication_token.token) {
      AUTH_TOKEN = data.authentication_token.token;
      localStorage.setItem("auth_token", AUTH_TOKEN);
      return { success: true };
    } else {
      return {
        success: false,
        error: data.error || JSON.stringify(data.errors) || "Invalid login credentials",
      };
    }
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

async function logout() {
  if (!AUTH_TOKEN) return { success: true };

  try {
    const response = await fetch("/api/v1/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      AUTH_TOKEN = null;
      localStorage.removeItem("auth_token");
      return { success: true };
    } else {
      const data = await response.json();
      return { success: false, error: data.error || "Logout failed" };
    }
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

async function register(username, email, password) {
  try {
    const response = await fetch("/api/v1/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    console.log("Register response:", response.status, data);

    if (response.ok) {
      return { success: true };
    } else {
      return {
        success: false,
        error: data.error || JSON.stringify(data.errors) || "Registration failed",
      };
    }
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

async function activateAccount(token) {
  try {
    const response = await fetch("/api/v1/users/activated", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();
    console.log("Activation response:", response.status, data);

    if (response.ok) {
      return { success: true };
    } else {
      return { success: false, error: data.error || "Activation failed" };
    }
  } catch (error) {
    console.error("Activation error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

function fetchWithAuth(url, options = {}) {
  if (!options.headers) options.headers = {};
  if (AUTH_TOKEN) options.headers["Authorization"] = `Bearer ${AUTH_TOKEN}`;
  return fetch(url, options);
}

window.auth = {
  isAuthenticated,
  login,
  logout,
  register,
  activateAccount,
  fetchWithAuth,
};
