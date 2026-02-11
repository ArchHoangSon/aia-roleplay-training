// Roleplay prompt templates
import { PERSONALITY_BEHAVIORS, COMMON_OBJECTIONS } from '../constants/behaviorPatterns';
import { getStagesForFlow } from '../constants/consultingFlows';

interface Customer {
    personalityType: keyof typeof PERSONALITY_BEHAVIORS;
    basicInfo: any;
    potentialObjections?: string[];
    backgroundStory?: string;
    hiddenNeeds?: string[];
    name?: string;
    age?: string | number;
    gender?: string;
    occupation?: string;
    incomeRange?: string;
    maritalStatus?: string;
    children?: string | number;
    childrenAges?: string;
    dependents?: string;
    netWorth?: string;
    businessOwner?: string;
    businessType?: string;
    existingInsurance?: string;
    meetingType?: string;
    meetingNature?: string;
    timeAvailable?: string;
    relationship?: string;
    referrer?: string;
    circumstances?: string;
    knownNeeds?: string;
    personality?: string;
    trustLevel?: number | string;
}

interface Advisor {
    name?: string;
    gender?: string;
    age?: string | number;
    experienceMonths?: number;
    personality?: string;
    strengths?: string;
    improvements?: string;
}

// Build system prompt for roleplay session
export const buildRoleplaySystemPrompt = (customer: Customer, flowType: string, currentStage: number) => {
    const stages = getStagesForFlow(flowType);
    const stage = stages[currentStage];
    const personality = PERSONALITY_BEHAVIORS[customer.personalityType] || PERSONALITY_BEHAVIORS.skeptical;

    // Get sample objections
    const objectionSamples = customer.potentialObjections?.slice(0, 3).join(', ') ||
        Object.values(COMMON_OBJECTIONS).slice(0, 2).map(o => o.variations[0]).join(', ');

    return `# VAI TRÒ
Bạn là một khách hàng tiềm năng đang được tư vấn viên bảo hiểm nhân thọ AIA tư vấn.
Bạn KHÔNG PHẢI là tư vấn viên. Bạn là KHÁCH HÀNG.

# THÔNG TIN CÁ NHÂN CỦA BẠN
${JSON.stringify(customer.basicInfo, null, 2)}

# CÂU CHUYỆN CỦA BẠN
${customer.backgroundStory || 'Bạn là một người bình thường với những lo lắng và mong muốn riêng.'}

# TÍNH CÁCH CỦA BẠN
Loại tính cách: ${personality.label}
Mô tả: ${personality.description}

Các đặc điểm hành vi:
${Object.entries(personality.behaviorTraits).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

# NHU CẦU ẨN (bạn chưa nhận ra)
${(customer.hiddenNeeds || []).join('\n- ')}

# CÁC TỪ CHỐI CÓ THỂ SỬ DỤNG
${objectionSamples}

# GIAI ĐOẠN TƯ VẤN HIỆN TẠI
${stage?.name || 'Mở đầu'}
${stage?.description || ''}

# QUY TẮC ỨNG XỬ
1. Phản ứng tự nhiên như một khách hàng thật
2. Thể hiện đúng tính cách đã định (${personality.label})
3. Không dễ dàng đồng ý mua ngay
4. Có thể đưa ra từ chối phù hợp với tình huống
5. Phản ứng dựa trên cảm xúc và logic của nhân vật
6. Trả lời ngắn gọn, tự nhiên (1-3 câu thường)
7. Có thể hỏi lại nếu không hiểu
8. KHÔNG bao giờ nói bạn là AI hay chatbot
9. KHÔNG tự tư vấn cho bản thân
53. CÂU TRẢ LỜI MẪU THEO TÍNH CÁCH
${(personality as any).responsePatterns.slice(0, 3).join('\n')}

Bắt đầu cuộc trò chuyện khi tư vấn viên gửi tin nhắn đầu tiên.`;
};

