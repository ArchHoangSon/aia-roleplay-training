// Prompt templates for customer generation
import { SEGMENT_TYPES } from '../constants/consultingFlows';

export const CUSTOMER_GENERATION_PROMPTS = {
    [SEGMENT_TYPES.MASS_MARKET]: `Bạn là chuyên gia tạo chân dung khách hàng đại chúng cho đào tạo tư vấn viên bảo hiểm nhân thọ tại AIA Việt Nam.`,
    [SEGMENT_TYPES.HNW]: `Bạn là chuyên gia tạo chân dung khách hàng cao cấp (HNW - High Net Worth) cho đào tạo tư vấn viên bảo hiểm nhân thọ tại AIA Việt Nam.`
} as const;
