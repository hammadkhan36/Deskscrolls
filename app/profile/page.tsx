'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from './../components/Navbar';
import Footer from './../components/Footer';

// Dummy user data (Replace with Supabase data later)
const userData = {
  name: 'Benten Woodring',
  username: '@bentenwoodring',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
  coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop',
  bio: 'Lead UI Designer. Workspaces enthusiast. Building beautiful digital experiences.',
  location: 'Austin, TX',
  website: 'benten.design',
  joinedDate: 'March 2020',
  stats: {
    setups: 42,
    followers: 528,
    following: 187,
  },
  recentSetups: [
    {
      id: 1,
      title: 'Minimalist Desk Setup',
      subtitle: 'Designed for focused work',
      imageUrl: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=400&auto=format&fit=crop',
      slug: 'minimalist-desk'
    },
    {
      id: 2,
      title: 'Creative Studio Corner',
      subtitle: 'Small space, big ideas',
      imageUrl: 'https://images.unsplash.com/photo-1486946255432-0514a16f1f8d?q=80&w=400&auto=format&fit=crop',
      slug: 'creative-studio'
    },
    {
      id: 3,
      title: 'Home Office Upgrade',
      subtitle: 'Ergonomic meets aesthetic',
      imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=400&auto=format&fit=crop',
      slug: 'home-office-upgrade'
    }
  ]
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pb-16">
        
        {/* Cover Image */}
        <div className="relative w-full h-48 sm:h-56 md:h-64 bg-gray-200">
          <Image
            src={userData.coverImage}
            alt="Cover"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Profile Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            
            {/* Avatar + Name Row */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white shadow-sm overflow-hidden">
                  <Image
                    src={userData.avatar}
                    alt={userData.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{userData.name}</h1>
                  <p className="text-gray-500 text-sm">{userData.username}</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition"
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </button>
            </div>

            {/* Bio & Info */}
            <div className="mt-4 space-y-2">
              <p className="text-gray-700 text-sm leading-relaxed">{userData.bio}</p>
              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                <span>📍 {userData.location}</span>
                <span>🌐 {userData.website}</span>
                <span>📅 Joined {userData.joinedDate}</span>
              </div>
            </div>

            import Link from 'next/link';

// Inside the profile action section:
<div className="mt-4 flex justify-end">
  <Link 
    href="/post/new"
    className="px-4 py-2 text-sm font-medium text-white bg-[#2ecc71] rounded-md hover:bg-[#27ae60] transition"
  >
    + Add New Post
  </Link>
</div>

            {/* Stats */}
            <div className="mt-4 flex flex-wrap gap-6 border-t border-gray-100 pt-4">
              <div>
                <span className="block text-xl font-bold text-gray-900">{userData.stats.setups}</span>
                <span className="text-xs text-gray-500">Setups</span>
              </div>
              <div>
                <span className="block text-xl font-bold text-gray-900">{userData.stats.followers}</span>
                <span className="text-xs text-gray-500">Followers</span>
              </div>
              <div>
                <span className="block text-xl font-bold text-gray-900">{userData.stats.following}</span>
                <span className="text-xs text-gray-500">Following</span>
              </div>
            </div>

          </div>

          {/* Recent Setups Grid */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Setups</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {userData.recentSetups.map((setup) => (
                <Link key={setup.id} href={`/setups/${setup.slug}`} className="group block">
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition">
                    <div className="relative aspect-[4/3] w-full bg-gray-200">
                      <Image
                        src={setup.imageUrl}
                        alt={setup.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#2ecc71] transition-colors">
                        {setup.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">{setup.subtitle}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}