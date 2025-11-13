export default function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-800/40 py-10 px-6 text-sm text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <p className="font-semibold text-slate-200">vorteX Health</p>
          <p className="mt-1 max-w-md leading-relaxed">Healthcare-grade burnout insights with orchestration hooks and ledger-backed audit trails for trust and transparency.</p>
        </div>
        <div className="flex gap-8">
          <ul className="space-y-1">
            <li className="font-semibold text-slate-300">Product</li>
            <li><a className="hover:text-white" href="#features">Features</a></li>
            <li><a className="hover:text-white" href="#pricing">Pricing</a></li>
            <li><a className="hover:text-white" href="#demo">Demo</a></li>
          </ul>
          <ul className="space-y-1">
            <li className="font-semibold text-slate-300">Company</li>
            <li><a className="hover:text-white" href="#about">About</a></li>
            <li><a className="hover:text-white" href="#careers">Careers</a></li>
            <li><a className="hover:text-white" href="#contact">Contact</a></li>
          </ul>
        </div>
      </div>
  <div className="mt-10 text-xs text-slate-500">© {new Date().getFullYear()} vorteX Health. All rights reserved.</div>
    </footer>
  )
}