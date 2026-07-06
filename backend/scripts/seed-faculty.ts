/**
 * seed-faculty.ts
 * Seeds faculty members from the static data into MongoDB.
 * Run: npm run seed:faculty
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Faculty } from '../src/models/Faculty';

dotenv.config();

function buildMongoURI(): string {
  if (process.env.MONGO_URI) return process.env.MONGO_URI;
  const username = process.env.MONGODB_USERNAME;
  const password = process.env.MONGODB_PASSWORD;
  const database = process.env.MONGODB_DATABASE ?? 'cybershield';
  if (username && password) {
    const cluster = process.env.MONGODB_CLUSTER ?? 'cysknowledgehub.sxc3yvo.mongodb.net';
    return `mongodb+srv://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${cluster}/${database}?appName=Cysknowledgehub`;
  }
  return `mongodb://localhost:27017/${database}`;
}

const FACULTY_DATA = [
  {
    name: 'Dr. S. Udhaya Kumar',
    designation: 'Associate Professor',
    email: 'udhayakumar.s@ch.amrita.edu',
    scholarUrl: 'https://scholar.google.com/citations?user=s_udhayakumar',
    bio: 'Associate Professor in the Department of Cyber Security, Amrita School of Engineering, Chennai. His research spans Network Security, Intrusion Detection Systems, and Cloud Computing Security. He has published in several IEEE and Springer journals and actively mentors students on network defence and cloud-based security projects.',
    researchInterests: ['Network Security', 'Intrusion Detection Systems', 'Cloud Computing Security', 'Anomaly Detection'],
    subjects: ['Network Security', 'Cloud Computing', 'Data Communication & Networking', 'Cyber Security Fundamentals'],
  },
  {
    name: 'S. Saravanan',
    designation: 'Assistant Professor (Senior Grade)',
    email: 's_saravanan@ch.amrita.edu',
    bio: 'Assistant Professor (Senior Grade) in the Department of Computer Science and Engineering, Amrita School of Computing, Chennai. Holds a BE and M.E. His research focuses on large-scale cybersecurity analytics, design and development of Big Data technology-based applications, and streaming data analytics.',
    researchInterests: ['Cybersecurity Analytics', 'Big Data Technology', 'Streaming Data Analytics'],
    subjects: ['Big Data Analytics', 'Cyber Security', 'Data Streaming', 'Database Systems'],
  },
  {
    name: 'Dr. K. Venkatesan',
    designation: 'Assistant Professor',
    email: 'k_venkatesan@ch.amrita.edu',
    bio: 'Assistant Professor in the Department of Computer Science and Engineering, Amrita School of Computing, Chennai. His research spans machine learning, AI-based DWDM design, optical system design, embedded and IoT systems, blockchain security, consensus algorithms, and cybersecurity for IoT devices.',
    researchInterests: ['Machine Learning', 'Blockchain Security', 'IoT Cybersecurity', 'Consensus Algorithms', 'Embedded Systems'],
    subjects: ['Machine Learning', 'IoT Systems', 'Blockchain Technology', 'Embedded Systems Security'],
  },
  {
    name: 'Dr. Deepak K.',
    designation: 'Assistant Professor',
    email: 'k_deepak@ch.amrita.edu',
    scholarUrl: 'https://scholar.google.com/citations?user=k_deepak_amrita',
    bio: 'Assistant Professor in the Department of Computer Science and Engineering, Amrita School of Computing, Chennai. His research spans machine learning, deep learning, computer vision, video anomaly detection, human activity detection, and vision-based heart rate estimation.',
    researchInterests: ['Machine Learning', 'Deep Learning', 'Computer Vision', 'Video Anomaly Detection', 'Human Activity Detection'],
    subjects: ['Machine Learning', 'Deep Learning', 'Computer Vision', 'Pattern Recognition'],
  },
  {
    name: 'Dr. G. Saranya',
    designation: 'Assistant Professor',
    email: 'g_saranya@ch.amrita.edu',
    bio: 'Assistant Professor in the Department of Computer Science and Engineering, Amrita School of Computing, Chennai. Holds BSc, MCA, MSc, and Ph.D. Her research interests include software engineering, database management systems, evolutionary algorithms, machine learning, and secure coding.',
    researchInterests: ['Software Engineering', 'Database Management Systems', 'Evolutionary Algorithms', 'Secure Coding'],
    subjects: ['Software Engineering', 'Database Management Systems', 'Machine Learning', 'Secure Coding'],
  },
  {
    name: 'Dr. M. Chandralekha',
    designation: 'Assistant Professor',
    email: 'm_chandralekha@ch.amrita.edu',
    bio: 'Assistant Professor in the Department of Computer Science and Engineering, Amrita School of Computing, Chennai. Her research covers data analytics, data mining, data science, information retrieval techniques, and machine learning.',
    researchInterests: ['Data Analytics', 'Data Mining', 'Data Science', 'Information Retrieval', 'Machine Learning'],
    subjects: ['Data Analytics', 'Data Mining', 'Data Science', 'Machine Learning'],
  },
  {
    name: 'K. Geetha',
    designation: 'Assistant Professor',
    email: 'k_geetha@ch.amrita.edu',
    bio: 'Assistant Professor (OC) in the Department of Cybersecurity, Amrita School of Computing, Chennai. Holds M.Tech., MCA, and Ph.D qualifications.',
    researchInterests: ['Cyber Security'],
    subjects: ['Cyber Security Foundations'],
  },
  {
    name: 'M. Rithani',
    designation: 'Assistant Professor',
    email: 'm_rithani@ch.amrita.edu',
    bio: 'Assistant Professor (OC) in the Department of Computer Science and Engineering, Amrita School of Computing, Chennai. Her research covers big data, cloud computing, security practices, information storage and management, and information forensics and security.',
    researchInterests: ['Big Data', 'Cloud Computing', 'Security Practices', 'Information Forensics & Security'],
    subjects: ['Big Data', 'Cloud Computing Security', 'Information Storage & Management', 'Security Analytics'],
  },
  {
    name: 'D. Sasikala',
    designation: 'Assistant Professor',
    email: 'd_sasikala@ch.amrita.edu',
    bio: 'Assistant Professor in the Department of Computer Science and Engineering, Amrita School of Computing, Chennai. Holds BE, M.E, and Ph.D. Her research interests include machine learning, speech processing, computer architecture, data mining, and data analytics.',
    researchInterests: ['Machine Learning', 'Speech Processing', 'Computer Architecture', 'Data Mining', 'Data Analytics'],
    subjects: ['Machine Learning', 'Data Mining', 'Computer Architecture', 'Data Analytics'],
  },
  {
    name: 'Dr. G. Anitha',
    designation: 'Assistant Professor',
    email: 'g_anitha@ch.amrita.edu',
    bio: 'Assistant Professor in the Department of Computer Science and Engineering, Amrita School of Computing, Chennai. Her research areas include artificial intelligence, machine learning, deep learning, video processing, computer vision, and data science.',
    researchInterests: ['Artificial Intelligence', 'Machine Learning', 'Deep Learning', 'Computer Vision', 'Data Science'],
    subjects: ['Artificial Intelligence', 'Machine Learning', 'Deep Learning', 'Computer Vision'],
  },
];

async function seed() {
  const uri = buildMongoURI();
  console.log(`Connecting to MongoDB...`);
  await mongoose.connect(uri);
  console.log('Connected. Seeding faculty...');

  // Clear existing
  await Faculty.deleteMany({});
  console.log('Cleared existing faculty data.');

  // Insert with proper ordering
  for (let i = 0; i < FACULTY_DATA.length; i++) {
    await Faculty.create({ ...FACULTY_DATA[i], order: i });
  }

  console.log(`Seeded ${FACULTY_DATA.length} faculty members.`);
  await mongoose.disconnect();
  console.log('Done.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
