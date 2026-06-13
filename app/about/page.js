


import Navbar from './../components/Navbar';
import Footer from './../components/Footer';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 py-8 md:py-16">
          
          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8 md:mb-10">
            About Workspaces
          </h1>

          {/* Content - Flex column */}
          <div className="flex flex-col gap-6 text-gray-800 text-[16px] leading-relaxed">
            
            {/* TL;DR Section (Green Border Left) */}
            <div className="border-l-4 border-[#2ecc71] pl-5 py-1 italic text-gray-700">
              <span className="font-bold not-italic text-[#2ecc71]">TL;DR:</span> Workspaces is an independently run archive of real desk setups and home offices gathered from interviewing creative people around the world.
            </div>
            
            {/* Italic Intro */}
            <p className="italic">
              Founded in 2020 by <span className="font-bold not-italic text-[#2ecc71]">Ryan Gilbert</span>, it has grown to feature <span className="text-[#2ecc71]">500+ real-life workspace tours</span>, reaching <span className="text-[#2ecc71]">70,000+ followers</span> across social platforms, attracting over <span className="text-[#2ecc71]">2.5 million</span> total page views, while publishing a weekly newsletter that is read by <span className="text-[#2ecc71]">21,000+ subscribers</span>.
            </p>
            
            <p>
              Workspaces is a curated collection of real desk setups and home offices from creative people around the world.
            </p>
            
            <p>
              I started Workspaces in early 2020, as remote work quickly became the default for millions of people. Around that time, I began noticing more designers, developers, founders, and creators sharing photos of their desks and workspaces online. These weren&apos;t just images posted on Twitter — they were small windows into how people were actually working day to day.
            </p>
            
            <p>
              Those moments stuck with me.
            </p>
            
            <p>
              So on <span className="text-[#2ecc71]">April 5, 2020</span>, I published the first edition of Workspaces.
            </p>
            
            <p>
              Since then, Workspaces has grown into a living archive of modern workspaces, featuring <span className="text-[#2ecc71]">500+ desk setups</span> (and counting) from people working across tech, design, writing, and creative industries. Each workspace is submitted by the person who actually uses it, offering an honest look at the desks, tools, and environments that support their work.
            </p>
            
            <p>
              Every feature on Workspaces follows the same general idea — photos of a guest&apos;s real workspace, a background into the person behind it, and the tools they rely on each and every day.
            </p>
            
            <p>
              Some setups are minimal, some are highly refined (and might cost more than my car), and many evolve over time. Together, they show the wide range of ways people build spaces that help them focus, create, and do their best work.
            </p>
            
            <p>
              Over the years, Workspaces has quietly grown into the largest collection of real workspace tours on the internet.
            </p>

            {/* Stats List */}
            <ul className="list-disc pl-5 space-y-1 marker:text-gray-400">
              <li><span className="text-[#2ecc71]">21,000+</span> newsletter subscribers</li>
              <li><span className="text-[#2ecc71]">2,500,000+</span> total web page views</li>
              <li><span className="text-[#2ecc71]">70,000+</span> followers across social platforms</li>
            </ul>
            
            <p>
              Workspaces is for anyone who cares about their work environment. Whether you&apos;re setting up your first home office, upgrading your desk, designing a creative studio, or simply curious to see how your peers work.
            </p>
            
            <p>
              New workspace tours are published weekly, continuing the same idea the project started with — documenting the spaces where modern work actually happens.
            </p>
            
            <p>
              If that sounds like your kind of thing, you can <span className="text-[#2ecc71] font-medium">subscribe to Workspaces</span> to receive new desk setups every Saturday morning.
            </p>

            {/* Signature */}
            <div className="mt-4 pt-2">
              <p className="font-script text-2xl font-bold italic text-gray-800">
                Ryan Gilbert
              </p>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}