import { BuilderTopbar } from "@/components/builder/BuilderTopbar";

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <BuilderTopbar />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
