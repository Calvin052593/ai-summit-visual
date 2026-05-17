// ~80 first names reflecting the "47 countries" attendee mix of Gen AI Summit Asia 2026
// Covers Malay, Chinese-Malaysian, Indian-Malaysian, Indonesian, Thai, Filipino, Vietnamese, Japanese, broader Asian

export const DUMMY_FIRST_NAMES = [
  // Malaysian Malay
  'Aishah', 'Nurul', 'Farah', 'Siti', 'Aisyah', 'Hanim', 'Zainab', 'Norlin', 'Husna', 'Amirah',
  'Ahmad', 'Muhammad', 'Hafiz', 'Razif', 'Syafiq', 'Amirul', 'Danial', 'Yusof', 'Haris', 'Afiq',
  // Malaysian Chinese
  'Wei Ming', 'Mei Xin', 'Jun Hao', 'Kai Lin', 'Ying Ying', 'Zi Yang',
  'Hui Min', 'Jia Wei', 'Xiao Qian', 'Chen Hao', 'Shan Shan', 'Bo Lin',
  'Hao Ren', 'Zhi Hao', 'Xin Yi', 'Wei Lin', 'Jing Wen', 'Yu Xuan',
  // Malaysian Indian / Tamil
  'Priya', 'Kavitha', 'Santhiya', 'Divya', 'Nithya', 'Anitha', 'Lavanya',
  'Rajesh', 'Kumaran', 'Sathish', 'Dinesh', 'Karthik', 'Vignesh', 'Arjun', 'Ravi',
  // Indonesian
  'Dewi', 'Sari', 'Putri', 'Ayu', 'Indah', 'Cahya', 'Rizky', 'Andi', 'Bayu', 'Dimas',
  // Singaporean / Pan-Chinese
  'Mei', 'Lin', 'Hui', 'Jing', 'Yong', 'Keng', 'Aaron', 'Jason', 'Marcus', 'Valerie',
  // Thai
  'Nong', 'Ploy', 'Fah', 'Mint', 'Pim', 'Tong', 'Chai', 'Natcha',
  // Filipino
  'Grace', 'Angel', 'Joy', 'Lovely', 'Mark', 'John Paul', 'Ria', 'Bea',
  // Vietnamese
  'Linh', 'Anh', 'Trang', 'Hoa', 'Lan', 'Ngoc', 'Minh', 'Duc',
  // Japanese / Korean
  'Kenji', 'Hiroshi', 'Yuki', 'Maya', 'Hana', 'Akira', 'Ji-Ho', 'Soo-Yeon',
  // South Asian / broader
  'Anisha', 'Lakshmi', 'Pooja', 'Nisha', 'Sunita', 'Geeta',
] as const

export const DUMMY_LAST_NAMES = [
  // Malay surnames
  'Abdullah', 'Rahman', 'Hassan', 'Ibrahim', 'Yusof', 'Ismail', 'Hamid', 'Aziz', 'Osman', 'Mohd',
  // Chinese Malaysian
  'Lim', 'Tan', 'Wong', 'Ng', 'Lee', 'Chan', 'Ong', 'Goh', 'Chong', 'Teh',
  // Indian Malaysian
  'Kumar', 'Nair', 'Pillai', 'Krishnan', 'Rajan', 'Murugan', 'Subramaniam',
  // Indonesian
  'Wijaya', 'Santoso', 'Pratama', 'Suharto', 'Wahyu', 'Kusuma',
  // Vietnamese
  'Nguyen', 'Tran', 'Le', 'Pham', 'Hoang', 'Do',
  // Filipino
  'Santos', 'Reyes', 'Cruz', 'Garcia', 'Dela Cruz', 'Ramos',
  // Japanese
  'Nakamura', 'Tanaka', 'Yamamoto', 'Watanabe', 'Suzuki',
  // Korean
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
