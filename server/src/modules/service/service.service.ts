import { ServiceModel, IService } from './service.model'

export const getAllServices = async (): Promise<IService[]> => {
  return await ServiceModel.find().sort({ createdAt: -1 })
}

export const getServiceById = async (id: string): Promise<IService | null> => {
  return await ServiceModel.findById(id)
}

export const getServiceBySlug = async (
  slug: string
): Promise<IService | null> => {
  return await ServiceModel.findOne({ slug })
}

export const createService = async (
  data: Partial<IService>
): Promise<IService> => {
  const service = new ServiceModel(data)
  return await service.save()
}

export const updateService = async (
  id: string,
  data: Partial<IService>
): Promise<IService | null> => {
  return await ServiceModel.findByIdAndUpdate(id, data, { new: true })
}

export const deleteService = async (id: string): Promise<IService | null> => {
  return await ServiceModel.findByIdAndDelete(id)
}
