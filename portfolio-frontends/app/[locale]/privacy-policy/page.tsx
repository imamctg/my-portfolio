'use client'

import { Lock, ShieldCheck } from 'lucide-react'
import Head from 'next/head'

const PrivacyPolicy = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy - Advanced Learning</title>
      </Head>

      <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 sm:p-10 border border-gray-200'>
          <div className='flex items-center gap-3 mb-6'>
            <Lock className='text-primary w-8 h-8' />
            <h1 className='text-3xl sm:text-4xl font-extrabold text-gray-900 text-center w-full'>
              Privacy Policy
            </h1>
          </div>

          <p className='text-gray-700 text-md leading-relaxed mb-6'>
            At <strong>Advanced Learning</strong>, your privacy is a top
            priority. This Privacy Policy outlines the types of personal
            information we collect, how it is used, and your choices regarding
            your data.
          </p>

          <section className='space-y-4 mb-8'>
            <h2 className='text-xl font-semibold text-gray-900'>
              1. What Information We Collect
            </h2>
            <ul className='list-disc pl-5 text-gray-700 space-y-2'>
              <li>Your name and email address during registration.</li>
              <li>
                Course progress, activity, and preferences for personalized
                learning.
              </li>
              <li>Technical data like IP address and device type.</li>
            </ul>
          </section>

          <section className='space-y-4 mb-8'>
            <h2 className='text-xl font-semibold text-gray-900'>
              2. How We Use Your Data
            </h2>
            <ul className='list-disc pl-5 text-gray-700 space-y-2'>
              <li>To manage and personalize your learning experience.</li>
              <li>To improve platform performance and user satisfaction.</li>
              <li>To send important notifications and course updates.</li>
            </ul>
          </section>

          <section className='space-y-4 mb-8'>
            <h2 className='text-xl font-semibold text-gray-900'>
              3. Data Sharing & Security
            </h2>
            <ul className='list-disc pl-5 text-gray-700 space-y-2'>
              <li>
                We never sell your personal data to third parties for marketing.
              </li>
              <li>
                We may share limited data with payment gateways and analytics
                tools—strictly for platform operation.
              </li>
              <li>
                All user data is encrypted and securely stored using industry
                best practices.
              </li>
            </ul>
          </section>

          <section className='space-y-4 mb-8'>
            <h2 className='text-xl font-semibold text-gray-900'>
              4. Your Rights & Choices
            </h2>
            <ul className='list-disc pl-5 text-gray-700 space-y-2'>
              <li>You can update or delete your profile at any time.</li>
              <li>
                You may request data deletion by contacting our support team.
              </li>
              <li>
                You may unsubscribe from communications via email preferences.
              </li>
            </ul>
          </section>

          <section className='space-y-4 mb-4'>
            <h2 className='text-xl font-semibold text-gray-900'>
              5. Changes to This Policy
            </h2>
            <p className='text-gray-700'>
              We may occasionally update this Privacy Policy. Any changes will
              be posted here with a revised effective date.
            </p>
          </section>

          <div className='flex justify-center mt-10'>
            <ShieldCheck className='w-10 h-10 text-primary animate-pulse' />
          </div>
        </div>
      </div>
    </>
  )
}

export default PrivacyPolicy
