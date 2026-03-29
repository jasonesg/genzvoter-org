import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function InvolvementPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center pt-24 px-6 text-center">
      <div className="bg-primary-500/10 p-4 rounded-full mb-6">
        <div className="w-12 h-12 bg-primary-500 rounded-full animate-pulse border-4 border-black box-content"></div>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
        Involvement Portal
      </h1>
      <p className="text-neutral-400 max-w-md mx-auto mb-10 text-lg">
        This page is currently under construction. Check back soon for exclusive mobilization tools and community access.
      </p>
      <Link 
        href="/" 
        className="flex items-center gap-2 px-6 py-3 rounded text-sm font-medium bg-white/10 hover:bg-white/20 transition-colors text-white"
      >
        <ArrowLeft className="w-4 h-4" /> 
        Return Home
      </Link>
    </div>
  );
}
