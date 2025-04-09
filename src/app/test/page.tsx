import { ContactForm, FeedbackForm, WaitlistForm } from '@mantlz/nextjs';

export default function CustomerFeedbackPage() {
  return (
    <div className="mx-auto py-8 flex flex-row items-center justify-center w-full gap-4 px-4">
      
      <FeedbackForm 
        formId="cm8xm51yo00020j1zkuh8yu8q"
        title="How was your experience?"
        description="Your feedback helps us improve our service"
        ratingLabel="Rate your experience"
        emailLabel="Email"
        messageLabel="Tell us more"
        messagePlaceholder="What did you like or dislike about our product?"
        submitButtonText="Send Your Feedback"
        theme="purple"

        
        // appearance={{
        //   baseStyle: {
        //     container: 'bg-gradient-to-r  from-zinc-100 to-zinc-200',
        //     form: 'space-y-6'
        //   },
        //   elements: {
        //     card: 'border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
        //     cardTitle: 'text-2xl font-black text-black uppercase',
        //     cardDescription: 'text-black font-medium',
        //     inputLabel: 'text-black font-bold uppercase',
        //     input: 'bg-white border-2 border-black',
        //     textarea: 'bg-white border-2 border-black min-h-[120px]',
        //     submitButton: 'bg-black hover:bg-gray-800 text-white font-bold uppercase px-6 py-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]',
        //     starIcon: {
        //       filled: 'text-amber-500',
        //       empty: 'text-gray-300'
        //     }
        //   }
        // }}
      />
      
      {/* <ContactForm
        formId="asdadadada"
        //redirectUrl="/feedback/thank-you"
        theme="neobrutalism"
       
  
        appearance={{
          //container: 'bg-white border-none',
          //formButtonPrimary: 'bg-white hover:bg-purple-700 text-black font-bold',
          //cardTitle: 'text-black',
           
          //cardDescription: 'text-black',
          // inputLabel: 'text-black',
          // input: 'bg-purple-800 border-purple-700 text-white placeholder:text-purple-300',
          // textarea: 'bg-purple-800 border-purple-700 text-white placeholder:text-purple-300'
        }}
      /> */}

      <WaitlistForm
        formId="cm8yl5ezq0004o7afghokqjze"
        showUsersJoined={true}
        usersJoinedLabel='joined'
        //redirectUrl="/feedback/thank-you"
        // title="join waitlist"
        // description="be the first to know when we launch. get early access and exclusive updates."
        // nameLabel="Name"
        // namePlaceholder="Enter your name"
        // emailLabel="Email"
        // emailPlaceholder="you@example.com"
        theme="default"
        appearance={{
          baseStyle: {
            container: 'bg-gradient-to-r justify-center from-red-100 to-red-200',
           form: 'space-y-6 items-center justify-center',
           background: 'bg-gradient-to-r from-red-100 to-red-200',
            border: 'border-4 border-red-600',
          },
          elements: {
            card: 'border-4 border-red-600 text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
            cardTitle: 'text-xl font-black text-white uppercase text-center',
            cardDescription: 'text-white font-medium text-center',
            inputLabel: 'text-white font-bold uppercase ',
            formButtonPrimary: 'bg-black hover:bg-gray-800 text-white font-bold uppercase px-6 py-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]',
            input: 'bg-white border-2 border-black ',
            inputError: 'text-destructive ',
            buttonIcon: 'text-black bg-white',
            formInput: 'text-black',
            usersJoinedCounter: 'text-white',
            cardHeader: 'text-white',

            background: 'bg-gradient-to-r from-zinc-900 to-zinc-800',
            border: 'border-4 border-red-600',

            cardContent: 'text-white',
            submitButton: 'bg-white hover:bg-gray-800 text-white cursor-pointer font-bold uppercase px-6 py-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]',
          },
           

         

          
          
       }}
      />
    </div>
  );
}