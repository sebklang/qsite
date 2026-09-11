interface PostgresInterval {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export function pluralize(num: number, str: string) {
    if (num != 1) return `${num} ${str}s`
    else return `1 ${str}`
}

export function agoify(diff: PostgresInterval) {
    let diffStr = ""
    if (diff.days > 0)
        diffStr = `${pluralize(diff.days, "day")}`
    else if (diff.hours > 0)
        diffStr = `${pluralize(diff.hours, "hour")} ${pluralize(diff.minutes, "minute")}`
    else if (diff.minutes > 1)
        diffStr = `${pluralize(diff.minutes, "minute")}`
    else if (diff.minutes == 1)
        diffStr = `1 minute ${pluralize(diff.seconds, "second")}`
    else if (diff.seconds)
        diffStr = `${pluralize(diff.seconds, "second")}`
    else
        diffStr = 'now'
    if (diffStr != 'now')
        diffStr += ' ago'
    return diffStr
}