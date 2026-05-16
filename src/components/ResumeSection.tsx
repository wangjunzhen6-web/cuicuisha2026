import { motion } from 'motion/react';
import { experiences } from '../data/portfolio';

export default function ResumeSection() {
  return (
    <section className="mx-auto w-full max-w-5xl bg-white p-8 md:p-16 rounded-[3rem] text-black my-20">
      <div className="grid gap-12 md:grid-cols-[1fr_1.5fr]">
        {/* Left Profile */}
        <div className="relative flex flex-col items-center">
          <div className="relative h-96 w-80 overflow-hidden rounded-[3rem] bg-gradient-to-b from-neutral-50 to-neutral-200 ring-8 ring-white shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800" 
              alt="Profile"
              className="h-full w-full object-contain object-bottom pt-10"
            />
            {/* Background elements to mimic the user's uploaded style */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-blue-600/20 to-transparent" />
          </div>
          
          <div className="mt-8 text-center md:text-left w-full">
            <h2 className="text-5xl font-black tracking-tighter">王军震</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-neutral-100 px-4 py-1.5 text-xs font-bold text-neutral-500 ring-1 ring-neutral-200">重庆邮电大学 (24届)</span>
              <span className="rounded-full bg-neutral-100 px-4 py-1.5 text-xs font-bold text-neutral-500 ring-1 ring-neutral-200">产品设计专业</span>
            </div>
          </div>
        </div>

        {/* Right Info */}
        <div className="flex flex-col gap-10 py-4">
          {experiences.map((exp, idx) => (
            <div key={idx} className="relative">
              <div className="mb-4 flex items-center">
                {exp.logo ? (
                  <img 
                    src={exp.logo} 
                    alt={exp.company} 
                    className="h-10 w-auto object-contain" 
                  />
                ) : (
                  <div className="flex items-center gap-3">
                    <div 
                      className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-neutral-100"
                    >
                      <span className="font-bold" style={{ color: exp.color }}>{exp.company[0]}</span>
                    </div>
                    <h3 className="text-2xl font-black text-neutral-900">{exp.company}</h3>
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-bold text-neutral-800">
                  {exp.role} <span className="ml-2 font-medium text-neutral-400">({exp.period})</span>
                </p>
              </div>

              <ul className="space-y-2">
                {exp.details.map((detail: string, dIdx: number) => (
                  <li key={dIdx} className="text-sm font-medium leading-relaxed text-neutral-600">
                    {dIdx + 1}. {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
