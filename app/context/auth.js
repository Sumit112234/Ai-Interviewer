export async function getUser() {
  try {
    let user = await fetch("/api/auth/me")
    if (!user.ok) throw new Error("Not authenticated")
    user = await user.json()
    return user
  } catch {
    return null
  }

}
export async function logout() {
  try {
    let user = await fetch("/api/auth/logout", { 
      method: "POST" ,
      credentials: "include"
    })
    
    if (!user.ok) throw new Error("Not authenticated")
    user = await user.json()
    return user
  } catch {
    return null
  }

}
export async function login() {
  try {
    let user = await fetch("/api/auth/me")
    if (!user.ok) throw new Error("Not authenticated")
    user = await user.json()
    return user
  } catch {
    return null
  }

}
export async function register() {
  try {
    let user = await fetch("/api/auth/me")
    if (!user.ok) throw new Error("Not authenticated")
    user = await user.json()
    return user
  } catch {
    return null
  }

}
