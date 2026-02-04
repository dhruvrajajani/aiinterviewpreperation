import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, Mail, Award, TrendingUp, Calendar, MapPin, Briefcase, 
    Github, Linkedin, Globe, Edit2, Save, X, Plus, Trash2, Camera, FileText, Download 
} from 'lucide-react';
import api from '../utils/api';

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
      bio: '',
      currentPosition: '',
      location: '',
      skills: [],
      avatar: '',
      banner: '',
      resume: '',
      socialLinks: { github: '', linkedin: '', portfolio: '' }
  });
  
  const bannerInputRef = useRef(null);
  const avatarInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  useEffect(() => {
    if (user) {
        setFormData({
            username: user.username || '',
            bio: user.bio || '',
            currentPosition: user.currentPosition || '',
            location: user.location || '',
            skills: user.skills || [],
            avatar: user.avatar || '',
            banner: user.banner || '',
            resume: user.resume || '',
            socialLinks: {
                github: user.socialLinks?.github || '',
                linkedin: user.socialLinks?.linkedin || '',
                portfolio: user.socialLinks?.portfolio || ''
            }
        });
    }
  }, [user]);

  const handleChange = (e) => {
      const { name, value } = e.target;
      if (name.includes('.')) {
          const [parent, child] = name.split('.');
          setFormData(prev => ({
              ...prev,
              [parent]: { ...prev[parent], [child]: value }
          }));
      } else {
          setFormData(prev => ({ ...prev, [name]: value }));
      }
  };

  const handleFileChange = async (e, field) => {
      const file = e.target.files[0];
      if (!file) return;

      console.log('📤 Uploading file:', file.name, 'Size:', (file.size / 1024).toFixed(2), 'KB');

      const uploadData = new FormData();
      uploadData.append('image', file);

      try {
          const res = await api.post('/upload', uploadData, {
              headers: { 'Content-Type': 'multipart/form-data' }
          });
          
          console.log('✅ Upload success! Server response:', res.data);
          console.log('📁 File saved at:', res.data.filePath);
          
          setFormData(prev => ({ ...prev, [field]: res.data.filePath }));
          alert('File uploaded successfully!');
      } catch (err) {
          console.error('❌ Upload failed:', err.response?.data || err.message);
          alert('File upload failed. Please ensure it is a valid image or document under 5MB.');
      }
  };

  const handleSkillAdd = (e) => {
      if (e.key === 'Enter' && e.target.value) {
          e.preventDefault();
          if (!formData.skills.includes(e.target.value)) {
            setFormData(prev => ({ ...prev, skills: [...prev.skills, e.target.value] }));
          }
          e.target.value = '';
      }
  };

  const removeSkill = (skillToRemove) => {
      setFormData(prev => ({
          ...prev,
          skills: prev.skills.filter(skill => skill !== skillToRemove)
      }));
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
          // Send all data including avatar/banner paths
          await api.put('/users/profile', formData);
          // Refresh user data from server
          await refreshUser();
          setIsEditing(false);
      } catch (err) {
          console.error(err);
          alert('Failed to update profile. Please try again.');
      } finally {
          setLoading(false);
      }
  };

  const getImageUrl = (path) => {
      if (!path) return null;
      if (path.startsWith('http')) return path;
      // Use the API base URL from environment variable
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      // Remove '/api' suffix to get the base server URL
      const baseUrl = apiBaseUrl.replace('/api', '');
      return `${baseUrl}${path}`;
  };

  const getDownloadUrl = (url) => {
      if (!url) return null;
      // Return URL as-is - browser's download attribute will handle it
      // fl_attachment doesn't work for raw files in free tier
      return url;
  };

  if (!user) return <div className="p-10 text-center text-muted">Loading profile...</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card mb-8 overflow-hidden relative group"
      >
        {/* Banner */}
        <div className="h-40 bg-gradient-to-r from-primary/80 to-secondary/80 relative overflow-hidden">
            {formData.banner ? (
                <img src={getImageUrl(formData.banner)} alt="Banner" className="w-full h-full object-cover" />
            ) : (
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
            )}
            
            {isEditing && (
                <>
                    <button 
                        type="button"
                        onClick={() => bannerInputRef.current.click()}
                        className="absolute top-4 right-16 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors text-white"
                    >
                        <Camera size={20} />
                    </button>
                    {formData.banner && (
                        <button
                            onClick={async () => {
                                if (window.confirm('Delete banner image?')) {
                                    try {
                                        await api.delete('/users/banner');
                                        await refreshUser();
                                        setFormData(prev => ({ ...prev, banner: '' }));
                                        alert('Banner deleted successfully');
                                    } catch (error) {
                                        console.error('Error deleting banner:', error);
                                        alert('Failed to delete banner');
                                    }
                                }
                            }}
                            className="absolute top-4 right-4 bg-red-600/80 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur-sm transition-colors shadow-lg"
                            title="Delete Banner"
                        >
                            <Trash2 size={20} />
                        </button>
                    )}
                </>
            )}
            <input 
                type="file" 
                ref={bannerInputRef} 
                onChange={(e) => handleFileChange(e, 'banner')} 
                className="hidden" 
                accept="image/*"
            />
        </div>
        
        <div className="relative z-10 px-4 sm:px-8 pb-6 sm:pb-8 flex flex-col sm:flex-row items-center sm:items-end -mt-12 sm:-mt-16 gap-4 sm:gap-6">
            <div className="relative group">
                {/* Avatar */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-background bg-surface shadow-xl flex items-center justify-center text-4xl sm:text-5xl font-bold bg-gradient-to-br from-surface to-background-light overflow-hidden relative">
                    {formData.avatar ? (
                        <img src={getImageUrl(formData.avatar)} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <span className="bg-clip-text text-transparent bg-gradient-to-br from-primary to-secondary">
                            {user.username?.[0]?.toUpperCase()}
                        </span>
                    )}
                    
                    {isEditing && (
                         <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => avatarInputRef.current.click()}>
                             <Camera size={24} className="text-white" />
                         </div>
                    )}
                </div>
                <div className="absolute bottom-2 right-2 z-20 flex gap-2">
                     {formData.avatar && isEditing && (
                         <button
                             onClick={async () => {
                                 if (window.confirm('Delete profile picture?')) {
                                     try {
                                         await api.delete('/users/avatar');
                                         await refreshUser();
                                         setFormData(prev => ({ ...prev, avatar: '' }));
                                         alert('Avatar deleted successfully');
                                     } catch (error) {
                                         console.error('Error deleting avatar:', error);
                                         alert('Failed to delete avatar');
                                     }
                                 }
                             }}
                             className="bg-red-600/80 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur-sm transition-colors shadow-lg"
                             title="Delete Avatar"
                         >
                             <Trash2 size={16} />
                         </button>
                     )}
                     <button 
                        onClick={() => setIsEditing(!isEditing)}
                         className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-colors shadow-lg border-2 border-surface"
                         title={isEditing ? "Cancel Editing" : "Edit Profile"}
                     >
                        {isEditing ? <X size={16} /> : <Edit2 size={16} />}
                     </button>
                </div>
                 <input 
                    type="file" 
                    ref={avatarInputRef} 
                    onChange={(e) => handleFileChange(e, 'avatar')} 
                    className="hidden" 
                    accept="image/*"
                />
            </div>
            
    <div className="flex-1 pb-2 text-center sm:text-left w-full min-w-0">
                <div className="flex justify-between items-start">
                    <div className="w-full min-w-0">
                        {isEditing ? (
                            <input
                                type="text"
                                name="username"
                                value={formData.username || user.username}
                                onChange={handleChange}
                                className="text-2xl sm:text-3xl md:text-4xl font-bold bg-transparent border-b border-white/10 focus:border-primary outline-none w-full mb-1"
                            />
                        ) : (
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold break-words overflow-hidden text-ellipsis">{user.username}</h1>
                        )}
                        <p className="text-base sm:text-xl text-muted mt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                             <span className="truncate max-w-full">{user.currentPosition || "Coding Enthusiast"}</span>
                             {user.location && (
                                <>
                                    <span className="w-1 h-1 rounded-full bg-muted hidden sm:block"></span>
                                    <span className="text-xs sm:text-sm flex items-center gap-1"><MapPin size={14}/> {user.location}</span>
                                </>
                             )}
                        </p>
                    </div>
                    {/* Edit Button moved to Avatar */}
                </div>
            </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Stats & Info */}
        <div className="space-y-6">
            {/* Stats */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card p-6"
            >
                <h3 className="section-title mb-4 flex items-center gap-2">
                    <TrendingUp className="text-primary" size={20}/> Activity
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="stat-card bg-surface-light p-4 rounded-xl text-center border border-white/5">
                        <div className="text-3xl font-bold text-yellow-400 mb-1">{user.coins || 0}</div>
                        <div className="text-xs uppercase tracking-wider text-muted font-semibold">Coins</div>
                    </div>
                    <div className="stat-card bg-surface-light p-4 rounded-xl text-center border border-white/5">
                        <div className="text-3xl font-bold text-orange-500 mb-1">{user.streak || 0} 🔥</div>
                        <div className="text-xs uppercase tracking-wider text-muted font-semibold">Day Streak</div>
                    </div>
                </div>
            </motion.div>

            {/* Socials */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6"
            >
                <h3 className="section-title mb-4 flex items-center gap-2">
                    <Globe className="text-primary" size={20}/> Connect
                </h3>
                <div className="space-y-3">
                    {user.email && (
                        <div className="flex items-center gap-3 text-muted hover:text-white transition-colors">
                            <Mail size={18} /> {user.email}
                        </div>
                    )}
                    {(formData.socialLinks?.github || isEditing) && (
                         <div className="flex items-center gap-3 text-muted hover:text-white transition-colors">
                            <Github size={18} /> 
                            {isEditing ? (
                                <span className="text-sm">Link via Edit Form</span>
                            ) : (
                                <a href={formData.socialLinks?.github} target="_blank" rel="noreferrer" className="cursor-pointer hover:underline">
                                    {formData.socialLinks?.github ? "GitHub Profile" : "Add GitHub"}
                                </a>
                            )}
                        </div>
                    )}
                     {(formData.socialLinks?.linkedin || isEditing) && (
                         <div className="flex items-center gap-3 text-muted hover:text-white transition-colors">
                            <Linkedin size={18} /> 
                            {isEditing ? (
                                <span className="text-sm">Link via Edit Form</span>
                            ) : (
                                <a href={formData.socialLinks?.linkedin} target="_blank" rel="noreferrer" className="cursor-pointer hover:underline">
                                     {formData.socialLinks?.linkedin ? "LinkedIn Profile" : "Add LinkedIn"}
                                </a>
                            )}
                        </div>
                    )}
                      {(formData.socialLinks?.portfolio || isEditing) && (
                         <div className="flex items-center gap-3 text-muted hover:text-white transition-colors">
                            <Globe size={18} /> 
                            {isEditing ? (
                                <span className="text-sm">Link via Edit Form</span>
                            ) : (
                                <a href={formData.socialLinks?.portfolio} target="_blank" rel="noreferrer" className="cursor-pointer hover:underline">
                                     {formData.socialLinks?.portfolio ? "Portfolio" : "Add Portfolio"}
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>

        {/* Right Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
                {isEditing ? (
                    <motion.form
                        key="edit-form"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="glass-card p-8"
                        onSubmit={handleSubmit}
                    >
                        <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted">Current Position</label>
                                <div className="input-group flex items-center bg-surface-light rounded-lg px-3 border border-white/10 focus-within:border-primary transition-colors">
                                    <Briefcase size={18} className="text-muted mr-2" />
                                    <input 
                                        type="text" 
                                        name="currentPosition" 
                                        value={formData.currentPosition}
                                        onChange={handleChange}
                                        className="bg-transparent border-none outline-none w-full py-3 text-white placeholder-gray-500"
                                        placeholder="e.g. Senior Developer"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted">Location</label>
                                <div className="input-group flex items-center bg-surface-light rounded-lg px-3 border border-white/10 focus-within:border-primary transition-colors">
                                    <MapPin size={18} className="text-muted mr-2" />
                                    <input 
                                        type="text" 
                                        name="location" 
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="bg-transparent border-none outline-none w-full py-3 text-white placeholder-gray-500"
                                        placeholder="e.g. San Francisco, CA"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 mb-6">
                            <label className="text-sm font-medium text-muted">Bio</label>
                            <textarea 
                                name="bio" 
                                value={formData.bio}
                                onChange={handleChange}
                                className="w-full bg-surface-light rounded-lg p-4 border border-white/10 focus:border-primary outline-none transition-colors min-h-[100px]"
                                placeholder="Tell us about yourself..."
                            ></textarea>
                        </div>

                         <div className="space-y-2 mb-6">
                            <label className="text-sm font-medium text-muted">Social Links</label>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="flex items-center bg-surface-light rounded-lg px-3 border border-white/10">
                                    <Github size={18} className="text-muted mr-2" />
                                    <input 
                                        type="text" 
                                        name="socialLinks.github" 
                                        value={formData.socialLinks.github}
                                        onChange={handleChange}
                                        className="bg-transparent border-none outline-none w-full py-3 text-white text-sm"
                                        placeholder="GitHub URL"
                                    />
                                </div>
                                <div className="flex items-center bg-surface-light rounded-lg px-3 border border-white/10">
                                    <Linkedin size={18} className="text-muted mr-2" />
                                    <input 
                                        type="text" 
                                        name="socialLinks.linkedin" 
                                        value={formData.socialLinks.linkedin}
                                        onChange={handleChange}
                                        className="bg-transparent border-none outline-none w-full py-3 text-white text-sm"
                                        placeholder="LinkedIn URL"
                                    />
                                </div>
                                <div className="flex items-center bg-surface-light rounded-lg px-3 border border-white/10">
                                    <Globe size={18} className="text-muted mr-2" />
                                    <input 
                                        type="text" 
                                        name="socialLinks.portfolio" 
                                        value={formData.socialLinks.portfolio}
                                        onChange={handleChange}
                                        className="bg-transparent border-none outline-none w-full py-3 text-white text-sm"
                                        placeholder="Portfolio URL"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 mb-6">
                            <label className="text-sm font-medium text-muted">Resume</label>
                            <div className="flex items-center gap-4 bg-surface-light rounded-lg p-3 border border-white/10">
                                <FileText size={24} className="text-primary" />
                                <div className="flex-1 truncate text-sm text-gray-300">
                                    {formData.resume ? (formData.resume.split('/').pop().split('-').slice(2).join('-') || "Resume Uploaded") : "No resume uploaded"}
                                </div>
                                <input 
                                    type="file" 
                                    ref={resumeInputRef} 
                                    onChange={(e) => handleFileChange(e, 'resume')} 
                                    className="hidden" 
                                    accept=".pdf,.doc,.docx"
                                />
                                <button 
                                    type="button" 
                                    onClick={() => resumeInputRef.current.click()}
                                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded text-sm transition-colors"
                                >
                                    Upload
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2 mb-6">
                            <label className="text-sm font-medium text-muted">Skills (Press Enter to add)</label>
                             <div className="input-group flex items-center bg-surface-light rounded-lg px-3 border border-white/10 focus-within:border-primary transition-colors">
                                <input 
                                    type="text" 
                                    onKeyDown={handleSkillAdd}
                                    className="bg-transparent border-none outline-none w-full py-3 text-white placeholder-gray-500"
                                    placeholder="Add a skill..."
                                />
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {formData.skills.map((skill, index) => (
                                    <span key={index} className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                        {skill}
                                        <button type="button" onClick={() => removeSkill(skill)} className="hover:text-white"><X size={14}/></button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                            <button 
                                type="button" 
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-2 rounded-lg hover:bg-white/5 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="btn btn-primary flex items-center gap-2"
                            >
                                <Save size={18} /> Save Changes
                            </button>
                        </div>
                    </motion.form>
                ) : (
                    <motion.div 
                        key="view-mode"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                         {/* Bio */}
                         <div className="glass-card p-8">
                            <h3 className="section-title mb-4 flex items-center gap-2">
                                <User className="text-secondary" size={20}/> About Me
                            </h3>
                            <p className="text-muted leading-relaxed">
                                {user.bio || "This user hasn't written a bio yet."}
                            </p>
                         </div>

                        {/* Skills */}
                        <div className="glass-card p-8">
                            <h3 className="section-title mb-4 flex items-center gap-2">
                                <Award className="text-yellow-400" size={20}/> Skills
                            </h3>
                            {user.skills && user.skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {user.skills.map((skill, index) => (
                                        <div key={index} className="bg-white/5 hover:bg-white/10 transition-colors px-4 py-2 rounded-lg border border-white/5 text-sm font-medium">
                                            {skill}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted">No skills listed yet.</p>
                            )}
                        </div>

                        {/* Resume Section */}
                        <div className="glass-card p-8">
                            <h3 className="section-title mb-4 flex items-center gap-2">
                                <FileText className="text-blue-400" size={20}/> Resume
                            </h3>
                            {user.resume ? (
                                <div className="flex items-center justify-between bg-surface-light p-4 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-500/20 rounded-lg">
                                            <FileText size={24} className="text-blue-400" />
                                        </div>
                                        <div>
                                             <div className="font-medium text-white">My Resume</div>
                                            <div className="text-xs text-muted">Click to delete</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={async () => {
                                                if (window.confirm('Are you sure you want to delete your resume? This action cannot be undone.')) {
                                                    try {
                                                        await api.delete('/users/resume');
                                                        await refreshUser();
                                                        alert('Resume deleted successfully');
                                                    } catch (error) {
                                                        console.error('Error deleting resume:', error);
                                                        alert('Failed to delete resume');
                                                    }
                                                }
                                            }}
                                            className="p-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-colors text-red-400 hover:text-red-300"
                                            title="Delete Resume"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-muted">No resume uploaded yet.</p>
                            )}
                        </div>

                         {/* Badges */}
                         <div className="glass-card p-8">
                            <h3 className="section-title mb-4 flex items-center gap-2">
                                <Award className="text-secondary" size={20}/> Badges
                            </h3>
                            {user.badges && user.badges.length > 0 ? (
                                <div className="flex flex-wrap gap-4">
                                    {user.badges.map((badge, index) => (
                                        <div key={index} className="bg-gradient-to-br from-primary/20 to-secondary/20 px-4 py-2 rounded-full border border-primary/20 text-sm">
                                            {badge}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted">No badges earned yet. Keep practicing!</p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
};


export default Profile;
