export interface SocialMediaLink {
  logo: string;
  url: string;
}

export interface PersonalInformation {
  name: string;
  surname: string;
  job: string;
  summary: string;
  biography: string;
  skills: string[];
  socialMediaLinks: SocialMediaLink[];
  personalImageUrl: string;
}

export interface Experience {
  id: number;
  companyName: string;
  companyLogo: string;
  role: string;
  startDate: string;
  endDate: string | null;  // Allow null for ongoing experiences
  detail: string;
  usedSkills: string[];
}

export interface Project {
  id: number;
  name: string;
  detail: string;
  skills: string[];
  logoUrl: string;
  url: string;
}