// WithdrawalProgress.tsx
'use client'

import { FC } from 'react'

interface Props {
  currentStatus:
    | 'pending'
    | 'approved'
    | 'processing'
    | 'completed'
    | 'rejected'
}

const statusDescriptions = {
  pending: 'আপনার অনুরোধটি প্রসেসিং এর জন্য প্রস্তুত',
  approved: 'আপনার অনুরোধটি অনুমোদিত হয়েছে',
  processing: 'পেমেন্ট প্রসেস চলছে',
  completed: 'পেমেন্ট সম্পূর্ণ হয়েছে',
  rejected: 'অনুরোধটি প্রত্যাখ্যান হয়েছে',
}

const WithdrawalProgress: FC<Props> = ({ currentStatus }) => {
  const steps = [
    { id: 'pending', label: 'প্রস্তুত' },
    { id: 'approved', label: 'অনুমোদিত' },
    { id: 'processing', label: 'প্রসেসিং' },
    { id: 'completed', label: 'সম্পূর্ণ' },
  ]

  const currentStepIndex = steps.findIndex((step) => step.id === currentStatus)
  const isRejected = currentStatus === 'rejected'

  return (
    <div className='space-y-2'>
      <div className='flex justify-between mb-2'>
        <span className='text-sm font-medium'>
          {isRejected
            ? 'প্রত্যাখ্যান হয়েছে'
            : statusDescriptions[currentStatus]}
        </span>
        <span className='text-sm text-muted-foreground'>
          ধাপ {Math.min(currentStepIndex + 1, steps.length)}/{steps.length}
        </span>
      </div>

      <div className='relative pt-1'>
        <div className='flex items-center justify-between'>
          <div className='flex-1'>
            <div className='h-2 bg-gray-200 rounded-full overflow-hidden'>
              <div
                className='h-full bg-green-500 rounded-full'
                style={{
                  width: `${
                    isRejected
                      ? 100
                      : (currentStepIndex / (steps.length - 1)) * 100
                  }%`,
                  backgroundColor: isRejected ? '#ef4444' : '#10b981',
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className='flex justify-between mt-2'>
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`text-xs text-center ${
                index <= currentStepIndex
                  ? 'font-bold text-green-600'
                  : 'text-gray-500'
              }`}
            >
              {step.label}
            </div>
          ))}
        </div>
      </div>

      {isRejected && (
        <div className='mt-2 text-xs text-red-500'>
          আপনার অনুরোধটি প্রত্যাখ্যান হয়েছে। অনুগ্রহ করে সহায়তা কেন্দ্রে
          যোগাযোগ করুন।
        </div>
      )}
    </div>
  )
}

export default WithdrawalProgress
