type WorldMixedLanguageName =
  | "Russian"
  | "Ukrainian"
  | "Indonesian"
  | "Vietnamese"
  | "Thai";

type WorldMixedLabelKey =
  | "openGuestDirectory"
  | "desk"
  | "column"
  | "signedInAsGuest"
  | "editions"
  | "featuredDepartments"
  | "localPortal"
  | "alsoInCheckout"
  | "relatedRoomPosts"
  | "openDirectory"
  | "lastChecked"
  | "accountSurface"
  | "guestbookPolicySitemap"
  | "language"
  | "support"
  | "mediaMetadataRetainedIn"
  | "freeShipping"
  | "ends"
  | "continueShoppingLater"
  | "add";

type WorldMixedLanguagePack = {
  webNouns: string[];
  interfaceNouns: string[];
  genreNouns: string[];
  adjectives: string[];
  verbs: string[];
  timeFragments: string[];
  contaminationFragments: string[];
  formLabels: Partial<Record<WorldMixedLabelKey, string>>;
  genericLabels: Record<WorldMixedLabelKey, string>;
};

export const worldMixedLanguagePacks = {
  Russian: {
    webNouns: [
      "сайт",
      "портал",
      "каталог",
      "лента",
      "страница",
      "профиль",
      "витрина",
      "архив",
      "форум",
      "гостевая книга"
    ],
    interfaceNouns: [
      "кнопка",
      "панель",
      "меню",
      "вкладка",
      "окно",
      "поле",
      "карточка",
      "столбец",
      "метка",
      "переключатель"
    ],
    genreNouns: [
      "новости",
      "объявления",
      "комментарии",
      "обзор",
      "каталог",
      "афиша",
      "покупки",
      "сообщество",
      "справочник",
      "журнал"
    ],
    adjectives: [
      "местный",
      "тихий",
      "поздний",
      "временный",
      "архивный",
      "общественный",
      "свободный",
      "соседний",
      "проверенный",
      "смешанный"
    ],
    verbs: [
      "открыть",
      "добавить",
      "проверить",
      "подписать",
      "продолжить",
      "сохранить",
      "выбрать",
      "показать",
      "обновить",
      "закрыть"
    ],
    timeFragments: [
      "сегодня утром",
      "в конце недели",
      "после проверки",
      "до полуночи",
      "вчера вечером",
      "через час",
      "к следующему выпуску",
      "пока открыта стойка"
    ],
    contaminationFragments: [
      "устаревшая метка осталась в углу",
      "заголовок смешался с текстом кнопки",
      "архивная дата просочилась в меню",
      "перевод сохранил служебную пометку",
      "номер колонки попал в название",
      "гостевой статус повторился дважды"
    ],
    formLabels: {
      language: "Язык",
      support: "Поддержка",
      add: "Добавить",
      openDirectory: "Открыть каталог",
      openGuestDirectory: "Открыть гостевой каталог",
      continueShoppingLater: "Продолжить покупки позже"
    },
    genericLabels: {
      openGuestDirectory: "Открыть гостевой каталог",
      desk: "стойка",
      column: "столбец",
      signedInAsGuest: "Вход выполнен как гость",
      editions: "выпуски",
      featuredDepartments: "избранные отделы",
      localPortal: "местный портал",
      alsoInCheckout: "также при оформлении",
      relatedRoomPosts: "связанные записи комнаты",
      openDirectory: "Открыть каталог",
      lastChecked: "последняя проверка",
      accountSurface: "область аккаунта",
      guestbookPolicySitemap: "карта политики гостевой книги",
      language: "язык",
      support: "поддержка",
      mediaMetadataRetainedIn: "метаданные медиа сохранены в",
      freeShipping: "бесплатная доставка",
      ends: "заканчивается",
      continueShoppingLater: "Продолжить покупки позже",
      add: "добавить"
    }
  },
  Ukrainian: {
    webNouns: [
      "сайт",
      "портал",
      "каталог",
      "стрічка",
      "сторінка",
      "профіль",
      "вітрина",
      "архів",
      "форум",
      "гостьова книга"
    ],
    interfaceNouns: [
      "кнопка",
      "панель",
      "меню",
      "вкладка",
      "вікно",
      "поле",
      "картка",
      "стовпець",
      "позначка",
      "перемикач"
    ],
    genreNouns: [
      "новини",
      "оголошення",
      "коментарі",
      "огляд",
      "каталог",
      "афіша",
      "покупки",
      "спільнота",
      "довідник",
      "журнал"
    ],
    adjectives: [
      "місцевий",
      "тихий",
      "пізній",
      "тимчасовий",
      "архівний",
      "громадський",
      "вільний",
      "сусідній",
      "перевірений",
      "змішаний"
    ],
    verbs: [
      "відкрити",
      "додати",
      "перевірити",
      "підписати",
      "продовжити",
      "зберегти",
      "вибрати",
      "показати",
      "оновити",
      "закрити"
    ],
    timeFragments: [
      "сьогодні вранці",
      "наприкінці тижня",
      "після перевірки",
      "до півночі",
      "учора ввечері",
      "за годину",
      "до наступного випуску",
      "поки стійка відкрита"
    ],
    contaminationFragments: [
      "застаріла позначка лишилася в куті",
      "заголовок змішався з текстом кнопки",
      "архівна дата потрапила в меню",
      "переклад зберіг службову примітку",
      "номер стовпця опинився в назві",
      "гостьовий статус повторився двічі"
    ],
    formLabels: {
      language: "Мова",
      support: "Підтримка",
      add: "Додати",
      openDirectory: "Відкрити каталог",
      openGuestDirectory: "Відкрити гостьовий каталог",
      continueShoppingLater: "Продовжити покупки пізніше"
    },
    genericLabels: {
      openGuestDirectory: "Відкрити гостьовий каталог",
      desk: "стійка",
      column: "стовпець",
      signedInAsGuest: "Вхід виконано як гість",
      editions: "випуски",
      featuredDepartments: "вибрані відділи",
      localPortal: "місцевий портал",
      alsoInCheckout: "також під час оформлення",
      relatedRoomPosts: "пов'язані записи кімнати",
      openDirectory: "Відкрити каталог",
      lastChecked: "остання перевірка",
      accountSurface: "поверхня акаунта",
      guestbookPolicySitemap: "карта політики гостьової книги",
      language: "мова",
      support: "підтримка",
      mediaMetadataRetainedIn: "метадані медіа збережено в",
      freeShipping: "безкоштовна доставка",
      ends: "закінчується",
      continueShoppingLater: "Продовжити покупки пізніше",
      add: "додати"
    }
  },
  Indonesian: {
    webNouns: [
      "situs",
      "portal",
      "direktori",
      "linimasa",
      "halaman",
      "profil",
      "etalase",
      "arsip",
      "forum",
      "buku tamu"
    ],
    interfaceNouns: [
      "tombol",
      "panel",
      "menu",
      "tab",
      "jendela",
      "kolom isian",
      "kartu",
      "kolom",
      "label",
      "saklar"
    ],
    genreNouns: [
      "berita",
      "pengumuman",
      "komentar",
      "ulasan",
      "katalog",
      "agenda",
      "belanja",
      "komunitas",
      "panduan",
      "majalah"
    ],
    adjectives: [
      "lokal",
      "tenang",
      "terlambat",
      "sementara",
      "arsip",
      "publik",
      "gratis",
      "tetangga",
      "terverifikasi",
      "campuran"
    ],
    verbs: [
      "membuka",
      "menambahkan",
      "memeriksa",
      "menandatangani",
      "melanjutkan",
      "menyimpan",
      "memilih",
      "menampilkan",
      "memperbarui",
      "menutup"
    ],
    timeFragments: [
      "pagi ini",
      "di akhir minggu",
      "setelah pemeriksaan",
      "sebelum tengah malam",
      "kemarin malam",
      "dalam satu jam",
      "untuk edisi berikutnya",
      "selama meja masih buka"
    ],
    contaminationFragments: [
      "label lama tertinggal di sudut",
      "judul bercampur dengan teks tombol",
      "tanggal arsip masuk ke menu",
      "terjemahan menyimpan catatan sistem",
      "nomor kolom terbawa ke nama",
      "status tamu muncul dua kali"
    ],
    formLabels: {
      language: "Bahasa",
      support: "Dukungan",
      add: "Tambah",
      openDirectory: "Buka direktori",
      openGuestDirectory: "Buka direktori tamu",
      continueShoppingLater: "Lanjutkan belanja nanti"
    },
    genericLabels: {
      openGuestDirectory: "Buka direktori tamu",
      desk: "meja",
      column: "kolom",
      signedInAsGuest: "Masuk sebagai tamu",
      editions: "edisi",
      featuredDepartments: "departemen unggulan",
      localPortal: "portal lokal",
      alsoInCheckout: "juga di checkout",
      relatedRoomPosts: "postingan ruang terkait",
      openDirectory: "Buka direktori",
      lastChecked: "terakhir diperiksa",
      accountSurface: "permukaan akun",
      guestbookPolicySitemap: "peta situs kebijakan buku tamu",
      language: "bahasa",
      support: "dukungan",
      mediaMetadataRetainedIn: "metadata media disimpan di",
      freeShipping: "pengiriman gratis",
      ends: "berakhir",
      continueShoppingLater: "Lanjutkan belanja nanti",
      add: "tambah"
    }
  },
  Vietnamese: {
    webNouns: [
      "trang web",
      "cổng thông tin",
      "thư mục",
      "dòng tin",
      "trang",
      "hồ sơ",
      "gian hàng",
      "kho lưu trữ",
      "diễn đàn",
      "sổ khách"
    ],
    interfaceNouns: [
      "nút",
      "bảng điều khiển",
      "menu",
      "thẻ",
      "cửa sổ",
      "trường",
      "thẻ nội dung",
      "cột",
      "nhãn",
      "công tắc"
    ],
    genreNouns: [
      "tin tức",
      "thông báo",
      "bình luận",
      "đánh giá",
      "danh mục",
      "lịch sự kiện",
      "mua sắm",
      "cộng đồng",
      "sổ tay",
      "tạp chí"
    ],
    adjectives: [
      "địa phương",
      "yên tĩnh",
      "muộn",
      "tạm thời",
      "lưu trữ",
      "công cộng",
      "miễn phí",
      "lân cận",
      "đã kiểm tra",
      "pha trộn"
    ],
    verbs: [
      "mở",
      "thêm",
      "kiểm tra",
      "ký",
      "tiếp tục",
      "lưu",
      "chọn",
      "hiển thị",
      "cập nhật",
      "đóng"
    ],
    timeFragments: [
      "sáng nay",
      "cuối tuần này",
      "sau khi kiểm tra",
      "trước nửa đêm",
      "tối qua",
      "trong một giờ nữa",
      "cho ấn bản tiếp theo",
      "khi quầy còn mở"
    ],
    contaminationFragments: [
      "nhãn cũ còn lại ở góc",
      "tiêu đề lẫn vào chữ trên nút",
      "ngày lưu trữ lọt vào menu",
      "bản dịch giữ lại ghi chú hệ thống",
      "số cột trôi vào tên gọi",
      "trạng thái khách lặp lại hai lần"
    ],
    formLabels: {
      language: "Ngôn ngữ",
      support: "Hỗ trợ",
      add: "Thêm",
      openDirectory: "Mở thư mục",
      openGuestDirectory: "Mở thư mục khách",
      continueShoppingLater: "Tiếp tục mua sắm sau"
    },
    genericLabels: {
      openGuestDirectory: "Mở thư mục khách",
      desk: "quầy",
      column: "cột",
      signedInAsGuest: "Đã đăng nhập với tư cách khách",
      editions: "ấn bản",
      featuredDepartments: "bộ phận nổi bật",
      localPortal: "cổng địa phương",
      alsoInCheckout: "cũng trong thanh toán",
      relatedRoomPosts: "bài đăng phòng liên quan",
      openDirectory: "Mở thư mục",
      lastChecked: "kiểm tra lần cuối",
      accountSurface: "bề mặt tài khoản",
      guestbookPolicySitemap: "sơ đồ chính sách sổ khách",
      language: "ngôn ngữ",
      support: "hỗ trợ",
      mediaMetadataRetainedIn: "siêu dữ liệu phương tiện được giữ trong",
      freeShipping: "miễn phí vận chuyển",
      ends: "kết thúc",
      continueShoppingLater: "Tiếp tục mua sắm sau",
      add: "thêm"
    }
  },
  Thai: {
    webNouns: [
      "เว็บไซต์",
      "พอร์ทัล",
      "ไดเรกทอรี",
      "ฟีด",
      "หน้า",
      "โปรไฟล์",
      "หน้าร้าน",
      "คลังเก็บ",
      "ฟอรัม",
      "สมุดเยี่ยม"
    ],
    interfaceNouns: [
      "ปุ่ม",
      "แผง",
      "เมนู",
      "แท็บ",
      "หน้าต่าง",
      "ช่องกรอก",
      "การ์ด",
      "คอลัมน์",
      "ป้ายกำกับ",
      "สวิตช์"
    ],
    genreNouns: [
      "ข่าว",
      "ประกาศ",
      "ความคิดเห็น",
      "รีวิว",
      "แค็ตตาล็อก",
      "กำหนดการ",
      "ช็อปปิง",
      "ชุมชน",
      "คู่มือ",
      "นิตยสาร"
    ],
    adjectives: [
      "ท้องถิ่น",
      "เงียบ",
      "ล่าช้า",
      "ชั่วคราว",
      "เก็บถาวร",
      "สาธารณะ",
      "ฟรี",
      "ใกล้เคียง",
      "ตรวจสอบแล้ว",
      "ผสม"
    ],
    verbs: [
      "เปิด",
      "เพิ่ม",
      "ตรวจสอบ",
      "ลงชื่อ",
      "ดำเนินการต่อ",
      "บันทึก",
      "เลือก",
      "แสดง",
      "อัปเดต",
      "ปิด"
    ],
    timeFragments: [
      "เช้านี้",
      "ปลายสัปดาห์",
      "หลังการตรวจสอบ",
      "ก่อนเที่ยงคืน",
      "เมื่อคืน",
      "ภายในหนึ่งชั่วโมง",
      "สำหรับฉบับถัดไป",
      "ขณะที่โต๊ะยังเปิดอยู่"
    ],
    contaminationFragments: [
      "ป้ายเก่ายังค้างอยู่ที่มุม",
      "หัวเรื่องปนกับข้อความบนปุ่ม",
      "วันที่เก็บถาวรหลุดเข้าเมนู",
      "คำแปลยังมีบันทึกระบบติดมา",
      "หมายเลขคอลัมน์ไหลเข้าไปในชื่อ",
      "สถานะแขกซ้ำขึ้นมาสองครั้ง"
    ],
    formLabels: {
      language: "ภาษา",
      support: "การสนับสนุน",
      add: "เพิ่ม",
      openDirectory: "เปิดไดเรกทอรี",
      openGuestDirectory: "เปิดไดเรกทอรีแขก",
      continueShoppingLater: "เลือกซื้อต่อภายหลัง"
    },
    genericLabels: {
      openGuestDirectory: "เปิดไดเรกทอรีแขก",
      desk: "โต๊ะ",
      column: "คอลัมน์",
      signedInAsGuest: "ลงชื่อเข้าใช้ในฐานะแขก",
      editions: "ฉบับ",
      featuredDepartments: "แผนกเด่น",
      localPortal: "พอร์ทัลท้องถิ่น",
      alsoInCheckout: "รวมอยู่ในการชำระเงิน",
      relatedRoomPosts: "โพสต์ห้องที่เกี่ยวข้อง",
      openDirectory: "เปิดไดเรกทอรี",
      lastChecked: "ตรวจสอบล่าสุด",
      accountSurface: "พื้นที่บัญชี",
      guestbookPolicySitemap: "แผนผังนโยบายสมุดเยี่ยม",
      language: "ภาษา",
      support: "การสนับสนุน",
      mediaMetadataRetainedIn: "ข้อมูลเมตาสื่อถูกเก็บไว้ใน",
      freeShipping: "จัดส่งฟรี",
      ends: "สิ้นสุด",
      continueShoppingLater: "เลือกซื้อต่อภายหลัง",
      add: "เพิ่ม"
    }
  }
} satisfies Record<WorldMixedLanguageName, WorldMixedLanguagePack>;
