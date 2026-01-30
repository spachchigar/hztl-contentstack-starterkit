'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const LANGUAGE_PREFERENCE_COOKIE = 'language-preference';

/**
 * Set language preference cookie and redirect to the language-specific page
 * This runs on the server, ensuring cookie is set before redirect
 */
export async function setLanguagePreference(
    langCode: string,
    redirectPath: string
) {
    // Set cookie on server (guaranteed to be set before redirect)
    const cookieStore = await cookies();
    cookieStore.set(LANGUAGE_PREFERENCE_COOKIE, langCode, {
        path: '/',
        maxAge: 365 * 24 * 60 * 60, // 1 year
        sameSite: 'lax',
    });

    // Redirect after cookie is set (atomic operation)
    redirect(redirectPath);
}