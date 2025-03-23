'use client';
import { FeedbackForm, WaitlistForm } from '@mantlz/nextjs'
import React from 'react'

const page = () => {
  return (
    <div>
        {/* <WaitlistForm 
          formId="Cm8kuld3k00010jin56id9grj"
          onSubmitSuccess={() => {}}
          onSubmitError={() => {}}
          className=""
          toastProvider={null}
        /> */}
        {/* <FeedbackForm /> */}

        <FeedbackForm 
          formId="cm8kuld3k00010jin56id9grj"
          onSubmitSuccess={() => {}}
          onSubmitError={() => {}}
          className=""
          //toastProvider={null}
        />
        
        
        
        </div>
  )
}

export default page