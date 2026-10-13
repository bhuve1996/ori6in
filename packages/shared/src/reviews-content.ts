export type GoogleReview = {
  id: string;
  author: string;
  initials: string;
  rating: number;
  date: string;
  text: string;
  role: string;
  verified: boolean;
};

export const GOOGLE_REVIEWS_META = {
  rating: 5.0,
  totalReviews: 18,
  googleMapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Ori6in+Education,+1315,+25th+Main+Rd,+Kottapalya,+Jayanagara+9th+Block,+Bengaluru,+Karnataka+560041',
  placeName: 'Ori6in Education',
  address:
    'Ori6in Education, 1315, 25th Main Rd, Kottapalya, Jayanagara 9th Block, JAYANGARA, Bengaluru, Karnataka 560041, India',
  coordinates: {
    lat: 12.9166,
    lng: 77.5937,
  },
};

export const GOOGLE_REVIEWS: GoogleReview[] = [
  {
    id: 'rev-1',
    author: 'Vishal Prakash',
    initials: 'VP',
    rating: 5,
    date: '2 months ago',
    role: 'Master’s Candidate · Tier 1 Public University Admit',
    text: 'Really good agency! My counselor, Ms. Munmi Hazarika, helped and guided me throughout my Masters application process starting for guidance about exams and profiling and shortlisting of universities to drafting applications and even mock visa interviews. This guidance significantly reduced the burden of this tedious process. Ultimately, thanks to her, I got into my course of choice at a tier 1 public university. Highly recommend this agency to anyone planning to pursue study abroad for their bachelors or masters.',
    verified: true,
  },
  {
    id: 'rev-2',
    author: 'Pratheek R.L.',
    initials: 'PR',
    rating: 5,
    date: '2 months ago',
    role: 'MS ECE, North Carolina State University',
    text: 'Excellent career counselling and guidance by ORI6IN. They helped me throughout my journey of coming to the US for my Master’s, starting from shortlisting universities and choosing the right program to preparing for the visa interview. I would especially like to thank Munmi Hazarika for all the guidance and support throughout the process. She was always available whenever I had questions and made sure I was well prepared at every step. Her guidance and experience made the whole process much easier and gave me a lot of confidence, especially during the visa process. I’m really thankful for all the help and would definitely recommend ORI6IN to anyone planning to pursue their studies in the US.',
    verified: true,
  },
  {
    id: 'rev-3',
    author: 'Sreeraj N',
    initials: 'SN',
    rating: 5,
    date: '2 months ago',
    role: 'MBA, Boston University (9 Yrs IT Experience)',
    text: 'Pursuing an MBA after 9 years of professional experience was an important step in my career journey. After my B.Tech, I worked in the IT industry as a Business Analyst for 9 years, so returning to academics after such a long gap and being disconnected from the application preparation process felt quite challenging. However, the guidance I received from Ms. Munmi Hazarika and the Ori6in Education team made it much easier for me to get back on track. They helped me understand my options, shortlist suitable universities, strengthen my application, and complete the required documentation with clarity and confidence. Their support was personalized, responsive, and consistent throughout the process. I am happy to have secured admission to the MBA program at Boston University, and I sincerely appreciate Ms. Munmi Hazarika and the Ori6in Education team for their contribution to this achievement.',
    verified: true,
  },
  {
    id: 'rev-4',
    author: 'Jobin Joseph',
    initials: 'JJ',
    rating: 5,
    date: '2 months ago',
    role: 'PhD & Research University Applicant',
    text: 'Highly recommended! I wholeheartedly recommend ORI6IN Education to anyone serious about pursuing higher education abroad. From strategic profile building and PhD university shortlisting to end-to-end application support and U.S. visa guidance, every stage of the process was handled with exceptional professionalism and expertise. The team has a deep understanding of research-focused profiles and helped present my academic and professional background in the strongest possible way for top universities. Their personalized guidance, attention to detail, and constant support made the entire journey smooth and stress-free. If you\'re looking for a trustworthy and knowledgeable study abroad consultancy, ORI6IN Education is an excellent choice.',
    verified: true,
  },
  {
    id: 'rev-5',
    author: 'Clinton Soans',
    initials: 'CS',
    rating: 5,
    date: 'a month ago',
    role: 'Career Counselling & Higher Education Candidate',
    text: 'I had a really good experience with Ori6in Education. I was honestly quite confused about what career path to choose and where to start, but Munmi was really helpful throughout the process. She took the time to understand my interests and explained the different options clearly without making it feel overwhelming. The counselling sessions were very useful and gave me a much better idea of what I should focus on for my future. Munmi was also very approachable and patient whenever I had questions. Really happy with the guidance I received from Ori6in. Would definitely recommend them to students who are confused about their career or higher education options.',
    verified: true,
  },
  {
    id: 'rev-6',
    author: 'Animesh Dubey',
    initials: 'AD',
    rating: 5,
    date: '2 months ago',
    role: 'MS Materials Science & Engineering, University of Washington, Seattle',
    text: 'I had a great experience working with Munmi Hazarika Ma\'am throughout my master\'s application journey. She was knowledgeable, approachable, and always willing to answer my questions with patience. Her guidance on university selection, application strategy, document preparation, and the overall admission process helped me stay organized and confident. She provided timely support at every stage, from reviewing my application materials to ensuring all requirements were completed correctly. I especially appreciated her professionalism, prompt communication, and genuine interest in helping me achieve my goals. Thanks to her guidance, I successfully secured admission to the Master of Science in Materials Science & Engineering program at the University of Washington, Seattle. I would highly recommend Munmi Ma\'am to anyone planning to pursue higher education abroad and looking for reliable, dedicated, and knowledgeable counseling support.',
    verified: true,
  },
  {
    id: 'rev-7',
    author: 'AKHILESH PR',
    initials: 'AP',
    rating: 5,
    date: '2 months ago',
    role: 'MS Data Science and Analytics, Claremont Graduate University',
    text: 'Excellent career counseling service by ORI6IN. They covered everything from shortlisting Universities to Preparation for Visa interview as well. I would also like to thank and recommend Munmi who helped me get through the process more easy making sure I submitted all my documents on time.',
    verified: true,
  },
  {
    id: 'rev-8',
    author: 'Jason Stevenson',
    initials: 'JS',
    rating: 5,
    date: '5 months ago',
    role: 'Verified Candidate',
    text: '5-star guidance and career support from the ORI6IN team. Very prompt and professional assistance throughout the process.',
    verified: true,
  },
  {
    id: 'rev-9',
    author: 'Harshvardhan Sharma',
    initials: 'HS',
    rating: 5,
    date: 'a month ago',
    role: 'Verified Candidate',
    text: 'Outstanding counselling and profiling guidance. Clear roadmaps and great attention to detail.',
    verified: true,
  },
  {
    id: 'rev-10',
    author: 'Hiya Kulshreshtha',
    initials: 'HK',
    rating: 5,
    date: 'a month ago',
    role: 'Verified Candidate',
    text: 'Extremely supportive and knowledgeable counsellors. Made the study-abroad preparation process seamless.',
    verified: true,
  },
  {
    id: 'rev-11',
    author: 'Kavana P',
    initials: 'KP',
    rating: 5,
    date: '2 months ago',
    role: 'Verified Candidate',
    text: 'Great experience with ORI6IN Education! Transparent advice and continuous mentoring for universities and visas.',
    verified: true,
  },
  {
    id: 'rev-12',
    author: 'Veronica Verma',
    initials: 'VV',
    rating: 5,
    date: 'a month ago',
    role: 'Verified Candidate',
    text: 'Highly professional and responsive team. They took care of every step with genuine personal attention.',
    verified: true,
  },
  {
    id: 'rev-13',
    author: 'CINDRELLA JAYS',
    initials: 'CJ',
    rating: 5,
    date: '6 months ago',
    role: 'Verified Candidate',
    text: 'Very helpful and dependable counselling. Always ready to guide and clear any doubts patiently.',
    verified: true,
  },
  {
    id: 'rev-14',
    author: 'Amaresh Ganesan',
    initials: 'AG',
    rating: 5,
    date: 'a month ago',
    role: 'Verified Candidate',
    text: 'Top notch higher-education mentoring and profile shortlisting support. Highly recommended!',
    verified: true,
  },
  {
    id: 'rev-15',
    author: 'Shardul Kulkarni',
    initials: 'SK',
    rating: 5,
    date: 'a month ago',
    role: 'Verified Candidate',
    text: 'Exceptional mentoring quality and hands-on guidance for applications and interviews.',
    verified: true,
  },
  {
    id: 'rev-16',
    author: 'MAHAMMAD RAFIK SADDAPALLI',
    initials: 'MS',
    rating: 5,
    date: 'a month ago',
    role: 'Verified Candidate',
    text: 'Smooth and structured assistance at every stage. Very thankful to the team for their dedication.',
    verified: true,
  },
  {
    id: 'rev-17',
    author: 'Anjana Rajak',
    initials: 'AR',
    rating: 5,
    date: '3 months ago',
    role: 'Verified Candidate',
    text: 'Great experience with ORI6IN. Friendly counsellors and timely application support.',
    verified: true,
  },
  {
    id: 'rev-18',
    author: 'Nadia S Sait',
    initials: 'NS',
    rating: 5,
    date: '3 months ago',
    role: 'Verified Candidate',
    text: 'Prompt, encouraging, and detailed counselling. Would definitely recommend ORI6IN to friends and family.',
    verified: true,
  },
];

