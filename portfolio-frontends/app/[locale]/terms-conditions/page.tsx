'use client'
import { ShieldCheck, ScrollText } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

const TermsPage = () => {
  const searchParams = useSearchParams()
  const role = searchParams.get('role') || 'guest'

  const isInstructor = role === 'instructor'

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 sm:p-10 border border-gray-200'>
        <div className='flex items-center gap-3 mb-6'>
          <ShieldCheck className='text-primary w-8 h-8' />
          <h1 className='text-3xl sm:text-4xl font-extrabold text-gray-900 text-center w-full'>
            Terms & Conditions
          </h1>
        </div>

        <p className='text-gray-700 text-md leading-relaxed mb-6'>
          Welcome to <strong>Advanced Learning</strong>. These terms and
          conditions outline the rules and responsibilities while using our
          platform.
        </p>

        {/* Common Terms Sections */}
        <section className='space-y-4 mb-8'>
          <h2 className='text-xl font-semibold text-gray-900'>
            1. User Eligibility
          </h2>
          <p className='text-gray-700'>
            You must be at least 13 years old to create an account. Under 18
            must have parental consent.
          </p>
        </section>

        <section className='space-y-4 mb-8'>
          <h2 className='text-xl font-semibold text-gray-900'>
            2. Platform Usage
          </h2>
          <ul className='list-disc pl-5 text-gray-700 space-y-2'>
            <li>Use of content is strictly personal.</li>
            <li>Do not redistribute or resell any course content.</li>
            <li>Respect all community guidelines and user interactions.</li>
          </ul>
        </section>

        {/* Instructor Specific Section */}
        {isInstructor && (
          <section className='space-y-4 mb-8'>
            <h2 className='text-xl font-semibold text-gray-900'>
              3. Instructor Revenue Sharing Policy
            </h2>
            <p className='text-gray-700'>
              Course revenue is subject to a 3% payment gateway deduction.
              Remaining revenue is shared as follows:
            </p>
            <ul className='list-disc pl-5 text-gray-700 space-y-2'>
              <li>Instructor brings student: earns 80%</li>
              <li>Platform brings student: earns 50%</li>
              <li>Affiliate brings student: earns 25%</li>
            </ul>
          </section>
        )}

        <div className='flex justify-center mt-10'>
          <ScrollText className='w-10 h-10 text-primary animate-bounce' />
        </div>
      </div>
    </div>
  )
}

export default TermsPage
