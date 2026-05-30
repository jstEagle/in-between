type LanguagePack = {
  webNouns: string[];
  interfaceNouns: string[];
  genreNouns: string[];
  adjectives: string[];
  verbs: string[];
  timeFragments: string[];
  contaminationFragments: string[];
  formLabels: {
    checkIn: string;
    checkOut: string;
    guests: string;
    preferredHallway: string;
    rememberFloor: string;
    searchSuite: string;
    emailUpdates: string;
    deliveryWindow: string;
  };
  genericLabels: {
    openGuestDirectory: string;
    desk: string;
    column: string;
    signedInAsGuest: string;
    editions: string;
    featuredDepartments: string;
    localPortal: string;
    alsoInCheckout: string;
    relatedRoomPosts: string;
    openDirectory: string;
    lastChecked: string;
    accountSurface: string;
    guestbookPolicySitemap: string;
    language: string;
    support: string;
    mediaMetadataRetainedIn: string;
    freeShipping: string;
    ends: string;
    continueShoppingLater: string;
    add: string;
  };
};

export const asiaLanguagePacks: Record<string, LanguagePack> = {
  Japanese: {
    webNouns: ["アカウント", "カート", "ポータル", "ダウンロード", "更新", "チェックアウト", "ディレクトリ", "ゲストブック", "索引"],
    interfaceNouns: ["タブ", "モーダル", "サイドバー", "サムネイル", "バナー", "フィード", "プロフィール", "リスト", "ウィジェット"],
    genreNouns: ["スイート", "記事", "商品", "エピソード", "投稿", "予約", "レビュー", "マニュアル", "バンドル"],
    adjectives: ["なじみのある", "静かな", "公式の", "あたたかい", "見つからない", "利用可能な", "やわらかな", "近くの", "以前の"],
    verbs: ["見つける", "比較する", "予約する", "続ける", "確認する", "更新する", "探す", "復元する"],
    timeFragments: ["今日", "あとで", "すでに", "2006年から", "明日の朝", "見出しのあと", "チェックアウト前"],
    contaminationFragments: ["おすすめ", "予約を続ける", "前のタブ", "近くのアカウント", "ローカル索引"],
    formLabels: {
      checkIn: "チェックイン",
      checkOut: "チェックアウト",
      guests: "ゲスト数",
      preferredHallway: "希望する廊下",
      rememberFloor: "階を記憶",
      searchSuite: "スイートを検索",
      emailUpdates: "建物の更新メール",
      deliveryWindow: "配送時間帯"
    },
    genericLabels: {
      openGuestDirectory: "ゲストディレクトリを開く",
      desk: "デスク",
      column: "列",
      signedInAsGuest: "ゲストとしてサインイン中",
      editions: "版",
      featuredDepartments: "注目部門",
      localPortal: "ローカルポータル",
      alsoInCheckout: "チェックアウトにもあります",
      relatedRoomPosts: "関連する部屋の投稿",
      openDirectory: "ディレクトリを開く",
      lastChecked: "最終確認",
      accountSurface: "アカウント画面",
      guestbookPolicySitemap: "ゲストブック、ポリシー、サイトマップ",
      language: "言語",
      support: "サポート",
      mediaMetadataRetainedIn: "メディアのメタデータ保持先",
      freeShipping: "送料無料",
      ends: "終了",
      continueShoppingLater: "あとで買い物を続ける",
      add: "追加"
    }
  },
  Korean: {
    webNouns: ["계정", "장바구니", "포털", "다운로드", "업데이트", "결제", "디렉터리", "방명록", "색인"],
    interfaceNouns: ["탭", "모달", "사이드바", "썸네일", "배너", "피드", "프로필", "목록", "위젯"],
    genreNouns: ["스위트", "기사", "상품", "에피소드", "게시물", "예약", "리뷰", "매뉴얼", "번들"],
    adjectives: ["익숙한", "조용한", "공식적인", "따뜻한", "누락된", "이용 가능한", "부드러운", "근처의", "이전의"],
    verbs: ["찾기", "비교하기", "예약하기", "계속하기", "확인하기", "업데이트하기", "위치 찾기", "복원하기"],
    timeFragments: ["오늘", "나중에", "이미", "2006년부터", "내일 아침", "헤드라인 이후", "결제 전"],
    contaminationFragments: ["이전 계정", "조용한 예약", "로컬 피드", "근처 디렉터리", "계속 쇼핑"],
    formLabels: {
      checkIn: "체크인",
      checkOut: "체크아웃",
      guests: "게스트 수",
      preferredHallway: "선호 복도",
      rememberFloor: "층 기억",
      searchSuite: "스위트 검색",
      emailUpdates: "건물 업데이트 이메일",
      deliveryWindow: "배송 시간대"
    },
    genericLabels: {
      openGuestDirectory: "게스트 디렉터리 열기",
      desk: "데스크",
      column: "열",
      signedInAsGuest: "게스트로 로그인됨",
      editions: "판",
      featuredDepartments: "추천 부서",
      localPortal: "로컬 포털",
      alsoInCheckout: "결제에도 있음",
      relatedRoomPosts: "관련 방 게시물",
      openDirectory: "디렉터리 열기",
      lastChecked: "마지막 확인",
      accountSurface: "계정 화면",
      guestbookPolicySitemap: "방명록, 정책, 사이트맵",
      language: "언어",
      support: "지원",
      mediaMetadataRetainedIn: "미디어 메타데이터 보관 위치",
      freeShipping: "무료 배송",
      ends: "종료",
      continueShoppingLater: "나중에 쇼핑 계속하기",
      add: "추가"
    }
  },
  "Simplified Chinese": {
    webNouns: ["账户", "购物车", "门户", "下载", "更新", "结账", "目录", "访客簿", "索引"],
    interfaceNouns: ["标签页", "弹窗", "侧边栏", "缩略图", "横幅", "信息流", "个人资料", "列表", "小组件"],
    genreNouns: ["套件", "文章", "商品", "剧集", "帖子", "预订", "评论", "手册", "捆绑包"],
    adjectives: ["熟悉的", "安静的", "官方的", "温暖的", "缺失的", "可用的", "柔和的", "附近的", "以前的"],
    verbs: ["发现", "比较", "预订", "继续", "确认", "更新", "定位", "恢复"],
    timeFragments: ["今天", "稍后", "已经", "自2006年以来", "明天早上", "头条之后", "结账前"],
    contaminationFragments: ["继续预订", "附近账户", "旧目录", "本地信息流", "安静购物车"],
    formLabels: {
      checkIn: "入住",
      checkOut: "退房",
      guests: "访客人数",
      preferredHallway: "偏好走廊",
      rememberFloor: "记住楼层",
      searchSuite: "搜索套件",
      emailUpdates: "楼宇更新邮箱",
      deliveryWindow: "配送时间段"
    },
    genericLabels: {
      openGuestDirectory: "打开访客目录",
      desk: "服务台",
      column: "列",
      signedInAsGuest: "以访客身份登录",
      editions: "版本",
      featuredDepartments: "精选部门",
      localPortal: "本地门户",
      alsoInCheckout: "也在结账中",
      relatedRoomPosts: "相关房间帖子",
      openDirectory: "打开目录",
      lastChecked: "最后检查",
      accountSurface: "账户界面",
      guestbookPolicySitemap: "访客簿、政策、站点地图",
      language: "语言",
      support: "支持",
      mediaMetadataRetainedIn: "媒体元数据保留在",
      freeShipping: "免费配送",
      ends: "结束",
      continueShoppingLater: "稍后继续购物",
      add: "添加"
    }
  },
  Arabic: {
    webNouns: ["حساب", "عربة", "بوابة", "تنزيل", "تحديث", "دفع", "دليل", "سجل الزوار", "فهرس"],
    interfaceNouns: ["تبويب", "نافذة", "شريط جانبي", "صورة مصغرة", "لافتة", "موجز", "ملف شخصي", "قائمة", "أداة"],
    genreNouns: ["جناح", "مقال", "منتج", "حلقة", "منشور", "حجز", "مراجعة", "دليل استخدام", "حزمة"],
    adjectives: ["مألوف", "هادئ", "رسمي", "دافئ", "مفقود", "متاح", "ناعم", "قريب", "سابق"],
    verbs: ["اكتشف", "قارن", "احجز", "تابع", "أكد", "حدّث", "حدد", "استعد"],
    timeFragments: ["اليوم", "لاحقًا", "بالفعل", "منذ 2006", "صباح الغد", "بعد العناوين", "قبل الدفع"],
    contaminationFragments: ["حجز هادئ", "الحساب القريب", "افتح الدليل", "تابع الدفع", "الموجز المحلي"],
    formLabels: {
      checkIn: "تسجيل الوصول",
      checkOut: "تسجيل المغادرة",
      guests: "عدد الضيوف",
      preferredHallway: "الممر المفضل",
      rememberFloor: "تذكر الطابق",
      searchSuite: "البحث عن جناح",
      emailUpdates: "بريد تحديثات المبنى",
      deliveryWindow: "فترة التسليم"
    },
    genericLabels: {
      openGuestDirectory: "افتح دليل الضيوف",
      desk: "مكتب",
      column: "عمود",
      signedInAsGuest: "تم تسجيل الدخول كضيف",
      editions: "إصدارات",
      featuredDepartments: "الأقسام المميزة",
      localPortal: "البوابة المحلية",
      alsoInCheckout: "أيضًا في الدفع",
      relatedRoomPosts: "منشورات غرف ذات صلة",
      openDirectory: "افتح الدليل",
      lastChecked: "آخر فحص",
      accountSurface: "واجهة الحساب",
      guestbookPolicySitemap: "سجل الزوار، السياسة، خريطة الموقع",
      language: "اللغة",
      support: "الدعم",
      mediaMetadataRetainedIn: "بيانات الوسائط الوصفية محفوظة في",
      freeShipping: "شحن مجاني",
      ends: "ينتهي",
      continueShoppingLater: "تابع التسوق لاحقًا",
      add: "إضافة"
    }
  },
  Hindi: {
    webNouns: ["खाता", "कार्ट", "पोर्टल", "डाउनलोड", "अपडेट", "चेकआउट", "डायरेक्टरी", "अतिथि पुस्तिका", "सूचकांक"],
    interfaceNouns: ["टैब", "मोडल", "साइडबार", "थंबनेल", "बैनर", "फीड", "प्रोफाइल", "सूची", "विजेट"],
    genreNouns: ["सुइट", "लेख", "उत्पाद", "एपिसोड", "पोस्ट", "बुकिंग", "समीक्षा", "मैनुअल", "बंडल"],
    adjectives: ["परिचित", "शांत", "आधिकारिक", "गरमजोशी वाला", "गुम", "उपलब्ध", "नरम", "पास का", "पिछला"],
    verbs: ["खोजें", "तुलना करें", "आरक्षित करें", "जारी रखें", "पुष्टि करें", "अपडेट करें", "स्थान खोजें", "पुनर्स्थापित करें"],
    timeFragments: ["आज", "बाद में", "पहले से", "2006 से", "कल सुबह", "सुर्खियों के बाद", "चेकआउट से पहले"],
    contaminationFragments: ["पास का खाता", "शांत बुकिंग", "स्थानीय फीड", "डायरेक्टरी खोलें", "खरीदारी जारी रखें"],
    formLabels: {
      checkIn: "चेक इन",
      checkOut: "चेक आउट",
      guests: "अतिथियों की संख्या",
      preferredHallway: "पसंदीदा गलियारा",
      rememberFloor: "मंजिल याद रखें",
      searchSuite: "सुइट खोजें",
      emailUpdates: "भवन अपडेट ईमेल",
      deliveryWindow: "डिलीवरी समय"
    },
    genericLabels: {
      openGuestDirectory: "अतिथि डायरेक्टरी खोलें",
      desk: "डेस्क",
      column: "कॉलम",
      signedInAsGuest: "अतिथि के रूप में साइन इन",
      editions: "संस्करण",
      featuredDepartments: "विशेष विभाग",
      localPortal: "स्थानीय पोर्टल",
      alsoInCheckout: "चेकआउट में भी",
      relatedRoomPosts: "संबंधित कमरे की पोस्ट",
      openDirectory: "डायरेक्टरी खोलें",
      lastChecked: "अंतिम जांच",
      accountSurface: "खाता सतह",
      guestbookPolicySitemap: "अतिथि पुस्तिका, नीति, साइटमैप",
      language: "भाषा",
      support: "सहायता",
      mediaMetadataRetainedIn: "मीडिया मेटाडेटा इसमें रखा गया",
      freeShipping: "मुफ्त शिपिंग",
      ends: "समाप्त",
      continueShoppingLater: "बाद में खरीदारी जारी रखें",
      add: "जोड़ें"
    }
  }
};
