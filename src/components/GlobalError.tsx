import { useRouteError, useNavigate } from 'react-router-dom';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default function GlobalError() {
  const error = useRouteError() as Error;
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto min-h-[100dvh] flex flex-col items-center justify-center bg-[#FDFBF7] text-[#4A3F35] p-6 text-center" dir="rtl">
      <div className="w-24 h-24 bg-red-50 text-red-400 rounded-full flex items-center justify-center mb-6 shadow-sm border border-red-100">
        <AlertTriangle size={48} />
      </div>
      
      <h1 className="font-serif text-3xl font-bold text-[#5B93B5] mb-4">
        אופס, משהו השתבש...
      </h1>
      
      <p className="text-[#A39B90] text-lg mb-8 max-w-[300px]">
        {error?.message || "נראה שקרתה תקלה לא צפויה. אנחנו מצטערים על חוסר הנוחות."}
      </p>

      <div className="flex flex-col gap-4 w-full max-w-[280px]">
        <button
          onClick={() => window.location.reload()}
          className="flex items-center justify-center gap-2 w-full bg-[#5B93B5] text-white py-4 rounded-2xl font-medium text-lg shadow-md hover:bg-opacity-90 transition"
        >
          <RefreshCw size={20} />
          <span>לנסות שוב</span>
        </button>
        
        <button
          onClick={() => navigate('/')}
          className="flex items-center justify-center gap-2 w-full bg-white text-[#5B93B5] border-2 border-[#5B93B5] py-4 rounded-2xl font-medium text-lg shadow-sm hover:bg-gray-50 transition"
        >
          <Home size={20} />
          <span>חזרה לדף הבית</span>
        </button>
      </div>
    </div>
  );
}