export type OfficeLocation = {
  id: string;
  name: string;
  kind: 'headquarters' | 'satellite';
  city: string;
  state: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  mapsQuery: string;
};

export const OFFICE_LOCATIONS: OfficeLocation[] = [
  {
    id: 'bengaluru-hq',
    name: 'Bengaluru Headquarters & Flagship Centre',
    kind: 'headquarters',
    city: 'Bengaluru',
    state: 'Karnataka',
    address:
      'Ori6in Education, 1315, 25th Main Rd, Kottapalya, Jayanagara 9th Block, JAYANAGAR, Bengaluru, Karnataka 560041',
    phone: '+91 91130 88519',
    email: 'info@ori6ineducation.com',
    hours: 'Mon – Sat: 9:30 AM – 7:00 PM · Sunday by appointment',
    mapsQuery: 'Ori6in+Education+1315+25th+Main+Rd+Kottapalya+Jayanagara+9th+Block+Bengaluru+Karnataka+560041',
  },
  {
    id: 'guwahati-satellite',
    name: 'Guwahati Satellite Centre',
    kind: 'satellite',
    city: 'Guwahati',
    state: 'Assam',
    address: 'Satellite Office · Northeast Regional Desk, Guwahati, Assam',
    phone: '+91 91130 88519',
    email: 'guwahati@ori6ineducation.com',
    hours: 'Mon – Sat: 10:00 AM – 6:30 PM (Counselling by Appointment & Online)',
    mapsQuery: 'Guwahati+Assam',
  },
];

export const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    handle: '@ori6ineducation',
    url: 'https://www.instagram.com/ori6ineducation/',
    icon: 'instagram',
  },
  {
    name: 'LinkedIn',
    handle: 'ORI6IN Education',
    url: 'https://www.linkedin.com/company/ori6in-education',
    icon: 'linkedin',
  },
  {
    name: 'WhatsApp',
    handle: '+91 91130 88519',
    url: 'https://wa.me/919113088519',
    icon: 'whatsapp',
  },
  {
    name: 'YouTube',
    handle: 'ORI6IN Education',
    url: 'https://www.youtube.com/@ori6ineducation',
    icon: 'youtube',
  },
  {
    name: 'X (Twitter)',
    handle: '@ori6inedu',
    url: 'https://x.com/ori6inedu',
    icon: 'x',
  },
] as const;
