import { Button } from '@businessportal/ui';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold text-foreground">
          Ddotsmedia Business Portal
        </h1>
        <p className="text-lg text-muted-foreground">
          Production-shaped monorepo with Next.js, Postgres, and workers
        </p>
        <Button variant="default" size="lg">
          Get Started
        </Button>
      </div>
    </main>
  );
}
