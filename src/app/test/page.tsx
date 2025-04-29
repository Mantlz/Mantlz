"use client"
import { WaitlistForm } from '@mantlz/nextjs';

export default function CustomerFeedbackPage() {
  return (
    <div className="mx-auto py-8 flex flex-row items-center justify-center w-full gap-4 px-4">
      
    

      
     

     

         

      


      <WaitlistForm
        formId="cm9x3lzt4001xo7wpo1mxticz"
       
        theme="neobrutalism"
        
      /> 

      <WaitlistForm
        formId="cm9yc2lge0001ie0480n9d87a"
        theme="default"
        
      />

      {/* <FeedbackForm
        formId="cm9muq8dg0013o7ks90uz4ljx"
        theme="neobrutalism"
        
      /> */}

      {/* <ContactForm
        formId="cm9mw8bku0001o7hufv90muwq"
        theme="neobrutalism"
        
      /> */}


      
    </div>
  );
}