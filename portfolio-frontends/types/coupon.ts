export interface Coupon {
  _id: string
  code: string
  discount: number
  expiresAt: string
  discountType: 'flat' | 'percentage'
}
