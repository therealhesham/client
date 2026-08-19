import Link from 'next/link'
import NavigationBar from './components/navigation'

export default function NotFound() {
  return (
    <>
      <NavigationBar />
      <div className="min-h-screen pt-32 pb-12 flex items-center justify-center bg-[#faf8f5] p-4 relative overflow-hidden">
        {/* Decorative background elements using brand colors */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#ecc383] rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-[#8d6c49] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-[#003749] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="relative z-10 w-full max-w-2xl backdrop-blur-xl bg-white/70 border border-[#ecc383]/30 shadow-[0_8px_30px_rgb(0,0,0,0.05)] rounded-[2.5rem] p-10 md:p-16 text-center transform transition-all duration-500 hover:scale-[1.01]">
          
          <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ecc383] to-[#8d6c49] drop-shadow-sm mb-6 tracking-tighter">
            404
          </h1>
          
          <div className="space-y-8 mb-10">
            <div dir="rtl">
              <h2 className="text-3xl md:text-4xl font-bold text-[#003749] mb-3 font-['Tajawal'] tracking-tight">عذراً، الصفحة غير موجودة</h2>
              <p className="text-[#003749]/80 text-lg font-['Tajawal'] leading-relaxed">يبدو أن الصفحة التي تبحث عنها قد تم نقلها، حذفها، أو أنها غير موجودة أصلاً. يرجى التأكد من الرابط.</p>
            </div>
            
            <div className="w-20 h-1.5 bg-gradient-to-r from-[#ecc383] via-[#8d6c49] to-[#003749] rounded-full mx-auto opacity-70"></div>
            
            <div dir="ltr">
              <h2 className="text-3xl md:text-4xl font-bold text-[#003749] mb-3 tracking-tight">Oops! Page Not Found</h2>
              <p className="text-[#003749]/80 text-lg leading-relaxed">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
            </div>
          </div>

          <Link 
            href="/"
            dir="ltr" 
            className="group inline-flex flex-row items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-300 transform rounded-full shadow-lg bg-gradient-to-r from-[#ecc383] to-[#8d6c49] hover:from-[#8d6c49] hover:to-[#ecc383] hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#ecc383]/30"
          >
            <span>Return Home</span>
            <svg className="w-5 h-5 mx-3 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="font-['Tajawal']">العودة للرئيسية</span>
          </Link>
        </div>
      </div>
    </>
  )
}
