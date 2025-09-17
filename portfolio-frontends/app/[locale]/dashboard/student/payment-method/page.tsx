import PaymentMethodSection from 'components/Dashboard/PaymentMethodSection'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Payment Methods',
  description: 'View all your payment method and transaction history.',
}

export default function PaymentMethodPage() {
  return (
    <div className='p-6 max-w-5xl mx-auto'>
      <h1 className='text-3xl font-bold mb-6'>My Payment Methods</h1>
      <PaymentMethodSection />
    </div>
  )
}
