
import React from "react";

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
     
        {children}
    
    </div>
  );
}