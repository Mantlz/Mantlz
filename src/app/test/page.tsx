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
  className="
    bg-gradient-to-r from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800 
    border-2 border-zinc-300 dark:border-zinc-700 backdrop-blur-3xl shadow-2xl
    [&_button]:bg-purple-500 [&_button]:hover:bg-purple-600 [&_button]:text-white
    [&_label]:text-purple-700 [&_label]:font-medium [&_label]:text-sm
    [&_input]:border-purple-200 [&_input]:focus:ring-purple-500
    [&_textarea]:border-purple-200 [&_textarea]:focus:ring-purple-500
    [&_checkbox]:border-purple-200 [&_checkbox]:focus:ring-purple-500
    [&_file-upload]:border-purple-200 [&_file-upload]:focus:ring-purple-500
  "
/>
     
      <Mantlz

        formId="cma9tu80t0004o7r0iuisldzg"
        theme='default'
        usersJoinedCount={1}
        usersJoinedLabel="people have already joined"
        showUsersJoined={true}
        className="bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-600 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-800 border-2 border-zinc-300 dark:border-zinc-700 mx-auto my-8 p-8 space-y-6"



       //redirectUrl='/feedback/thank-you'
      /> 

        
     
        
      <Mantlz formId="cman7j8ub0003o7jpmg2bjr6n"
      theme='neobrutalism'


      
      />

      <Mantlz formId="cmaqyion30003ie048dva1ebd"
      theme='default'
      className="bg-purple-50 dark:bg-purple-950 shadow-purple-200 dark:shadow-purple-800 shadow-lg"

      />

     

      


      
    </div>
  );
}