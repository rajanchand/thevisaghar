/**
 * Testimonials — structured content layer
 */

export interface Testimonial {
  clientName: string;
  clientPhoto: string | null;
  country: string;
  visaType: string;
  rating: number;
  content: string;
}

export const testimonials: Testimonial[] = [
  {
    clientName: "Sachita Lamichhane",
    clientPhoto: null,
    country: "Finland",
    visaType: "Dependent Visa",
    rating: 5,
    content:
      "Getting my Finland dependent visa was straightforward with The Visa Ghar. The counselling was transparent, and they walked me through every financial and documentation requirement clearly.",
  },
  {
    clientName: "Bunu Rijal",
    clientPhoto: null,
    country: "Finland",
    visaType: "Dependent Visa",
    rating: 5,
    content:
      "Highly recommend The Visa Ghar for study abroad and family applications. Professional staff, always responsive, and genuinely caring about getting it right.",
  },
  {
    clientName: "Bishal Upadhyay",
    clientPhoto: null,
    country: "UK",
    visaType: "Student Visa",
    rating: 5,
    content:
      "The Visa Ghar made my UK student visa application feel manageable. From CAS tracking to interview preparation, they were with me at every step. Visa approved in three weeks.",
  },
  {
    clientName: "Chadani Gautam",
    clientPhoto: null,
    country: "UK",
    visaType: "Student Visa",
    rating: 5,
    content:
      "The IELTS instructors are excellent — I scored 7.5 on my first attempt. The counselling team then helped me through the entire UK visa process. Got approved on the first try.",
  },
];
