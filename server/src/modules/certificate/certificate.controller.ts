import { Request, Response } from 'express'
import { handleCertificateGeneration } from './certificate.service'

export const getCertificate = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId, courseId } = req.params
    const url = await handleCertificateGeneration(userId, courseId)
    return res.json({ url })
  } catch (error: any) {
    console.error('Certificate error:', error)
    return res
      .status(error.status || 500)
      .json({ message: error.message || 'Internal server error' })
  }
}
