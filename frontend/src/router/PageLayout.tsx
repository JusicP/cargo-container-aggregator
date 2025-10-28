import React, {type ReactNode } from 'react';

// Define the types for the Layout component's props
interface LayoutProps {
    children: ReactNode;
    sidebar?: ReactNode;
}

const PageLayout: React.FC<LayoutProps> = ({ children, sidebar }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex flex-1 w-full">
                {sidebar && (
                    <aside className="w-64 shadow-sm">
                        {sidebar}
                    </aside>
                )}
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default PageLayout;