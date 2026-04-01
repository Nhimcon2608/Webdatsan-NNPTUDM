export const stringToColor = (string) => {
    const normalizedString = String(string || '').trim();
    if (!normalizedString) {
        return '#90a4ae';
    }

    let hash = 0;
    for (let i = 0; i < normalizedString.length; i++) {
        hash = normalizedString.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF;
        color += ('00' + value.toString(16)).substr(-2);
    }

    return color;
}
