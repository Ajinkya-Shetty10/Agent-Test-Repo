"use client";
import { HomeIcon, ChartBarIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { RocketLaunchIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import veilIcon from "@/app/icon.png";

interface SidebarProps {
  logoUrl?: string;
  companyName?: string;
}

export default function Sidebar({ logoUrl, companyName = "Veil" }: SidebarProps) {
  const navItems = [
    { icon: RocketLaunchIcon, label: "Recommendations", active: true },
    
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Image
            src={logoUrl ?? veilIcon}
            alt={`${companyName} logo`}
            width={40}
            height={40}
            className="rounded-lg object-contain"
            priority
          />
          <div>
            <h1 className="font-semibold text-gray-900 text-lg">{companyName}</h1>
            
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <button
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    item.active
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

