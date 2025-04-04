import { FeedbackForm } from '@mantlz/nextjs';

export default function CustomerFeedbackPage() {
  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">We Value Your Feedback</h1>
      
      <FeedbackForm 
        formId="cm8xm51yo00020j1zkuh8yu8q"
        redirectUrl="/feedback/thank-you"
        
        // You can also customize the form appearance
        //primaryColor="#4F46E5"
        //darkMode={false}
        submitButtonText="Submit Feedback"
      />
    </div>
  );
}