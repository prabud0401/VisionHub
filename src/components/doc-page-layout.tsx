
import { ThemeToggle } from "./theme-toggle";

interface Section {
    id: string;
    title: string;
}

interface DocPageLayoutProps {
    title: string;
    description: string;
    sections: Section[];
    children: React.ReactNode;
}

export function DocPageLayout({ title, description, sections, children }: DocPageLayoutProps) {
    return (
        <div className="container mx-auto py-20 px-4">
             <div className="absolute top-24 right-6">
                <ThemeToggle />
            </div>
            <div className="flex flex-col lg:flex-row lg:gap-16">
                <main className="flex-1 lg:w-3/4">
                    <header className="mb-12 border-b pb-8">
                        <h1 className="font-headline text-4xl font-bold tracking-tight lg:text-5xl">{title}</h1>
                        <p className="mt-4 text-lg text-muted-foreground">{description}</p>
                    </header>
                    <div className="prose prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-12 prose-p:leading-relaxed prose-a:text-primary hover:prose-a:underline">
                        {children}
                    </div>
                </main>
                <aside className="hidden lg:block lg:w-1/4 sticky top-24 h-screen">
                    <nav>
                        <h3 className="font-semibold mb-4">On this page</h3>
                        <ul className="space-y-2">
                            {sections.map(section => (
                                <li key={section.id}>
                                    <a href={`#${section.id}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                        {section.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>
            </div>
        </div>
    );
}
