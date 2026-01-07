"use client"

export function GoogleLoginButton() {
  const handleGoogleLogin = () => {

    console.log("origin:", window.location.origin)

    if (!window.google) return
    console.log("Initiating Google Sign-In")

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: async (response) => {
        console.log("inside callback" )
        await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: response.credential }),
        })

        window.location.href = "/dashboard"
      },
    })

    console.log('after callback setup')
    window.google.accounts.id.prompt()
  }

  return (
    <button
      onClick={handleGoogleLogin}
      className="
        w-full max-w-sm
        flex items-center justify-center gap-3
        bg-white text-gray-700
        rounded-lg
        px-4 py-2.5
        text-sm font-medium
        shadow-md
        hover:bg-gray-100
        active:scale-[0.98]
        transition
        border border-gray-200
      "
    >
      {/* Google Logo */}
      <svg width="18" height="18" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.72 1.22 9.22 3.6l6.9-6.9C35.9 2.38 30.47 0 24 0 14.62 0 6.5 5.38 2.56 13.22l8.02 6.22C12.4 13.18 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.1 24.5c0-1.6-.14-3.14-.4-4.64H24v9.28h12.44c-.54 2.9-2.16 5.36-4.6 7.02l7.08 5.5c4.14-3.82 6.52-9.44 6.52-16.16z"/>
        <path fill="#FBBC05" d="M10.58 28.44c-.5-1.48-.78-3.06-.78-4.68 0-1.62.28-3.2.78-4.68l-8.02-6.22C.92 16.46 0 20.12 0 23.76c0 3.64.92 7.3 2.56 10.9l8.02-6.22z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.9-2.14 15.86-5.82l-7.08-5.5c-1.96 1.32-4.48 2.1-8.78 2.1-6.26 0-11.6-3.68-13.42-8.94l-8.02 6.22C6.5 42.62 14.62 48 24 48z"/>
      </svg>

      <span>Continue with Google</span>
    </button>
  )
}
