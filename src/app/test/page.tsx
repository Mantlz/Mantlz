"use client"
import { Mantlz } from '@mantlz/nextjs';

export default function CustomerFeedbackPage() {
  return (
    <div className="min-h-screen w-full bg-red-500 flex items-center justify-center py-8 px-4">
      <div className="flex flex-row items-center justify-center gap-4 flex-wrap">
         <Mantlz
          formId="cma9tu80t0004o7r0iuisldzg"
          theme='default'
          showUsersJoined={true}
          usersJoinedCount={100000}
          usersJoinedLabel='Users already joined'
          redirectUrl='/feedback/thank-you'
        /> 

         <Mantlz 
          formId="cmbi9pisu0001jp04lt68brmj"
          theme='simple'
        />
        
        <Mantlz 
          formId="cmasd5mci0001o7hws12icdk0"
          theme='neobrutalism'
        />  

        <Mantlz 
          formId="cman7j8ub0003o7jpmg2bjr6n"
          theme='modern'
        />
       

         {/* <Mantlz 
          formId="cman7j8ub0003o7jpmg2bjr6n"
          theme='neobrutalism'
        /> */}
{/* 
<Mantlz 
  formId="cman7j8ub0003o7jpmg2bjr6n"
  fields={[
    {
      id: 'product',
      name: 'product',
      type: 'product',
      label: 'Select Product',
      required: true,
      products: [
        {
          id: 'basic',
          name: 'Basic Plan',
          description: 'Perfect for starters',
          price: 9.99,
          currency: 'USD',
          image: '/images/basic.png'
        }
      ],
      displayMode: 'grid'
    }
  ]}
/> */}



        

      </div>
    </div>
  );
}