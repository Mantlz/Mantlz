'use client';
import { FeedbackForm, WaitlistForm } from '@mantlz/nextjs'
import React from 'react'

const page = () => {
  return (
    <div className='flex flex-col gap-4 w-full '>
        {/* <WaitlistForm 
          formId="cm8koux7d0017o7ept68qas45"
          onSubmitSuccess={() => {}}
          onSubmitError={() => {}}
          className=""
          toastProvider={null}
        /> */}
        {/* <FeedbackForm /> */}

    
      

<div className='flex flex-col gap-4 w-full '>
<FeedbackForm 
  formId="cm8ukiyfl000io7mplft4ziih"
  theme="glass"
  description='jean daly marc'
  primaryColor='red'
  backgroundColor='blue'
  borderRadius='none'
  fontSize='base'
  shadow='none'
  submitButtonText='Send'
  feedbackPlaceholder='jean daly marc'
  darkMode={true}
  variant='default'
  // toastProvider={null}  
  
  // Event handlers
 // onSubmitSuccess={(data) => console.log(data)}
/>
</div>


  


<WaitlistForm
  formId="cm8kuld3k00010jin56id9gsj"
  theme="light"
  // /onSubmitSuccess={(data) => console.log(data)}
/>




        
        
        
        </div>
  )
}

export default page