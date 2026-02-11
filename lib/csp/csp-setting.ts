import { getSiteSettings } from "../contentstack/entries";

export const getCSPDirectives = async (): Promise<string> => {
    const isDev = process.env.NODE_ENV === 'development';
    const siteSettings = await getSiteSettings();

    if (siteSettings?.content_security_policy_configuration) {
        const cspSettings = siteSettings.content_security_policy_configuration;

        // Define CSP directives
        const cspDirectives = [
            // Default fallback
            "default-src 'self'",

            // Scripts - Allow specific external sources and eval for necessary functionality
            `script-src 'self'  ${isDev ? "'unsafe-eval'" : ''} ${cspSettings?.script_src}`,

            // Script elements specifically
            `script-src-elem 'self' 'unsafe-inline' ${cspSettings?.script_src_elem}`,

            // Styles
            `style-src 'self' 'unsafe-inline' ${cspSettings?.style_src}`,

            // Images - ensure data URLs are explicitly allowed
            `img-src 'self' data: https: ${cspSettings?.img_src}`,

            // Fonts
            `font-src 'self' data: ${cspSettings?.fontsource}`,

            // Connect (APIs, WebSocket)
            `connect-src 'self' ${cspSettings?.connect_src}`,

            // Frames
            `frame-src 'self' ${cspSettings?.frame_src}`,

            // Media
            `media-src 'self' https: data: ${cspSettings?.media_src}`,

            // Object sources - allow data URLs for plugins
            "object-src 'self'",

            // Base URI restriction
            "base-uri 'self'",

            // Form submissions
            "form-action 'self'",

            // Worker scripts
            "worker-src 'self' blob:",

            // Manifest
            "manifest-src 'self'",

            // Frame-ancestors
            "frame-ancestors 'self' https://app.contentstack.com",
        ].join('; ');

        return cspDirectives;
    } else {
        return ''
    }
}