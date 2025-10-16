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
