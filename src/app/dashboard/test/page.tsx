'use client';
import { FeedbackForm, WaitlistForm } from '@mantlz/nextjs'
import React from 'react'

const page = () => {
  return (
    <div>
        {/* <WaitlistForm 
          formId="cm8koux7d0017o7ept68qas45"
          onSubmitSuccess={() => {}}
          onSubmitError={() => {}}
          className=""
          toastProvider={null}
        /> */}
        {/* <FeedbackForm /> */}

    
      

<FeedbackForm 
  formId="cm8q6hbad0009o7572hpdxxxc"
  theme="rounded"
  
  
  // Event handlers
  onSubmitSuccess={(data) => console.log(data)}
/>

{/* <WaitlistForm
  formId="cm8kuld3k00010jin56id9gsj"
  theme="dark"
  onSubmitSuccess={(data) => console.log(data)}
/>
 */}



        
        
        
        </div>
  )
}

export default page