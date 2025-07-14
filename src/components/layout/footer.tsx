export default function Footer() {
  return (
    <footer className="w-full border-t border-border/40">
      <div className="container flex h-16 items-center justify-center">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} VisionHub AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
