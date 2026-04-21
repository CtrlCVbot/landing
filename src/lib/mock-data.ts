export interface PreviewMockData {
  readonly aiInput: {
    readonly message: string
  }
  readonly aiResult: {
    readonly categories: ReadonlyArray<{
      readonly id: 'departure' | 'destination' | 'cargo' | 'fare'
      readonly label: string
      readonly icon: string
      readonly buttons: ReadonlyArray<{
        readonly fieldKey: string
        readonly label: string
        readonly displayValue: string
        readonly status: 'pending' | 'applied'
      }>
    }>
  }
  readonly formData: {
    readonly pickup: {
      readonly company: string
      readonly address: string
      readonly date: string
      readonly time: string
    }
    readonly delivery: {
      readonly company: string
      readonly address: string
      readonly date: string
      readonly time: string
    }
    readonly vehicle: {
      readonly type: string
      readonly weight: string
    }
    readonly cargo: {
      readonly name: string
      readonly remark: string
    }
    readonly options: readonly string[]
    readonly estimate: {
      readonly distance: number
      readonly amount: number
    }
  }
  readonly tooltips: Readonly<Record<string, string>>
}

export const PREVIEW_MOCK_DATA: PreviewMockData = {
  aiInput: {
    message:
      '서울 강남구 물류센터에서 대전 유성구 산업단지로 5톤 카고 파레트 공산품 3파레트 보내주세요. 내일 오전 9시 상차, 직송 지게차 필요합니다.',
  },

  aiResult: {
    categories: [
      {
        id: 'departure',
        label: '상차지',
        icon: 'MapPin',
        buttons: [
          {
            fieldKey: 'departure-address1',
            label: '주소',
            displayValue: '서울 강남구 물류센터',
            status: 'pending',
          },
          {
            fieldKey: 'departure-datetime',
            label: '상차일시',
            displayValue: '내일 09:00',
            status: 'pending',
          },
        ],
      },
      {
        id: 'destination',
        label: '하차지',
        icon: 'Flag',
        buttons: [
          {
            fieldKey: 'destination-address1',
            label: '주소',
            displayValue: '대전 유성구 산업단지',
            status: 'pending',
          },
        ],
      },
      {
        id: 'cargo',
        label: '화물/차량',
        icon: 'Package',
        buttons: [
          {
            fieldKey: 'cargo-vehicleType',
            label: '차량종류',
            displayValue: '카고 5톤',
            status: 'pending',
          },
          {
            fieldKey: 'cargo-cargoName',
            label: '화물명',
            displayValue: '파레트 적재 공산품 3파레트',
            status: 'pending',
          },
        ],
      },
      {
        id: 'fare',
        label: '운임',
        icon: 'Banknote',
        buttons: [
          {
            fieldKey: 'fare-amount',
            label: '운임',
            displayValue: '420,000원',
            status: 'pending',
          },
        ],
      },
    ],
  },

  formData: {
    pickup: {
      company: '서울 강남구 물류센터',
      address: '서울특별시 강남구 삼성로 512',
      date: '2026-04-15',
      time: '09:00',
    },
    delivery: {
      company: '대전 유성구 산업단지',
      address: '대전광역시 유성구 테크노2로 65',
      date: '2026-04-15',
      time: '14:00',
    },
    vehicle: {
      type: '카고',
      weight: '5톤',
    },
    cargo: {
      name: '파레트 적재 공산품 3파레트',
      remark: '적재 높이 주의',
    },
    options: ['direct', 'forklift'],
    estimate: {
      distance: 160,
      amount: 420000,
    },
  },

  tooltips: {
    'ai-input': '카카오톡 메시지를 붙여넣으면 AI가 자동으로 분석합니다',
    'extract-button': '클릭 한 번으로 메시지에서 운송 정보를 추출합니다',
    'result-departure': 'AI가 추출한 상차지 정보를 폼에 자동 적용합니다',
    'result-destination': 'AI가 추출한 하차지 정보를 폼에 자동 적용합니다',
    'result-cargo': '차량 종류와 화물 정보를 자동으로 입력합니다',
    'result-fare': '예상 운임을 자동 계산하여 반영합니다',
    'cargo-info': '차량 타입, 중량, 화물 종류를 한 화면에서 관리합니다',
    'location-departure': '상차지 주소, 담당자, 연락처를 입력합니다',
    'location-destination': '하차지 주소, 담당자, 연락처를 입력합니다',
    'transport-options': '직송, 지게차 등 운송 옵션을 선택합니다',
    'estimate-info': '거리와 예상 운임이 자동 계산됩니다',
  },
} as const
