// Customer input form field definitions

// Personality types với detailed behavior patterns
export const PERSONALITY_TYPES = {
    skeptical: {
        label: 'Hoài nghi',
        description: 'Nghi ngờ động cơ của TVV, cần nhiều bằng chứng',
        behaviors: ['Đặt nhiều câu hỏi', 'Yêu cầu số liệu cụ thể', 'So sánh với các công ty khác']
    },
    analytical: {
        label: 'Phân tích',
        description: 'Cần logic, số liệu, so sánh chi tiết',
        behaviors: ['Muốn xem brochure', 'Hỏi về lãi suất chính xác', 'Cần thời gian suy nghĩ']
    },
    emotional: {
        label: 'Cảm xúc',
        description: 'Quyết định dựa trên cảm xúc, câu chuyện',
        behaviors: ['Chia sẻ về gia đình', 'Quan tâm đến story', 'Dễ bị ảnh hưởng bởi mối quan hệ']
    },
    avoidant: {
        label: 'Né tránh',
        description: 'Ngại ra quyết định, hay trì hoãn',
        behaviors: ['Nói "để suy nghĩ thêm"', 'Tìm lý do hoãn cuộc hẹn', 'Khó contact lại']
    },
    social_pressure: {
        label: 'Áp lực xã hội',
        description: 'Cần hỏi ý kiến người khác trước khi quyết định',
        behaviors: ['Đề cập vợ/chồng phải đồng ý', 'Hỏi bạn bè đã mua chưa', 'Cần social proof']
    },
    impatient: {
        label: 'Thiếu kiên nhẫn',
        description: 'Muốn nhanh, không thích nghe dài dòng',
        behaviors: ['Ngắt lời nếu TVV nói dài', 'Muốn biết tổng kết nhanh', 'Hay check đồng hồ']
    },
    friendly: {
        label: 'Thân thiện',
        description: 'Cởi mở, dễ nói chuyện nhưng có thể khó chốt',
        behaviors: ['Nói chuyện phiếm nhiều', 'Tạo quan hệ tốt', 'Không muốn làm mất lòng TVV']
    }
} as const;

// Trust levels với impact descriptions
export const TRUST_LEVELS = {
    1: {
        label: 'Rất thấp',
        description: 'Cảnh giác cao độ, nghi ngờ mọi thứ TVV nói',
        behaviors: ['Giữ khoảng cách', 'Ít chia sẻ thông tin cá nhân', 'Hay từ chối thẳng']
    },
    2: {
        label: 'Thấp',
        description: 'Hoài nghi nhưng còn cho cơ hội',
        behaviors: ['Hỏi nhiều câu hỏi kiểm tra', 'Cần chứng minh từng điểm', 'Dễ bị mất nếu TVV sai sót']
    },
    3: {
        label: 'Trung bình',
        description: 'Trung lập, chưa tin nhưng cũng không phản đối',
        behaviors: ['Lắng nghe nhưng chưa cam kết', 'Cần thêm thông tin', 'Cân nhắc nghiên túc']
    },
    4: {
        label: 'Khá cao',
        description: 'Có thiện cảm, sẵn sàng lắng nghe',
        behaviors: ['Chia sẻ thông tin cởi mở hơn', 'Đặt câu hỏi xây dựng', 'Quan tâm thực sự']
    },
    5: {
        label: 'Cao',
        description: 'Tin tưởng TVV, chỉ cần giải pháp phù hợp',
        behaviors: ['Chia sẻ cả lo lắng sâu xa', 'Sẵn sàng giới thiệu KH khác', 'Mở với đề xuất']
    }
} as const;

