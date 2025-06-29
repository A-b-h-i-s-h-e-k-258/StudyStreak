
import { Mail } from 'lucide-react';

export const Footer = () => {
  const handleFeedbackClick = () => {
    window.location.href = 'mailto:iit2023258@iiita.ac.in?subject=Feedback';
  };

  return (
    <footer className="w-full mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-white/10 shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            {/* Left side - Copyright */}
            <div className="text-sm text-gray-700 dark:text-gray-300">
              © 2025 Abhishek. All rights reserved.
            </div>
            
            {/* Right side - Feedback link */}
            <button
              onClick={handleFeedbackClick}
              className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors duration-200"
            >
              <Mail className="h-4 w-4" />
              <span>Send Feedback</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
