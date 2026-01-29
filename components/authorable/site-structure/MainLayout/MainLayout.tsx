'use client';

import { IPage } from "@/.generated";
import { ComponentRenderer } from "@/components/primitives/ComponentRenderer";
import { ContentstackLivePreview } from "@/components/primitives/ContentstackLivePreview";
import { useScrollElementIntoView } from "@/lib/hooks/useScrollElementIntoView";
import { JSX, useRef } from "react";
import { tv } from "tailwind-variants";

interface MainLayoutProps {
    page: IPage;
    pageContentTypeUID?: string;
}


export const MainLayout = ({ page, pageContentTypeUID = "page" }: MainLayoutProps): JSX.Element => {
    const { base } = TAILWIND_VARIANTS();

    const mainLayoutRef = useRef<HTMLDivElement>(null);

    useScrollElementIntoView(mainLayoutRef.current, {
        stickyHeaderId: 'header',
        scrollTargetId: 'main-content',
    });

    const pageTypeMapping = {
        page: () => {
            const { components, ...rest } = page as IPage;
            return <ComponentRenderer components={components} extendedProps={rest} />;
        },
    };
    return (
        <div
            ref={mainLayoutRef}
            className={base()}
            id={page.uid}
            data-component="authorable/shared/site-structure/main-layout/main-layout"
        >
            {(() => {
                return pageTypeMapping[pageContentTypeUID as keyof typeof pageTypeMapping]();
            })()}
            <ContentstackLivePreview />
        </div>
    )
}

const TAILWIND_VARIANTS = tv({
    slots: {
        base: [
            'grid',
            'grid-cols-1',
            'm-auto',
            'w-full',
            'max-w-screen-dimensions-max-width',
            'min-w-screen-dimensions-min-width',
            'px-general-spacing-margin-x',
        ],
    },
    variants: {
        isSearchLayout: {
            true: {
                base: ['gap-0', '!pb-general-spacing-margin-y'],
            },
        },
    },
});