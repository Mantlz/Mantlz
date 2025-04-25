'use client'

import React from 'react'
import { BookOpen, GraduationCap, Library, Microscope, Users } from 'lucide-react'

const icons = [
  { Icon: BookOpen, name: 'Learning' },
  { Icon: GraduationCap, name: 'Graduation'},
  { Icon: Library, name: 'Resources'},
  { Icon: Microscope, name: 'Research'},
  { Icon: Users, name: 'Community' },
]

export default function LogoClouds() {
  return (
    <section className="bg-white dark:bg-neutral-950 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12 md:mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Trusted by Students Worldwide
          </h2>
          <p className="text-lg text-gray-600 dark:text-white max-w-2xl mx-auto">
            Empowering education through innovative tools and collaboration
          </p>
        </div>
        
        {/* Mobile Layout */}
        <div className="grid grid-cols-2 gap-8 sm:hidden">
          {icons.map(({ Icon, name }) => (
            <div
              key={name}
              className="group flex flex-col items-center p-4 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-300"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                <Icon className="h-7 w-7 text-primary" />
              </div>
              <p className="mt-3 font-semibold text-gray-900 dark:text-white">{name}</p>
              {/* <p className="mt-1 text-xs text-gray-500 text-center">{description}</p> */}
            </div>
          ))}
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:grid sm:grid-cols-3 md:grid-cols-5 gap-8">
          {icons.map(({ Icon, name }) => (
            <div
              key={name}
              className="group flex flex-col items-center p-6 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 dark:bg-orange-200 transition-colors duration-300">
                <Icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <p className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{name}</p>
              {/* <p className="mt-2 text-sm text-gray-500 text-center">{description}</p> */}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500 dark:text-white">
            Join over <span className="font-semibold text-primary">1,000+</span> students from leading universities
          </p>
        </div>
      </div>
    </section>
  )
}