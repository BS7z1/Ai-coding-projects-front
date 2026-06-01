export function desensitizeCertID(value) {
    if (!value) return value
    return String(value).replace(/^(.{4}).+(.{4})$/, '$1**********$2')
}

export function desensitizeName(value) {
    if (!value) return value
    const text = String(value)
    return text.length <= 1 ? text : text[0] + '*'.repeat(text.length - 1)
}

export function desensitizeCardNo(value) {
    if (!value) return value
    return String(value).replace(/^(.{4}).+(.{4})$/, '$1 **** **** $2')
}

export function desensitizeMoblie(value) {
    if (!value) return value
    return String(value).replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
}

export function desensitizeAddress(value) {
    if (!value) return value
    const text = String(value)
    return text.length <= 6 ? text : text.slice(0, 6) + '****'
}

export function desensitizeDefault(value) {
    if (!value) return value
    const text = String(value)
    return text.length <= 2 ? text : text[0] + '****' + text[text.length - 1]
}