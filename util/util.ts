export function pluralize(num: number, str: string) {
    if (num != 1) return `${num} ${str}s`
    else return `1 ${str}`
}

export function agoify(diff: number) {
    let diffStr = ""

    const days = Math.floor(diff / 3600 / 24)
    diff -= days * 24 * 3600
    const hours = Math.floor(diff / 3600)
    diff -= hours * 3600
    const minutes = Math.floor(diff / 60)
    diff -= minutes * 60
    const seconds = Math.floor(diff)

    if (days > 0)
        diffStr = `${pluralize(days, "day")}`
    else if (hours > 0)
        diffStr = `${pluralize(hours, "hour")} ${pluralize(minutes, "minute")}`
    else if (minutes > 0)
        diffStr = `${pluralize(minutes, "minute")}`
    else if (seconds)
        diffStr = `${pluralize(seconds, "second")}`
    else
        diffStr = 'now'
    if (diffStr != 'now')
        diffStr += ' ago'
    return diffStr
}
