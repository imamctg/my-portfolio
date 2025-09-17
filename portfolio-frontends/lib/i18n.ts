import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      earnings: 'Earnings',
      totalEarnings: 'Total Earnings',
      thisMonth: 'This Month',
      pending: 'Pending Payouts',
      downloadReport: 'Download Report',
      monthlyEarnings: 'Monthly Earnings',
      paymentHistory: 'Payment History',
      date: 'Date',
      amount: 'Amount',
      status: 'Status',
      method: 'Method',
      paid: 'Paid',
      processing: 'Processing',
    },
  },
  bn: {
    translation: {
      earnings: 'উপার্জন',
      totalEarnings: 'মোট আয়',
      thisMonth: 'এই মাস',
      pending: 'বকেয়া পরিশোধ',
      downloadReport: 'রিপোর্ট ডাউনলোড করুন',
      monthlyEarnings: 'মাসিক আয়',
      paymentHistory: 'পেমেন্ট হিস্টোরি',
      date: 'তারিখ',
      amount: 'টাকা',
      status: 'স্ট্যাটাস',
      method: 'মেথড',
      paid: 'পরিশোধিত',
      processing: 'প্রসেসিং',
    },
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // Default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