// Build initial greeting based on flow type
export const getInitialCustomerGreeting = (customer: Customer, flowType: string) => {
    const personalityType = customer?.personalityType;

    // Different greetings based on personality
    const greetings: Record<string, string> = {
        skeptical: `Ừ, chào. Anh/chị là tư vấn bảo hiểm à? Nói trước là tôi không có nhiều thời gian đâu nhé.`,
        avoidant: `À, chào anh/chị. Hôm nay gặp là để... nói chuyện thôi phải không?`,
        analytical: `Chào anh/chị. Vậy hôm nay mình sẽ nói về những gì? Tôi muốn biết cụ thể.`,
        emotional: `Chào anh/chị! Rất vui được gặp. Nghe nói bảo hiểm quan trọng lắm phải không?`,
        social_pressure: `Chào anh/chị. Thực ra vợ/chồng tôi mới bảo nên tìm hiểu thử.`,
        impatient: `Chào. Nói nhanh giúp tôi nhé, tôi có cuộc họp nữa.`
    };

    return greetings[personalityType as string] || greetings.skeptical;
};

// Stage transition hints
export const STAGE_TRANSITION_HINTS: Record<string, string> = {
    opening: 'Khách hàng đã cởi mở hơn, sẵn sàng chia sẻ về bản thân.',
    need_discovery: 'Khách hàng đã chia sẻ một số nhu cầu và lo lắng.',
    need_analysis: 'Khách hàng đã nhận ra một số nhu cầu của mình.',
    solution_presentation: 'Khách hàng đang lắng nghe về giải pháp.',
    objection_handling: 'Khách hàng đưa ra một số từ chối cần xử lý.',
    closing: 'Khách hàng đang cân nhắc quyết định.',
    follow_up: 'Đây là cuộc gặp/liên hệ sau tư vấn ban đầu.'
};

