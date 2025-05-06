import { db } from '@/lib/db';

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const email = resolvedSearchParams.email as string | undefined;
  const formId = resolvedSearchParams.formId as string | undefined;
  const campaignId = resolvedSearchParams.campaignId as string | undefined;

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
