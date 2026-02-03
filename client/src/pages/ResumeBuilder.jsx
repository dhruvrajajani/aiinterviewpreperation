import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, User, Briefcase, GraduationCap, Code, Sparkles, ChevronRight, ChevronLeft, Download, LayoutTemplate, Palette, CheckCircle, FolderGit2, BookOpen, Link as LinkIcon, Github } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';

const ResumeBuilder = () => {
    const [step, setStep] = useState(1);
    const [generating, setGenerating] = useState(false);
    const [generated, setGenerated] = useState(false);
    const resumeRef = useRef(null);

    const downloadPDF = async () => {
        if (!resumeRef.current) return;
        
        const toastId = toast.loading('Generating PDF...');
        try {
            const canvas = await html2canvas(resumeRef.current, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${formData.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
            toast.success('Resume downloaded!', { id: toastId });
        } catch (err) {
            console.error("PDF Generation failed", err);
            toast.error('Failed to generate PDF', { id: toastId });
        }
    };
    
    // State
    const [selectedTemplate, setSelectedTemplate] = useState('modern');
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        linkedin: '',
        github: '', // Added
        website: '', // Added
        address: '', 
        summary: '',
        education: [{ school: '', degree: '', year: '' }],
        experience: [{ company: '', role: '', duration: '', description: '' }],
        projects: [{ title: '', link: '', description: '', techs: '' }], // Added
        research: [{ title: '', publisher: '', year: '', link: '' }], // Added
        skills: ''
    });

    const templates = [
        { id: 'modern', name: 'Modern Tech', color: 'from-blue-500 to-cyan-500', icon: LayoutTemplate, desc: 'Clean, two-column layout perfect for developers.' },
        { id: 'classic', name: 'Classic Professional', color: 'from-gray-700 to-gray-900', icon: FileText, desc: 'Traditional single-column elegance for corporate roles.' },
        { id: 'minimal', name: 'Creative Minimalist', color: 'from-purple-500 to-pink-500', icon: Palette, desc: 'Bold typography and whitespace for designers.' }
    ];

    const handleInputChange = (e, field) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    const handleArrayChange = (index, field, value, type) => {
        const newArray = [...formData[type]];
        newArray[index][field] = value;
        setFormData({ ...formData, [type]: newArray });
    };

    const addArrayItem = (type) => {
        let newItem;
        if (type === 'education') newItem = { school: '', degree: '', year: '' };
        else if (type === 'experience') newItem = { company: '', role: '', duration: '', description: '' };
        else if (type === 'projects') newItem = { title: '', link: '', description: '', techs: '' };
        else if (type === 'research') newItem = { title: '', publisher: '', year: '', link: '' };
        
        setFormData({ ...formData, [type]: [...formData[type], newItem] });
    };

    const removeArrayItem = (index, type) => {
        const newArray = [...formData[type]];
        newArray.splice(index, 1);
        setFormData({ ...formData, [type]: newArray });
    };


    const handleGenerate = async () => {
        setGenerating(true);
        
        // Track resume creation
        try {
            await api.post('/resume/created');
        } catch (error) {
            console.error('Error tracking resume creation:', error);
        }
        
        setTimeout(() => {
            setGenerating(false);
            setGenerated(true);
        }, 2000);
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const steps = [
        { id: 1, title: 'Template', icon: LayoutTemplate },
        { id: 2, title: 'Personal', icon: User },
        { id: 3, title: 'Experience', icon: Briefcase },
        { id: 4, title: 'Projects', icon: FolderGit2 }, // New Step
        { id: 5, title: 'Education', icon: GraduationCap },
        { id: 6, title: 'Skills', icon: Code },
        { id: 7, title: 'Preview', icon: FileText }
    ];

    // --- Template Components ---
    const ModernTemplate = ({ data }) => (
        <div className="bg-white text-gray-800 h-full flex shadow-xl min-h-[800px]">
            {/* Sidebar */}
            <div className="w-1/3 bg-slate-900 text-white p-8 flex flex-col gap-6">
                <div>
                    <h1 className="text-2xl font-bold uppercase tracking-wider mb-2">{data.fullName || 'YOUR NAME'}</h1>
                    <p className="text-blue-400 text-sm mb-1">{data.email}</p>
                    <p className="text-blue-400 text-sm mb-1">{data.phone}</p>
                    <p className="text-gray-400 text-xs mt-2 mb-1">{data.address}</p>
                    <div className="flex flex-col gap-1 mt-2">
                        {data.linkedin && <p className="text-gray-400 text-xs flex items-center gap-1"><LinkIcon size={10}/> {data.linkedin.replace('https://', '')}</p>}
                        {data.github && <p className="text-gray-400 text-xs flex items-center gap-1"><Github size={10}/> {data.github.replace('https://', '')}</p>}
                        {data.website && <p className="text-gray-400 text-xs flex items-center gap-1"><LinkIcon size={10}/> {data.website.replace('https://', '')}</p>}
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest border-b border-gray-700 pb-1 mb-3 text-blue-400">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {data.skills.split(',').map((s, i) => (
                            <span key={i} className="bg-white/10 px-2 py-1 rounded text-xs">{s.trim()}</span>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest border-b border-gray-700 pb-1 mb-3 text-blue-400">Education</h3>
                    {data.education.map((edu, i) => (
                        <div key={i} className="mb-4">
                            <p className="font-bold text-sm">{edu.school}</p>
                            <p className="text-xs text-gray-400">{edu.degree}</p>
                            <p className="text-xs text-gray-500 italic">{edu.year}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="w-2/3 p-8 bg-white">
                {data.summary && (
                    <div className="mb-8">
                        <h2 className="text-xl font-bold uppercase text-slate-800 border-b-2 border-slate-200 pb-2 mb-4">Professional Summary</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">{data.summary}</p>
                    </div>
                )}

                <div className="mb-8">
                    <h2 className="text-xl font-bold uppercase text-slate-800 border-b-2 border-slate-200 pb-2 mb-4">Experience</h2>
                    {data.experience.map((exp, i) => (
                        <div key={i} className="mb-6 relative pl-4 border-l-2 border-slate-100">
                            <div className="absolute -left-[9px] top-1 px-1">●</div>
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="font-bold text-lg text-slate-800">{exp.role}</h3>
                                <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{exp.duration}</span>
                            </div>
                            <div className="text-sm font-semibold text-blue-600 mb-2">{exp.company}</div>
                            <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{exp.description}</p>
                        </div>
                    ))}
                </div>

                {data.projects.length > 0 && data.projects[0].title && (
                    <div className="mb-8">
                        <h2 className="text-xl font-bold uppercase text-slate-800 border-b-2 border-slate-200 pb-2 mb-4">Projects</h2>
                        {data.projects.map((proj, i) => (
                            <div key={i} className="mb-4">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-md text-slate-800">{proj.title}</h3>
                                    {proj.link && <a href={proj.link} target="_blank" className="text-xs text-blue-500 hover:underline">View Project</a>}
                                </div>
                                <p className="text-xs text-gray-500 font-mono mb-1">{proj.techs}</p>
                                <p className="text-sm text-gray-600">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                )}

                {data.research && data.research.length > 0 && data.research[0].title && (
                    <div className="mb-8">
                        <h2 className="text-xl font-bold uppercase text-slate-800 border-b-2 border-slate-200 pb-2 mb-4">Research & Publications</h2>
                        {data.research.map((res, i) => (
                            <div key={i} className="mb-3">
                                <p className="font-bold text-sm text-slate-800">{res.title}</p>
                                <p className="text-xs text-gray-500">{res.publisher} • {res.year}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    const ClassicTemplate = ({ data }) => (
        <div className="bg-white text-black p-10 h-full shadow-xl font-serif min-h-[800px]">
            <div className="text-center border-b-2 border-black pb-6 mb-6">
                <h1 className="text-4xl font-bold tracking-tight mb-2">{data.fullName || 'Your Name'}</h1>
                <div className="flex justify-center gap-4 text-sm italic items-center flex-wrap">
                    <span>{data.email}</span> • <span>{data.phone}</span>
                </div>
                <div className="flex justify-center gap-4 text-xs mt-2 text-gray-600">
                    {data.linkedin && <span>LinkedIn: {data.linkedin.replace('https://www.linkedin.com/in/', '')}</span>}
                    {data.github && <span>GitHub: {data.github.replace('https://github.com/', '')}</span>}
                </div>
                {data.address && <p className="text-xs text-gray-500 mt-2">{data.address}</p>}
            </div>

            {data.summary && (
               <div className="mb-6">
                   <h3 className="font-bold uppercase text-sm mb-2 border-b border-gray-300 pb-1">Profile</h3>
                   <p className="text-sm leading-relaxed">{data.summary}</p>
               </div>
            )}

            <div className="mb-6">
                <h3 className="font-bold uppercase text-sm border-b border-gray-300 mb-3 pb-1">Experience</h3>
                {data.experience.map((exp, i) => (
                    <div key={i} className="mb-4">
                        <div className="flex justify-between font-bold text-sm">
                            <span>{exp.company}</span>
                            <span>{exp.duration}</span>
                        </div>
                        <div className="italic text-sm mb-1">{exp.role}</div>
                        <p className="text-sm text-gray-700">{exp.description}</p>
                    </div>
                ))}
            </div>

            {data.projects.length > 0 && data.projects[0].title && (
                <div className="mb-6">
                    <h3 className="font-bold uppercase text-sm border-b border-gray-300 mb-3 pb-1">Projects</h3>
                    {data.projects.map((proj, i) => (
                        <div key={i} className="mb-3">
                            <div className="flex justify-between font-bold text-sm">
                                <span>{proj.title}</span>
                            </div>
                            <p className="text-xs italic text-gray-600 mb-1">{proj.techs}</p>
                            <p className="text-sm text-gray-700">{proj.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {data.research && data.research.length > 0 && data.research[0].title && (
                <div className="mb-6">
                    <h3 className="font-bold uppercase text-sm border-b border-gray-300 mb-3 pb-1">Publications</h3>
                    {data.research.map((res, i) => (
                        <div key={i} className="mb-2">
                            <span className="font-bold text-sm">{res.title}</span> <span className="text-sm text-gray-600">— {res.publisher}, {res.year}</span>
                        </div>
                    ))}
                </div>
            )}

            <div className="mb-6">
                <h3 className="font-bold uppercase text-sm border-b border-gray-300 mb-3 pb-1">Education</h3>
                {data.education.map((edu, i) => (
                    <div key={i} className="mb-2 flex justify-between text-sm">
                        <div>
                            <span className="font-bold">{edu.school}</span>, <span className="italic">{edu.degree}</span>
                        </div>
                        <span>{edu.year}</span>
                    </div>
                ))}
            </div>

            <div>
                 <h3 className="font-bold uppercase text-sm border-b border-gray-300 mb-3 pb-1">Skills</h3>
                 <p className="text-sm">{data.skills}</p>
            </div>
        </div>
    );


    return (
        <div className="min-h-screen pt-24 px-6 max-w-6xl mx-auto pb-20">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                    <Sparkles className="text-primary" /> AI Resume Studio
                </h1>
                <p className="text-muted text-lg">Build your professional identity with our intelligent designer.</p>
            </div>

            {/* Progress Steps */}
            <div className="flex justify-between items-center mb-12 relative max-w-5xl mx-auto">
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-white/10 -z-10 rounded-full"></div>
                <div className="hidden md:block absolute top-1/2 left-0 h-1 bg-gradient-to-r from-primary to-purple-500 -z-10 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}></div>
                
                {steps.map((s) => (
                    <div key={s.id} className="flex flex-col items-center gap-2 bg-background p-2 rounded-full z-10">
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-all ${step >= s.id ? 'bg-primary border-primary text-white' : 'bg-surface border-white/20 text-muted'}`}>
                            <s.icon size={16} />
                        </div>
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">{s.title}</span>
                    </div>
                ))}
            </div>

            <motion.div layout className="max-w-4xl mx-auto">
                <AnimatePresence mode="wait">
                    {/* STEP 1: TEMPLATE SELECTION */}
                    {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                            <h2 className="text-3xl font-bold text-center">Choose Your Style</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {templates.map((t) => (
                                    <div 
                                        key={t.id}
                                        onClick={() => setSelectedTemplate(t.id)}
                                        className={`group cursor-pointer relative rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                                            selectedTemplate === t.id 
                                            ? 'border-primary shadow-[0_0_30px_rgba(99,102,241,0.3)] scale-105' 
                                            : 'border-white/10 hover:border-white/30 grayscale hover:grayscale-0'
                                        }`}
                                    >
                                        <div className={`h-32 bg-gradient-to-br ${t.color} flex items-center justify-center`}>
                                            <t.icon size={48} className="text-white drop-shadow-lg" />
                                        </div>
                                        <div className="p-6 bg-surface">
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="font-bold text-lg">{t.name}</h3>
                                                {selectedTemplate === t.id && <CheckCircle size={20} className="text-primary" />}
                                            </div>
                                            <p className="text-muted text-sm">{t.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: PERSONAL INFO */}
                    {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card p-8">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><User className="text-primary" /> Personal Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput label="Full Name" value={formData.fullName} onChange={(val) => handleInputChange({ target: { value: val } }, 'fullName')} placeholder="Jane Doe" />
                                <FormInput label="Email Address" value={formData.email} onChange={(val) => handleInputChange({ target: { value: val } }, 'email')} placeholder="jane@example.com" />
                                <FormInput label="Phone Number" value={formData.phone} onChange={(val) => handleInputChange({ target: { value: val } }, 'phone')} placeholder="+1 555 000 0000" />
                                <FormInput label="Location" value={formData.address} onChange={(val) => handleInputChange({ target: { value: val } }, 'address')} placeholder="San Francisco, CA" />
                                <FormInput label="LinkedIn URL" value={formData.linkedin} onChange={(val) => handleInputChange({ target: { value: val } }, 'linkedin')} placeholder="linkedin.com/in/jane" />
                                <FormInput label="GitHub URL" value={formData.github} onChange={(val) => handleInputChange({ target: { value: val } }, 'github')} placeholder="github.com/jane" />
                                <FormInput label="Portfolio Website" value={formData.website} onChange={(val) => handleInputChange({ target: { value: val } }, 'website')} placeholder="janedoe.com" />
                                
                                <div className="md:col-span-2">
                                    <label className="text-sm font-semibold text-gray-300 mb-1 block">Professional Summary</label>
                                    <textarea 
                                        value={formData.summary} 
                                        onChange={(e) => handleInputChange(e, 'summary')}
                                        className="w-full h-24 bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-primary outline-none resize-none"
                                        placeholder="Briefly describe your experience and career goals..."
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: EXPERIENCE */}
                    {step === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card p-8">
                             <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Briefcase className="text-primary" /> Work Experience</h2>
                             {formData.experience.map((exp, index) => (
                                <div key={index} className="mb-6 p-6 bg-white/5 rounded-xl border border-white/10 relative group hover:border-white/20 transition-colors">
                                    {index > 0 && <button onClick={() => removeArrayItem(index, 'experience')} className="absolute top-4 right-4 text-red-400 text-xs hover:bg-red-400/10 px-2 py-1 rounded">Remove</button>}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormInput label="Job Title" value={exp.role} onChange={(val) => handleArrayChange(index, 'role', val, 'experience')} placeholder="Senior Engineer" />
                                        <FormInput label="Company" value={exp.company} onChange={(val) => handleArrayChange(index, 'company', val, 'experience')} placeholder="Tech Corp Inc." />
                                        <FormInput label="Duration" value={exp.duration} onChange={(val) => handleArrayChange(index, 'duration', val, 'experience')} placeholder="Jan 2020 - Present" />
                                        <div className="md:col-span-2">
                                            <label className="text-xs text-gray-400 mb-1 block">Key Achievements</label>
                                            <textarea 
                                                value={exp.description} 
                                                onChange={(e) => handleArrayChange(index, 'description', e.target.value, 'experience')}
                                                className="w-full h-24 bg-black/20 border border-white/10 rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary outline-none"
                                                placeholder="• Describe your responsibilities..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => addArrayItem('experience')} className="w-full py-3 border-2 border-dashed border-white/20 rounded-xl text-gray-400 hover:text-white hover:border-white/40 font-bold transition-all">+ Add Position</button>
                        </motion.div>
                    )}

                     {/* STEP 4: PROJECTS (NEW) */}
                     {step === 4 && (
                        <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card p-8">
                             <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><FolderGit2 className="text-primary" /> Projects & Research</h2>
                             
                             <h3 className="text-lg font-bold text-gray-300 mb-4 border-b border-white/10 pb-2">Significant Projects</h3>
                             {formData.projects.map((proj, index) => (
                                <div key={index} className="mb-6 p-6 bg-white/5 rounded-xl border border-white/10 relative">
                                    {index > 0 && <button onClick={() => removeArrayItem(index, 'projects')} className="absolute top-4 right-4 text-red-400 text-xs">Remove</button>}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormInput label="Project Title" value={proj.title} onChange={(val) => handleArrayChange(index, 'title', val, 'projects')} placeholder="E-commerce App" />
                                        <FormInput label="Link (GitHub/Live)" value={proj.link} onChange={(val) => handleArrayChange(index, 'link', val, 'projects')} placeholder="github.com/myproject" />
                                        <div className="md:col-span-2">
                                             <FormInput label="Technologies Used" value={proj.techs} onChange={(val) => handleArrayChange(index, 'techs', val, 'projects')} placeholder="React, Node.js, MongoDB" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-xs text-gray-400 mb-1 block">Description</label>
                                            <textarea 
                                                value={proj.description} 
                                                onChange={(e) => handleArrayChange(index, 'description', e.target.value, 'projects')}
                                                className="w-full h-20 bg-black/20 border border-white/10 rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary outline-none"
                                                placeholder="Built a full-stack platform that..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => addArrayItem('projects')} className="w-full py-2 mb-8 border border-dashed border-white/20 rounded-lg text-sm text-gray-400 hover:text-white">+ Add Project</button>

                            <h3 className="text-lg font-bold text-gray-300 mb-4 border-b border-white/10 pb-2">Research Papers / Publications</h3>
                            {formData.research.map((res, index) => (
                                <div key={index} className="mb-4 p-4 bg-white/5 rounded-xl border border-white/10 relative">
                                    {index > 0 && <button onClick={() => removeArrayItem(index, 'research')} className="absolute top-2 right-2 text-red-500 text-xs">Remove</button>}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormInput label="Paper Title" value={res.title} onChange={(val) => handleArrayChange(index, 'title', val, 'research')} placeholder="AI in Healthcare" />
                                        <FormInput label="Publisher/Conference" value={res.publisher} onChange={(val) => handleArrayChange(index, 'publisher', val, 'research')} placeholder="IEEE Journal" />
                                        <FormInput label="Year" value={res.year} onChange={(val) => handleArrayChange(index, 'year', val, 'research')} placeholder="2024" />
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => addArrayItem('research')} className="text-primary text-sm font-bold hover:underline">+ Add Publication</button>
                        </motion.div>
                    )}

                    {/* STEP 5: EDUCATION */}
                    {step === 5 && (
                        <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card p-8">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><GraduationCap className="text-primary" /> Education</h2>
                            {formData.education.map((edu, index) => (
                                <div key={index} className="mb-4 p-4 bg-white/5 rounded-xl border border-white/10 relative">
                                    {index > 0 && <button onClick={() => removeArrayItem(index, 'education')} className="absolute top-2 right-2 text-red-500 text-xs">Remove</button>}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormInput label="School / University" value={edu.school} onChange={(val) => handleArrayChange(index, 'school', val, 'education')} />
                                        <FormInput label="Degree / Major" value={edu.degree} onChange={(val) => handleArrayChange(index, 'degree', val, 'education')} />
                                        <FormInput label="Graduation Year" value={edu.year} onChange={(val) => handleArrayChange(index, 'year', val, 'education')} />
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => addArrayItem('education')} className="text-primary text-sm font-bold hover:underline">+ Add Education</button>
                        </motion.div>
                    )}

                    {/* STEP 6: SKILLS */}
                    {step === 6 && (
                         <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card p-8">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Code className="text-primary" /> Skills</h2>
                            <p className="text-muted text-sm mb-4">List your technical skills separated by commas.</p>
                            <textarea 
                                value={formData.skills}
                                onChange={(e) => handleInputChange(e, 'skills')}
                                className="w-full h-40 bg-black/20 border border-white/10 rounded-xl p-6 text-lg text-white focus:ring-1 focus:ring-primary outline-none"
                                placeholder="e.g. React, Node.js, Project Management, Public Speaking..."
                            />
                        </motion.div>
                    )}

                    {/* STEP 7: PREVIEW & GENERATE */}
                    {step === 7 && (
                        <motion.div key="step7" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-full">
                             {!generated ? (
                                <div className="text-center py-20 bg-surface rounded-2xl border border-white/10">
                                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Sparkles size={40} className="text-primary" />
                                    </div>
                                    <h2 className="text-3xl font-bold mb-4">Ready to Build?</h2>
                                    <p className="text-muted mb-8 text-lg max-w-md mx-auto">Our AI will now assemble your information into the <strong>{templates.find(t => t.id === selectedTemplate)?.name}</strong> template.</p>
                                    <button 
                                        onClick={handleGenerate}
                                        disabled={generating}
                                        className="bg-primary hover:bg-primary/80 text-white px-10 py-4 rounded-full font-bold text-xl transition-all shadow-lg hover:shadow-primary/50 flex items-center gap-3 mx-auto"
                                    >
                                        {generating ? 'Optimizing Layout...' : 'Generate Resume'}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center bg-black/50 p-4 rounded-lg border border-white/10">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="text-green-500" />
                                            <span className="font-bold">Resume Generated Successfully!</span>
                                        </div>
                                        <button onClick={downloadPDF} className="bg-white text-black px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-gray-200">
                                            <Download size={16} /> Download PDF
                                        </button>
                                    </div>
                                    {/* PREVIEW CONTAINER */}
                                    <div ref={resumeRef} className="w-full aspect-[1/1.414] bg-white rounded shadow-2xl overflow-hidden mx-auto max-w-3xl transform origin-top hover:scale-[1.02] transition-transform duration-500">
                                        {selectedTemplate === 'modern' && <ModernTemplate data={formData} />}
                                        {selectedTemplate === 'classic' && <ClassicTemplate data={formData} />}
                                        {selectedTemplate === 'minimal' && <ClassicTemplate data={formData} />} {/* Reusing Classic for now or build 3rd */}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Footer Navigation */}
                <div className="flex justify-between mt-12">
                     <button 
                        onClick={prevStep} 
                        disabled={step === 1}
                        className={`flex items-center gap-2 font-bold transition-colors ${step === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 hover:text-white'}`}
                    >
                        <ChevronLeft size={20} /> Back
                    </button>
                    
                    {step < 7 && (
                        <button 
                            onClick={nextStep} 
                            className="bg-white text-black hover:bg-indigo-50 px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg"
                        >
                            Next Step <ChevronRight size={18} />
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

// UI Helper
const FormInput = ({ label, value, onChange, placeholder }) => (
    <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</label>
        <input 
            type="text" 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:ring-1 focus:ring-primary outline-none transition-all focus:bg-black/40"
            placeholder={placeholder}
        />
    </div>
);

export default ResumeBuilder;
