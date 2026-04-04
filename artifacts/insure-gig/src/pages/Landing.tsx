import { Link } from "wouter";
import { Shield, Zap, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600 text-white">
        <nav className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">InSureGig</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-white/80 hover:text-white transition-colors px-4 py-2">Worker Login</Link>
            <Link href="/admin/login" className="text-sm text-white/80 hover:text-white transition-colors px-4 py-2">Admin</Link>
            <Link href="/register" className="bg-white text-blue-700 text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-50 transition-colors">
              Get Started
            </Link>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
            <Zap className="w-3.5 h-3.5 text-yellow-300" />
            Parametric Insurance for Gig Workers
          </div>
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Income protection that moves<br />at the speed of your delivery
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            When heavy rain, extreme heat, or air pollution stops your deliveries, InSureGig automatically detects the disruption and credits your payout — no paperwork, no waiting.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register" className="bg-white text-blue-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors inline-flex items-center gap-2">
              Protect My Income <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/login" className="border border-white/30 text-white px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "5,000+", label: "Delivery workers covered" },
            { value: "98%", label: "Auto-claim success rate" },
            { value: "< 2 min", label: "Average payout time" },
            { value: "4 cities", label: "Active coverage zones" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">How InSureGig works</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Zero-touch insurance that works while you work</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: "01", icon: Shield, title: "Choose your plan", desc: "Pick Basic, Standard, or Premium. Our AI calculates your risk based on city and zone." },
            { step: "02", icon: Zap, title: "We monitor disruptions", desc: "Our system continuously monitors rain, AQI, heat, and curfew events in your delivery zone." },
            { step: "03", icon: CheckCircle, title: "Instant payout", desc: "When a qualifying disruption is detected, your claim is auto-approved and credited immediately." },
          ].map(({ step, icon: Icon, title, desc }) => (
            <div key={step} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="text-4xl font-black text-primary/20 mb-4">{step}</div>
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Covered disruptions */}
      <div className="bg-blue-50 border-y border-blue-100">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-center mb-10">What we cover</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: "🌧️", type: "Heavy Rain", cities: "Mumbai, Chennai, Kolkata", example: "Monsoon disruptions" },
              { icon: "🌫️", type: "Severe Pollution", cities: "Delhi, Ahmedabad, Kolkata", example: "AQI 300+" },
              { icon: "🌡️", type: "Extreme Heat", cities: "Hyderabad, Ahmedabad, Chennai", example: "Temp above 42°C" },
              { icon: "🚧", type: "Curfew / Zone Closure", cities: "All cities", example: "Government orders" },
            ].map((item) => (
              <div key={item.type} className="bg-white rounded-xl p-5 border border-blue-100 shadow-xs">
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="font-semibold mb-1">{item.type}</div>
                <div className="text-xs text-muted-foreground mb-2">{item.cities}</div>
                <div className="text-xs bg-blue-100 text-blue-700 rounded-full px-2.5 py-0.5 inline-block">{item.example}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Plans preview */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Flexible weekly plans</h2>
          <p className="text-muted-foreground">Starting at just ₹20 per week</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { name: "Basic", premium: 20, coverage: 500, popular: false },
            { name: "Standard", premium: 35, coverage: 1000, popular: true },
            { name: "Premium", premium: 63, coverage: 1500, popular: false },
          ].map((plan) => (
            <div key={plan.name} className={`relative rounded-2xl p-6 border ${plan.popular ? "border-primary bg-primary text-white shadow-lg scale-105" : "border-border bg-card"}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <div className={`text-sm font-medium mb-1 ${plan.popular ? "text-blue-100" : "text-muted-foreground"}`}>{plan.name}</div>
              <div className={`text-3xl font-bold mb-1 ${plan.popular ? "text-white" : "text-foreground"}`}>₹{plan.premium}<span className={`text-sm font-normal ${plan.popular ? "text-blue-200" : "text-muted-foreground"}`}>/week</span></div>
              <div className={`text-sm mb-6 ${plan.popular ? "text-blue-100" : "text-muted-foreground"}`}>₹{plan.coverage} weekly coverage</div>
              <Link href="/register" className={`block text-center py-2.5 rounded-xl font-medium text-sm transition-colors ${plan.popular ? "bg-white text-primary hover:bg-blue-50" : "bg-primary text-white hover:bg-blue-600"}`}>
                Get started
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-sidebar text-sidebar-foreground py-8 px-6 text-center text-sm text-sidebar-foreground/50">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-blue-400" />
          <span className="font-semibold text-sidebar-foreground">InSureGig</span>
        </div>
        <p>Parametric income insurance for India's gig delivery workforce.</p>
      </footer>
    </div>
  );
}
