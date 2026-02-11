// Advisor Profile constants and default structure
export const ADVISOR_PROFILE_FIELDS = {
    // Thông tin cơ bản
    name: {
        label: 'Họ tên',
        type: 'text',
        placeholder: 'Nguyễn Văn A',
        required: true
    },
    gender: {
        label: 'Giới tính',
        type: 'select',
        options: ['Nam', 'Nữ'],
        required: false
    },
    age: {
        label: 'Tuổi',
        type: 'number',
        placeholder: '25',
        required: false
    },

    // Kinh nghiệm
    experienceMonths: {
        label: 'Kinh nghiệm (tháng)',
        type: 'number',
        placeholder: '6',
        required: false
    },

    // Thế mạnh
    personality: {
        label: 'Tính cách bản thân',
        type: 'text',
        placeholder: 'Thân thiện, kiên nhẫn, lắng nghe tốt...',
        required: false
    },
    strengths: {
        label: 'Thế mạnh',
        type: 'textarea',
        placeholder: 'Sản phẩm chuyên, kỹ năng nổi bật...',
        required: false
    },

    // Điểm cần cải thiện
    improvements: {
        label: 'Điểm muốn cải thiện',
        type: 'textarea',
        placeholder: 'Xử lý từ chối, chốt sale...',
        required: false
    }
} as const;

export const DEFAULT_ADVISOR_PROFILE = {
    name: '',
    gender: '',
    age: '',
    experienceMonths: '',
    personality: '',
    strengths: '',
    improvements: ''
};

// Relationship types between advisor and customer
export const RELATIONSHIP_TYPES = [
    { id: 'referral', label: 'Được giới thiệu', description: 'Khách hàng được người quen giới thiệu' },
    { id: 'acquaintance', label: 'Quen biết', description: 'Bạn bè, đồng nghiệp, hàng xóm...' },
    { id: 'cold', label: 'Cold call/Tiếp cận mới', description: 'Chưa từng gặp, tiếp cận lần đầu' },
    { id: 'existing', label: 'Khách hàng cũ', description: 'Đã từng tư vấn hoặc đã mua sản phẩm' },
    { id: 'event', label: 'Gặp tại sự kiện', description: 'Booth, hội thảo, triển lãm...' }
] as const;