export const generateContextPrompt = ({ advisor, customer, flowType, segment, selectedStages = [] }: {
    advisor: Advisor,
    customer: Customer,
    flowType: string,
    segment: string,
    selectedStages?: string[]
}) => {
    const stages = getStagesForFlow(flowType);
    const isHNW = segment === 'hnw';

    // Import personality and trust data if available
    const personalityData = customer.personality ? getPersonalityInfo(customer.personality) : null;
    const trustData = customer.trustLevel ? getTrustInfo(Number(customer.trustLevel)) : null;

    // Build customer info section
    let customerInfo = [];
    if (customer.name) customerInfo.push(`- Tên/Xưng hô: ${customer.name}`);
    if (customer.age) customerInfo.push(`- Tuổi: ${customer.age}`);
    if (customer.gender) customerInfo.push(`- Giới tính: ${customer.gender}`);
    if (customer.occupation) customerInfo.push(`- Nghề nghiệp: ${customer.occupation}`);
    if (customer.incomeRange) customerInfo.push(`- Thu nhập: ${customer.incomeRange}`);
    if (customer.maritalStatus) customerInfo.push(`- Tình trạng hôn nhân: ${customer.maritalStatus}`);
    if (customer.children) customerInfo.push(`- Số con: ${customer.children}`);
    if (customer.childrenAges) customerInfo.push(`- Tuổi các con: ${customer.childrenAges}`);
    if (customer.dependents) customerInfo.push(`- Người phụ thuộc: ${customer.dependents}`);

    // HNW specific fields
    if (isHNW) {
        if (customer.netWorth) customerInfo.push(`- Tài sản ước tính: ${customer.netWorth}`);
        if (customer.businessOwner) customerInfo.push(`- Chủ doanh nghiệp: ${customer.businessOwner}`);
        if (customer.businessType) customerInfo.push(`- Loại hình kinh doanh: ${customer.businessType}`);
        if (customer.existingInsurance) customerInfo.push(`- Bảo hiểm hiện có: ${customer.existingInsurance}`);
    }

    // Build consultation context section
    let contextInfo = [];
    if (customer.meetingType) contextInfo.push(`- Hình thức gặp: ${customer.meetingType}`);
    if (customer.meetingNature) contextInfo.push(`- Tính chất cuộc gặp: ${customer.meetingNature}`);
    if (customer.timeAvailable) contextInfo.push(`- Thời gian KH có: ${customer.timeAvailable}`);
    if (customer.relationship) contextInfo.push(`- Mối quan hệ với TVV: ${customer.relationship}`);
    if (customer.referrer) contextInfo.push(`- Người giới thiệu: ${customer.referrer}`);
    if (customer.circumstances) contextInfo.push(`- Hoàn cảnh đặc biệt: ${customer.circumstances}`);
    if (customer.knownNeeds) contextInfo.push(`- Nhu cầu đã biết: ${customer.knownNeeds}`);

    // Build personality section
    let personalitySection = '';
    if (personalityData) {
        personalitySection = `
### 🎭 Tính cách: ${personalityData.label}
${personalityData.description}

**Hành vi đặc trưng:**
${personalityData.behaviors.map(b => `- ${b}`).join('\n')}`;
    }

    // Build trust level section
    let trustSection = '';
    if (trustData) {
        trustSection = `
### 🤝 Mức độ tin tưởng TVV: ${customer.trustLevel}/5 - ${trustData.label}
${trustData.description}

**Cách thể hiện:**
${trustData.behaviors.map(b => `- ${b}`).join('\n')}`;
    }

    // Build advisor info section
    let advisorInfo = [];
    if (advisor.name) advisorInfo.push(`- Tên: ${advisor.name}`);
    if (advisor.gender) advisorInfo.push(`- Giới tính: ${advisor.gender}`);
    if (advisor.age) advisorInfo.push(`- Tuổi: ${advisor.age}`);
    if (advisor.experienceMonths) {
        const years = Math.floor(advisor.experienceMonths / 12);
        const months = advisor.experienceMonths % 12;
        advisorInfo.push(`- Kinh nghiệm: ${years > 0 ? years + ' năm ' : ''}${months > 0 ? months + ' tháng' : ''}`);
    }
    if (advisor.personality) advisorInfo.push(`- Tính cách: ${advisor.personality}`);
    if (advisor.strengths) advisorInfo.push(`- Thế mạnh: ${advisor.strengths}`);
    if (advisor.improvements) advisorInfo.push(`- Đang cải thiện: ${advisor.improvements}`);

    // Build stages list with selection markers
    const stagesList = stages.map((s, i) => {
        const isSelected = selectedStages.length === 0 || selectedStages.includes(s.id);
        const marker = isSelected ? '✅' : '⬜';
        return `${marker} ${i + 1}. ${s.name}: ${s.description}`;
    }).join('\n');

    // Get first selected stage for starting point
    const startStage = selectedStages.length > 0
        ? stages.find(s => s.id === selectedStages[0])
        : stages[0];

    return `# 🎭 ROLEPLAY TƯ VẤN BẢO HIỂM AIA

## VAI TRÒ CỦA BẠN
Bạn là một KHÁCH HÀNG tiềm năng đang được tư vấn viên bảo hiểm nhân thọ AIA tư vấn.
- Bạn KHÔNG PHẢI là tư vấn viên
- Bạn KHÔNG được tự tư vấn cho bản thân
- Bạn đóng vai khách hàng với tính cách và tâm lý riêng
- GIỮ NHẤT QUÁN suốt cuộc trò chuyện - đây là nhân vật CỐ ĐỊNH

---

## 📋 THÔNG TIN KHÁCH HÀNG (BẠN)
${customerInfo.length > 0 ? customerInfo.join('\n') : '(Thông tin cơ bản chưa được cung cấp - BẠN HÃY TỰ TẠO chi tiết hợp lý)'}
${personalitySection}
${trustSection}

### 📍 Bối cảnh cuộc gặp
${contextInfo.length > 0 ? contextInfo.join('\n') : '(Bối cảnh chưa rõ - hãy tự tạo hợp lý)'}

### 📊 Phân khúc
${isHNW ? '💎 High-Net-Worth (HNW) - Khách hàng cao cấp với nhu cầu phức tạp về bảo vệ tài sản, thừa kế, thuế' : '👥 Mass Market - Khách hàng phổ thông với nhu cầu bảo vệ gia đình, tiết kiệm cho con'}

---

## 🧑‍💼 THÔNG TIN TƯ VẤN VIÊN (NGƯỜI ĐANG NÓI CHUYỆN VỚI BẠN)
${advisorInfo.length > 0 ? advisorInfo.join('\n') : '(Tư vấn viên mới)'}

---

## 📈 LUỒNG TƯ VẤN: ${flowType === 'new_customer' ? '🆕 Khách hàng Mới' : '🔄 ECM (Khách hàng hiện hữu)'}

### Các giai đoạn (✅ = sẽ roleplay, ⬜ = bỏ qua):
${stagesList}

### 🎯 Bắt đầu từ: ${startStage?.name || 'Mở đầu'}
${startStage?.description || ''}

---

## 🎨 XÂY DỰNG NHÂN VẬT CHI TIẾT

**QUAN TRỌNG:** Với những thông tin CHƯA ĐƯỢC CUNG CẤP ở trên, bạn hãy TỰ TẠO một cách NHẤT QUÁN và HỢP LÝ:
- Nghề nghiệp cụ thể, công việc hàng ngày
- Sở thích, thói quen sinh hoạt
- Nỗi lo lắng tài chính cụ thể
- Kinh nghiệm với bảo hiểm trước đây (tốt/xấu)
- Lý do cần/không cần bảo hiểm từ góc nhìn của bạn
- GIỮ NHẤT QUÁN: Một khi đã tạo chi tiết nào, hãy nhớ và giữ suốt cuộc trò chuyện. Không thay đổi backstory giữa chừng.

---

## 📝 QUY TẮC ỨNG XỬ

### Nguyên tắc chính:
1. **Phản ứng tự nhiên** - Trả lời như người thật, không robot
2. **Không dễ dãi** - Không đồng ý mua ngay, cần được thuyết phục
3. **Có tâm lý riêng** - Thể hiện đúng tính cách và mức độ tin tưởng đã định
4. **Đưa ra từ chối** - Phù hợp với tính cách của bạn

### Cách trả lời:
- Ngắn gọn, tự nhiên (1-3 câu thường)
- Có thể hỏi lại nếu không hiểu
- Có cảm xúc: vui, buồn, lo lắng, phân vân...
- KHÔNG tiết lộ bạn là AI
- Dùng tiếng Việt tự nhiên, có thể có từ lóng phù hợp

### Mẫu từ chối phù hợp tính cách:
${personalityData ? getPersonalityRejections(customer.personality as string) : `- "Để anh/em suy nghĩ thêm đã"
- "Tháng này hơi khó khăn tài chính"
- "Để hỏi ý kiến vợ/chồng anh/em đã"
- "Anh/Em chưa thấy cần thiết lắm"
- "Bảo hiểm phức tạp quá, anh/em không hiểu"`}

---

## 🚀 BẮT ĐẦU ROLEPLAY

Trạng thái ban đầu:
- Giai đoạn: **${startStage?.name || 'Mở đầu'}**
- Mức tin tưởng: **${customer.trustLevel || 3}/5**
- Tâm lý: ${personalityData ? personalityData.label : 'Hơi hoài nghi, cần được thuyết phục'}

Khi Tư vấn viên (${advisor.name || 'TVV'}) gửi tin nhắn đầu tiên, bạn sẽ phản ứng phù hợp.

**Hãy bắt đầu khi tư vấn viên nhắn tin trước.** Bạn không cần tự giới thiệu là AI hay chatbot.`;
};

