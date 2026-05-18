// ~130 first names reflecting the "47 countries" attendee mix of AI Summit
// Weighted toward Chinese / Chinese-Malaysian names as requested

export const DUMMY_FIRST_NAMES = [
  // ── Chinese / Chinese-Malaysian (heavily expanded) ──
  'Wei Ming', 'Mei Xin', 'Jun Hao', 'Kai Lin', 'Zi Yang', 'Hui Min',
  'Jia Wei', 'Xiao Qian', 'Chen Hao', 'Hao Ren', 'Zhi Hao', 'Xin Yi',
  'Wei Lin', 'Jing Wen', 'Yu Xuan', 'Shan Shan', 'Bo Lin', 'Ying Ying',
  'Zhi Wei', 'Jia Hao', 'Ming Hui', 'Xiu Ying', 'Pei Ling', 'Shu Ting',
  'Mei Ling', 'Jia Xin', 'Rui Qi', 'Zhen Wei', 'Wen Jie', 'Guo Hao',
  'Li Wei', 'Xiao Ming', 'Yu Ting', 'Jing Yi', 'Zhi Xuan', 'Hao Yang',
  'Fang Fang', 'Xin Rui', 'Jun Wei', 'Bing Wen', 'Yan Ling', 'Ke Xin',
  'Zi Xuan', 'Wei Jie', 'Xiao Hua', 'Yong Kang', 'Bao Ling', 'Qi Wei',
  'Mei Hua', 'Hai Long', 'Ruo Xi', 'Jia Lin', 'Ting Ting', 'Yi Fan',
  'Zhi Yong', 'Chun Mei', 'Yi Ling', 'Jia Qi', 'Shu Wei', 'Dong Mei',
  'Guo Wei', 'Xin Hui', 'Rui Han', 'Zi Han', 'Mei Yi', 'Peng Fei',
  // ── Cantonese / HK-style single syllable ──
  'Wai', 'Kwan', 'Kin', 'Sze', 'Man', 'Pak', 'Fong', 'Boon',
  // ── Malaysian Malay ──
  'Aishah', 'Nurul', 'Farah', 'Siti', 'Aisyah', 'Hanim', 'Zainab', 'Husna', 'Amirah',
  'Ahmad', 'Muhammad', 'Hafiz', 'Syafiq', 'Amirul', 'Danial', 'Yusof', 'Haris', 'Afiq',
  // ── Malaysian Indian / Tamil ──
  'Priya', 'Kavitha', 'Divya', 'Nithya', 'Lavanya',
  'Rajesh', 'Kumaran', 'Dinesh', 'Karthik', 'Vignesh', 'Arjun',
  // ── Indonesian ──
  'Dewi', 'Sari', 'Putri', 'Ayu', 'Rizky', 'Bayu', 'Dimas',
  // ── Singaporean ──
  'Aaron', 'Jason', 'Marcus', 'Valerie', 'Cheryl', 'Darren',
  // ── Thai ──
  'Nong', 'Ploy', 'Mint', 'Pim', 'Natcha',
  // ── Filipino ──
  'Grace', 'Angel', 'Joy', 'Mark', 'Ria',
  // ── Vietnamese ──
  'Linh', 'Anh', 'Trang', 'Hoa', 'Ngoc', 'Minh',
  // ── Japanese / Korean ──
  'Kenji', 'Yuki', 'Hana', 'Akira', 'Ji-Ho', 'Soo-Yeon',
] as const

export const DUMMY_LAST_NAMES = [
  // ── Chinese / Chinese-Malaysian (expanded) ──
  'Lim', 'Tan', 'Wong', 'Ng', 'Lee', 'Chan', 'Ong', 'Goh', 'Chong', 'Teh',
  'Yap', 'Koh', 'Chin', 'Cheong', 'Fong', 'Leong', 'Teoh', 'Yeoh', 'Woo', 'Lau',
  'Chew', 'Khoo', 'Ooi', 'Ho', 'Chua', 'Pang', 'Heng', 'Tay', 'Kang', 'Siew',
  'Chen', 'Zhang', 'Liu', 'Wang', 'Li', 'Yang', 'Huang', 'Zhao', 'Wu', 'Lin',
  'Zhu', 'Sun', 'Xu', 'Deng', 'Cheng', 'Xiao', 'Zeng', 'Han', 'Feng', 'Tang',
  // ── Malay ──
  'Abdullah', 'Rahman', 'Hassan', 'Ibrahim', 'Yusof', 'Ismail', 'Hamid', 'Aziz', 'Osman',
  // ── Indian Malaysian ──
  'Kumar', 'Nair', 'Krishnan', 'Rajan', 'Murugan',
  // ── Indonesian ──
  'Wijaya', 'Santoso', 'Pratama', 'Wahyu', 'Kusuma',
  // ── Vietnamese ──
  'Nguyen', 'Tran', 'Le', 'Pham', 'Hoang',
  // ── Filipino ──
  'Santos', 'Reyes', 'Cruz', 'Garcia', 'Ramos',
  // ── Japanese ──
  'Nakamura', 'Tanaka', 'Yamamoto', 'Watanabe',
  // ── Korean ──
  'Kim', 'Park', 'Choi', 'Jung',
] as const

export function randomDummyName(): { first_name: string; last_name: string } {
  const first = DUMMY_FIRST_NAMES[Math.floor(Math.random() * DUMMY_FIRST_NAMES.length)]
  const last = DUMMY_LAST_NAMES[Math.floor(Math.random() * DUMMY_LAST_NAMES.length)]
  return { first_name: first, last_name: last }
}

export function randomDummyEmail(firstName: string, lastName: string): string {
  const slug = `${firstName.replace(/\s+/g, '').toLowerCase()}.${lastName.replace(/\s+/g, '').toLowerCase()}`
  return `dummy_${slug}_${Math.floor(Math.random() * 10000)}@example.com`
}

export const DUMMY_COUNTRY_CODES = ['+60', '+60', '+60', '+65', '+62', '+91', '+81', '+66', '+63']

export function randomDummyCountryCode(): string {
  return DUMMY_COUNTRY_CODES[Math.floor(Math.random() * DUMMY_COUNTRY_CODES.length)]
}
