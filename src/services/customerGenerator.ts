// Customer generator service - builds prompts and parses responses
import { SEGMENT_TYPES } from '../constants/consultingFlows';
import { MASS_MARKET_TEMPLATE, HNW_TEMPLATE } from '../constants/personaTemplates';
import { PERSONALITY_BEHAVIORS, COMMON_OBJECTIONS } from '../constants/behaviorPatterns';
import { generateCustomerProfile } from './geminiService';

// Build prompt to generate customer persona
export const buildCustomerPrompt = (description: string, segmentType: string, flowType: string) => {
    const template = segmentType === SEGMENT_TYPES.HNW ? HNW_TEMPLATE : MASS_MARKET_TEMPLATE;
    const templateFields = JSON.stringify(template, null, 2);

    const personalityList = Object.entries(PERSONALITY_BEHAVIORS)
        .map(([_, value]) => `- ${value.label}: ${value.description}`)
        .join('\n');

    const prompt = `Bạn là chuyên gia tạo chân dung khách hàng cho đào tạo tư vấn viên bảo hiểm nhân thọ.

## Nhiệm vụ
Dựa trên mô tả sau, hãy tạo một chân dung khách hàng ${segmentType === SEGMENT_TYPES.HNW ? 'cao cấp (HNW)' : 'đại chúng'} hoàn chỉnh, chi tiết và chân thực.

## Mô tả từ tư vấn viên
"${description}"

## Yêu cầu
1. Điền đầy đủ tất cả các trường thông tin trong template
2. Với thông tin không được cung cấp, hãy suy luận hợp lý dựa trên context
3. Tạo background story nhất quán và logic
4. Chọn MỘT tính cách chính từ danh sách sau:
${personalityList}

## Template cần điền
${templateFields}

## Output format
Trả về JSON hợp lệ theo đúng cấu trúc template ở trên, thêm các trường sau:
- "personalityType": (một trong: skeptical, avoidant, analytical, emotional, social_pressure, impatient)
- "backgroundStory": (2-3 câu mô tả ngắn về cuộc sống khách hàng)
- "hiddenNeeds": (array các nhu cầu ẩn mà khách hàng chưa nhận ra)
- "potentialObjections": (array các từ chối có thể xảy ra)

CHỈ TRẢ VỀ JSON, KHÔNG CÓ TEXT KHÁC.`;

    return prompt;
};

// Parse AI response to customer object
export const parseCustomerResponse = (response: string) => {
    try {
        // Remove markdown code blocks if present
        let jsonStr = response.trim();
        if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.slice(7);
        } else if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.slice(3);
        }
        if (jsonStr.endsWith('```')) {
            jsonStr = jsonStr.slice(0, -3);
        }

        return JSON.parse(jsonStr.trim());
    } catch (error) {
        console.error('Failed to parse customer response:', error);
        throw new Error('Không thể phân tích dữ liệu khách hàng. Vui lòng thử lại.');
    }
};

// Generate complete customer profile
export const generateCustomer = async (description: string, segmentType: string, flowType: string) => {
    const prompt = buildCustomerPrompt(description, segmentType, flowType);
    const response = await generateCustomerProfile(prompt);
    const customer = parseCustomerResponse(response);

    // Add metadata
    customer._meta = {
        segmentType,
        flowType,
        generatedAt: new Date().toISOString(),
        originalDescription: description
    };

    return customer;
};

// Get personality behavior details
export const getPersonalityBehavior = (personalityType: keyof typeof PERSONALITY_BEHAVIORS) => {
    return PERSONALITY_BEHAVIORS[personalityType] || PERSONALITY_BEHAVIORS.skeptical;
};

// Get random objections for a personality
export const getRandomObjections = (count = 2) => {
    const allObjections = Object.values(COMMON_OBJECTIONS);
    const shuffled = [...allObjections].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

// Format customer display name
export const getCustomerDisplayName = (customer: any) => {
    if (customer?.basicInfo?.name) {
        return customer.basicInfo.name;
    }
    return 'Khách hàng';
};

// Get customer summary for display
export const getCustomerSummary = (customer: any) => {
    const info = customer?.basicInfo || {};
    const parts = [];

    if (info.age) parts.push(`${info.age} tuổi`);
    if (info.occupation) parts.push(info.occupation);
    if (info.maritalStatus) parts.push(info.maritalStatus);

    return parts.join(' • ') || 'Chưa có thông tin';
};
