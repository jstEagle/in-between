type EuropeMixedLanguageName = "Dutch" | "Swedish" | "Polish" | "Turkish" | "Greek";

type GenericLabelKey =
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

type EuropeMixedLanguagePack = {
  webNouns: readonly string[];
  interfaceNouns: readonly string[];
  genreNouns: readonly string[];
  adjectives: readonly string[];
  verbs: readonly string[];
  timeFragments: readonly string[];
  contaminationFragments: readonly string[];
  formLabels: Record<string, string>;
  genericLabels: Record<GenericLabelKey, string>;
};

export const europeMixedLanguagePacks = {
  Dutch: {
    webNouns: ["account", "winkelwagen", "portaal", "download", "update", "checkout", "gids", "gastenboek", "index", "startpagina"],
    interfaceNouns: ["tabblad", "venster", "zijbalk", "miniatuur", "banner", "feed", "profiel", "vermelding", "widget", "kolom"],
    genreNouns: ["suite", "artikel", "product", "aflevering", "bericht", "boeking", "beoordeling", "handleiding", "bundel", "afdeling"],
    adjectives: ["stil", "vertrouwd", "officieel", "warm", "ontbrekend", "beschikbaar", "nabij", "vorig", "lokaal", "zacht"],
    verbs: ["openen", "vergelijken", "reserveren", "doorgaan", "bevestigen", "bijwerken", "vinden", "herstellen", "toevoegen", "bekijken"],
    timeFragments: ["vandaag", "later", "al sinds 2006", "morgen vroeg", "na de koppen", "voor de checkout", "deze avond", "vorige week"],
    contaminationFragments: ["stille aanbieding", "vorige kamer", "openbare tab", "lokale gids blijft open", "checkout later verderzetten"],
    formLabels: {
      checkIn: "Inchecken",
      checkOut: "Uitchecken",
      guests: "Aantal gasten",
      preferredHallway: "Voorkeursgang",
      rememberFloor: "Verdieping onthouden",
      searchSuite: "Suite zoeken",
      emailForUpdates: "E-mail voor gebouwupdates",
      deliveryWindow: "Leveringsvenster"
    },
    genericLabels: {
      openGuestDirectory: "Gastengids openen",
      desk: "Balie",
      column: "Kolom",
      signedInAsGuest: "Aangemeld als gast",
      editions: "Edities",
      featuredDepartments: "Uitgelichte afdelingen",
      localPortal: "Lokaal portaal",
      alsoInCheckout: "Ook in checkout",
      relatedRoomPosts: "Gerelateerde kamerberichten",
      openDirectory: "Gids openen",
      lastChecked: "Laatst gecontroleerd",
      accountSurface: "Accountoppervlak",
      guestbookPolicySitemap: "Gastenboek beleid sitemap",
      language: "Taal",
      support: "Ondersteuning",
      mediaMetadataRetainedIn: "Mediametadata bewaard in",
      freeShipping: "Gratis verzending",
      ends: "Eindigt",
      continueShoppingLater: "Later verder winkelen",
      add: "Toevoegen"
    }
  },
  Swedish: {
    webNouns: ["konto", "kundvagn", "portal", "nedladdning", "uppdatering", "kassa", "katalog", "gästbok", "index", "startsida"],
    interfaceNouns: ["flik", "modal", "sidofält", "miniatyr", "banner", "flöde", "profil", "listning", "widget", "kolumn"],
    genreNouns: ["svit", "artikel", "produkt", "avsnitt", "inlägg", "bokning", "recension", "manual", "paket", "avdelning"],
    adjectives: ["tyst", "bekant", "officiell", "varm", "saknad", "tillgänglig", "nära", "tidigare", "lokal", "mjuk"],
    verbs: ["öppna", "jämför", "reservera", "fortsätt", "bekräfta", "uppdatera", "hitta", "återställ", "lägg till", "visa"],
    timeFragments: ["idag", "senare", "redan sedan 2006", "i morgon bitti", "efter rubrikerna", "före kassan", "i kväll", "förra veckan"],
    contaminationFragments: ["tyst medlemskap", "lokal rubrik", "gammal katalog", "öppna gästboken igen", "fortsätt kassan senare"],
    formLabels: {
      checkIn: "Incheckning",
      checkOut: "Utcheckning",
      guests: "Antal gäster",
      preferredHallway: "Föredragen korridor",
      rememberFloor: "Kom ihåg våning",
      searchSuite: "Sök svit",
      emailForUpdates: "E-post för byggnadsuppdateringar",
      deliveryWindow: "Leveransfönster"
    },
    genericLabels: {
      openGuestDirectory: "Öppna gästkatalog",
      desk: "Disk",
      column: "Kolumn",
      signedInAsGuest: "Inloggad som gäst",
      editions: "Utgåvor",
      featuredDepartments: "Utvalda avdelningar",
      localPortal: "Lokal portal",
      alsoInCheckout: "Även i kassan",
      relatedRoomPosts: "Relaterade rumsinlägg",
      openDirectory: "Öppna katalog",
      lastChecked: "Senast kontrollerad",
      accountSurface: "Kontovyta",
      guestbookPolicySitemap: "Gästbok policy webbplatskarta",
      language: "Språk",
      support: "Support",
      mediaMetadataRetainedIn: "Mediemetadata sparas i",
      freeShipping: "Fri frakt",
      ends: "Slutar",
      continueShoppingLater: "Fortsätt handla senare",
      add: "Lägg till"
    }
  },
  Polish: {
    webNouns: ["konto", "koszyk", "portal", "pobieranie", "aktualizacja", "kasa", "katalog", "księga gości", "indeks", "strona główna"],
    interfaceNouns: ["karta", "okno", "pasek boczny", "miniatura", "baner", "kanał", "profil", "ogłoszenie", "widżet", "kolumna"],
    genreNouns: ["apartament", "artykuł", "produkt", "odcinek", "wpis", "rezerwacja", "recenzja", "instrukcja", "pakiet", "dział"],
    adjectives: ["cichy", "znajomy", "oficjalny", "ciepły", "brakujący", "dostępny", "pobliski", "poprzedni", "lokalny", "miękki"],
    verbs: ["otwórz", "porównaj", "zarezerwuj", "kontynuuj", "potwierdź", "zaktualizuj", "znajdź", "przywróć", "dodaj", "zobacz"],
    timeFragments: ["dzisiaj", "później", "już od 2006", "jutro rano", "po nagłówkach", "przed kasą", "dziś wieczorem", "w zeszłym tygodniu"],
    contaminationFragments: ["cicha oferta", "poprzedni pokój", "publiczna karta", "lokalny katalog pozostaje otwarty", "kontynuuj kasę później"],
    formLabels: {
      checkIn: "Zameldowanie",
      checkOut: "Wymeldowanie",
      guests: "Liczba gości",
      preferredHallway: "Preferowany korytarz",
      rememberFloor: "Zapamiętaj piętro",
      searchSuite: "Szukaj apartamentu",
      emailForUpdates: "E-mail do aktualizacji budynku",
      deliveryWindow: "Okno dostawy"
    },
    genericLabels: {
      openGuestDirectory: "Otwórz katalog gości",
      desk: "Biurko",
      column: "Kolumna",
      signedInAsGuest: "Zalogowano jako gość",
      editions: "Wydania",
      featuredDepartments: "Wyróżnione działy",
      localPortal: "Lokalny portal",
      alsoInCheckout: "Także w kasie",
      relatedRoomPosts: "Powiązane wpisy pokojowe",
      openDirectory: "Otwórz katalog",
      lastChecked: "Ostatnio sprawdzono",
      accountSurface: "Powierzchnia konta",
      guestbookPolicySitemap: "Księga gości polityka mapa strony",
      language: "Język",
      support: "Wsparcie",
      mediaMetadataRetainedIn: "Metadane mediów zachowane w",
      freeShipping: "Darmowa wysyłka",
      ends: "Kończy się",
      continueShoppingLater: "Kontynuuj zakupy później",
      add: "Dodaj"
    }
  },
  Turkish: {
    webNouns: ["hesap", "sepet", "portal", "indirme", "güncelleme", "ödeme", "dizin", "ziyaretçi defteri", "indeks", "ana sayfa"],
    interfaceNouns: ["sekme", "pencere", "kenar çubuğu", "küçük resim", "afiş", "akış", "profil", "liste", "bileşen", "sütun"],
    genreNouns: ["süit", "makale", "ürün", "bölüm", "gönderi", "rezervasyon", "inceleme", "kılavuz", "paket", "departman"],
    adjectives: ["sessiz", "tanıdık", "resmi", "sıcak", "eksik", "mevcut", "yakındaki", "önceki", "yerel", "yumuşak"],
    verbs: ["aç", "karşılaştır", "rezerve et", "devam et", "onayla", "güncelle", "bul", "geri yükle", "ekle", "görüntüle"],
    timeFragments: ["bugün", "daha sonra", "2006'dan beri", "yarın sabah", "başlıklardan sonra", "ödemeden önce", "bu akşam", "geçen hafta"],
    contaminationFragments: ["sessiz teklif", "önceki oda", "genel sekme", "yerel dizin açık kalır", "ödemeye sonra devam et"],
    formLabels: {
      checkIn: "Giriş",
      checkOut: "Çıkış",
      guests: "Misafir sayısı",
      preferredHallway: "Tercih edilen koridor",
      rememberFloor: "Katı hatırla",
      searchSuite: "Süit ara",
      emailForUpdates: "Bina güncellemeleri için e-posta",
      deliveryWindow: "Teslimat aralığı"
    },
    genericLabels: {
      openGuestDirectory: "Misafir dizinini aç",
      desk: "Masa",
      column: "Sütun",
      signedInAsGuest: "Misafir olarak oturum açıldı",
      editions: "Sürümler",
      featuredDepartments: "Öne çıkan departmanlar",
      localPortal: "Yerel portal",
      alsoInCheckout: "Ödemede de var",
      relatedRoomPosts: "İlgili oda gönderileri",
      openDirectory: "Dizini aç",
      lastChecked: "Son kontrol",
      accountSurface: "Hesap yüzeyi",
      guestbookPolicySitemap: "Ziyaretçi defteri politika site haritası",
      language: "Dil",
      support: "Destek",
      mediaMetadataRetainedIn: "Medya meta verileri şurada tutulur",
      freeShipping: "Ücretsiz kargo",
      ends: "Biter",
      continueShoppingLater: "Alışverişe sonra devam et",
      add: "Ekle"
    }
  },
  Greek: {
    webNouns: ["λογαριασμός", "καλάθι", "πύλη", "λήψη", "ενημέρωση", "ταμείο", "κατάλογος", "βιβλίο επισκεπτών", "ευρετήριο", "αρχική σελίδα"],
    interfaceNouns: ["καρτέλα", "παράθυρο", "πλευρική μπάρα", "μικρογραφία", "μπάνερ", "ροή", "προφίλ", "καταχώριση", "γραφικό στοιχείο", "στήλη"],
    genreNouns: ["σουίτα", "άρθρο", "προϊόν", "επεισόδιο", "ανάρτηση", "κράτηση", "κριτική", "εγχειρίδιο", "πακέτο", "τμήμα"],
    adjectives: ["ήσυχος", "οικείος", "επίσημος", "ζεστός", "χαμένος", "διαθέσιμος", "κοντινός", "προηγούμενος", "τοπικός", "απαλός"],
    verbs: ["άνοιγμα", "σύγκριση", "κράτηση", "συνέχεια", "επιβεβαίωση", "ενημέρωση", "εύρεση", "επαναφορά", "προσθήκη", "προβολή"],
    timeFragments: ["σήμερα", "αργότερα", "ήδη από το 2006", "αύριο το πρωί", "μετά τους τίτλους", "πριν από το ταμείο", "απόψε", "την προηγούμενη εβδομάδα"],
    contaminationFragments: ["ήσυχη προσφορά", "προηγούμενο δωμάτιο", "δημόσια καρτέλα", "ο τοπικός κατάλογος μένει ανοιχτός", "συνέχεια στο ταμείο αργότερα"],
    formLabels: {
      checkIn: "Άφιξη",
      checkOut: "Αναχώρηση",
      guests: "Αριθμός επισκεπτών",
      preferredHallway: "Προτιμώμενος διάδρομος",
      rememberFloor: "Απομνημόνευση ορόφου",
      searchSuite: "Αναζήτηση σουίτας",
      emailForUpdates: "Email για ενημερώσεις κτιρίου",
      deliveryWindow: "Παράθυρο παράδοσης"
    },
    genericLabels: {
      openGuestDirectory: "Άνοιγμα καταλόγου επισκεπτών",
      desk: "Γραφείο",
      column: "Στήλη",
      signedInAsGuest: "Σύνδεση ως επισκέπτης",
      editions: "Εκδόσεις",
      featuredDepartments: "Προτεινόμενα τμήματα",
      localPortal: "Τοπική πύλη",
      alsoInCheckout: "Επίσης στο ταμείο",
      relatedRoomPosts: "Σχετικές αναρτήσεις δωματίου",
      openDirectory: "Άνοιγμα καταλόγου",
      lastChecked: "Τελευταίος έλεγχος",
      accountSurface: "Επιφάνεια λογαριασμού",
      guestbookPolicySitemap: "Βιβλίο επισκεπτών πολιτική χάρτης ιστότοπου",
      language: "Γλώσσα",
      support: "Υποστήριξη",
      mediaMetadataRetainedIn: "Μεταδεδομένα μέσων διατηρούνται σε",
      freeShipping: "Δωρεάν αποστολή",
      ends: "Λήγει",
      continueShoppingLater: "Συνέχεια αγορών αργότερα",
      add: "Προσθήκη"
    }
  }
} as const satisfies Record<EuropeMixedLanguageName, EuropeMixedLanguagePack>;
