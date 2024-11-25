export function truncateString(text: string, n: number) {
    if (text.length > n) {
        return text.slice(0, n) + "...";
    }
    return text;
}

