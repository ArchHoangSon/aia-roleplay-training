// Customer persona templates for Mass Market and HNW segments

export const MASS_MARKET_TEMPLATE = {
    // Thông tin cơ bản
    basicInfo: {
        name: '',
        age: 0,
        gender: '',
        occupation: '',
        jobTitle: '',
        monthlyIncome: 0,
        maritalStatus: '',
        numberOfChildren: 0
    },

    // Bối cảnh gia đình
    familyContext: {
        familyStructure: '', // Cấu trúc gia đình
        familyFinancialStatus: '', // Tình trạng tài chính gia đình
        financialResponsibilities: [] as string[], // Các gánh nặng tài chính
        dependents: [] as string[] // Người phụ thuộc
    },

    // Đặc điểm tâm lý & hành vi
    psychological: {
        personalityType: '', // cởi mở/kín đáo, quyết đoán/do dự
        attitudeTowardInsurance: '', // tích cực/trung lập/hoài nghi
        financialLiteracy: '', // thấp/trung bình/cao
        decisionMakingStyle: '', // nhanh/chậm, cần tham khảo
        communicationStyle: '' // logic/cảm xúc
    },

    // Nhu cầu & mối quan tâm
    needs: {
        financialGoals: [] as string[], // Mục tiêu tài chính
        mainConcerns: [] as string[], // Nỗi lo lắng chính
        previousInsuranceExperience: '', // Trải nghiệm với BH
        currentInsurance: [] as string[] // BH hiện có
    },

    // Hoàn cảnh đặc biệt
    specialCircumstances: {
        healthConditions: [] as string[], // Bệnh lý
        recentLifeEvents: [] as string[], // Sự kiện gần đây
        upcomingPlans: [] as string[] // Kế hoạch sắp tới
    }
};

export const HNW_TEMPLATE = {
    // Thông tin cơ bản
    basicInfo: {
        name: '',
        age: 0,
        gender: '',
        occupation: '', // CEO, chủ DN, chuyên gia...
        industry: '',
        wealthSource: '' // kinh doanh/thừa kế/đầu tư/nghề nghiệp
    },

    // Tình trạng tài chính
    financialStatus: {
        estimatedNetWorth: 0, // Tổng tài sản ước tính
        assetAllocation: {
            realEstate: 0,
            stocks: 0,
            cash: 0,
            business: 0,
            other: 0
        },
        annualIncome: 0,
        liquidityLevel: '' // % tài sản dễ chuyển đổi
    },

    // Bối cảnh gia đình & Thừa kế
    familyAndLegacy: {
        familyStructure: '', // Cấu trúc nhiều thế hệ
        inheritancePlan: '', // Kế hoạch thừa kế
        familyRelationships: '', // Hòa thuận/xung đột về tài sản
        hasFamilyTrust: false,
        heirs: [] as string[] // Người thừa kế
    },

    // Doanh nghiệp/Đầu tư
    business: {
        businessType: '',
        businessScale: '', // Quy mô
        roleInBusiness: '', // Vai trò
        successionPlan: '', // Kế hoạch kế thừa DN
        partners: [] as string[] // Đối tác/cổ đông
    },

    // Đặc điểm tâm lý HNW
    psychological: {
        serviceExpectation: '', // cao/rất cao
        trustLevel: '', // cần thời gian/đã có quan hệ
        decisionMakingStyle: '', // độc lập/tham khảo chuyên gia
        privacyConcern: '', // mức độ bảo mật
        experienceWithFinancialInstitutions: ''
    },

    // Nhu cầu đặc thù HNW
    hnwNeeds: {
        assetProtection: false, // Bảo vệ khỏi rủi ro pháp lý
        taxOptimization: false, // Tối ưu thuế
        wealthTransfer: false, // Chuyển giao liên thế hệ
        estateTaxFunding: false, // Tài trợ thuế thừa kế
        inheritanceEqualization: false, // Cân bằng thừa kế các con
        keyPersonInsurance: false, // BH key-person
        buySellAgreement: false, // Buy-sell agreement
        legacyPlanning: false // Từ thiện/legacy
    },

    // Hoàn cảnh đặc biệt
    specialCircumstances: {
        sellingBusiness: false,
        divorceAssetSplit: false,
        generationTransition: false,
        heirHealthIssues: false,
        otherCircumstances: [] as string[]
    }
};

export const PERSONA_LABELS = {
    // Personality types
    personalityTypes: [
        { value: 'skeptical', label: 'Hoài nghi', description: 'Hay hỏi ngược, đòi bằng chứng' },
        { value: 'avoidant', label: 'Né tránh', description: 'Trả lời mơ hồ, chuyển đề tài' },
        { value: 'analytical', label: 'Phân tích', description: 'Hỏi chi tiết số liệu' },
        { value: 'emotional', label: 'Cảm xúc', description: 'Phản ứng dựa trên câu chuyện' },
        { value: 'social_pressure', label: 'Áp lực xã hội', description: 'Cần hỏi ý kiến người khác' },
        { value: 'impatient', label: 'Thiếu kiên nhẫn', description: 'Muốn đi thẳng vấn đề' }
    ],

    // Attitude toward insurance
    attitudes: [
        { value: 'positive', label: 'Tích cực' },
        { value: 'neutral', label: 'Trung lập' },
        { value: 'skeptical', label: 'Hoài nghi' },
        { value: 'negative', label: 'Tiêu cực' }
    ],

    // Financial literacy
    financialLiteracy: [
        { value: 'low', label: 'Thấp' },
        { value: 'medium', label: 'Trung bình' },
        { value: 'high', label: 'Cao' }
    ]
} as const;
