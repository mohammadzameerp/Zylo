import { useState, useRef, useEffect } from 'react';
import {
  RiImageAddLine,
  RiCloseLine,
  RiSendPlaneFill,
  RiLoader4Line,
  RiHashtag,
} from 'react-icons/ri';

const categories = [
  { id: 'general', name: 'General' },
  { id: 'humor', name: 'Humor' },
  { id: 'story', name: 'Story' },
  { id: 'confession', name: 'Confession' },
  { id: 'question', name: 'Question' },
  { id: 'advice', name: 'Advice' },
  { id: 'rant', name: 'Rant' },
  { id: 'shower-thought', name: 'Shower Thought' },
];

export default function PostForm({ initialData = null, onSubmit, isLoading = false }) {
  const [content, setContent] = useState(initialData?.content || '');
  const [category, setCategory] = useState(initialData?.category || 'general');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(initialData?.tags || []);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData?.image || '');
  const [dragActive, setDragActive] = useState(false);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    autoResize();
  }, [content]);

  const autoResize = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.max(120, el.scrollHeight) + 'px';
    }
  };

  const handleImageChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files[0]);
    }
  };

  const handleTagKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
      if (newTag && !tags.includes(newTag) && tags.length < 5) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const formData = new FormData();
    formData.append('content', content.trim());
    formData.append('category', category);
    tags.forEach((tag) => formData.append('tags', tag));
    if (image) {
      formData.append('image', image);
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-5 animate-fade-in">
      {/* Content Textarea */}
      <div>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind? Share anonymously..."
          className="w-full min-h-[120px] bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 resize-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all duration-300 text-sm leading-relaxed"
          maxLength={5000}
        />
        <div className="flex justify-end mt-1">
          <span className={`text-xs ${content.length > 4500 ? 'text-danger' : 'text-gray-600'}`}>
            {content.length}/5000
          </span>
        </div>
      </div>

      {/* Category Select */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-accent/50 focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all duration-300 appearance-none cursor-pointer"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`, backgroundPosition: 'right 12px center', backgroundSize: '20px', backgroundRepeat: 'no-repeat' }}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id} className="bg-dark-500 text-white">
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tags Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Tags <span className="text-gray-600 font-normal">(max 5, press Enter to add)</span>
        </label>
        <div className="flex flex-wrap items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 focus-within:border-accent/50 focus-within:ring-2 focus-within:ring-accent/20 transition-all duration-300">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-accent bg-accent/10 rounded-full border border-accent/10"
            >
              <RiHashtag className="w-3 h-3" />
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-0.5 hover:text-white transition-colors"
              >
                <RiCloseLine className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
          {tags.length < 5 && (
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder={tags.length === 0 ? 'Add tags...' : ''}
              className="flex-1 min-w-[100px] bg-transparent border-none outline-none text-white text-sm placeholder-gray-500 py-1"
            />
          )}
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Image (optional)</label>
        {imagePreview ? (
          <div className="relative rounded-xl overflow-hidden">
            <img src={imagePreview} alt="Preview" className="w-full max-h-64 object-cover rounded-xl" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-dark-700/80 text-white hover:bg-danger transition-all duration-300"
            >
              <RiCloseLine className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center gap-2 p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${
              dragActive
                ? 'border-accent bg-accent/5'
                : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
            }`}
          >
            <RiImageAddLine className={`w-8 h-8 ${dragActive ? 'text-accent' : 'text-gray-500'}`} />
            <p className="text-sm text-gray-500">
              <span className="text-accent font-medium">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-600">PNG, JPG, GIF up to 5MB</p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleImageChange(e.target.files[0])}
          className="hidden"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading || !content.trim()}
        className="w-full btn-gradient py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <RiLoader4Line className="w-5 h-5 animate-spin" />
            Publishing...
          </>
        ) : (
          <>
            <RiSendPlaneFill className="w-4 h-4" />
            {initialData ? 'Update Post' : 'Publish Post'}
          </>
        )}
      </button>
    </form>
  );
}
