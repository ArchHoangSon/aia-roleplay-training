// Review prompts for analyzing roleplay conversations
export const REVIEW_CRITERIA = {
    communication: {
        label: 'Kỹ năng giao tiếp',
        aspects: [
            'Lắng nghe chủ động',
            'Đặt câu hỏi mở',
            'Tóm tắt ý khách',
            'Ngôn ngữ phù hợp đối tượng'
        ]
    },
    empathy: {
        label: 'Đồng cảm & Kết nối',
        aspects: [
            'Thể hiện sự quan tâm chân thành',
            'Hiểu cảm xúc khách hàng',
            'Xây dựng rapport',
            'Không áp đặt'
        ]
    },
    objectionHandling: {
        label: 'Xử lý từ chối',
        aspects: [
            'Không phản ứng tiêu cực',
            'Tìm hiểu nguyên nhân sâu xa',
            'Đưa ra giải pháp phù hợp',
            'Không ép buộc'
        ]
    },
    needDiscovery: {
        label: 'Khám phá nhu cầu',
        aspects: [
            'Đặt câu hỏi đúng',
            'Không assume nhu cầu',
            'Kết nối nhu cầu với giải pháp',
            'Ưu tiên nhu cầu của KH'
        ]
    },
    trustBuilding: {
        label: 'Xây dựng niềm tin',
        aspects: [
            'Minh bạch thông tin',
            'Không hứa suông',
            'Chuyên nghiệp',
            'Tạo giá trị cho KH'
        ]
    },
    progression: {
        label: 'Tiến trình tư vấn',
        aspects: [
            'Chuyển giai đoạn tự nhiên',
            'Không vội vàng chốt',
            'Theo dõi tín hiệu KH',
            'Biết khi nào nên dừng'
        ]
    }
} as const;

interface AdvisorContext {
    name?: string;
    experienceMonths?: number;
    improvements?: string;
}

export const generateReviewPrompt = (chatLog: string, advisorContext: AdvisorContext = {}) => {
    const criteriaList = Object.entries(REVIEW_CRITERIA)
        .map(([_, val]) => `### ${val.label}\n${val.aspects.map(a => `- ${a}`).join('\n')}`)
        .join('\n\n');

    return `# 📋 PHÂN TÍCH CUỘC TƯ VẤN BẢO HIỂM

## VAI TRÒ CỦA BẠN
Bạn là một HUẤN LUYỆN VIÊN TƯ VẤN BẢO HIỂM chuyên nghiệp. Hãy phân tích cuộc trò chuyện roleplay bên dưới và đưa ra đánh giá chi tiết, khách quan, mang tính xây dựng.

---

## THÔNG TIN TƯ VẤN VIÊN
${advisorContext.name ? `- Tên: ${advisorContext.name}` : '(Không rõ)'}
${advisorContext.experienceMonths ? `- Kinh nghiệm: ${Math.floor(advisorContext.experienceMonths / 12)} năm ${advisorContext.experienceMonths % 12} tháng` : ''}
${advisorContext.improvements ? `- Đang cải thiện: ${advisorContext.improvements}` : ''}

---

## TIÊU CHÍ ĐÁNH GIÁ

${criteriaList}

---

## CUỘC TRÒ CHUYỆN CẦN PHÂN TÍCH

\`\`\`
${chatLog}
\`\`\`

---

## YÊU CẦU PHÂN TÍCH

Hãy đưa ra phân tích theo format sau:

### 📊 TỔNG QUAN
- **Điểm tổng thể:** X/10
- **Giai đoạn đạt được:** (Ví dụ: Đã hoàn thành Need Discovery, đang ở Presentation)
- **Mức độ tin tưởng cuối cùng:** X/5

### ✅ ĐIỂM MẠNH
Liệt kê 3-5 điểm TVV làm tốt, với ví dụ cụ thể từ cuộc trò chuyện.

### ⚠️ CẦN CẢI THIỆN
Liệt kê 3-5 điểm TVV cần cải thiện, với ví dụ cụ thể và giải thích tại sao.

### 🎯 GỢI Ý CẢI THIỆN
Đưa ra 3-5 gợi ý CỤ THỂ và THỰC TẾ mà TVV có thể áp dụng ngay:
- Câu nói thay thế
- Kỹ thuật cụ thể
- Thời điểm nên làm khác

### 🔄 KHẢ NĂNG CHUYỂN GIAI ĐOẠN
Đánh giá liệu TVV có đủ điều kiện để chuyển sang giai đoạn tiếp theo hay không, và cần làm gì để đạt được.

### 💡 CÂU NÓI GỢI Ý
Đưa ra 2-3 câu nói mẫu mà TVV có thể sử dụng trong tình huống tương tự.

---

**Lưu ý:** Hãy đưa ra phản hồi mang tính XÂY DỰNG, KHÁCH QUAN và CỤ THỂ. Tránh chung chung, và luôn đính kèm ví dụ từ cuộc trò chuyện thực tế.`;
};

export const REVIEW_RESULT_TEMPLATE = {
    overallScore: 0,
    stageReached: '',
    finalTrustLevel: 0,
    strengths: [] as string[],
    improvements: [] as string[],
    suggestions: [] as string[],
    stageProgression: '',
    samplePhrases: [] as string[]
};
