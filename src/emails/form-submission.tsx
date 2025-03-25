import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Text,
} from '@react-email/components';

interface FormSubmissionEmailProps {
  formName: string;
  submissionData: Record<string, any>;
}

export function FormSubmissionEmail({ formName, submissionData }: FormSubmissionEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'sans-serif' }}>
        <Container>
          <Heading>Form Submission Confirmation</Heading>
          <Text>Thank you for submitting the form: {formName}</Text>
          <Text>We have received your submission with the following details:</Text>
          {Object.entries(submissionData).map(([key, value]) => (
            <Text key={key}>
              {key}: {String(value)}
            </Text>
          ))}
        </Container>
      </Body>
    </Html>
  );
} 