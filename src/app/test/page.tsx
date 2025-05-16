"use client"
import { Mantlz } from '@mantlz/nextjs';

export default function CustomerFeedbackPage() {
  return (
    <div className="mx-auto py-8 flex flex-row items-center justify-center w-full gap-4 px-4">
      
    

      
     

     

        
      <Mantlz
        formId="cmao2vgrf0007o7lfm6r82jif"
        //colorMode='dark'
        theme='purple'
        //theme=''
        onSuccess={() => {
          console.log('success');
        }}
        onError={() => {
          console.log('error');
        }}
       
        //theme="neobrutalism"
        
      /> 
     
      <Mantlz

        formId="cma9tu80t0004o7r0iuisldzg"
        theme='default'
        usersJoinedCount={1}
        usersJoinedLabel="people have already joined"
        showUsersJoined={true}
        colorMode='dark'
       //redirectUrl='/feedback/thank-you'
      /> 

        
     
        
      <Mantlz formId="cman7j8ub0003o7jpmg2bjr6n"
      theme='neobrutalism'
      variant='glass'
      colorMode='dark'
      
      />

     

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