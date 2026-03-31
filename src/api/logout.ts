
export async function logout(): Promise<void> {
  const res = await fetch('/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    // ここでは throw して mutation 側の onError でログを出す
    throw new Error(`Logout failed with status ${res.status}`)
  }
}
