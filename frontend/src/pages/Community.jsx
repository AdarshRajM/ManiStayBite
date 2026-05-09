import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Sparkles, Image as ImageIcon, Video, Send, Download } from 'lucide-react';

const POSTS = [
  { id: 1, user: "Adarsh Raj Mani", avatar: "AR", image: "https://images.unsplash.com/photo-1542314831-c6a4d27ce66b?w=800&q=80", caption: "Amazing weekend getaway at ManiStayBite! The infinity pool was breathtaking. 🌊✨ #luxury #vacation", likes: 124, comments: 12, isStory: true },
  { id: 2, user: "Priya Singh", avatar: "PS", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80", caption: "Fine dining experience at its best. The Rasmalai is a must-try! 🍽️🍰", likes: 89, comments: 5, isStory: false }
];

export default function Community() {
  const [posts, setPosts] = useState(POSTS);
  const [generatingStory, setGeneratingStory] = useState(false);
  const [myStory, setMyStory] = useState(null);

  const handleGenerateStory = () => {
    setGeneratingStory(true);
    setTimeout(() => {
      setGeneratingStory(false);
      setMyStory({
        title: "Adarsh's Summer Retreat",
        date: "May 2026",
        highlights: ["Stayed in Deluxe Suite", "Enjoyed Luxury Spa", "Ordered Rasmalai"],
        nftId: "NFT-#8492-MSB"
      });
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Travel Community</h1>
        <p className="text-slate-500">Share your memories and get inspired by other guests.</p>
      </div>

      {/* AI Trip Story Generator */}
      <div className="mb-12 glass dark:dark-glass p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-48 h-48" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Sparkles className="text-primary-500" /> AI Trip Story Generator</h2>
            <p className="text-slate-500 max-w-md">Let AI compile your photos, room bookings, and food orders into a beautiful Digital NFT Souvenir.</p>
          </div>
          
          {!myStory ? (
            <button 
              onClick={handleGenerateStory}
              disabled={generatingStory}
              className="px-8 py-4 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition-colors flex items-center gap-2 shrink-0 shadow-lg hover:shadow-primary-500/25"
            >
              {generatingStory ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Compiling Memories...</>
              ) : (
                <><ImageIcon className="w-5 h-5" /> Generate My Story</>
              )}
            </button>
          ) : (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-2xl border border-primary-500/20 backdrop-blur-md">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg">{myStory.title}</h3>
                <span className="text-xs bg-primary-500/10 text-primary-500 px-2 py-1 rounded-full font-mono">{myStory.nftId}</span>
              </div>
              <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1 mb-4">
                {myStory.highlights.map((h, i) => <li key={i}>• {h}</li>)}
              </ul>
              <button className="w-full py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-bold flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Mint as NFT & Download
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Create Post */}
      <div className="glass dark:dark-glass p-4 rounded-3xl mb-8 flex gap-4 items-center">
        <div className="w-12 h-12 bg-primary-500 rounded-full text-white font-bold flex items-center justify-center shrink-0">AR</div>
        <input type="text" placeholder="Share your experience..." className="w-full bg-transparent outline-none px-4" />
        <div className="flex gap-2 text-slate-400">
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><ImageIcon className="w-5 h-5" /></button>
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><Video className="w-5 h-5" /></button>
        </div>
        <button className="px-6 py-2 bg-primary-500 text-white rounded-full font-bold hover:bg-primary-600 transition-colors">Post</button>
      </div>

      {/* Feed */}
      <div className="space-y-8">
        {posts.map(post => (
          <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass dark:dark-glass rounded-3xl overflow-hidden">
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-primary-400 to-primary-600 rounded-full text-white font-bold flex items-center justify-center">{post.avatar}</div>
              <div>
                <h4 className="font-bold">{post.user}</h4>
                {post.isStory && <span className="text-xs text-primary-500 font-bold bg-primary-500/10 px-2 py-0.5 rounded-full">AI Trip Story</span>}
              </div>
            </div>
            
            <img src={post.image} alt="Post content" className="w-full h-96 object-cover" />
            
            <div className="p-6">
              <div className="flex gap-6 mb-4">
                <button className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors"><Heart className="w-6 h-6" /> {post.likes}</button>
                <button className="flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-colors"><MessageCircle className="w-6 h-6" /> {post.comments}</button>
                <button className="flex items-center gap-2 text-slate-500 hover:text-green-500 transition-colors ml-auto"><Share2 className="w-6 h-6" /></button>
              </div>
              <p className="text-slate-700 dark:text-slate-300"><span className="font-bold mr-2">{post.user}</span>{post.caption}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
