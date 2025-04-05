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
        theme="dark"

        
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
        formId="adssadasd"
        //redirectUrl="/feedback/thank-you"
        title="join wait list"
        description="be the first to know when we launch. get early access and exclusive updates."
        nameLabel="Name"
        namePlaceholder="Enter your name"
        emailLabel="Email"
        emailPlaceholder="you@example.com"
        theme="neobrutalism"
        appearance={{
          baseStyle: {
            container: 'bg-gradient-to-r justify-center from-zinc-100 to-zinc-200',
            form: 'space-y-6 items-center justify-center'
          },
          elements: {
            card: 'border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
            cardTitle: 'text-xl font-black text-black uppercase',
            cardDescription: 'text-black font-medium',
            inputLabel: 'text-black font-bold uppercase',
            input: 'bg-white border-2 border-black',
            submitButton: 'bg-black hover:bg-gray-800 text-white font-bold uppercase px-6 py-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]',
          }
          
        }}
      />
    </div>
  );
}