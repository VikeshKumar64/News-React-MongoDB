export const categories = [
  { id: 'technology', name: 'Technology', icon: '💻', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  { id: 'business', name: 'Business', icon: '📈', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  { id: 'science', name: 'Science', icon: '🔬', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  { id: 'health', name: 'Health', icon: '🏥', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  { id: 'sports', name: 'Sports', icon: '⚽', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' },
];

export const articles = [
  {
    id: 1,
    title: 'Google DeepMind Unveils Gemini 2.0: A Major Leap in AI Reasoning',
    excerpt: 'The latest model from Google DeepMind demonstrates unprecedented capabilities in multi-step reasoning, coding, and scientific problem-solving, setting new benchmarks across the industry.',
    content: `Google DeepMind has officially unveiled Gemini 2.0, its most capable AI model to date, representing a significant leap forward in artificial intelligence reasoning capabilities. The new model showcases remarkable improvements in multi-step reasoning, coding assistance, and complex scientific problem-solving.

In benchmark tests conducted by independent researchers, Gemini 2.0 outperformed all previous models including GPT-4 Turbo and Claude 3 Opus on several key metrics. The model demonstrates particularly impressive performance in mathematical reasoning, where it achieved a 94.7% accuracy rate on the MATH benchmark.

One of the most notable improvements in Gemini 2.0 is its ability to break down complex, multi-faceted problems into logical steps and work through them systematically. This "chain-of-thought" reasoning has been enhanced significantly compared to its predecessor.

"What we're seeing with Gemini 2.0 is a model that doesn't just pattern-match answers — it genuinely reasons through problems," said Dr. Sarah Chen, lead researcher at Google DeepMind. "This is a fundamental shift in how AI systems approach complex tasks."

The model is also notably more efficient, using approximately 40% fewer computational resources than Gemini 1.5 while delivering superior performance. This efficiency gain is expected to make the technology more accessible and reduce operational costs for businesses deploying AI solutions.

Google plans to make Gemini 2.0 available through its API and various products over the coming weeks, with enterprise deployments rolling out globally by the end of the quarter.`,
    category: 'technology',
    source: 'The Verge',
    author: 'Emily Chen',
    authorAvatar: 'https://i.pravatar.cc/150?img=1',
    publishedAt: '2026-03-30T10:00:00Z',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80',
    tags: ['AI', 'Google', 'Machine Learning'],
    featured: true,
    trending: true,
  },
  {
    id: 2,
    title: 'SpaceX Successfully Launches Starship on Historic Mars Rehearsal Mission',
    excerpt: 'In a major milestone for human space exploration, SpaceX achieved a near-perfect launch of Starship in its most comprehensive test flight yet, simulating key stages of a Mars mission.',
    content: `SpaceX has achieved a historic milestone with the successful launch of its Starship rocket in what the company calls a "Mars rehearsal mission." The test flight, which lasted approximately 90 minutes, simulated key stages of an eventual crewed mission to Mars, marking a pivotal moment in the history of space exploration.

The mission included a first-of-its-kind orbital refueling demonstration, where a tanker Starship successfully transferred liquid oxygen propellant to the primary vehicle in low Earth orbit. This technology is considered critical for long-duration missions to the Moon and Mars, as spacecraft will need to refuel before embarking on interplanetary journeys.

"Today's flight represents years of engineering work and represents what's possible when you refuse to accept limitations," said Elon Musk via video link from SpaceX headquarters. "Every flight teaches us something new, and this one was our most successful to date."

The Super Heavy booster successfully executed a catch maneuver, being caught by the launch tower's mechanical arms for the second time in Starship's history. Both vehicles demonstrated improved thermal protection systems during reentry, with only minor damage reported compared to previous flights.

NASA, which has selected Starship as the Human Landing System for its Artemis Moon missions, expressed strong satisfaction with the results. The agency is working closely with SpaceX to certify the vehicle for crewed flights.

The next Starship test flight is expected within three months, with engineers incorporating lessons learned from this mission.`,
    category: 'science',
    source: 'Space.com',
    author: 'Marcus Rodriguez',
    authorAvatar: 'https://i.pravatar.cc/150?img=3',
    publishedAt: '2026-03-29T14:30:00Z',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1516242459272-a8bb2e2b09d8?w=800&q=80',
    tags: ['SpaceX', 'Mars', 'Rocket'],
    featured: true,
    trending: true,
  },
  {
    id: 3,
    title: 'Apple Reports Record Q1 Earnings Driven by iPhone 16 and Services Growth',
    excerpt: 'Apple beat Wall Street expectations with revenues of $124 billion in Q1, with the iPhone 16 series accounting for strong hardware sales and Apple Intelligence features driving record services engagement.',
    content: `Apple Inc. reported record-breaking first quarter earnings, surpassing Wall Street estimates with total revenue of $124 billion, a 12% year-over-year increase. The results were driven by strong iPhone 16 series sales and exceptional growth in the company's Services segment, which includes the App Store, Apple Music, iCloud, and the newly launched Apple Intelligence subscription tier.

The iPhone 16 lineup, which introduced significant AI-powered features through Apple Intelligence, proved to be a major catalyst for upgrades from existing iPhone users. The company reported that approximately 45% of iPhone 16 purchasers upgraded from iPhone 12 or older models, indicating strong pent-up demand.

"This quarter reflects the power of our ecosystem and our relentless focus on innovation," said CEO Tim Cook during the earnings call. "Apple Intelligence is fundamentally changing how people interact with their devices, and we're only just getting started."

Services revenue reached $26.3 billion, growing 18% year-over-year and now representing the company's second-largest segment. Apple Intelligence Plus, the company's premium AI subscription launched in January, already has over 15 million paid subscribers globally.

The Mac and iPad segments also showed solid performance, with the new M4 MacBook Air and iPad Pro contributing to an 8% increase in Mac revenue and a 15% jump in iPad revenue.

Looking ahead, Apple provided guidance of $117-$121 billion for Q2, slightly above analyst estimates, suggesting continued momentum through the spring quarter.`,
    category: 'business',
    source: 'Bloomberg',
    author: 'Jessica Park',
    authorAvatar: 'https://i.pravatar.cc/150?img=5',
    publishedAt: '2026-03-28T18:00:00Z',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80',
    tags: ['Apple', 'Earnings', 'iPhone'],
    featured: false,
    trending: true,
  },
  {
    id: 4,
    title: 'Breakthrough Study Reveals New Treatment Approach for Alzheimer\'s Disease',
    excerpt: 'Researchers at Johns Hopkins have discovered a novel mechanism that could revolutionize Alzheimer\'s treatment, showing 78% plaque reduction in early clinical trials with a new compound.',
    content: `Scientists at Johns Hopkins University have announced a groundbreaking discovery that could revolutionize the treatment of Alzheimer's disease. A new compound, designated JH-2847, demonstrated a remarkable 78% reduction in amyloid-beta plaques in early-stage clinical trials, while also showing neuroprotective properties that previous treatments lacked.

The research, published in the journal Nature Medicine, details how JH-2847 works through a dual mechanism — simultaneously clearing existing plaques and preventing new ones from forming, while also reducing neuroinflammation that contributes to cognitive decline.

"What makes this compound different is that it doesn't just target one aspect of the disease," explained Dr. Maria Santos, the study's principal investigator. "Alzheimer's is multifaceted, and our approach addresses multiple pathways simultaneously."

In the Phase 1 clinical trial involving 120 participants with mild-to-moderate Alzheimer's, patients who received JH-2847 showed significantly slower cognitive decline compared to the placebo group over a 12-month period. Crucially, the treatment was well-tolerated with minimal side effects, addressing a major concern with previous amyloid-targeting therapies.

The research team has partnered with pharmaceutical company Meridian Biosciences to advance the compound to Phase 2 trials, which are expected to begin enrollment within the next six months. If successful, the treatment could potentially receive accelerated FDA approval within three to four years.

Experts in the field have called the results "tremendously promising" while noting that larger trials are needed to confirm efficacy and long-term safety.`,
    category: 'health',
    source: 'Nature Medicine',
    author: 'Dr. Alan Wright',
    authorAvatar: 'https://i.pravatar.cc/150?img=8',
    publishedAt: '2026-03-27T09:00:00Z',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
    tags: ['Alzheimer\'s', 'Medical Research', 'Health'],
    featured: false,
    trending: false,
  },
  {
    id: 5,
    title: 'Premier League Title Race Heats Up as Arsenal Leapfrog Manchester City',
    excerpt: 'With just 8 games left in the season, Arsenal reclaimed the top spot in the Premier League table following their emphatic 3-0 victory over Liverpool at the Emirates Stadium.',
    content: `The Premier League title race has taken an exhilarating turn as Arsenal leapfrogged Manchester City at the top of the table following a commanding 3-0 victory over Liverpool at the Emirates Stadium on Sunday. With just eight games remaining in the season, the Gunners now hold a two-point advantage over their closest rivals.

Bukayo Saka was the standout performer, contributing a goal and two assists in what many pundits are calling his finest Premier League performance. Martin Ødegaard's first-half strike and a powerful header from Gabriel Magalhães completed the comfortable victory.

"We knew this was a defining moment in our season," said Arsenal manager Mikel Arteta in the post-match press conference. "The players were absolutely brilliant — their intensity, their quality, their desire. This is what we've been building towards."

Manchester City, who drew 1-1 against Brighton on Saturday, now face a daunting run of fixtures that includes away trips to Tottenham and Chelsea. Meanwhile, Arsenal's remaining schedule appears more favorable, though they still face a crucial away fixture at the Etihad Stadium with five games to go.

Liverpool manager Arne Slot acknowledged that the title race was now between the two Manchester clubs — or rather, Arsenal and the two Manchester clubs — calling it "the most competitive end to a season I've seen in English football."

Chelsea and Tottenham, sitting third and fourth respectively, remain mathematically in contention but would need City or Arsenal to stumble significantly to have any chance of claiming an unlikely title.`,
    category: 'sports',
    source: 'BBC Sport',
    author: 'Tom Bradley',
    authorAvatar: 'https://i.pravatar.cc/150?img=11',
    publishedAt: '2026-03-30T20:00:00Z',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
    tags: ['Football', 'Premier League', 'Arsenal'],
    featured: false,
    trending: true,
  },
  {
    id: 6,
    title: 'Oscars 2026: Complete List of Winners & Stunning Red Carpet Moments',
    excerpt: 'The 98th Academy Awards delivered dramatic surprises with "Echoes of Tomorrow" sweeping seven awards including Best Picture, while the night featured unforgettable fashion and emotional speeches.',
    content: `The 98th Academy Awards ceremony held at the Dolby Theatre in Hollywood delivered one of the most dramatic and entertaining awards nights in recent memory, with the science fiction drama "Echoes of Tomorrow" emerging as the night's big winner, taking home seven awards including the coveted Best Picture.

Director Sofia Amendola made history as only the third woman to win Best Director, accepting the award to a standing ovation. "This is for every young girl who was told science fiction wasn't for her," she said during an emotional acceptance speech.

Best Actor went to Daniel Kaluuya for his transformative performance in "The Foundation," a biographical drama about historical civil rights leaders. He became only the second actor to win the award for two different films.

The Best Actress award went to newcomer Amara Okafor for her devastating performance in "Between Two Worlds," making her the youngest Best Actress winner since Marlee Matlin in 1986.

On the red carpet, fashion was equally striking. Zendaya wore a custom Valentino gown that sparked immediate conversation across social media, while Pedro Pascal opted for a vintage-inspired tuxedo that many fashion critics are calling one of the best-dressed looks in Oscars history.

The ceremony itself ran smoothly under the hosting duties of Quinta Brunson, who received widespread praise for her warm yet sharp wit. Musical performances included a stunning live rendition of "Starlight Road" by Billie Eilish, who won Best Original Song.`,
    category: 'entertainment',
    source: 'Variety',
    author: 'Sophia Laurent',
    authorAvatar: 'https://i.pravatar.cc/150?img=9',
    publishedAt: '2026-03-26T12:00:00Z',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
    tags: ['Oscars', 'Hollywood', 'Movies'],
    featured: false,
    trending: false,
  },
  {
    id: 7,
    title: 'Quantum Computing Milestone: IBM Achieves Error-Free Processing at Scale',
    excerpt: 'IBM has demonstrated error-corrected quantum computing at a scale previously thought impossible, processing 1,000 logical qubits without errors — a breakthrough that could accelerate the quantum advantage era.',
    content: `IBM has achieved a landmark milestone in quantum computing by demonstrating error-free processing at a scale that researchers believe will unlock the first truly practical quantum advantage. The company's newest quantum processor successfully maintained 1,000 logical qubits in a stable, error-corrected state — a feat long considered a crucial threshold for commercially viable quantum computing.

The achievement, which required sophisticated quantum error correction techniques applied across thousands of physical qubits, was described in a paper simultaneously published in Nature and presented at the American Physical Society's annual meeting.

"This is the moment the field has been working toward for decades," said Jay Gambetta, IBM's Vice President of Quantum Computing. "We're not just running quantum algorithms that are better than classical computers — we're running them reliably, repeatedly, without errors corrupting the results."

The implications span multiple industries. In pharmaceutical research, error-free quantum simulation could enable molecular modeling at scales impossible for classical computers, potentially cutting drug discovery timelines from decades to years. In financial services, quantum optimization algorithms could transform portfolio management and risk analysis.

Google and Microsoft, both major players in the quantum computing race, responded positively to IBM's announcement, with Google noting that the breakthrough validates the field's overall approach to error correction, even as the companies remain competitors in commercializing the technology.

IBM announced plans to open cloud access to its error-corrected quantum systems for research institutions within the next 12 months, with commercial enterprise access to follow in 2027.`,
    category: 'technology',
    source: 'Wired',
    author: 'David Kim',
    authorAvatar: 'https://i.pravatar.cc/150?img=15',
    publishedAt: '2026-03-25T11:00:00Z',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
    tags: ['Quantum Computing', 'IBM', 'Technology'],
    featured: false,
    trending: false,
  },
  {
    id: 8,
    title: 'Global Economic Forum 2026: Key Takeaways on Inflation and Growth Outlook',
    excerpt: 'Central bank governors and finance ministers gathered in Davos to assess a surprisingly resilient global economy while acknowledging growing risks from geopolitical tensions and trade fragmentation.',
    content: `The Global Economic Forum 2026 in Davos concluded with cautious optimism about the world economy, as central bank governors, finance ministers, and corporate leaders agreed that the global economy has proven more resilient than expected, while warning about emerging headwinds that could complicate the path forward.

The International Monetary Fund updated its global growth forecast for 2026 upward by 0.3 percentage points to 3.4%, driven by stronger-than-expected performance in India, Southeast Asia, and a stabilizing European economy. The United States, despite earlier fears of a slowdown, maintained solid growth of approximately 2.8%.

Inflation, the dominant concern of the past four years, appears to be largely under control in major economies. Most G7 central banks have completed their rate-cutting cycles or are near the end, with the Federal Reserve now holding rates at 4% following a series of cuts from the peak.

However, attendees identified several key risks: the fragmentation of global trade into regional blocs, climate-related economic disruptions, and structural challenges in China's property sector that continue to weigh on Asian growth.

"We've successfully navigated the post-pandemic adjustment, and that's genuinely encouraging," said IMF Managing Director Kristalina Georgieva, "but we must not become complacent. The structural challenges ahead — particularly around the energy transition and debt sustainability — require bold policy responses."

Emerging market debt sustainability was flagged as a particular concern, with several African and Latin American nations facing refinancing challenges in a still-elevated global interest rate environment.`,
    category: 'business',
    source: 'Reuters',
    author: 'Claire Fontaine',
    authorAvatar: 'https://i.pravatar.cc/150?img=20',
    publishedAt: '2026-03-24T15:00:00Z',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    tags: ['Economy', 'Global Finance', 'Davos'],
    featured: false,
    trending: false,
  },
];

export const getArticleById = (id) => articles.find(a => a.id === parseInt(id));
export const getArticlesByCategory = (category) => 
  category === 'all' ? articles : articles.filter(a => a.category === category);
export const getFeaturedArticles = () => articles.filter(a => a.featured);
export const getTrendingArticles = () => articles.filter(a => a.trending);
export const getCategoryInfo = (id) => categories.find(c => c.id === id);

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
