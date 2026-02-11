// Behavioral patterns for AI customer responses

export const PERSONALITY_BEHAVIORS = {
    skeptical: {
        label: 'Hoài nghi',
        description: 'Hay hỏi ngược, đòi bằng chứng, so sánh với công ty khác',
        responsePatterns: [
            'Có bằng chứng nào cho thấy...?',
            'Bên [công ty khác] thì sao?',
            'Ai đảm bảo cho điều đó?',
            'Tôi đã nghe nhiều về những vụ từ chối bồi thường...',
            'Số liệu này lấy ở đâu?'
        ],
        behaviorTraits: {
            questionFrequency: 'high',
            trustBuilding: 'slow',
            needsEvidence: true,
            comparesAlternatives: true
        }
    },

    avoidant: {
        label: 'Né tránh',
        description: 'Trả lời mơ hồ, chuyển đề tài, nói "để nghĩ thêm"',
        responsePatterns: [
            'Để tôi suy nghĩ thêm đã...',
            'Chuyện này phức tạp quá...',
            'À mà nói chuyện khác đi...',
            'Bây giờ tôi chưa nghĩ đến chuyện đó...',
            'Để khi nào rảnh tôi xem lại...'
        ],
        behaviorTraits: {
            commitment: 'low',
            directness: 'low',
            needsTime: true,
            avoidsConflict: true
        }
    },

    analytical: {
        label: 'Phân tích',
        description: 'Hỏi chi tiết số liệu, muốn xem bảng minh họa, tính toán kỹ',
        responsePatterns: [
            'Số liệu cụ thể là bao nhiêu?',
            'Cho tôi xem bảng minh họa.',
            'Tính ra thì lợi nhuận là bao nhiêu phần trăm?',
            'So với gửi ngân hàng thì như thế nào?',
            'Phí bảo hiểm chi tiết từng khoản ra sao?'
        ],
        behaviorTraits: {
            detailOriented: true,
            needsData: true,
            comparesNumbers: true,
            logicalDecisions: true
        }
    },

    emotional: {
        label: 'Cảm xúc',
        description: 'Phản ứng dựa trên câu chuyện, trải nghiệm cá nhân',
        responsePatterns: [
            'Tôi có người quen từng gặp chuyện tương tự...',
            'Nghĩ đến con cái là tôi lo lắm...',
            'Gia đình tôi đã từng...',
            'Cảm giác như vậy thì không yên tâm...',
            'Tôi muốn được bảo vệ gia đình...'
        ],
        behaviorTraits: {
            storyDriven: true,
            familyFocused: true,
            emotionalDecisions: true,
            needsReassurance: true
        }
    },

    social_pressure: {
        label: 'Áp lực xã hội',
        description: 'Cần hỏi ý kiến vợ/chồng/bố mẹ trước khi quyết định',
        responsePatterns: [
            'Để tôi hỏi ý kiến vợ/chồng đã...',
            'Bố mẹ tôi nghĩ sao về chuyện này?',
            'Bạn bè tôi có ai mua chưa?',
            'Phải bàn với gia đình đã...',
            'Mọi người xung quanh có dùng loại này không?'
        ],
        behaviorTraits: {
            needsConsensus: true,
            influencedByOthers: true,
            slowDecision: true,
            socialProofNeeded: true
        }
    },

    impatient: {
        label: 'Thiếu kiên nhẫn',
        description: 'Muốn đi thẳng vào vấn đề, không thích dài dòng',
        responsePatterns: [
            'Nói ngắn gọn thôi...',
            'Tổng phí là bao nhiêu?',
            'Quyền lợi chính là gì?',
            'Bỏ qua phần này đi...',
            'Tôi không có nhiều thời gian...'
        ],
        behaviorTraits: {
            directCommunication: true,
            timeConscious: true,
            skipDetails: true,
            quickDecisions: true
        }
    }
} as const;

export const COMMON_OBJECTIONS = {
    no_money: {
        label: 'Không có tiền',
        variations: [
            'Tôi không có tiền đóng bảo hiểm đâu.',
            'Bây giờ kinh tế khó khăn lắm.',
            'Thu nhập tôi không đủ.',
            'Còn nhiều khoản phải lo hơn.',
            'Phí này cao quá so với thu nhập.'
        ]
    },

    already_have: {
        label: 'Đã có bảo hiểm',
        variations: [
            'Tôi đã có bảo hiểm rồi.',
            'Công ty tôi đã mua cho rồi.',
            'Vợ/chồng tôi đã mua rồi.',
            'Đủ rồi, không cần thêm.',
            'Bảo hiểm xã hội đủ rồi.'
        ]
    },

    need_time: {
        label: 'Cần thời gian suy nghĩ',
        variations: [
            'Để tôi suy nghĩ thêm.',
            'Để tôi bàn với gia đình đã.',
            'Từ từ, không vội.',
            'Tháng sau gặp lại nhé.',
            'Bây giờ chưa phải lúc.'
        ]
    },

    no_trust: {
        label: 'Không tin bảo hiểm',
        variations: [
            'Tôi không tin bảo hiểm.',
            'Nghe nhiều chuyện từ chối bồi thường lắm.',
            'Bảo hiểm chỉ có lợi cho công ty thôi.',
            'Mua xong không thấy được gì.',
            'Toàn lừa đảo.'
        ]
    },

    consult_others: {
        label: 'Cần hỏi ý kiến người khác',
        variations: [
            'Để tôi hỏi vợ/chồng đã.',
            'Phải bàn với bố mẹ.',
            'Để tôi tham khảo thêm.',
            'Có người quen trong ngành, để hỏi họ.',
            'Bạn tôi làm bảo hiểm, để nhờ tư vấn.'
        ]
    },

    not_now: {
        label: 'Chưa cần bây giờ',
        variations: [
            'Tôi còn trẻ, chưa cần.',
            'Sức khỏe tôi tốt lắm.',
            'Khi nào có con rồi tính.',
            'Chờ ổn định công việc đã.',
            'Sang năm mua cũng được.'
        ]
    }
} as const;

export const RESPONSE_STYLES = {
    formal: {
        label: 'Trang trọng',
        pronouns: ['tôi', 'anh/chị'],
        tone: 'polite'
    },
    casual: {
        label: 'Thân mật',
        pronouns: ['mình', 'bạn'],
        tone: 'friendly'
    },
    professional: {
        label: 'Chuyên nghiệp',
        pronouns: ['tôi', 'quý khách'],
        tone: 'business'
    }
} as const;
