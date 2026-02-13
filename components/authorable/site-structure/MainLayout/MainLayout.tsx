import { IPage } from "@/.generated";
import { ComponentRenderer } from "@/components/primitives/ComponentRenderer";
import { ContentstackLivePreview } from "@/components/primitives/ContentstackLivePreview";
import { JSX } from "react";
import { tv } from "tailwind-variants";

interface MainLayoutProps {
    page: IPage;
    pageContentTypeUID?: string;
}


export const MainLayout = ({ page, pageContentTypeUID = "page" }: MainLayoutProps): JSX.Element => {

    const pageTypeMapping = {
        page: () => {
            const { components, ...rest } = page as IPage;
            return <ComponentRenderer components={components} extendedProps={rest} />;
        },
    };

    const { base, mainContent, mainContentWrapper } = TAILWIND_VARIANTS();
    return (
        <>
            <div className={mainContentWrapper()}>
                <div id="main-content" className={mainContent()}></div>
            </div>
            <div className={base()}
                id={page.uid}
                data-component="authorable/shared/site-structure/main-layout/main-layout"
            >
                {(() => {
                    return pageTypeMapping[pageContentTypeUID as keyof typeof pageTypeMapping]();
                })()}
                <ContentstackLivePreview />
            </div>
        </>
    )
}

const TAILWIND_VARIANTS = tv({
    slots: {
        base: [
            'grid',
            'grid-cols-1',
            'm-auto',
            'w-full',
            'max-w-screen-2xl',
            'px-6',
            'md:px-12',
            'xl:px-20'
        ],
        mainContentWrapper: [
            'relative',
        ],
        mainContent: [
            'absolute',
            'left-0',
        ]
    },
});