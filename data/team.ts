/**
 * Team members — structured content layer
 * Replace placeholder photos with real team photos.
 */

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  photo: string | null; // Replace with real path e.g. "/images/team/rajan.jpg"
}

export const team: TeamMember[] = [
  {
    name: "Rajan Chand",
    role: "Founder & Lead Counsellor",
    bio: "With over a decade of experience in education consulting, he founded The Visa Ghar to provide honest, one-on-one guidance for Nepali students navigating the study abroad process.",
    photo: null,
  },
  {
    name: "Sunita Sharma",
    role: "Senior Student Counsellor",
    bio: "Specialises in UK and Australian university applications. Known for meticulous attention to documentation and a high first-attempt visa approval record.",
    photo: null,
  },
  {
    name: "Susan Thapa",
    role: "IELTS & PTE Instructor",
    bio: "Certified English language instructor with experience preparing students for both IELTS Academic and PTE Academic examinations.",
    photo: null,
  },
  {
    name: "Ramesh Shrestha",
    role: "Japanese Language Instructor",
    bio: "JLPT N2 certified instructor specialising in N5 and N4 preparation for students planning to study in Japan.",
    photo: null,
  },
];
