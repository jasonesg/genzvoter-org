import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Pricing | Houdys",
  description: "Simple, transparent pricing for Houdys.",
};

const PLANS = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started.",
    features: [
      "Browse property listings",
      "Save up to 10 favourites",
      "Basic search filters",
      "Email support",
    ],
    cta: "Get started free",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "month",
    description: "For serious buyers and renters.",
    features: [
      "Unlimited saved properties",
      "Advanced filters & alerts",
      "Direct broker messaging",
      "Priority support",
      "Market insights & reports",
    ],
    cta: "Start free trial",
    href: "/signup",
    highlight: true,
  },
  {
    name: "Broker",
    price: "$49",
    period: "month",
    description: "For licensed real-estate agents.",
    features: [
      "List unlimited properties",
      "Featured placement in search",
      "Lead management dashboard",
      "Client messaging inbox",
      "Analytics & performance stats",
      "Priority support",
    ],
    cta: "Start free trial",
    href: "/signup",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen py-24 px-6" style={{ backgroundColor: "#f5f4f1" }}>
      <div className="max-w-[1200px] mx-auto">

        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif font-bold text-[#1C1410] mb-4">Simple pricing</h1>
          <p className="text-[#7A6555] text-lg max-w-xl mx-auto">
            No surprises. Pick the plan that fits how you use Houdys.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl p-7 border transition-all ${
                plan.highlight
                  ? "bg-[#1C1410] text-[#f5f4f1] border-[#1C1410] shadow-xl scale-[1.02]"
                  : "bg-[#eceae6] text-[#1C1410] border-[#e0dfdb] hover:border-[#C4A882]"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#27BE5D] text-white text-xs font-semibold rounded-full">
                  Most popular
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-lg font-serif font-bold mb-1">{plan.name}</h2>
                <p className={`text-sm mb-5 ${plan.highlight ? "text-[#f5f4f1]/60" : "text-[#7A6555]"}`}>
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className={`text-sm ${plan.highlight ? "text-[#f5f4f1]/50" : "text-[#7A6555]"}`}>
                    / {plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${plan.highlight ? "text-[#27BE5D]" : "text-[#27BE5D]"}`} />
                    <span className={plan.highlight ? "text-[#f5f4f1]/80" : "text-[#4A3728]"}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`w-full py-2.5 rounded-full text-sm font-semibold text-center transition-colors ${
                  plan.highlight
                    ? "bg-[#27BE5D] text-white hover:bg-[#297A46]"
                    : "bg-[#1C1410] text-[#f5f4f1] hover:bg-[#2E2018]"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-[#7A6555] text-sm mt-12">
          All plans include a 14-day free trial. No credit card required.{" "}
          <Link href="/subprocessors" className="underline hover:text-[#1C1410] transition-colors">
            View subprocessors
          </Link>
        </p>

      </div>
    </div>
  );
}
