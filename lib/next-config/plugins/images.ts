import type { NextConfig } from 'next';
import type { ImageConfig, RemotePattern } from 'next/dist/shared/lib/image-config';
import micromatch from 'micromatch';

const { makeRe } = micromatch;

/**
 * Next.js images plugin configuration
 * @param nextConfig - Next.js configuration object
 * @returns Next.js configuration with image settings
 */
const imagesPlugin = (nextConfig: NextConfig = {}): NextConfig => {
    return Object.assign({}, nextConfig, {
        images: nextConfigImages,
    });
};

/** Next.js image configuration */
const nextConfigImages: ImageConfig = {
    dangerouslyAllowSVG: true,
    // Update patterns here
    remotePatterns: [
        {
            hostname: 'images.contentstack.io',
        },
        {
            protocol: 'https',
            hostname: '*-images.contentstack.com',
        },
    ],
    qualities: [25, 50, 75, 100],
};

/**
 * Validates if a given image source URL is allowed by Next.js image configuration
 * @param src - Image source URL to validate
 * @returns true if the domain is allowed, false otherwise
 */
export function isValidNextImageDomain(src: string | undefined): boolean {
    if (!src) {
        return false;
    }
    if (src.startsWith('/')) {
        return true;
    }
    try {
        const url = new URL(src);
        if (nextConfigImages.remotePatterns?.some((p: RemotePattern | URL) => matchRemotePattern(p as RemotePattern, url))) {
            return true;
        }
    } catch {
        return false;
    }

    return false;
}

/**
 * Matches a URL against a remote pattern configuration
 * @param pattern - Remote pattern from Next.js image config
 * @param url - URL object to match against
 * @returns true if URL matches the pattern, false otherwise
 */
function matchRemotePattern(pattern: RemotePattern, url: URL): boolean {
    if (pattern.protocol !== undefined) {
        const actualProto = url.protocol.slice(0, -1);
        if (pattern.protocol !== actualProto) {
            return false;
        }
    }
    if (pattern.port !== undefined) {
        if (pattern.port !== url.port) {
            return false;
        }
    }

    if (pattern.hostname === undefined) {
        throw new Error(`Pattern should define hostname but found\n${JSON.stringify(pattern)}`);
    } else {
        if (!makeRe(pattern.hostname).test(url.hostname)) {
            return false;
        }
    }

    if (!makeRe(pattern.pathname ?? '**').test(url.pathname)) {
        return false;
    }

    return true;
}

// Export for ES modules
export default imagesPlugin;
export { nextConfigImages };
export { imagesPlugin };