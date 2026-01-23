'use client';

import { IPage } from "@/.generated";
import { ComponentRenderer } from "@/components/primitives/ComponentRenderer";
import { ContentstackLivePreview } from "@/components/primitives/ContentstackLivePreview";
import { useScrollElementIntoView } from "@/lib/hooks/useScrollElementIntoView";
import { JSX, useRef } from "react";

interface MainLayoutProps {
    page: IPage;
    pageContentTypeUID?: string;
}


export const MainLayout = ({ page, pageContentTypeUID = "page" }: MainLayoutProps): JSX.Element => {
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