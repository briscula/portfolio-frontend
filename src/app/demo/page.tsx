import DividendChart from '../../components/dividend-chart';
import Link from 'next/link';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Dividend Portfolio - Demo
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Dividend Chart Demo
            </h2>
            <p className="text-gray-600 mb-6">
              This is a demonstration of the Nivo charting library showing monthly dividend data across multiple years.
            </p>
            <DividendChart />
          </div>
        </div>
      </main>
    </div>
  );
} 