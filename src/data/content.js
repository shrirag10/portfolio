export const personalInfo = {
  name: "Shriman Raghav Srinivasan",
  title: "Mechatronics & Robotics Engineer",
  tagline: "Accelerating Material Flow with Autonomy & Intelligent Coordination",
  email: "srinivasan.shrim@northeastern.edu",
  phone: "+1 (857) 269-7945",
  location: "Boston, MA",
  linkedin: "https://www.linkedin.com/in/shriman-raghav",
  github: "https://github.com/shrirag10",
  scholar: "https://scholar.google.com/citations?user=YOUR_ID",
  resumeUrl: "/content/documents/Shriman_s_Resume__Robotics_Manufacturing_1.pdf",
  hobbies: ["Formula 1 Racing", "Playing Mridangam", "3D Printing"],
  about: [
    "I am an enthusiastic, results-driven professional with a deep passion for Robotics Engineering! My interests span the fields of Manufacturing and Robotics, and with two years of impactful work experience under my belt, I am eager to dive deeper into the vast world of Robotics.",
    "Currently, I'm pursuing my Master's in Robotics at Northeastern University, Boston, with a focus on Mechanical concentration. With hands-on experience deploying AMR systems in manufacturing environments at Tesla and Hero MotoCorp, I bridge the gap between cutting-edge robotics research and real-world industrial applications.",
    "I am truly passionate about harnessing technology to spark innovation and tackle complex engineering challenges!"
  ]
}

export const experiences = [
  {
    id: "tesla",
    title: "Manufacturing Equipment Engineer Intern",
    company: "Tesla Inc.",
    location: "Fremont, CA",
    date: "April 2025 – December 2025",
    companyPhoto: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png",
    description: [
      "Driving deployment of autonomous forklift AMRs using SLAM, LiDAR, and 3D pallet vision, projected to deliver $2.04M in cost savings",
      "Programmed AMR path planning using penalty-optimized Theta* algorithm, reducing routing complexity by 83%",
      "Developed RAG-based AI LLM agent for machine documentation, reducing diagnostic response time by 17%",
      "Engineering DFMEA enhancements for AGV operations targeting 35% downtime reduction"
    ],
    tags: ["AMR", "SLAM", "LiDAR", "Path Planning", "LLM", "DFMEA"]
  },
  {
    id: "hero-manager",
    title: "Assistant Manager - Robotics Engineer",
    company: "Hero MotoCorp Limited",
    location: "Tirupati, India",
    date: "2023 – 2024",
    companyPhoto: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Hero_MotoCorp_Logo.svg/320px-Hero_MotoCorp_Logo.svg.png",
    description: [
      "As a Robotics Engineer at Hero Motorsport's EV plant in the south of India, optimized production throughput through implementation of Automation and Robotics in the manufacturing plant",
      "Delivered 67% reduction in pallet unloading time by engineering zero-height pallet lifters",
      "Tripled pallet handling throughput by eliminating forklift operations on factory floor",
      "Achieved 32% increase in JIT material loading efficiency through RRT-based AMR path planning"
    ],
    tags: ["AMR", "RRT", "Path Planning", "Manufacturing", "Automation", "EV"]
  },
  {
    id: "hero-production",
    title: "Production Engineer",
    company: "Hero MotoCorp",
    location: "Neemrana, India",
    date: "2023",
    companyPhoto: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Hero_MotoCorp_Logo.svg/320px-Hero_MotoCorp_Logo.svg.png",
    description: [
      "As a production engineer at Hero's EV battery pack division, learned about EV battery production processes",
      "Effectively managed production output and quality control measures",
      "Implemented process improvements for battery assembly line efficiency"
    ],
    tags: ["Production", "EV Battery", "Quality Control", "Manufacturing"]
  },
  {
    id: "hero-trainee",
    title: "Graduate Engineer Trainee - Projects",
    company: "Hero MotoCorp",
    location: "Neemrana, India",
    date: "2022 – 2023",
    companyPhoto: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Hero_MotoCorp_Logo.svg/320px-Hero_MotoCorp_Logo.svg.png",
    description: [
      "As a Graduate Engineer at Hero's completely automated Parts fulfillment center, optimized material movement using Robotics such as AMRs and RGVs",
      "Led initiatives that increased profitability by 23% through automation improvements",
      "Implemented sampling-based path planning for dynamic obstacle avoidance"
    ],
    tags: ["AMR", "RGV", "Automation", "Path Planning", "Material Handling"]
  }
]

