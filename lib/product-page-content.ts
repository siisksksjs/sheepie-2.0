export type ProductSlug = "cervicloud" | "lumicloud" | "calmicloud";

export interface ProductFeatureCard {
  title: string;
  body: string;
}

export interface ProductFaqItem {
  q: string;
  a: string;
}

export interface ProductComparisonRow {
  label: string;
  sheepie: string;
  generic: string;
}

export interface ProductPageContent {
  eyebrow: string;
  headline: string;
  summary: string;
  trustBadges: string[];
  keyBenefits: string[];
  fitTags: string[];
  bundleTitle: string;
  bundleBody: string;
  relatedSlug: ProductSlug;
  relatedCta: string;
  marquee: string[];
  problemTitle: string;
  problemIntro: string;
  problemPoints: string[];
  solutionTitle: string;
  solutionIntro: string;
  features: ProductFeatureCard[];
  compareTitle: string;
  compareLead: string;
  compareGenericLabel: string;
  comparisonRows: ProductComparisonRow[];
  goodFitTitle: string;
  goodFit: string[];
  notFitTitle: string;
  notFit: string[];
  faqTitle: string;
  faqs: ProductFaqItem[];
  ctaTitle: string;
  ctaBody: string;
  ctaNote: string;
}

const content = {
  id: {
    cervicloud: {
      eyebrow: "Bantal Cervical Memory Foam",
      headline: "Bangun tanpa leher terasa kaku dan salah bantal.",
      summary:
        "CerviCloud adalah bantal cervical memory foam yang membantu menopang leher lebih stabil saat tidur. Cocok untuk side sleeper, back sleeper, dan combination sleeper yang ingin rasa support lebih jelas dibanding bantal biasa.",
      trustBadges: [
        "Pengiriman cepat Indonesia",
        "Checkout via Shopee & Tokopedia",
        "Bisa dibundle dengan sleep essentials lain",
      ],
      keyBenefits: [
        "Support leher lebih stabil untuk tidur side, back, dan combo",
        "Memory foam slow rebound terasa lebih supportive dari bantal biasa",
        "Ukuran lebar 64 cm untuk support yang tetap terasa penuh",
        "Cocok untuk yang sering bangun dengan leher kaku di pagi hari",
      ],
      fitTags: [
        "Side sleeper",
        "Back sleeper",
        "Combination sleeper",
        "Leher kaku di pagi hari",
      ],
      bundleTitle: "Pasangkan dengan LumiCloud untuk sleep setup yang lebih lengkap.",
      bundleBody:
        "Kalau problem Anda bukan cuma leher, bundle dengan LumiCloud membantu mengurangi gangguan cahaya tanpa bikin setup tidur terasa ribet.",
      relatedSlug: "lumicloud",
      relatedCta: "Lihat LumiCloud",
      marquee: [
        "Leher lebih tersangga",
        "Support lebih stabil",
        "Cocok untuk side sleeper",
        "Memory foam slow rebound",
        "Lebih supportive dari bantal biasa",
      ],
      problemTitle: "Kenapa banyak orang bangun tetap pegal walau tidurnya cukup lama?",
      problemIntro:
        "Masalahnya sering bukan cuma durasi tidur, tapi bantal yang terlalu tinggi, terlalu kempes, atau support-nya berubah sepanjang malam.",
      problemPoints: [
        "Bantal biasa mudah terasa terlalu tinggi atau terlalu turun di bawah kepala.",
        "Leher jadi tidak terasa tersangga konsisten saat Anda ganti posisi.",
        "Kalau bangun dengan leher kaku, rasa tidak nyaman itu bisa kebawa seharian.",
      ],
      solutionTitle: "CerviCloud dibuat untuk satu pekerjaan: bantu leher terasa lebih tertopang saat Anda tidur.",
      solutionIntro:
        "Alih-alih mengejar bahasa mewah, yang penting adalah rasa support yang benar-benar terasa saat dipakai semalaman.",
      features: [
        {
          title: "Kontur cervical yang terasa jelas",
          body: "Bentuknya membantu kepala dan leher berada di posisi yang lebih stabil daripada bantal datar biasa.",
        },
        {
          title: "Memory foam slow rebound",
          body: "Rasa support-nya lebih konsisten dan tidak terasa gampang kempes saat dipakai berjam-jam.",
        },
        {
          title: "Lebar 64 cm",
          body: "Memberi area support yang tetap terasa penuh saat Anda bergerak atau ganti sisi tidur.",
        },
      ],
      compareTitle: "Dibanding bantal biasa",
      compareLead:
        "Yang orang cari biasanya simpel: leher lebih nyaman, support lebih stabil, dan bangun tanpa rasa salah posisi.",
      compareGenericLabel: "Bantal biasa",
      comparisonRows: [
        {
          label: "Rasa support",
          sheepie: "Lebih supportive dan stabil",
          generic: "Sering terlalu kempes atau terlalu tinggi",
        },
        {
          label: "Cocok untuk ganti posisi tidur",
          sheepie: "Lebih membantu side / back / combo sleeper",
          generic: "Sering terasa tidak konsisten saat posisi berubah",
        },
        {
          label: "Bangun dengan leher kaku",
          sheepie: "Dirancang untuk bantu mengurangi rasa tidak nyaman",
          generic: "Sering jadi salah satu penyebab bangun pegal",
        },
      ],
      goodFitTitle: "Cocok untuk",
      goodFit: [
        "Side sleeper yang butuh support leher lebih jelas",
        "Back sleeper yang ingin kepala dan leher terasa lebih stabil",
        "Combination sleeper yang sering ganti posisi",
        "Orang yang sering bangun dengan leher terasa kaku",
      ],
      notFitTitle: "Mungkin kurang cocok untuk",
      notFit: [
        "Yang suka bantal super tipis dan sangat empuk",
        "Yang ingin feel tenggelam seperti bantal kapuk atau dacron lembek",
        "Yang berharap efek medis instan tanpa masa adaptasi",
      ],
      faqTitle: "Pertanyaan yang paling sering muncul",
      faqs: [
        {
          q: "Apakah perlu masa adaptasi?",
          a: "Biasanya iya, terutama kalau Anda sebelumnya pakai bantal biasa yang sangat empuk atau datar. Wajar kalau butuh beberapa malam sampai terasa pas.",
        },
        {
          q: "Apakah cocok untuk side sleeper?",
          a: "Ya, ini salah satu posisi tidur yang paling cocok. Banyak orang mencari bantal seperti ini justru karena side sleeping sering bikin leher lebih mudah terasa salah posisi.",
        },
        {
          q: "Apakah terasa keras?",
          a: "Feel-nya supportive, bukan fluffy. Jadi fokusnya memang menopang, bukan tenggelam.",
        },
      ],
      ctaTitle: "Kalau masalah utama Anda leher pegal saat bangun, mulai dari CerviCloud.",
      ctaBody:
        "Ini produk hero Sheepie karena pain point-nya paling jelas dan hasil yang dicari customer juga paling konkret: tidur lebih nyaman, bangun tanpa rasa salah bantal.",
      ctaNote: "Belanja lewat Shopee atau Tokopedia. Bundle dengan LumiCloud untuk setup tidur yang lebih lengkap.",
    },
    lumicloud: {
      eyebrow: "Blackout Sleep Mask",
      headline: "Tidur lebih gelap tanpa masker yang menekan mata.",
      summary:
        "LumiCloud adalah sleep mask ringan dengan fit yang simpel, full blackout untuk kebanyakan pengguna, dan nyaman dipakai semalaman. Cocok untuk tidur malam, naps, dan travel.",
      trustBadges: [
        "Ringan dan mudah dibawa",
        "Hair-friendly quiet velcro",
        "Checkout via Shopee & Tokopedia",
      ],
      keyBenefits: [
        "Full blackout untuk kebanyakan bentuk wajah",
        "Tidak menekan kelopak mata saat dipakai tidur",
        "Lebih ringan dan simpel daripada masker bulky",
        "Nyaman untuk tidur malam, nap, dan travel",
      ],
      fitTags: ["Night sleep", "Power nap", "Travel", "Hair-friendly fit"],
      bundleTitle: "LumiCloud paling enak dijadikan pasangan CerviCloud.",
      bundleBody:
        "Kalau leher dan cahaya sama-sama mengganggu kualitas tidur Anda, kombinasi ini jadi setup paling masuk akal untuk diprioritaskan.",
      relatedSlug: "cervicloud",
      relatedCta: "Lihat CerviCloud",
      marquee: [
        "Full blackout untuk kebanyakan pengguna",
        "Tidak menekan mata",
        "Ringan dan lembut",
        "Aman untuk rambut",
        "Cocok untuk nap dan travel",
      ],
      problemTitle: "Masker tidur yang tipis sering masih bocor cahaya atau terasa mengganggu di mata.",
      problemIntro:
        "Banyak orang ingin kamar lebih gelap, tapi masker kain biasa sering geser, menekan kelopak mata, atau bikin malas dipakai semalaman.",
      problemPoints: [
        "Masih ada cahaya masuk dari sela-sela masker.",
        "Tekanan di area mata bikin tidur terasa kurang nyaman.",
        "Strap atau karet kasar bisa bikin kepala sakit atau rambut kusut.",
      ],
      solutionTitle: "LumiCloud fokus pada tiga hal: gelap, nyaman, dan gampang dipakai.",
      solutionIntro:
        "Keunggulannya bukan karena kelihatan rumit, tapi karena terasa praktis saat dipakai setiap hari.",
      features: [
        {
          title: "Full blackout untuk most users",
          body: "Dirancang untuk membantu memblokir cahaya dengan lebih rapat daripada masker kain generik biasa.",
        },
        {
          title: "Tidak menekan mata",
          body: "Area mata tidak terasa ketekan, jadi lebih nyaman untuk dipakai tidur lebih lama.",
        },
        {
          title: "Quiet velcro yang aman untuk rambut",
          body: "Lebih nyaman dipasang-lepas dan tidak terasa sekeras strap yang sering bikin kepala atau telinga sakit.",
        },
      ],
      compareTitle: "Dibanding masker tidur biasa",
      compareLead:
        "LumiCloud menang di hal yang paling sering bikin orang malas pakai sleep mask: tekanan di mata, fit yang ribet, dan rasa gerah.",
      compareGenericLabel: "Masker kain biasa",
      comparisonRows: [
        {
          label: "Blok cahaya",
          sheepie: "Lebih blackout untuk kebanyakan pengguna",
          generic: "Sering masih bocor cahaya",
        },
        {
          label: "Kenyamanan area mata",
          sheepie: "Tidak terasa menekan mata",
          generic: "Sering menekan kelopak mata",
        },
        {
          label: "Praktis dibawa",
          sheepie: "Ringan, simpel, mudah masuk tas",
          generic: "Kadang terasa asal pakai, kadang kurang nyaman",
        },
      ],
      goodFitTitle: "Cocok untuk",
      goodFit: [
        "Orang yang tidur terganggu lampu kamar atau lampu luar",
        "Yang suka tidur siang dan butuh gelap cepat",
        "Traveler yang ingin sleep mask ringan dan gampang dipakai",
        "Pengguna yang sensitif dengan strap kasar atau rambut mudah kusut",
      ],
      notFitTitle: "Mungkin kurang cocok untuk",
      notFit: [
        "Yang mencari masker super bulky dengan feel premium tebal",
        "Yang menginginkan sistem fitting rumit dengan banyak attachment",
        "Yang berharap hasil sama di semua bentuk wajah tanpa penyesuaian",
      ],
      faqTitle: "Pertanyaan yang paling sering muncul",
      faqs: [
        {
          q: "Apakah benar-benar blackout?",
          a: "Untuk kebanyakan pengguna, ya. Seperti semua sleep mask, hasil akhirnya tetap dipengaruhi bentuk wajah dan cara memasang, tapi targetnya memang blackout yang terasa jelas.",
        },
        {
          q: "Apakah menekan bulu mata atau kelopak mata?",
          a: "Tidak, itu salah satu alasan LumiCloud lebih nyaman dipakai untuk tidur lebih lama daripada masker tipis biasa.",
        },
        {
          q: "Apakah enak dibawa traveling?",
          a: "Ya. Salah satu kelebihan utamanya justru ringan, gampang dilipat, dan tidak terasa ribet dipakai saat di pesawat atau mobil.",
        },
      ],
      ctaTitle: "Kalau gangguan utama Anda cahaya, mulai dari LumiCloud.",
      ctaBody:
        "Ini upgrade yang sederhana tapi terasa. Tidak perlu ubah kamar atau pasang gorden mahal dulu kalau yang Anda butuhkan sebenarnya hanya sleep mask yang enak dipakai.",
      ctaNote: "Bisa dipakai sendiri atau dipasangkan dengan CerviCloud untuk setup tidur yang lebih lengkap.",
    },
    calmicloud: {
      eyebrow: "Reusable Silicone Earplugs",
      headline: "Tidur lebih tenang tanpa earplug foam yang bikin tidak nyaman.",
      summary:
        "CalmiCloud membantu mengurangi gangguan suara seperti dengkuran, AC, atau lalu lintas agar lingkungan tidur terasa lebih tenang. Cocok sebagai add-on sleep setup atau companion product untuk travel.",
      trustBadges: [
        "Reusable dan bisa dibersihkan",
        "Nyaman untuk banyak side sleeper",
        "Ringkas untuk dibawa travel",
      ],
      keyBenefits: [
        "Membantu meredam suara yang mengganggu tidur",
        "Lebih nyaman dari foam earplug bagi banyak pengguna",
        "Reusable dan mudah dibawa dalam case",
        "Cocok untuk tidur, fokus, dan travel",
      ],
      fitTags: ["Snoring", "AC noise", "Traffic", "Side sleeper"],
      bundleTitle: "CalmiCloud paling masuk akal sebagai add-on sleep kit.",
      bundleBody:
        "Kalau Anda sudah memilih CerviCloud atau LumiCloud, CalmiCloud jadi pelengkap yang membantu mengurangi distraksi suara tanpa bikin setup terasa mahal.",
      relatedSlug: "lumicloud",
      relatedCta: "Lihat LumiCloud",
      marquee: [
        "Bantu redam dengkuran",
        "Lebih nyaman dari foam untuk banyak pengguna",
        "Reusable",
        "Travel-friendly",
        "Support tidur lebih tenang",
      ],
      problemTitle: "Kadang suara kecil saja sudah cukup bikin tidur terputus.",
      problemIntro:
        "Dengkuran, AC, suara motor, atau lingkungan kos yang ramai sering jadi gangguan tidur yang sulit dikontrol dari sumbernya.",
      problemPoints: [
        "Foam earplug tidak selalu nyaman dipakai semalaman.",
        "Sebagian earplug terasa terlalu invasive atau bikin telinga cepat pegal.",
        "Gangguan suara kecil bisa cukup untuk membangunkan tidur ringan.",
      ],
      solutionTitle: "CalmiCloud dibuat untuk bantu tidur terasa lebih tenang, bukan untuk menjanjikan dunia jadi sunyi total.",
      solutionIntro:
        "Posisinya jelas: membantu mengurangi distraksi suara sehari-hari agar Anda lebih mudah istirahat.",
      features: [
        {
          title: "Membantu mengurangi ambient noise",
          body: "Cocok untuk suara dengkuran, AC, atau lalu lintas yang sering mengganggu kualitas tidur.",
        },
        {
          title: "Reusable dan mudah dirawat",
          body: "Lebih praktis untuk dipakai berulang dibanding earplug sekali pakai yang cepat habis.",
        },
        {
          title: "Oke untuk banyak side sleeper",
          body: "Dirancang untuk kenyamanan lebih baik dibanding earplug yang terasa terlalu keras atau terlalu dalam.",
        },
      ],
      compareTitle: "Dibanding foam earplug biasa",
      compareLead:
        "Yang penting bukan jargon teknis, tapi apakah earplug-nya mau benar-benar dipakai terus karena nyaman dan praktis.",
      compareGenericLabel: "Foam earplug biasa",
      comparisonRows: [
        {
          label: "Kenyamanan semalaman",
          sheepie: "Lebih nyaman untuk banyak pengguna",
          generic: "Sering terasa mengganjal atau cepat bikin tidak nyaman",
        },
        {
          label: "Pemakaian berulang",
          sheepie: "Reusable",
          generic: "Lebih sering dianggap sekali pakai",
        },
        {
          label: "Use case",
          sheepie: "Tidur, fokus, travel",
          generic: "Lebih sempit dan kurang fleksibel",
        },
      ],
      goodFitTitle: "Cocok untuk",
      goodFit: [
        "Tidur di kamar yang sering terganggu suara lingkungan",
        "Partner yang terganggu dengkuran",
        "Traveler yang butuh sleep kit ringkas",
        "Orang yang kurang suka foam earplug biasa",
      ],
      notFitTitle: "Mungkin kurang cocok untuk",
      notFit: [
        "Yang berharap suara hilang total",
        "Yang butuh angka dB tersertifikasi untuk kebutuhan teknis",
        "Yang ingin produk utama dengan dampak terbesar dibanding add-on",
      ],
      faqTitle: "Pertanyaan yang paling sering muncul",
      faqs: [
        {
          q: "Apakah bisa menghilangkan suara sepenuhnya?",
          a: "Tidak. Posisi CalmiCloud adalah membantu mengurangi gangguan suara, bukan membuat semuanya hilang total.",
        },
        {
          q: "Apakah nyaman untuk side sleeper?",
          a: "Untuk banyak pengguna, ya. Itu salah satu alasan CalmiCloud lebih cocok dijadikan sleep earplug dibanding opsi yang terasa terlalu keras atau terlalu menekan.",
        },
        {
          q: "Apakah bisa dipakai ulang?",
          a: "Ya, CalmiCloud dirancang untuk pemakaian berulang dan bisa dibersihkan setelah dipakai.",
        },
      ],
      ctaTitle: "Kalau suara adalah gangguan tambahan, tambahkan CalmiCloud ke sleep setup Anda.",
      ctaBody:
        "CalmiCloud bukan SKU utama Sheepie, tapi justru bagus sebagai pelengkap untuk membuat setup tidur terasa lebih lengkap tanpa biaya terlalu besar.",
      ctaNote: "Paling efektif sebagai add-on atau bundle companion untuk CerviCloud dan LumiCloud.",
    },
  },
  en: {
    cervicloud: {
      eyebrow: "Cervical Memory Foam Pillow",
      headline: "Wake up without that stiff-neck, wrong-pillow feeling.",
      summary:
        "CerviCloud is a cervical memory foam pillow designed to keep your neck feeling more supported through the night. It is best suited for side sleepers, back sleepers, and combination sleepers who want a more supportive feel than a regular pillow.",
      trustBadges: [
        "Fast shipping across Indonesia",
        "Marketplace checkout via Shopee and Tokopedia",
        "Easy to pair with other sleep essentials",
      ],
      keyBenefits: [
        "More stable neck support for side, back, and combo sleep positions",
        "Slow-rebound memory foam feels more supportive than regular pillows",
        "64 cm width helps support feel more consistent across the night",
        "A strong fit for people who often wake up with neck stiffness",
      ],
      fitTags: [
        "Side sleeper",
        "Back sleeper",
        "Combination sleeper",
        "Morning neck stiffness",
      ],
      bundleTitle: "Pair it with LumiCloud for a more complete sleep setup.",
      bundleBody:
        "If light is part of the problem too, adding LumiCloud gives you a cleaner sleep environment without making your setup complicated.",
      relatedSlug: "lumicloud",
      relatedCta: "Explore LumiCloud",
      marquee: [
        "More stable neck support",
        "Slow-rebound memory foam",
        "Works for side sleepers",
        "More supportive than a regular pillow",
        "Built for morning stiffness pain points",
      ],
      problemTitle: "Why do so many people still wake up sore after a full night of sleep?",
      problemIntro:
        "Often the issue is not sleep duration. It is a pillow that feels too high, too flat, or inconsistent as you move through the night.",
      problemPoints: [
        "Regular pillows can feel too flat or too collapsed under your head.",
        "Your neck does not always feel consistently supported as you change position.",
        "That morning stiffness can stay with you all day.",
      ],
      solutionTitle: "CerviCloud is built for one job: helping your neck feel more supported while you sleep.",
      solutionIntro:
        "The win here is not fancy language. It is whether the support feels meaningfully better by morning.",
      features: [
        {
          title: "Clear cervical contouring",
          body: "Its shape helps your head and neck feel more stable than a flat, standard pillow.",
        },
        {
          title: "Slow-rebound memory foam",
          body: "Support stays more consistent through the night instead of feeling like it quickly collapses.",
        },
        {
          title: "Wide 64 cm support area",
          body: "You still get a fuller support feel even when you move or rotate positions.",
        },
      ],
      compareTitle: "Compared with a regular pillow",
      compareLead:
        "What people really want is simple: better support, less morning stiffness, and fewer nights that feel like the pillow was the problem.",
      compareGenericLabel: "Regular pillow",
      comparisonRows: [
        {
          label: "Support feel",
          sheepie: "More supportive and stable",
          generic: "Often too flat or too collapsed",
        },
        {
          label: "Works when positions change",
          sheepie: "Better suited to side, back, and combo sleepers",
          generic: "Can feel inconsistent as your sleep position changes",
        },
        {
          label: "Morning neck stiffness",
          sheepie: "Designed to help reduce discomfort",
          generic: "Often part of why people wake up sore",
        },
      ],
      goodFitTitle: "Best for",
      goodFit: [
        "Side sleepers who want more obvious neck support",
        "Back sleepers who want a more stable support feel",
        "Combination sleepers who move through the night",
        "People who often wake up with a stiff neck",
      ],
      notFitTitle: "Probably not for",
      notFit: [
        "People who want an ultra-thin, ultra-soft pillow",
        "People who prefer a sink-in kapok or dacron feel",
        "Anyone expecting an instant medical fix",
      ],
      faqTitle: "Common questions",
      faqs: [
        {
          q: "Is there an adjustment period?",
          a: "Usually yes, especially if you are switching from a very soft or flat pillow. A few nights of adjustment is normal.",
        },
        {
          q: "Is it good for side sleepers?",
          a: "Yes. That is one of the clearest fit cases for a pillow like this, since side sleeping often makes poor neck support more noticeable.",
        },
        {
          q: "Does it feel hard?",
          a: "It feels supportive rather than plush. The point is support, not a sink-in feel.",
        },
      ],
      ctaTitle: "If morning neck pain is the main issue, start with CerviCloud.",
      ctaBody:
        "This is Sheepie’s hero product because the pain point is concrete and the outcome people want is concrete too: better support at night and a better morning.",
      ctaNote: "Shop via Shopee or Tokopedia. Pair with LumiCloud for a fuller sleep setup.",
    },
    lumicloud: {
      eyebrow: "Blackout Sleep Mask",
      headline: "Sleep in the dark without a mask that presses on your eyes.",
      summary:
        "LumiCloud is a lightweight blackout mask with a simple fit, a softer feel, and comfort that works for all-night sleep, naps, and travel. For most users, it delivers a clearly darker sleep environment without the bulky feel of premium oversized masks.",
      trustBadges: [
        "Lightweight and packable",
        "Hair-friendly quiet velcro",
        "Marketplace checkout via Shopee and Tokopedia",
      ],
      keyBenefits: [
        "Full blackout for most users",
        "Does not press on eyelids during sleep",
        "Lighter and simpler than bulky premium masks",
        "Works for nighttime sleep, naps, and travel",
      ],
      fitTags: ["Night sleep", "Power naps", "Travel", "Hair-friendly fit"],
      bundleTitle: "LumiCloud pairs naturally with CerviCloud.",
      bundleBody:
        "If both neck comfort and light are hurting your sleep quality, this is the most logical bundle to prioritize first.",
      relatedSlug: "cervicloud",
      relatedCta: "Explore CerviCloud",
      marquee: [
        "Full blackout for most users",
        "No eye pressure",
        "Lightweight and soft",
        "Hair-friendly fit",
        "Great for naps and travel",
      ],
      problemTitle: "Most basic sleep masks either leak light or feel annoying on your face.",
      problemIntro:
        "A lot of people want a darker room, but cheap cloth masks slide around, press on the eyes, or feel uncomfortable after a short time.",
      problemPoints: [
        "Light still leaks in around the edges.",
        "Eye pressure makes it harder to wear through the night.",
        "Rough straps can tug hair or create pressure around the head.",
      ],
      solutionTitle: "LumiCloud focuses on three things: darkness, comfort, and simplicity.",
      solutionIntro:
        "Its real advantage is not complexity. It is how easy it feels to actually wear and keep using.",
      features: [
        {
          title: "Full blackout for most users",
          body: "It is built to block light more effectively than a basic cloth eye mask.",
        },
        {
          title: "No pressure on the eyes",
          body: "The eye area stays more comfortable, which matters when you want to wear it longer.",
        },
        {
          title: "Quiet velcro that is easier on hair",
          body: "It feels less harsh than rough elastic straps that can tug hair or make the head feel sore.",
        },
      ],
      compareTitle: "Compared with a basic sleep mask",
      compareLead:
        "LumiCloud wins where most people give up on sleep masks: light leak, eye pressure, and straps that feel annoying.",
      compareGenericLabel: "Basic cloth mask",
      comparisonRows: [
        {
          label: "Light blocking",
          sheepie: "More blackout for most users",
          generic: "Often still leaks light",
        },
        {
          label: "Eye comfort",
          sheepie: "Does not feel like it presses on the eyes",
          generic: "Can press directly on eyelids",
        },
        {
          label: "Packability",
          sheepie: "Light, simple, easy to bring",
          generic: "Usually generic and less comfortable to rely on",
        },
      ],
      goodFitTitle: "Best for",
      goodFit: [
        "People bothered by bedroom light or outside light spill",
        "Anyone who wants better naps quickly",
        "Travelers who want a lightweight mask that is easy to use",
        "Users who dislike rough straps or hair snagging",
      ],
      notFitTitle: "Probably not for",
      notFit: [
        "People who want an oversized bulky luxury mask",
        "People who want a complex attachment-based fit system",
        "Anyone expecting identical fit on every face shape without adjustment",
      ],
      faqTitle: "Common questions",
      faqs: [
        {
          q: "Is it really blackout?",
          a: "For most users, yes. Like any sleep mask, final results still depend a bit on face shape and how you wear it, but it is designed to create a clearly darker environment.",
        },
        {
          q: "Does it press on eyelashes or eyelids?",
          a: "No. That is one of the main reasons LumiCloud is easier to wear for longer than a thin, basic cloth mask.",
        },
        {
          q: "Is it good for travel?",
          a: "Yes. One of its biggest advantages is that it is lightweight, simple to pack, and easy to put on anywhere.",
        },
      ],
      ctaTitle: "If light is the main thing ruining your sleep, start with LumiCloud.",
      ctaBody:
        "It is a simple upgrade that feels useful fast. You do not need to redesign your room first if what you really need is a mask you will actually keep wearing.",
      ctaNote: "Use it on its own or pair it with CerviCloud for a more complete setup.",
    },
    calmicloud: {
      eyebrow: "Reusable Silicone Earplugs",
      headline: "Sleep in more peace without uncomfortable foam plugs.",
      summary:
        "CalmiCloud helps reduce common sleep-disrupting noise like snoring, AC sound, or street noise so your room feels quieter. It works best as an add-on sleep product or travel companion.",
      trustBadges: [
        "Reusable and easy to clean",
        "Comfortable for many side sleepers",
        "Small and travel friendly",
      ],
      keyBenefits: [
        "Helps reduce sleep-disrupting ambient noise",
        "More comfortable than foam plugs for many users",
        "Reusable and easy to carry in a case",
        "Good for sleep, focus, and travel",
      ],
      fitTags: ["Snoring", "AC noise", "Traffic", "Side sleeper"],
      bundleTitle: "CalmiCloud makes the most sense as a sleep-kit add-on.",
      bundleBody:
        "If you are already buying CerviCloud or LumiCloud, CalmiCloud is a low-friction add-on that helps reduce sound distractions without making the setup expensive.",
      relatedSlug: "lumicloud",
      relatedCta: "Explore LumiCloud",
      marquee: [
        "Helps reduce snoring noise",
        "Reusable",
        "Travel friendly",
        "More comfortable than foam for many users",
        "Built for a quieter sleep setup",
      ],
      problemTitle: "Sometimes even a small amount of noise is enough to break sleep.",
      problemIntro:
        "Snoring, AC hum, street traffic, or noisy living environments are common sleep problems that are hard to control at the source.",
      problemPoints: [
        "Foam earplugs do not always feel good enough to wear all night.",
        "Some earplugs feel too invasive or too pressurized inside the ear.",
        "Even low-level noise can be enough to wake a light sleeper.",
      ],
      solutionTitle: "CalmiCloud is built to help your room feel quieter, not to promise total silence.",
      solutionIntro:
        "The positioning is straightforward: reduce common sound distractions so it is easier to rest.",
      features: [
        {
          title: "Helps reduce ambient noise",
          body: "Useful for snoring, AC sound, and traffic noise that often interrupts sleep.",
        },
        {
          title: "Reusable and easy to maintain",
          body: "It is more practical for repeat use than throwaway earplug options.",
        },
        {
          title: "Okay for many side sleepers",
          body: "Designed to feel more comfortable than earplugs that feel too hard or too deep.",
        },
      ],
      compareTitle: "Compared with basic foam earplugs",
      compareLead:
        "The real question is not technical jargon. It is whether the earplugs are comfortable and practical enough that you actually keep using them.",
      compareGenericLabel: "Foam earplugs",
      comparisonRows: [
        {
          label: "All-night comfort",
          sheepie: "More comfortable for many users",
          generic: "Often feels intrusive or irritating",
        },
        {
          label: "Repeat use",
          sheepie: "Reusable",
          generic: "More often treated as disposable",
        },
        {
          label: "Use cases",
          sheepie: "Sleep, focus, travel",
          generic: "Narrower and less flexible",
        },
      ],
      goodFitTitle: "Best for",
      goodFit: [
        "People sleeping in noisy environments",
        "Partners bothered by snoring",
        "Travelers building a compact sleep kit",
        "Users who dislike standard foam plugs",
      ],
      notFitTitle: "Probably not for",
      notFit: [
        "People expecting total sound elimination",
        "Anyone needing certified dB data for technical use",
        "Anyone looking for the biggest-impact hero SKU first",
      ],
      faqTitle: "Common questions",
      faqs: [
        {
          q: "Will it remove sound completely?",
          a: "No. CalmiCloud is positioned to help reduce distracting sound, not to eliminate everything entirely.",
        },
        {
          q: "Is it comfortable for side sleepers?",
          a: "For many users, yes. That is part of why it works better as a sleep earplug option than harder or more invasive alternatives.",
        },
        {
          q: "Can I reuse it?",
          a: "Yes. CalmiCloud is designed for repeat use and can be cleaned after wearing.",
        },
      ],
      ctaTitle: "If sound is an extra sleep problem, add CalmiCloud to your setup.",
      ctaBody:
        "It is not Sheepie’s hero SKU, but it works well as a companion product that helps round out a sleep setup without adding much cost.",
      ctaNote: "Best used as an add-on or bundle companion for CerviCloud and LumiCloud.",
    },
  },
} satisfies Record<"id" | "en", Record<ProductSlug, ProductPageContent>>;

export function getProductPageContent(slug: string, locale: string): ProductPageContent {
  const language = locale === "id" ? "id" : "en";
  return content[language][slug as ProductSlug];
}

