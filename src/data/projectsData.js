export const projects = [
  {
    slug: "spinx-club",
    title: "SPINX CLUB",
    role: "Full Stack Blockchain Developer (Intern)",
    services: ["Full Stack Development", "WebSockets", "Wallet Integration", "UI/UX Implementation"],
    heroImage: "/projects/spinx_club/hero.png",
    thumbnail: "/projects/spinx_club/thumb.svg",
    year: "2024",
    intro: [
      "SpinX Club is a premium luxury online casino platform I developed during my internship at SixtyNine Galaxies. This project required building a robust full-stack architecture capable of handling high-frequency transactions and real-time multiplayer updates.",
      "As a Full Stack Blockchain Developer, I was responsible for crafting the responsive frontend UI, integrating secure wallet functionalities for deposits and withdrawals, and setting up WebSocket connections to power live betting feeds and multiplayer gaming environments.",
    ],
    outcomesList: [
      "Real-time WebSocket Integration",
      "Secure Crypto Wallet System",
      "Comprehensive Game Portfolio"
    ],
    sections: [
      {
        id: "luxury-casino-architecture",
        heading: "Luxury Casino Architecture & UI",
        body: "The core frontend was designed to evoke a sense of luxury and exclusivity. I implemented a highly responsive, modern interface with smooth navigation, allowing users to seamlessly browse a vast portfolio of in-house games including Blackjack, Dice, Limbo, Mines, Plinko, and Roulette.",
        image: "/projects/spinx_club/all-games-cards.png",
      },
      {
        id: "real-time-websockets",
        heading: "Real-time WebSockets & Live Bets",
        body: "To recreate the thrill of a live casino floor, I integrated WebSockets to stream real-time betting activity across the platform. This feature instantly broadcasts live bets, large multipliers, and user winnings, significantly increasing user engagement and platform transparency.",
        image: "/projects/spinx_club/live-bets-websocket.png",
      },
      {
        id: "game-blackjack",
        heading: "Blackjack Integration",
        body: "I implemented a fully functional Blackjack experience, complete with split, double down, and insurance mechanics. The frontend state management meticulously handles card dealing animations, player hands, and dealer logic, ensuring a smooth and authentic casino feel.",
        image: "/projects/spinx_club/game-blackjack.png",
      },
      {
        id: "game-dice",
        heading: "Dice Mechanics",
        body: "The Dice game relies heavily on provably fair random number generation. I designed an interactive slider UI that allows players to instantly adjust their win chance and payout multipliers, featuring real-time probability calculations and instant roll execution.",
        image: "/projects/spinx_club/game-dice.png",
      },
      {
        id: "game-limbo",
        heading: "Limbo Multipliers",
        body: "Limbo is a fast-paced crash-style game where players bet on a target multiplier. I focused on the core animation loop and rapid execution, ensuring the rapidly escalating numbers provide thrilling feedback before the inevitable crash.",
        image: "/projects/spinx_club/game-limbo.png",
      },
      {
        id: "game-mines",
        heading: "Mines Sweeper",
        body: "The Mines game introduces grid-based logic and progressive multipliers. I engineered the board interactions, allowing users to safely uncover gems while managing their risk, culminating in a robust cash-out mechanism.",
        image: "/projects/spinx_club/game-mines.png",
      },
      {
        id: "game-plinko",
        heading: "Plinko Physics",
        body: "For Plinko, I integrated a physics-based animation system that dynamically routes falling balls through a pegboard. The result is a highly engaging visual experience where the ball's final resting place corresponds directly to dynamic multiplier payouts.",
        image: "/projects/spinx_club/game-plinko.png",
      },
      {
        id: "game-the-hunt",
        heading: "The Hunt",
        body: "The Hunt is a unique, proprietary casino offering that required a specialized UI/UX. I developed the custom game loop and interactive grid where players search for hidden multipliers, balancing anticipation with high-stakes mechanics.",
        image: "/projects/spinx_club/game-the-hunt.png",
      },
      {
        id: "game-wheel",
        heading: "Wheel of Fortune",
        body: "I implemented the Wheel of Fortune featuring a smooth, physics-based spinning animation. The segmented payout logic is synchronized perfectly with server-client states, guaranteeing fair and visually satisfying results for every spin.",
        image: "/projects/spinx_club/game-wheel.png",
      },
      {
        id: "wallet-transactions",
        heading: "Wallet, Deposits & Withdrawals",
        body: "A secure financial ecosystem is the backbone of any online casino. I built intuitive interfaces for the integrated wallet, allowing users to easily view their balances, initiate deposits via various crypto networks, and manage automated withdrawals safely and securely.",
        image: "/projects/spinx_club/wallet-balance.png",
      },
      {
        id: "affiliate-program",
        heading: "Affiliate Program & User Perks",
        body: "To drive user acquisition and retention, I implemented the frontend for the affiliate dashboard. This system allows users to generate referral codes, track their referred traffic in real-time, and automatically claim commission perks based on the betting volume of their network.",
        image: "/projects/spinx_club/affiliate-program.png",
      },
      {
        id: "internship-completion",
        heading: "Internship Completion & Validation",
        body: "This project served as the capstone of my industrial internship at SixtyNine Galaxies. Successfully delivering a full-stack, real-time application of this scale validated my skills as a Full Stack Blockchain Developer and provided invaluable experience in building production-ready, high-traffic systems.",
        image: "/projects/spinx_club/internship-certificate.jpg",
      }
    ],
  },
  {
    slug: "iphone-15-clone",
    title: "IPHONE 15 PRO",
    role: "Frontend Developer",
    services: ["React", "Three.js", "GSAP Animations"],
    heroImage: "/projects/iphone15_website_clone/hero.mp4",
    thumbnail: "/projects/iphone15_website_clone/thumb.png",
    thumbnailMobile: "/projects/iphone15_website_clone/thumb_mobile.png",
    year: "2024",
    intro: [
      "A high-fidelity clone of Apple's iPhone 15 Pro promotional website, built to showcase advanced web animation and 3D rendering capabilities.",
      "I recreated the intricate scroll-driven animations and 3D interactions using <em>React</em>, <em>Three.js</em> (React Three Fiber), and <em>GSAP</em> to deliver an immersive, Apple-like user experience.",
    ],
    outcomesList: [
      "60fps 3D Rendering",
      "Custom Video Carousel",
      "Complex ScrollTrigger Timelines"
    ],
    sections: [
      {
        id: "hero-section",
        heading: "Hero Animation & Video Integration",
        body: "The experience begins with a precise recreation of Apple's cinematic hero section. Using GSAP, the text and UI elements fade in synchronously with the hero video. The video itself is optimized for seamless playback, setting the premium tone immediately upon load.",
        image: "/projects/iphone15_website_clone/hero.mp4",
      },
      {
        id: "video-carousel",
        heading: "Custom Video Carousel",
        body: "A central feature of the clone is the seamless video carousel, allowing users to scrub and swipe through product feature highlights. Built completely from scratch without relying on external carousel libraries, it ensures a buttery smooth navigation experience directly tied to scroll and drag events.",
        image: "/projects/iphone15_website_clone/features.mp4",
      },
      {
        id: "3d-interactive",
        heading: "Interactive 3D Experience",
        body: "Using React Three Fiber, I integrated a highly detailed 3D model of the iPhone 15 Pro. The model dynamically rotates and scales as the user scrolls down the page, providing an interactive product showcase that feels deeply engaging and performant across devices.",
        image: "/projects/iphone15_website_clone/3d-model.mp4",
      },
      {
        id: "premium-ui",
        heading: "Premium UI Detail",
        body: "Every pixel of the layout was meticulously crafted to match Apple's signature design aesthetic. This includes precise typography scaling, deep blacks for OLED pop, subtle glassmorphism effects, and highly refined spacing to create a sense of digital luxury.",
        image: "/projects/iphone15_website_clone/image.png",
      },
      {
        id: "responsive-design",
        heading: "Responsive Design",
        body: "The entire clone is fully responsive. 3D models intelligently downscale, video layouts stack gracefully, and the navigation transforms for a tactile, native-app feel on mobile devices—ensuring the experience is flawless whether viewed on a desktop monitor or a smartphone.",
        image: "/projects/iphone15_website_clone/image1.png",
      }
    ],
  },
  {
    slug: "defichain",
    title: "DEFICHAIN",
    role: "Lead Product Designer",
    services: ["Responsive Design", "Web3 Blockchain Explorer"],
    heroImage: "/projects/hero-defichain.png",
    contentImage: "/projects/content-defichain.png",
    year: "2020",
    intro: [
      "Defichain is a Web3 blockchain, using bitcoin layer 2 to create on-chain solutions.",
      'I joined the team as Lead product designer and worked on their light <em>wallet</em>, <em>consortium</em>, <em>branding</em> and showcased here, their ERC-20 blockchain explorer for DefiMetaChain, their cross chain solution.',
    ],
    outcomesList: [
      "72% decrease in search time",
      "40% above user engagement targets",
      "3 new ecosystem DeFi products"
    ],
    sections: [
      {
        id: "what-is-blockchain-explorer",
        heading: "What is a blockchain explorer",
        body: "A blockchain explorer allows users to access details related to transactions on specific blockchains and wallet addresses; including amounts transacted, sources and destinations of funds, and the status of the transactions themselves. It serves as a transparency tool that is fundamental to the decentralized ethos of blockchain technology.",
      },
      {
        id: "where-we-started",
        heading: "Where we started",
        body: "The project began with an extensive research phase to understand the needs of DefiMetaChain users. We conducted user interviews, analyzed competitor products, and mapped out the core user journeys. The initial challenge was creating a viable MVP solution for an ERC-20 blockchain explorer that could handle the complexity of cross-chain transactions while remaining intuitive for both novice and experienced users.",
        image: "/projects/content-defichain.png",
      },
      {
        id: "desired-outcomes",
        heading: "Desired Outcomes",
        body: "There was an opportunity for us to learn about DefiMetaChain potential users. What would they need from this product? Our goals included reducing the time to find transaction details by 60%, creating an intuitive search experience, and building a design system that could scale across the entire DeFi ecosystem.",
      },
      {
        id: "work-process",
        heading: "Work process",
        body: "As the Lead on this project I was responsible for overseeing the end-to-end design process including user research, validation of studies, documenting solutions, creating high quality UI designs and design system contributions and working closely with cross-functional teams to ensure that the design aligns with DefiMetaChain's design and goals.",
        image: "/projects/content-defichain.png",
      },
      {
        id: "outcomes",
        heading: "Outcomes",
        body: "The blockchain explorer launched successfully with overwhelmingly positive feedback from the community. Transaction search times decreased by 72%, and user engagement metrics exceeded our initial targets by 40%. The design system we created became the foundation for three additional DeFi products within the ecosystem.",
      },
    ],
  },
  {
    slug: "tyme-bank",
    title: "TYME BANK",
    role: "Senior UI/UX Designer",
    services: ["Mobile Banking", "Fintech Platform"],
    heroImage: "/projects/hero-tymebank.png",
    contentImage: "/projects/content-tymebank.png",
    year: "2022",
    intro: [
      "Tyme Bank is a digital-first bank revolutionizing personal finance in emerging markets through accessible, mobile-native banking solutions.",
      'I led the redesign of their core <em>mobile banking</em> experience, focusing on <em>investment features</em>, <em>card management</em>, and the overall user journey for a growing user base of over 8 million customers.',
    ],
    outcomesList: [
      "3.7 million user",
      "600% YoY Growth",
      "250k avg user gain per month"
    ],
    sections: [
      {
        id: "the-challenge",
        heading: "The Challenge",
        body: "Tyme Bank needed to evolve from a basic transactional banking app into a comprehensive financial management platform. The challenge was adding sophisticated features like investment portfolios, budgeting tools, and rewards programs without overwhelming users who primarily came from unbanked or underbanked backgrounds.",
      },
      {
        id: "research-insights",
        heading: "Research & Insights",
        body: "Through extensive field research across South Africa, we discovered that our users valued simplicity and trust above all else. Many were first-time smartphone users, and their relationship with traditional banking was fraught with anxiety. These insights shaped our design philosophy: progressive disclosure, clear visual hierarchies, and reassuring micro-interactions.",
        image: "/projects/content-tymebank.png",
      },
      {
        id: "design-system",
        heading: "Design System",
        body: "We built a comprehensive design system from the ground up — 'Tyme Elements' — encompassing 200+ components, a carefully crafted color system optimized for accessibility, and a typography scale that worked across devices of varying screen sizes and resolutions. Every component was tested for readability in bright sunlight conditions.",
      },
      {
        id: "investment-feature",
        heading: "Investment Feature",
        body: "The GoalSave investment feature was designed to make investing accessible to first-time investors. We used familiar metaphors — piggy banks, progress bars, celebration animations — to demystify the investment process. The feature contributed to a 340% increase in investment product adoption within the first quarter of launch.",
        image: "/projects/content-tymebank.png",
      },
      {
        id: "results",
        heading: "Results",
        body: "The redesigned app saw a 58% increase in daily active users, a 45% reduction in support tickets, and won the 'Best Digital Banking Experience' award at the African Fintech Awards 2023. App store ratings improved from 3.2 to 4.7 stars across both platforms.",
      },
    ],
  },
  {
    slug: "nexus-ai",
    title: "NEXUS AI",
    role: "Creative Director",
    services: ["AI Dashboard", "Data Visualization"],
    heroImage: "/projects/hero-nexusai.png",
    contentImage: "/projects/content-nexusai.png",
    year: "2023",
    intro: [
      "Nexus AI is an enterprise intelligence platform that transforms complex machine learning workflows into intuitive visual experiences for data teams.",
      'I directed the creative vision for the entire <em>dashboard ecosystem</em>, including <em>real-time analytics</em>, <em>model monitoring</em>, and the collaborative workspace that enables teams to build and deploy AI models without writing code.',
    ],
    sections: [
      {
        id: "vision",
        heading: "Vision & Direction",
        body: "The vision was to create an AI platform that felt less like a technical tool and more like a creative workspace. We drew inspiration from music production software and video editing tools — environments where complex operations are made tangible through visual metaphors and direct manipulation interfaces.",
      },
      {
        id: "data-visualization",
        heading: "Data Visualization",
        body: "We developed a custom visualization library that could render millions of data points in real-time while maintaining 60fps performance. Each visualization type was designed to tell a story — from training loss curves that show model learning patterns to attention heatmaps that reveal what the AI focuses on during inference.",
        image: "/projects/content-nexusai.png",
      },
      {
        id: "collaborative-workspace",
        heading: "Collaborative Workspace",
        body: "The workspace was designed around the concept of 'AI canvases' — infinite, zoomable spaces where team members could arrange model components, data pipelines, and evaluation metrics in spatial layouts that made sense to their workflow. Real-time collaboration features allowed multiple team members to work simultaneously.",
      },
      {
        id: "model-monitoring",
        heading: "Model Monitoring",
        body: "We designed an alert system that could surface model drift, data quality issues, and performance degradation through an intuitive traffic-light system. Complex statistical concepts were translated into plain language notifications, making it possible for non-technical stakeholders to understand model health at a glance.",
        image: "/projects/content-nexusai.png",
      },
      {
        id: "impact",
        heading: "Impact",
        body: "Nexus AI reduced the average time-to-deployment for ML models from 6 weeks to 5 days. The platform was adopted by 150+ enterprise teams within the first year, and the visualization framework was open-sourced, garnering 12,000+ GitHub stars. The project was featured in MIT Technology Review's 'Best Enterprise AI Tools of 2024'.",
      },
    ],
  },
];

export function getProjectBySlug(slug) {
  return projects.find((p) => p.slug === slug) || null;
}

export function getNextProject(slug) {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return projects[0];
  return projects[(index + 1) % projects.length];
}

export function getAllSlugs() {
  return projects.map((p) => p.slug);
}
