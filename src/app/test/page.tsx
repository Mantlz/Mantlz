"use client"
import { DynamicForm , ContactForm, WaitlistForm} from '@mantlz/nextjs';

export default function CustomerFeedbackPage() {
  return (
    <div className="mx-auto py-8 flex flex-row items-center justify-center w-full gap-4 px-4">
      
    

      
     

     

        
      {/* <ContactForm
        formId="cmak0g9660004o7zdvxlpdl4c"
       
        theme="neobrutalism"
        
      /> 
      */}
      <WaitlistForm
        formId="cmanvgicz0001jv04jihe4b5h"
      /> 

        
     
        
      <DynamicForm formId="cman7j8ub0003o7jpmg2bjr6n" />

     

      {/* <WaitlistForm
        formId="cm9yc2lge0001ie0480n9d87a"
        theme="default"
        
      /> */}

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