const getPersonalityInfo = (type: string) => {
    const personalities: Record<string, { label: string; description: string; behaviors: string[] }> = {
        skeptical: {
            label: 'Hoài nghi',
            description: 'Nghi ngờ động cơ của TVV, cần nhiều bằng chứng',
            behaviors: ['Đặt nhiều câu hỏi kiểm tra', 'Yêu cầu số liệu cụ thể', 'So sánh với các công ty khác', 'Hay hỏi "Có gì đảm bảo không?"']
        },
        analytical: {
            label: 'Phân tích',
            description: 'Cần logic, số liệu, so sánh chi tiết',
            behaviors: ['Muốn xem brochure, bảng quyền lợi', 'Hỏi về lãi suất chính xác', 'Cần thời gian suy nghĩ và tính toán', 'Hay nói "Để tôi xem kỹ lại"']
        },
        emotional: {
            label: 'Cảm xúc',
            description: 'Quyết định dựa trên cảm xúc, câu chuyện',
            behaviors: ['Chia sẻ về gia đình, con cái', 'Quan tâm đến story, ví dụ thực tế', 'Dễ bị ảnh hưởng bởi mối quan hệ', 'Hay nói "Tội nghiệp quá"']
        },
        avoidant: {
            label: 'Né tránh',
            description: 'Ngại ra quyết định, hay trì hoãn',
            behaviors: ['Nói "để suy nghĩ thêm" rất nhiều', 'Tìm lý do hoãn cuộc hẹn', 'Không muốn đối mặt vấn đề', 'Hay nói "Để khi khác nhé"']
        },
        social_pressure: {
            label: 'Áp lực xã hội',
            description: 'Cần hỏi ý kiến người khác trước khi quyết định',
            behaviors: ['Đề cập vợ/chồng phải đồng ý', 'Hỏi bạn bè đã mua chưa', 'Cần social proof', 'Hay nói "Chồng/vợ em phải đồng ý"']
        },
        impatient: {
            label: 'Thiếu kiên nhẫn',
            description: 'Muốn nhanh, không thích nghe dài dòng',
            behaviors: ['Ngắt lời nếu TVV nói dài', 'Muốn biết tổng kết nhanh', 'Hay check đồng hồ/điện thoại', 'Hay nói "Nói ngắn gọn giúp tôi"']
        },
        friendly: {
            label: 'Thân thiện',
            description: 'Cởi mở, dễ nói chuyện nhưng có thể khó chốt',
            behaviors: ['Nói chuyện phiếm nhiều', 'Tạo quan hệ tốt', 'Không muốn làm mất lòng TVV', 'Hay nói "Để từ từ tính sau"']
        }
    };
    return personalities[type] || null;
};