// Consultation context options
export const CONSULTATION_CONTEXTS = {
    meetingType: {
        label: 'Hình thức gặp',
        options: [
            { value: 'in_person_office', label: 'Gặp mặt - tại văn phòng TVV' },
            { value: 'in_person_customer', label: 'Gặp mặt - tại nhà/công ty KH' },
            { value: 'in_person_cafe', label: 'Gặp mặt - quán cafe/nơi công cộng' },
            { value: 'video_call', label: 'Online - Video call' },
            { value: 'phone_call', label: 'Qua điện thoại' }
        ]
    },
    meetingNature: {
        label: 'Tính chất cuộc gặp',
        options: [
            { value: 'first_cold', label: 'Lần đầu - Cold call/Tiếp cận mới' },
            { value: 'first_referral', label: 'Lần đầu - Được giới thiệu' },
            { value: 'first_event', label: 'Lần đầu - Gặp tại sự kiện' },
            { value: 'follow_up', label: 'Gặp lại - Follow up' },
            { value: 'presentation', label: 'Gặp lại - Trình bày giải pháp' },
            { value: 'closing', label: 'Gặp lại - Chốt deal' }
        ]
    },
    timeAvailable: {
        label: 'Thời gian KH có',
        options: [
            { value: 'limited', label: '15-20 phút (rất giới hạn)' },
            { value: 'moderate', label: '30-45 phút (vừa phải)' },
            { value: 'ample', label: '1 tiếng+ (thoải mái)' },
            { value: 'unknown', label: 'Không rõ' }
        ]
    }
} as const;

