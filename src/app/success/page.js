import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 pb-24 relative overflow-hidden">
      {/* Background gradients similar to the rest of the site */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-md w-full bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 text-center shadow-2xl relative z-10">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay rounded-3xl"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex flex-col items-center justify-center mb-6 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Payment Successful!</h1>
          
          <p className="text-neutral-300 mb-10 text-lg">
            Thank you for subscribing to the Pro Plan. Your account is now active and you have access to all premium features.
          </p>
          
          <Link 
            href="/"
            className="group flex items-center justify-center gap-2 w-full py-4 px-6 rounded-full bg-white text-primary-900 font-bold hover:bg-neutral-200 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-[1.02]"
          >
            Return to Homepage
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
