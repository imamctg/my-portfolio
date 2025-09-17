// import cron from 'node-cron'
// import { EarningsService } from '../modules/earnings/earnings.service'

// export const scheduleBonuses = () => {
//   // মাসিক Bonus: প্রতি মাসের ১ তারিখ
//   cron.schedule('0 1 1 * *', async () => {
//     console.log('✅ Monthly Bonus Processing...')
//     await EarningsService.applyMonthlyBonusesForAll()
//   })

//   // সাপ্তাহিক ক্যাম্পেইন Bonus: প্রতি শনিবার
//   // cron.schedule('0 2 * * 5,6,9', async () => {
//   cron.schedule('0 12 * * 5,6,9', async () => {
//     console.log('✅ Weekly Campaign Bonus Running...')
//     await EarningsService.applyWeeklyCampaignBonus()
//   })
// }
