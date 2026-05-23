import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8 sm:p-12">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-primary hover:underline mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Terms of Service</h1>
          <p className="text-slate-500">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        
        <div className="prose prose-slate max-w-none">
          <p className="mb-4">Welcome to NoMenu, a service provided by AmBrightTech LLC. By using our website and services, you agree to comply with and be bound by the following terms and conditions.</p>
          
          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">By accessing or using NoMenu, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our service.</p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">2. Description of Service</h2>
          <p className="mb-4">NoMenu provides digital menu generation and QR code services for restaurants. We reserve the right to modify, suspend, or discontinue any part of the service at any time without notice.</p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">3. User Accounts</h2>
          <p className="mb-4">You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password. AmBrightTech LLC cannot and will not be liable for any loss or damage arising from your failure to comply with this security obligation.</p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">4. Content Ownership</h2>
          <p className="mb-4">You retain all your ownership rights in your content (menus, pricing, restaurant details). By uploading content to NoMenu, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display the content solely for the purpose of providing the service.</p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">5. Limitation of Liability</h2>
          <p className="mb-4">In no event shall AmBrightTech LLC, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.</p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">6. Contact Us</h2>
          <p className="mb-4">If you have any questions about these Terms, please contact us at legal@ambrighttech.com.</p>
        </div>
      </div>
    </main>
  );
}