export const projects = [
  {
    id: "tesla-amr",
    title: "Autonomous Forklift AMR System",
    subdomain: "Manufacturing",
    type: "professional",
    company: "Tesla Inc.",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png",
    category: "Industrial Robotics",
    description: "Deployment and refinement of autonomous forklift AMRs at Tesla, leveraging SLAM, LiDAR, and 3D pallet vision for automated material handling in manufacturing.",
    featured: true,
    image: "/images/extracted/industrial/image8.jpg",
    tech: ["SLAM", "LiDAR", "3D Vision", "Python"],
    date: "2025",
    role: "Lead Engineer",
    details: {
      overview: "Led the deployment and continuous refinement of autonomous forklift AMRs at Tesla's Fremont facility. The system uses advanced SLAM algorithms, LiDAR perception, and 3D pallet vision to automate pallet handling operations.",
      challenge: "Manufacturing floors present complex navigation challenges with dynamic obstacles, varying lighting conditions, and the need for precise pallet manipulation.",
      solution: "Developed custom perception pipelines for 3D pallet detection and pose estimation. Created comprehensive DFMEA documentation for system reliability to ensuring seamless integration with fleet management.",
      results: [
        "Projected $2.04M in annual cost savings through headcount optimization",
        "35% targeted downtime reduction through DFMEA enhancements",
        "Seamless integration with existing fleet management systems",
        "Improved safety metrics in material handling zones"
      ],
      internalGithub: "https://github.tesla.com/shsrinivasan",
      internalGithubNote: "Note: This link is only accessible within the Tesla network."
    }
  },
  {
    id: "tesla-theta-star",
    title: "Theta* Automated Path Planning",
    subdomain: "Path Planning",
    type: "professional",
    company: "Tesla Inc.",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png",
    category: "Algorithm Development",
    description: "Programmed AMR path planning using penalty-optimized Theta* algorithm, reducing routing complexity by 83% for efficient navigation in complex layouts.",
    featured: true,
    image: "/images/extracted/industrial/image8.jpg",
    tech: ["Theta*", "Path Planning", "C++", "Optimization"],
    date: "2025",
    role: "Robotics Engineer",
    details: {
      overview: "Developed and implemented a penalty-optimized Theta* algorithm for AMR path planning to address inefficiencies in standard grid-based navigation.",
      challenge: "Standard A* creates jagged paths constrained to grids, while post-smoothing is computationally expensive. The system required smooth, natural paths in real-time.",
      solution: "Implemented Theta* with custom cost penalties for proximity to static obstacles and dynamic zones. Optimized for any-angle path planning to reduce path length and turning maneuvers.",
      results: [
        "83% reduction in routing complexity",
        "Generated smooth, any-angle trajectories",
        "Reduced travel time and mechanical wear on AMRs",
        "Real-time replanning capabilities enabled"
      ]
    }
  },
  {
    id: "hero-pallet",
    title: "Zero-Height Pallet Lifter",
    subdomain: "Manufacturing",
    type: "professional",
    company: "Hero MotoCorp",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Hero_MotoCorp_Logo.svg/320px-Hero_MotoCorp_Logo.svg.png",
    category: "Industrial Automation",
    description: "Designed and implemented zero-height pallet lifters to optimize material handling at Hero MotoCorp's EV plant, significantly reducing unloading time.",
    featured: true,
    image: "/images/extracted/industrial/image2.png",
    tech: ["SolidWorks", "PLC", "Hydraulics", "Automation"],
    date: "2024",
    role: "Assistant Manager - Robotics",
    details: {
      overview: "Engineered zero-height pallet lifters for the EV plant material handling system to streamline the unloading process.",
      challenge: "Manual offloading and traditional forklift operations were bottlenecks, causing delays and safety concerns on the factory floor.",
      solution: "Designed a custom zero-height lifting mechanism that allows direct pallet jack access, integrated with the plant's automated workflow.",
      results: [
        "Delivered 67% reduction in pallet unloading time",
        "Eliminated need for forklift operations in the specific zone",
        "Improved worker ergonomics and safety",
        "Seamless integration with AMR material flow"
      ]
    }
  },
  {
    id: "hero-amr",
    title: "AMR Fleet & Path Planning",
    subdomain: "Perception-SLAM",
    type: "professional",
    company: "Hero MotoCorp",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Hero_MotoCorp_Logo.svg/320px-Hero_MotoCorp_Logo.svg.png",
    category: "Mobile Robotics",
    description: "Optimized material movement using AMRs and RGVs, achieving significant efficiency gains through RRT-based path planning and dynamic obstacle avoidance.",
    featured: true,
    image: "/images/extracted/industrial/image3.png",
    tech: ["AMR", "RRT", "Path Planning", "Fleet Management"],
    date: "2023",
    role: "Graduate Engineer Trainee",
    details: {
      overview: "Managed and optimized the automated parts fulfillment center using a fleet of Autonomous Mobile Robots (AMRs) and Rail Guided Vehicles (RGVs).",
      challenge: "Inefficient routing and dynamic obstacles in a busy warehouse environment led to delays in Just-In-Time (JIT) material delivery.",
      solution: "Implemented sampling-based path planning (RRT) for dynamic obstacle avoidance and optimized fleet coordination algorithms.",
      results: [
        "Achieved 32% increase in JIT material loading efficiency",
        "Increased profitability by 23% through automation improvements",
        "Robust navigation in dynamic environments",
        "Tripled pallet handling throughput"
      ]
    }
  },
  {
    id: "hero-battery",
    title: "EV Battery Production Optimization",
    subdomain: "Manufacturing",
    type: "professional",
    company: "Hero MotoCorp",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Hero_MotoCorp_Logo.svg/320px-Hero_MotoCorp_Logo.svg.png",
    category: "Process Engineering",
    description: "Managed production output and implemented process improvements for the EV battery pack division, ensuring high quality and efficiency.",
    featured: false,
    image: "/images/extracted/industrial/image10.jpg",
    tech: ["Process Engineering", "Quality Control", "EV Battery", "Manufacturing"],
    date: "2023",
    role: "Production Engineer",
    details: {
      overview: "Oversaw the EV battery pack assembly line, focusing on production targets and quality assurance.",
      challenge: "Meeting aggressive production targets while maintaining strict quality standards for EV battery safety and performance.",
      solution: "Implemented process improvements and rigorous quality control measures to streamline the assembly line.",
      results: [
        "Effectively managed production output to meet demand",
        "Maintained high quality standards for battery packs",
        "Improved assembly line efficiency",
        "Reduced defect rates through process optimization"
      ]
    }
  },
  {
    id: "maze-solving",
    title: "Maze Solving Robot",
    subdomain: "Control Systems",
    type: "academic",
    companyLogo: "https://upload.wikimedia.org/wikipedia/en/f/fe/Srmseal.png",
    category: "Control Systems",
    description: "Developed an autonomous maze-solving robot using flood-fill and PID algorithms, optimizing path length and traversal time.",
    featured: true,
    image: "/content/CSE_Total Path Length per Maze.png",
    tech: ["C++", "PID Control", "Embedded Systems", "Flood Fill"],
    date: "2022",
    role: "Lead Developer",
    details: {
      overview: "Designed and built a maze-solving robot capable of autonomously mapping and navigating unknown maze configurations.",
      challenge: "The robot needed to navigate accurately without external sensors like GPS, relying solely on local wall detection and odometry.",
      solution: "Implemented a flood-fill algorithm for maze mapping and path optimization. Tuned PID controllers for precise straight-line motion and turns.",
      results: [
        "Successfully solved 16x16 mazes autonomously",
        "Optimized total path length per maze",
        "Reduced total traversal time significantly",
        "Demonstrated robust control logic"
      ]
    }
  },
  {
    id: "rtab-slam",
    title: "3D Spatial Mapping of Sparse Featured Environments",
    subdomain: "Perception-SLAM",
    type: "academic",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Northeastern_University_seal.svg/1200px-Northeastern_University_seal.svg.png",
    category: "SLAM & Perception",
    description: "This project explores using RTAB-Map (Real-Time Appearance-Based Mapping) to create 3D indoor maps for applications like calculating paint/wallpaper requirements.",
    featured: true,
    image: "/images/extracted/personal/image1.jpg",
    tech: ["ROS2", "RTAB-Map", "ZED Camera", "SLAM", "Python"],
    date: "2024",
    role: "Lead Developer",
    github: "https://github.com/shrirag10/3D-Mapping-RTAB-SLAM",
    details: {
      overview: "Built an autonomous robot mapping system using RTAB-Map SLAM with ZED Mini stereo camera in ROS2. The system creates drift-free maps in challenging GPS-denied environments.",
      challenge: "Testing in Northeastern University's tunnels revealed that mounting the camera on a rolling chair improved stability and accuracy compared to handheld use.",
      solution: "Integrated stereo visual odometry with IMU data using Kalman filtering. Implemented Bayesian loop closure with GTSAM optimization to eliminate accumulated drift.",
      results: [
        "Precise alignment with ground truth maps",
        "Real-time 3D indoor mapping capabilities",
        "Successfully mapped Northeastern University underground tunnels",
        "Cost-effective solution for indoor mapping applications"
      ]
    }
  },
  {
    id: "sensor-fusion",
    title: "GPS & IMU Sensor Fusion for Automotive Dead Reckoning",
    subdomain: "Perception-SLAM",
    type: "academic",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Northeastern_University_seal.svg/1200px-Northeastern_University_seal.svg.png",
    category: "Sensor Fusion",
    description: "Fusing IMU's split-second reflexes with GPS's steady fixes using Extended Kalman Filtering for reliable automotive navigation.",
    featured: true,
    image: "/images/extracted/personal/image2.png",
    tech: ["Python", "Kalman Filter", "MATLAB", "ROS", "GPS", "IMU"],
    date: "2024",
    role: "Lead Developer",
    github: "https://github.com/shrirag10/Dead-Reckoning",
    details: {
      overview: "Developed a sensor fusion system combining GPS and IMU data through Extended Kalman Filtering for reliable vehicle positioning.",
      challenge: "GPS signals can be unreliable in urban environments with multipath effects and signal blockage. IMU sensors accumulate drift over time.",
      solution: "Using MATLAB and ROS, implemented Extended Kalman Filter for optimal sensor fusion with real-time trajectory correction algorithms.",
      results: [
        "Reliable positioning for robotic manipulation tasks",
        "Real-time performance suitable for automotive applications",
        "Proven sensors can thrive in cities where GPS falters",
        "Demonstrated sensor fusion wizardry"
      ]
    }
  },
  {
    id: "llm-astar",
    title: "LLM-Enhanced A* Path Planning",
    subdomain: "Deep Learning",
    type: "academic",
    companyLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Northeastern_University_seal.svg/1200px-Northeastern_University_seal.svg.png",
    category: "AI + Robotics",
    description: "Hybrid path planning system integrating LLM waypoint guidance with classical A* search, achieving significant improvements in node efficiency.",
    featured: true,
    image: "/images/extracted/personal/image3.png",
    tech: ["Python", "LLM", "A*", "PyTorch", "ROS2"],
    date: "2025",
    role: "Lead Developer",
    github: "https://github.com/shrirag10/Improved-LLM-A-star",
    details: {
      overview: "Redesigned and improved the LLM-A* hybrid path planning system from the ground up, integrating refined LLM waypoint guidance with classical A* search.",
      challenge: "Traditional path planning algorithms can be computationally expensive. The goal was to leverage LLM reasoning capabilities to guide classical planners.",
      solution: "Developed a novel integration of LLM-generated waypoint suggestions with A* search. Compared chain-of-thought, minimalistic, and RePE prompting methods.",
      results: [
        "23.4% reduction in node expansions on 10×10 grids",
        "21.6% improvement on 20×20 grids",
        "17.8% boost in waypoint accuracy",
        "Faster, more resource-efficient navigation"
      ]
    }
  },
  {
    id: "laser-cutter",
    title: "Diode Based Laser Cutter for Leather Applications",
    subdomain: "Mechanical",
    type: "academic",
    companyLogo: "https://upload.wikimedia.org/wikipedia/en/f/fe/Srmseal.png",
    category: "Industrial Automation",
    description: "Adaptive Three-Axis Gantry Robot Laser Cutter designed for leather manufacturing, featuring dynamic standoff distance control.",
    featured: false,
    image: "/images/extracted/personal/image4.png",
    tech: ["GRBL", "Raspberry Pi", "CAD", "Control Systems"],
    date: "2023",
    role: "Lead Engineer",
    details: {
      overview: "Designed and built a precision laser cutting system for leather manufacturing applications with a modular aluminum gantry frame.",
      challenge: "Small-scale leather industries need affordable, precise cutting solutions that minimize material wastage.",
      solution: "Implemented GRBL-based control system with Raspberry Pi interface. Added advanced filtration and dynamic standoff distance control.",
      results: [
        "Clean, carbonization-free cuts with high-speed accuracy",
        "Safe, efficient, and user-friendly operations",
        "Minimal material wastage and low energy consumption",
        "Supports intricate cutting and engraving"
      ]
    }
  },
  {
    id: "nano-swarm",
    title: "Nano Swarm Drone",
    subdomain: "Aerial Robotics",
    type: "academic",
    companyLogo: "https://upload.wikimedia.org/wikipedia/en/f/fe/Srmseal.png",
    category: "Aerial Robotics",
    description: "Drone Surveillance System for smart campuses, providing autonomous, real-time monitoring and enhanced security with SWARM capabilities.",
    featured: false,
    image: "/images/extracted/personal/image5.png",
    tech: ["Drone", "SWARM", "GPS", "AI", "Computer Vision"],
    date: "2022",
    role: "Team Lead",
    details: {
      overview: "Advanced surveillance drone system for smart campuses with autonomous monitoring and enhanced security features.",
      challenge: "Campus security needs efficient, scalable monitoring solutions that can cover large areas while detecting anomalies.",
      solution: "Developed drones with GPS-aided navigation, AI-powered obstacle avoidance, and modular chassis. Implemented SWARM capabilities.",
      results: [
        "Autonomous, real-time monitoring capabilities",
        "Precise surveillance and anomaly detection",
        "Emergency response integration",
        "Reliable, scalable campus operations"
      ]
    }
  },
  {
    id: "zerkix-rov",
    title: "Zerkix ROV",
    subdomain: "Underwater Robotics",
    type: "academic",
    companyLogo: "https://upload.wikimedia.org/wikipedia/en/f/fe/Srmseal.png",
    category: "Underwater Robotics",
    description: "Biomimetic Remotely Operated Vehicle (ROV) designed for underwater inspections, inspired by ray fish hydrodynamics.",
    featured: false,
    image: "/images/extracted/personal/image6.jpg",
    tech: ["ROV", "Blue Robotics", "Hydrodynamics", "Control Systems"],
    date: "2022",
    role: "Design Lead",
    details: {
      overview: "Designed a biomimetic ROV for underwater inspections with ray fish-inspired hydrodynamic design.",
      challenge: "Underwater operations require vehicles that can navigate efficiently while maintaining stability.",
      solution: "Created biomimetic chassis with Blue Robotics T200 thrusters and Bar30 pressure sensor. Implemented robust waterproofing.",
      results: [
        "Weight of 10 kg with exceptional performance",
        "Pipeline inspections and marine research capabilities",
        "High-resolution underwater imaging",
        "Reliable rescue mission support"
      ]
    }
  }
]

