"use client"
import { Mantlz } from '@mantlz/sdk';

export default function CustomerFeedbackPage() {
  return (
    <div className="mx-auto py-8 flex flex-row items-center justify-center w-full gap-4 px-4">
      
    

      
     

     

        
      {/* <Mantlz
        formId="cmao2vgrf0007o7lfm6r82jif"

       // theme='purple'
        className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 border-2 border-purple-300 dark:border-purple-700"


        

       

       
       
        
      />  */}
      {/* <Mantlz
  formId="cma9tu80t0004o7r0iuisldzg"
  theme='simple'
  
/>
<Mantlz
  formId="cma9tu80t0004o7r0iuisldzg"
  theme='default'
  
/> */}
     
      <Mantlz

        formId="cma9tu80t0004o7r0iuisldzg"
        theme='neobrutalism'
        showUsersJoined={true}
        usersJoinedCount={100000}
        usersJoinedLabel='Users already joined'
        redirectUrl='/feedback/thank-you'

        






      /> 

        
     
        
      <Mantlz formId="cmav82ejc00030juymuh65bsm"
      theme='neobrutalism'
      // className="bg-gradient-to-r from-red-400 to-zinc-900 dark:from-zinc-900 dark:to-zinc-800 border-2 border-zinc-300 dark:border-zinc-700
      
      // "



      
      />

      <Mantlz formId="cmao2vgrf0007o7lfm6r82jif"
      theme='neobrutalism'



      />
      <Mantlz formId="cmasd5mci0001o7hws12icdk0"
      theme='neobrutalism'



      />

     

      


      
    </div>
  );
}