export const CUSTOMER_FORM_FIELDS = {
    // Thông tin cơ bản
    basic: {
        title: 'Thông tin cơ bản',
        fields: {
            name: {
                label: 'Tên khách hàng',
                type: 'text',
                placeholder: 'Anh Minh, Chị Lan...',
                required: true,
                hint: 'Cách xưng hô bạn sẽ dùng'
            },
            age: {
                label: 'Tuổi',
                type: 'number',
                placeholder: '35',
                required: false
            },
            gender: {
                label: 'Giới tính',
                type: 'select',
                options: ['Nam', 'Nữ'],
                required: false
            },
            occupation: {
                label: 'Nghề nghiệp',
                type: 'text',
                placeholder: 'Nhân viên IT, Chủ doanh nghiệp...',
                required: false
            },
            incomeRange: {
                label: 'Thu nhập ước tính',
                type: 'select',
                options: [
                    'Dưới 15 triệu/tháng',
                    '15-30 triệu/tháng',
                    '30-50 triệu/tháng',
                    '50-100 triệu/tháng',
                    'Trên 100 triệu/tháng',
                    'Không rõ'
                ],
                required: false
            }
        }
    },

    // Gia đình
    family: {
        title: 'Gia đình',
        fields: {
            maritalStatus: {
                label: 'Tình trạng hôn nhân',
                type: 'select',
                options: ['Độc thân', 'Đã kết hôn', 'Ly hôn/Góa', 'Không rõ'],
                required: false
            },
            children: {
                label: 'Số con',
                type: 'number',
                placeholder: '2',
                required: false
            },
            childrenAges: {
                label: 'Tuổi các con',
                type: 'text',
                placeholder: '5 tuổi, 10 tuổi...',
                required: false
            },
            dependents: {
                label: 'Người phụ thuộc khác',
                type: 'text',
                placeholder: 'Bố mẹ già, em nhỏ...',
                required: false
            }
        }
    },

    // Tính cách & Mức độ tin tưởng (MỚI)
    psychology: {
        title: 'Tâm lý khách hàng',
        fields: {
            personality: {
                label: 'Tính cách',
                type: 'select',
                options: Object.entries(PERSONALITY_TYPES).map(([key, val]) => ({
                    value: key,
                    label: `${val.label} - ${val.description}`
                })),
                required: false,
                hint: 'Ảnh hưởng cách KH phản ứng và ra quyết định'
            },
            trustLevel: {
                label: 'Mức độ tin tưởng TVV',
                type: 'select',
                options: Object.entries(TRUST_LEVELS).map(([key, val]) => ({
                    value: key,
                    label: `${key}/5 - ${val.label}: ${val.description}`
                })),
                required: false,
                hint: 'Ảnh hưởng mạnh đến cởi mở và hợp tác'
            }
        }
    },

    // Bối cảnh tư vấn (NÂNG CẤP)
    context: {
        title: 'Bối cảnh tư vấn',
        fields: {
            meetingType: {
                label: 'Hình thức gặp',
                type: 'select',
                options: CONSULTATION_CONTEXTS.meetingType.options.map(o => o.label),
                optionValues: CONSULTATION_CONTEXTS.meetingType.options.map(o => o.value),
                required: false
            },
            meetingNature: {
                label: 'Tính chất cuộc gặp',
                type: 'select',
                options: CONSULTATION_CONTEXTS.meetingNature.options.map(o => o.label),
                optionValues: CONSULTATION_CONTEXTS.meetingNature.options.map(o => o.value),
                required: false
            },
            timeAvailable: {
                label: 'Thời gian KH có',
                type: 'select',
                options: CONSULTATION_CONTEXTS.timeAvailable.options.map(o => o.label),
                optionValues: CONSULTATION_CONTEXTS.timeAvailable.options.map(o => o.value),
                required: false
            },
            relationship: {
                label: 'Mối quan hệ với bạn',
                type: 'select',
                options: [
                    'Được giới thiệu',
                    'Quen biết (bạn bè, đồng nghiệp...)',
                    'Cold call/Tiếp cận mới',
                    'Khách hàng cũ',
                    'Gặp tại sự kiện'
                ],
                required: false
            },
            referrer: {
                label: 'Người giới thiệu (nếu có)',
                type: 'text',
                placeholder: 'Anh Hùng - bạn đại học của KH',
                required: false
            },
            circumstances: {
                label: 'Hoàn cảnh đặc biệt',
                type: 'textarea',
                placeholder: 'Vợ mới sinh, bố vừa mất, mới mua nhà trả góp...',
                required: false
            },
            knownNeeds: {
                label: 'Nhu cầu đã biết (nếu có)',
                type: 'textarea',
                placeholder: 'Đã hỏi về bảo hiểm y tế, muốn tiết kiệm cho con học đại học...',
                required: false
            }
        }
    },

    // Thông tin bổ sung (cho HNW)
    hnw: {
        title: 'Thông tin bổ sung (HNW)',
        showFor: 'hnw',
        fields: {
            netWorth: {
                label: 'Tài sản ước tính',
                type: 'select',
                options: [
                    '5-20 tỷ',
                    '20-50 tỷ',
                    '50-100 tỷ',
                    'Trên 100 tỷ',
                    'Không rõ'
                ],
                required: false
            },
            businessOwner: {
                label: 'Có sở hữu doanh nghiệp?',
                type: 'select',
                options: ['Có', 'Không', 'Không rõ'],
                required: false
            },
            businessType: {
                label: 'Loại hình kinh doanh',
                type: 'text',
                placeholder: 'Bất động sản, Xuất nhập khẩu...',
                required: false
            },
            existingInsurance: {
                label: 'Bảo hiểm hiện có',
                type: 'textarea',
                placeholder: 'Đã có BH nhân thọ 2 tỷ, BH sức khỏe Bảo Việt...',
                required: false
            }
        }
    }
} as const;

export const DEFAULT_CUSTOMER_DATA = {
    // Basic
    name: '',
    age: '',
    gender: '',
    occupation: '',
    incomeRange: '',
    // Family
    maritalStatus: '',
    children: '',
    childrenAges: '',
    dependents: '',
    // Psychology (NEW)
    personality: '',
    trustLevel: '',
    // Context (ENHANCED)
    meetingType: '',
    meetingNature: '',
    timeAvailable: '',
    relationship: '',
    referrer: '',
    circumstances: '',
    knownNeeds: '',
    // HNW
    netWorth: '',
    businessOwner: '',
    businessType: '',
    existingInsurance: ''
};