export const skills = {
  personal: {
    title: "Personal Skills",
    items: ["Problem-Solving & Critical Thinking", "Analytical & Logical Reasoning", "Innovation & Creativity", "Attention to Detail", "Adaptability & Continuous Learning", "Time Management & Prioritization", "Resilience & Persistence", "Independent Research & Self-Learning"]
  },
  robotics: {
    title: "Robotics & Autonomy",
    items: ["SLAM (Simultaneous Localization and Mapping)", "Sensor Fusion & Perception Systems", "Trajectory & Motion Planning", "Kinematics & Dynamics", "Control Systems (PID, Adaptive, MPC)", "Path Planning (A*, RRT, BRRT)", "Machine Vision & Image Processing", "Industrial Robotics (ABB, Fanuc, KUKA, Mitsubishi)"]
  },
  programming: {
    title: "Programming",
    items: ["Python", "C/C++", "CUDA", "SQL", "VBA", "PLC Ladder", "MELFA-BASIC"]
  },
  frameworks: {
    title: "Frameworks & Tools",
    items: ["ROS 2", "OpenCV", "PyTorch", "TensorFlow", "Isaac Sim", "MuJoCo", "Gazebo"]
  },
  hardware: {
    title: "Hardware",
    items: ["LiDAR (2D/3D)", "Stereo Cameras", "IMU", "GPS/RTK", "Jetson Orin", "Arduino", "Raspberry Pi", "PLC"]
  },
  software: {
    title: "Software & DevOps",
    items: ["Git/GitHub", "MATLAB/Simulink", "SolidWorks", "Docker", "Kubernetes", "Splunk", "Power BI", "AutoCAD"]
  }
}

export const education = [
  {
    degree: "Master of Science in Robotics",
    school: "Northeastern University",
    location: "Boston, MA",
    date: "2024 – 2026",
    gpa: "3.78",
    courses: ["Robot Sensing & Navigation", "Mobile Robotics", "Deep Learning for Robotics"],
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Northeastern_University_seal.svg/1200px-Northeastern_University_seal.svg.png"
  },
  {
    degree: "Bachelor of Technology in Mechatronics Engineering",
    school: "SRM Institute of Science & Technology",
    location: "Chennai, India",
    date: "June 2018 – May 2022",
    gpa: "3.81",
    courses: ["Fundamentals of Robotics", "Linear & Digital Control Systems", "Computer Vision"],
    icon: "https://upload.wikimedia.org/wikipedia/en/f/fe/Srmseal.png"
  }
]
