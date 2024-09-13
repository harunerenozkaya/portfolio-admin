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