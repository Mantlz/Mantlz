"use client"
import { Mantlz } from '@mantlz/nextjs';

export default function CustomerFeedbackPage() {
  return (
    <div className="mx-auto py-8 flex flex-row items-center justify-center w-full gap-4 px-4">
      
    

      
     

     

        
      {/* <Mantlz
        formId="cmao2vgrf0007o7lfm6r82jif"

       // theme='purple'
        className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 border-2 border-purple-300 dark:border-purple-700"


        

       

       
       
        
      />  */}
      <Mantlz
  formId="cma9tu80t0004o7r0iuisldzg"
  theme='simple'
  
/>
<Mantlz
  formId="cma9tu80t0004o7r0iuisldzg"
  theme='default'
  
/>
     
      <Mantlz

        formId="cma9tu80t0004o7r0iuisldzg"
        theme='neobrutalism'
        showUsersJoined={true}
        usersJoinedCount={100000}
        usersJoinedLabel='Users already joined'

        






      /> 

        
     
        
      <Mantlz formId="cmas7oldb0001o70rn1injfyb"
      theme='modern'
      // className="bg-gradient-to-r from-red-400 to-zinc-900 dark:from-zinc-900 dark:to-zinc-800 border-2 border-zinc-300 dark:border-zinc-700
      
      // "



      
      />


     

      


      
    </div>
  );
}