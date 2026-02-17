declare global {
    interface Window {
        jstag?: any;
    }
}

export const getJstag = () => {
    if (typeof window === 'undefined') return null;
    return window.jstag ?? null;
}