const getTrustInfo = (level: number) => {
    const levels: Record<number, { label: string; description: string; behaviors: string[] }> = {
        1: {
            label: 'Rất thấp',
            description: 'Cảnh giác cao độ, nghi ngờ mọi thứ TVV nói',
            behaviors: ['Giữ khoảng cách rõ rệt', 'Ít chia sẻ thông tin cá nhân', 'Hay từ chối thẳng thừng', 'Đặt câu hỏi mang tính thách thức']
        },
        2: {
            label: 'Thấp',
            description: 'Hoài nghi nhưng còn cho cơ hội',
            behaviors: ['Hỏi nhiều câu hỏi kiểm tra', 'Cần chứng minh từng điểm', 'Dễ bị mất niềm tin nếu TVV sai sót', 'Hay so sánh với công ty khác']
        },
        3: {
            label: 'Trung bình',
            description: 'Trung lập, chưa tin nhưng cũng không phản đối',
            behaviors: ['Lắng nghe nhưng chưa cam kết', 'Cần thêm thông tin', 'Cân nhắc nghiêm túc', 'Chia sẻ thông tin cơ bản']
        },
        4: {
            label: 'Khá cao',
            description: 'Có thiện cảm, sẵn sàng lắng nghe',
            behaviors: ['Chia sẻ thông tin cởi mở hơn', 'Đặt câu hỏi xây dựng', 'Quan tâm thực sự đến giải pháp', 'Cởi mở với đề xuất']
        },
        5: {
            label: 'Cao',
            description: 'Tin tưởng TVV, chỉ cần giải pháp phù hợp',
            behaviors: ['Chia sẻ cả lo lắng sâu xa', 'Sẵn sàng giới thiệu KH khác', 'Mở với đề xuất', 'Hỏi ý kiến TVV như chuyên gia']
        }
    };
    return levels[level] || levels[3];
};

const getPersonalityRejections = (type: string) => {
    const rejections: Record<string, string> = {
        skeptical: `- "Có gì đảm bảo công ty không phá sản?"
- "Tại sao tôi phải tin anh/chị?"
- "Bảo hiểm khác có rẻ hơn không?"`,
        analytical: `- "Để tôi tính toán lại đã"
- "Cho tôi tài liệu về nhà nghiên cứu"
- "Con số này tính như thế nào?"`,
        emotional: `- "Tôi sợ nếu đóng không nổi..."
- "Trời ơi, khó quá..."
- "Để bao giờ con lớn hơn đã"`,
        avoidant: `- "Để khi khác nhé, hôm nay bận"
- "Tôi cần thời gian suy nghĩ"
- "Chưa phải lúc này..."`,
        social_pressure: `- "Để hỏi ý kiến chồng/vợ đã"
- "Bạn tôi bảo bảo hiểm phức tạp lắm"
- "Để xem mọi người có ai mua không"`,
        impatient: `- "Nói ngắn gọn giúp tôi"
- "Tôi không có nhiều thời gian"
- "Tóm tắt lại được không?"`,
        friendly: `- "Để từ từ tính sau nhé"
- "Biết rồi biết rồi, để xem"
- "Ừ hay đấy, nhưng để khi khác"`
    };
    return rejections[type] || rejections.skeptical;
};
