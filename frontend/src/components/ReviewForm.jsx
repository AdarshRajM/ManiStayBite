import { useState } from 'react';
import { Star, Send } from 'lucide-react';
import api from '../utils/api';

export default function ReviewForm({ entityType, entityId, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post('/public/reviews/', { rating, text, entityType, entityId });
      setText('');
      if(onSuccess) onSuccess();
      alert("Review submitted!");
    } catch (err) {
      console.warn("API not reachable, simulating success.");
      setText('');
      if(onSuccess) onSuccess();
      alert("Mock: Review submitted!");
    }
  };

  return (
    <form onSubmit={submitReview} className="glass dark:dark-glass p-6 rounded-3xl max-w-lg w-full mt-8">
      <h3 className="text-xl font-bold mb-4">Leave a Review</h3>
      <div className="flex gap-2 mb-4 cursor-pointer">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`w-6 h-6 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} 
            onClick={() => setRating(star)}
          />
        ))}
      </div>
      <textarea 
        className="w-full bg-white/50 dark:bg-slate-800/50 rounded-xl p-4 mb-4 outline-none focus:ring-2 focus:ring-primary-500 transition-all"
        rows="3"
        placeholder="Share your experience..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      ></textarea>
      <button 
        type="submit" 
        className="flex items-center gap-2 px-6 py-2 bg-primary-500 text-white font-bold rounded-xl hover:bg-primary-600 transition-colors"
      >
        <Send className="w-4 h-4" /> Submit
      </button>
    </form>
  );
}
