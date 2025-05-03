import { db } from '@/lib/db';
import { redirect } from 'next/navigation';

interface UnsubscribePageProps {
  searchParams: {
    email?: string;
    formId?: string;
    campaignId?: string;
  };
}

export default async function UnsubscribePage({ searchParams }: UnsubscribePageProps) {
  const email = searchParams.email;
  const formId = searchParams.formId;
  const campaignId = searchParams.campaignId;

  if (!email || !formId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Unsubscribe Request</h1>
          <p className="text-gray-600">Missing required parameters. Please use the unsubscribe link from your email.</p>
        </div>
      </div>
    );
  }

  try {
    // Update the submission to mark as unsubscribed
    await db.submission.updateMany({
      where: {
        email,
        formId,
      },
      data: {
        unsubscribed: true,
      },
    });

    // If there's a campaignId, update the sent email record
    if (campaignId) {
      await db.sentEmail.updateMany({
        where: {
          campaignId,
          submission: {
            email,
            formId,
          },
        },
        data: {
          unsubscribeClicked: true,
          unsubscribeClickedAt: new Date(),
        },
      });
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Successfully Unsubscribed</h1>
          <p className="text-gray-600">You have been successfully unsubscribed from this form. You will no longer receive emails.</p>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error processing unsubscribe:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600">There was an error processing your unsubscribe request. Please try again later.</p>
        </div>
      </div>
    );
  }
} 