export async function getJSON(url, init) {
  const res = await fetch(url, init)
  const ct = res.headers.get('content-type') || ''

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`HTTP ${res.status} for ${url}\n` + text.slice(0, 300))
  }
  if (!ct.includes('application/json')) {
    const text = await res.text().catch(() => '')
    throw new Error(
      `Expected JSON but got "${ct}" from ${url}\n` + text.slice(0, 300),
    )
  }
  return res.json()
}
