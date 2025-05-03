import { redirect } from 'next/navigation';
import { db } from '@/lib/db';

interface UnsubscribePageProps {
  searchParams: {
    email?: string;
    formId?: string;
    campaignId?: string;
  };
}

export default async function UnsubscribePage({ searchParams }: UnsubscribePageProps) {
  const { email, formId, campaignId } = searchParams;

  if (!email || !formId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Unsubscribe Link</h1>
          <p className="text-gray-600">
            The unsubscribe link you clicked is invalid. Please contact the sender if you wish to unsubscribe.
          </p>
        </div>
      </div>
    );
  }

  try {
    // Create unsubscribe record
    await db.unsubscribe.create({
      data: {
        email,
        formId,
        campaignId,
      },
    });

    // Update submission unsubscribed status
    await db.submission.updateMany({
      where: {
        formId,
        email,
      },
      data: {
        unsubscribed: true,
      },
    });

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Successfully Unsubscribed</h1>
          <p className="text-gray-600">
            You have been successfully unsubscribed from future emails. You will no longer receive emails from this form.
          </p>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error processing unsubscribe:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Processing Unsubscribe</h1>
          <p className="text-gray-600">
            There was an error processing your unsubscribe request. Please try again later or contact the sender.
          </p>
        </div>
      </div>
    );
  }
} 