export function host(url: string): string {
  const host = url
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")

  const parts = host.split(".").slice(-3)
  if (parts[0] === "www") parts.shift()

  return parts.join(".")
}

export function timeAgo(time: number | string): string {
  const seconds = Date.now() / 1000 - Number(time)

  if (seconds < 3600) {
    return pluralize(Math.floor(seconds / 60), " minute")
  }

  if (seconds < 86400) {
    return pluralize(Math.floor(seconds / 3600), " hour")
  }

  return pluralize(Math.floor(seconds / 86400), " day")
}

function pluralize(value: number, label: string): string {
  if (value === 1) {
    return value + label
  }
  return value + label + "s"
}
