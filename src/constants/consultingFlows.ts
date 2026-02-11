// Consulting flows definition for New Customer and ECM

export const FLOW_TYPES = {
    NEW_CUSTOMER: 'new_customer',
    ECM: 'ecm'
} as const;

export const SEGMENT_TYPES = {
    MASS_MARKET: 'mass_market',
    HNW: 'hnw'
} as const;

export const NEW_CUSTOMER_STAGES = [
    {
        id: 'opening',
        name: 'Mở đầu & Tạo thiện cảm',
        description: 'Chào hỏi, tạo ấn tượng ban đầu, xây dựng mối quan hệ',
        tips: ['Tạo không khí thoải mái', 'Tìm điểm chung', 'Lắng nghe chủ động']
    },
    {
        id: 'need_discovery',
        name: 'Khơi gợi & Thăm dò nhu cầu',
        description: 'Đặt câu hỏi thăm dò, tìm pain points và nỗi lo lắng',
        tips: ['Hỏi mở', 'Không ngắt lời', 'Ghi nhận cảm xúc']
    },
    {
        id: 'need_analysis',
        name: 'Phân tích nhu cầu',
        description: 'Tổng hợp thông tin, giúp khách nhận ra nhu cầu ẩn',
        tips: ['Tóm tắt những gì đã nghe', 'Kết nối với giải pháp', 'Xác nhận lại hiểu đúng']
    },
    {
        id: 'solution_presentation',
        name: 'Trình bày giải pháp',
        description: 'Giới thiệu sản phẩm, nêu bật quyền lợi và giá trị',
        tips: ['Tập trung vào lợi ích', 'Dùng số liệu cụ thể', 'Liên hệ với nhu cầu đã khám phá']
    },
    {
        id: 'objection_handling',
        name: 'Xử lý từ chối',
        description: 'Đối mặt và xử lý các phản đối từ khách hàng',
        tips: ['Đồng cảm trước', 'Không phản bác trực tiếp', 'Đặt câu hỏi làm rõ']
    },
    {
        id: 'closing',
        name: 'Chốt sale',
        description: 'Nhận diện tín hiệu mua hàng, chốt đơn',
        tips: ['Nhận diện buying signals', 'Đề xuất bước tiếp theo', 'Tạo urgency hợp lý']
    },
    {
        id: 'follow_up',
        name: 'Follow-up',
        description: 'Liên hệ lại, xử lý khách đang suy nghĩ',
        tips: ['Theo dõi đúng hẹn', 'Cung cấp thêm thông tin', 'Duy trì mối quan hệ']
    }
] as const;

export const ECM_STAGES = [
    {
        id: 're_engagement',
        name: 'Kết nối lại',
        description: 'Chào hỏi khách hàng cũ, cập nhật tình hình',
        tips: ['Nhắc lại mối quan hệ', 'Hỏi thăm chân thành', 'Cảm ơn sự tin tưởng']
    },
    {
        id: 'policy_review',
        name: 'Kiểm tra hợp đồng hiện tại',
        description: 'Nhắc lại quyền lợi, xác nhận thông tin còn chính xác',
        tips: ['Tóm tắt quyền lợi đang có', 'Cập nhật thay đổi sản phẩm', 'Kiểm tra thông tin liên lạc']
    },
    {
        id: 'need_rediscovery',
        name: 'Khám phá nhu cầu mới',
        description: 'Tìm hiểu thay đổi trong cuộc sống, gaps trong coverage',
        tips: ['Hỏi về life events', 'Đánh giá lại nhu cầu', 'Phát hiện gaps bảo hiểm']
    },
    {
        id: 'upsell_crosssell',
        name: 'Đề xuất nâng cấp/mua thêm',
        description: 'Giới thiệu sản phẩm bổ sung, đề xuất nâng cấp',
        tips: ['Kết nối với nhu cầu mới', 'Nêu giá trị gia tăng', 'Đề xuất gói bundle']
    },
    {
        id: 'ecm_objection_handling',
        name: 'Xử lý từ chối ECM',
        description: 'Xử lý phản đối đặc thù khách hàng cũ',
        tips: ['Công nhận đã có coverage', 'Giải thích gaps', 'Dùng relationship leverage']
    },
    {
        id: 'closing_referral',
        name: 'Chốt & Xin giới thiệu',
        description: 'Chốt bán thêm, xin referral',
        tips: ['Tổng kết giá trị', 'Xin giới thiệu tự nhiên', 'Lên lịch gặp định kỳ']
    }
] as const;

export type FlowType = typeof FLOW_TYPES[keyof typeof FLOW_TYPES];

export const getStagesForFlow = (flowType: string) => {
    return flowType === FLOW_TYPES.ECM ? ECM_STAGES : NEW_CUSTOMER_STAGES;
};

// Get flow info by type
export const getFlowById = (flowType: string) => {
    const flows: Record<string, { id: string; name: string; description: string }> = {
        [FLOW_TYPES.NEW_CUSTOMER]: {
            id: FLOW_TYPES.NEW_CUSTOMER,
            name: 'Khách hàng Mới',
            description: 'Luồng tư vấn cho khách hàng tiềm năng mới'
        },
        [FLOW_TYPES.ECM]: {
            id: FLOW_TYPES.ECM,
            name: 'ECM',
            description: 'Luồng cho khách hàng hiện hữu'
        }
    };
    return flows[flowType] || flows[FLOW_TYPES.NEW_CUSTOMER];
};
