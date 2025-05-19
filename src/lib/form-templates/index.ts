import { waitlistTemplate } from './waitlist-template';
import { contactTemplate } from './contact-template';
import { feedbackTemplate } from './feedback-template';
import { surveyTemplate } from './survey-template';
import { applicationTemplate } from './application-template';
import { orderTemplate } from './order-template';
import { analyticsOptInTemplate } from './analytics-opt-in-template';
import { rsvpTemplate } from './rsvp-template';
import { customTemplate } from './custom-template';

export const formTemplates = {
  waitlist: waitlistTemplate,
  contact: contactTemplate,
  feedback: feedbackTemplate,
  survey: surveyTemplate,
  application: applicationTemplate,
  order: orderTemplate,
  'analytics-opt-in': analyticsOptInTemplate,
  rsvp: rsvpTemplate,
  custom: customTemplate,
};

export type FormTemplateId = keyof typeof formTemplates; 