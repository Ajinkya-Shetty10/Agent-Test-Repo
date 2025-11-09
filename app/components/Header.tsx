"use client";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export default function Header({ title = "Recommendations", subtitle }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        
      </div>
    </header>
  );
}

