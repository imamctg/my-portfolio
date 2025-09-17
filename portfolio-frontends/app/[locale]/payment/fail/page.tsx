'use client'

export default function PaymentFailPage() {
  return (
    <div className='min-h-screen flex flex-col justify-center items-center bg-red-50 text-red-800 p-10'>
      <h1 className='text-3xl font-bold'>❌ Payment Failed!</h1>
      <p className='mt-4 text-lg'>
        Sorry, your payment was not successful. Please try again.
      </p>
    </div>
  )
}
