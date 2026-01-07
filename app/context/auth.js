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

export async function login(email,password, isGoogle=false) {

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email ,
          password,
          provider: isGoogle ? "google" : "local"
        })
      })

      const data = await response.json()

      if (!response.ok) {
       return {error : true, msg : data.error || "Invalid credentials"}
      }

     
    return { error: false, msg: "Login successful" }
      
    } catch (err) {
      console.log("Login error:", err)
    } 

}


export async function register(name, email, password, google) {
  try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password : google ? "786hgujd&%(" + Date.now().toString() : password,
          google
        })
      })
      const data = await response.json()

      if (!response.ok) {
       return {error : true, msg : data.error || "Registration failed"}
      }
      return { error: false, msg: "Registration successful" }
  } catch(err) {
    return { error: true, msg: "Registration failed" }
  }

}
