import { ContactForm, FeedbackForm, WaitlistForm , BASE_THEMES} from '@mantlz/nextjs';

export default function CustomerFeedbackPage() {
  return (
    <div className="mx-auto py-8 flex flex-row items-center justify-center w-full gap-4 px-4">
      
    

      
     

     

         

      
     <WaitlistForm
        formId="cm9msn9b30009o7ks7b90ycik"
        showUsersJoined={true}
        usersJoinedLabel='joined'
        theme="neobrutalism"
        
      /> 

      <WaitlistForm
        formId="cm9q8pimz00040ju2szwoq8mh"
       
        theme="neobrutalism"
        
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