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
  formId="cmao2vgrf0007o7lfm6r82jif"
  theme='simple'
  
/>
<Mantlz
  formId="cmao2vgrf0007o7lfm6r82jif"
  theme='default'
  
/>
     
      <Mantlz

        formId="cma9tu80t0004o7r0iuisldzg"
        theme='modern'
        showUsersJoined={true}
        usersJoinedCount={10}
        // usersJoinedLabel='Users joined'

        






      /> 

        
     
        
      <Mantlz formId="cman7j8ub0003o7jpmg2bjr6n"
      theme='neobrutalism'
      // className="bg-gradient-to-r from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800 border-2 border-zinc-300 dark:border-zinc-700
      
      //"



      
      />


     

      


      
    </div>
  );
}