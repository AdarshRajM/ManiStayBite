export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600">ManiStayBite</h3>
            <p className="text-sm max-w-sm">
              The ultimate smart hotel, food, and event management system. Experience premium hospitality with cutting-edge AI technology.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary-400 transition-colors">Home</a></li>
              <li><a href="#menu" className="hover:text-primary-400 transition-colors">Food Menu</a></li>
              <li><a href="#rooms" className="hover:text-primary-400 transition-colors">Book a Room</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>support@manistaybite.com</li>
              <li>+91 98765 43210</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm">
          <p>&copy; 2026 ManiStayBite. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
