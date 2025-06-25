"use client"
import { Mantlz } from '@mantlz/nextjs';

export default function CustomerFeedbackPage() {
  return (
    <div className="min-h-screen w-full  
     flex items-center justify-center py-8 bg-blue-600 px-4">
      <div className="flex flex-row items-center justify-center gap-4 flex-wrap">
         <Mantlz
          formId="cmc44ix1u001pl0oswpc14utt"
          theme='default'
          showUsersJoined={true}
          usersJoinedCount={100000}
          usersJoinedLabel='Users already joined'
          // redirectUrl='https://www.mantlz.app'
        /> 



       


        

      </div>
    </div>
  );
}