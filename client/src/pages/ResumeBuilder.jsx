import { useState, useRef, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, User, Briefcase, GraduationCap, Code, Sparkles, ChevronRight, ChevronLeft, Download, LayoutTemplate, Palette, CheckCircle, FolderGit2, Link as LinkIcon, Github, Terminal, Type, ALargeSmall, Bold, Italic, Underline, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const ResumeBuilder = () => {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [mobileView, setMobileView] = useState('edit'); // 'edit' or 'preview'
    const resumeRef = useRef(null);
    const [isAnalyzingATS, setIsAnalyzingATS] = useState(false);
    const [atsResult, setAtsResult] = useState(null);
    const [showAtsModal, setShowAtsModal] = useState(false);

    const [selectedTemplate, setSelectedTemplate] = useState('modern');
    const [theme, setTheme] = useState({
        accentColor: '#4f46e5', // Default indigo
        fontFamily: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        fontSize: '14px'
    });

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        linkedin: '',
        github: '',
        website: '',
        address: '', 
        summary: '',
        education: [{ school: '', degree: '', year: '' }],
        experience: [{ company: '', role: '', duration: '', description: '' }],
        projects: [{ title: '', link: '', description: '', techs: '' }],
        research: [{ title: '', publisher: '', year: '', link: '' }],
        skills: ''
    });

    // Auto-fill from user profile
    useEffect(() => {
        if (user && formData.fullName === '') {
            setFormData(prev => ({
                ...prev,
                fullName: user.username || '',
                email: user.email || '',
                linkedin: user.socialLinks?.linkedin || '',
                github: user.socialLinks?.github || '',
                website: user.socialLinks?.portfolio || '',
                skills: (user.skills && user.skills.join(', ')) || ''
            }));
        }
    }, [user]);

    const templates = [
        { id: 'modern', name: 'Modern Tech', color: 'from-blue-500 to-cyan-500', icon: LayoutTemplate, desc: 'Clean, two-column layout perfect for developers.' },
        { id: 'classic', name: 'Classic Professional', color: 'from-gray-700 to-gray-900', icon: FileText, desc: 'Traditional single-column elegance for corporate roles.' },
        { id: 'minimal', name: 'Creative Minimalist', color: 'from-purple-500 to-pink-500', icon: Palette, desc: 'Bold typography and whitespace for designers.' },
        { id: 'faang', name: 'FAANG Standard', color: 'from-emerald-500 to-teal-700', icon: Terminal, desc: 'The strict, technically dense 1-column layout used by top Silicon Valley engineers.' },
        { id: 'executive', name: 'Executive Leader', color: 'from-indigo-700 to-blue-900', icon: Briefcase, desc: 'Authoritative, metric-driven layout with a navy accent for senior leadership roles.' }
    ];

    const handleInputChange = (e, field) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    const handleArrayChange = (index, field, value, type) => {
        const newArray = [...formData[type]];
        newArray[index] = { ...newArray[index], [field]: value };
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
        if (formData[type].length <= 1) return;
        const newArray = [...formData[type]];
        newArray.splice(index, 1);
        setFormData({ ...formData, [type]: newArray });
    };

    const exportWord = async () => {
        try {
            await api.post('/resume/created');
        } catch (error) {
            console.error('Error tracking resume creation:', error);
            if (error.response?.status === 400 && error.response.data.msg.includes('coins')) {
                toast.error("Not enough coins to export resume.");
                return;
            }
        }

        const element = document.querySelector('.resume-print-container');
        if (!element) return;
        
        const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Resume Output</title></head><body>";
        const footer = "</body></html>";
        // Convert to DOC format using application/msword type
        const sourceHTML = header + element.innerHTML + footer;
        
        const blob = new Blob(['\\ufeff', sourceHTML], {
            type: 'application/msword;charset=utf-8'
        });
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const filename = formData.fullName ? formData.fullName.replace(/\\s+/g, '_') : 'Resume';
        link.download = `${filename}.doc`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success("Resume downloaded as Word document!");
    };

    const analyzeATS = async () => {
        setIsAnalyzingATS(true);
        try {
            const res = await api.post('/resume/ats', { resumeData: formData });
            setAtsResult(res.data);
            setShowAtsModal(true);
        } catch (err) {
            console.error('ATS Error:', err);
            if (err.response?.status === 400 && err.response.data.msg.includes('coins')) {
                toast.error("Not enough coins to analyze ATS score.");
            } else {
                toast.error("Failed to analyze ATS score.");
            }
        } finally {
            setIsAnalyzingATS(false);
        }
    };

    const downloadPDF = async () => {
        // Log the creation (uses 10 coins as configured)
        try {
            await api.post('/resume/created');
        } catch (error) {
            console.error('Error tracking resume creation:', error);
            if (error.response?.status === 400 && error.response.data.msg.includes('coins')) {
                toast.error("Not enough coins to export resume. Solve questions to earn more!");
                return;
            }
        }
        
        // Use browser's native print targeting our @media print CSS wrapper 
        toast.success("Select 'Save as PDF' in the destination dropdown!");
        setTimeout(() => window.print(), 500);
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const steps = [
        { id: 1, title: 'Template', icon: LayoutTemplate },
        { id: 2, title: 'Personal', icon: User },
        { id: 3, title: 'Experience', icon: Briefcase },
        { id: 4, title: 'Projects', icon: FolderGit2 },
        { id: 5, title: 'Education', icon: GraduationCap },
        { id: 6, title: 'Skills', icon: Code }
    ];

    // --- Template Components ---
    const ModernTemplate = ({ data, tConfig }) => (
        <div className="bg-white text-gray-800 h-full flex shadow-xl min-h-[850px] resume-document" style={{ fontFamily: tConfig.fontFamily, fontSize: tConfig.fontSize }}>
            <div className="w-1/3 text-white p-8 flex flex-col gap-6" style={{ backgroundColor: tConfig.accentColor }}>
                <div>
                    <h1 className="text-2xl font-bold uppercase tracking-wider mb-2" style={{ fontSize: '2em' }}>{data.fullName || 'YOUR NAME'}</h1>
                    <p className="text-white/80 text-[1em] mb-1">{data.email}</p>
                    <p className="text-white/80 text-[1em] mb-1">{data.phone}</p>
                    <p className="text-white/60 text-[0.85em] mt-2 mb-1">{data.address}</p>
                    <div className="flex flex-col gap-1 mt-2">
                        {data.linkedin && <p className="text-white/60 text-[0.85em] flex items-center gap-1"><LinkIcon size={10}/> {data.linkedin.replace('https://', '').replace('www.', '')}</p>}
                        {data.github && <p className="text-white/60 text-[0.85em] flex items-center gap-1"><Github size={10}/> {data.github.replace('https://', '').replace('www.', '')}</p>}
                    </div>
                </div>

                {data.skills && (
                    <div>
                        <h3 className="font-bold uppercase tracking-widest border-b border-white/20 pb-1 mb-3 text-white/90" style={{ fontSize: '0.9em' }}>Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {data.skills.split(',').filter(s=>s.trim()).map((s, i) => (
                                <span key={i} className="bg-white/10 px-2 py-1 rounded text-[0.85em]" dangerouslySetInnerHTML={{ __html: s.trim() }}></span >
                            ))}
                        </div>
                    </div>
                )}

                {data.education[0].school && (
                    <div>
                        <h3 className="font-bold uppercase tracking-widest border-b border-white/20 pb-1 mb-3 text-white/90" style={{ fontSize: '0.9em' }}>Education</h3>
                        {data.education.map((edu, i) => (
                            <div key={i} className="mb-4">
                                <p className="font-bold text-[1em]">{edu.school}</p>
                                <p className="text-[0.85em] text-white/70">{edu.degree}</p>
                                <p className="text-[0.85em] text-white/60 italic">{edu.year}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="w-2/3 p-8 bg-white">
                {data.summary && (
                    <div className="mb-8">
                        <h2 className="font-bold uppercase text-slate-800 border-b-2 border-slate-200 pb-2 mb-4" style={{ fontSize: '1.25em' }}>Professional Summary</h2>
                        <p className="text-slate-600 leading-relaxed" style={{ fontSize: '1em' }} dangerouslySetInnerHTML={{ __html: data.summary }}></p>
                    </div>
                )}

                {data.experience[0].company && (
                    <div className="mb-8">
                        <h2 className="font-bold uppercase text-slate-800 border-b-2 border-slate-200 pb-2 mb-4" style={{ fontSize: '1.25em' }}>Experience</h2>
                        {data.experience.map((exp, i) => (
                            <div key={i} className="mb-6 relative pl-4 border-l-2 border-slate-100">
                                <div className="absolute -left-[9px] top-1 px-1" style={{ color: tConfig.accentColor }}>●</div>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-slate-800" style={{ fontSize: '1.1em' }}>{exp.role}</h3>
                                    <span className="font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full" style={{ fontSize: '0.85em' }}>{exp.duration}</span>
                                </div>
                                <div className="font-semibold mb-2" style={{ fontSize: '1em', color: tConfig.accentColor }}>{exp.company}</div>
                                <p className="text-slate-600 whitespace-pre-line leading-relaxed" style={{ fontSize: '1em' }} dangerouslySetInnerHTML={{ __html: exp.description }}></p>
                            </div>
                        ))}
                    </div>
                )}

                {data.projects[0].title && (
                    <div className="mb-8">
                        <h2 className="font-bold uppercase text-slate-800 border-b-2 border-slate-200 pb-2 mb-4" style={{ fontSize: '1.25em' }}>Projects</h2>
                        {data.projects.map((proj, i) => (
                            <div key={i} className="mb-4">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-slate-800" style={{ fontSize: '1.05em' }}>{proj.title}</h3>
                                    {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="hover:underline" style={{ fontSize: '0.85em', color: tConfig.accentColor }}>View Project</a>}
                                </div>
                                <p className="text-slate-500 font-mono mb-1" style={{ fontSize: '0.85em' }}>{proj.techs}</p>
                                <p className="text-slate-600" style={{ fontSize: '1em' }} dangerouslySetInnerHTML={{ __html: proj.description }}></p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    const ClassicTemplate = ({ data, tConfig }) => (
        <div className="bg-white text-black p-10 h-full shadow-xl min-h-[850px] resume-document" style={{ fontFamily: tConfig.fontFamily, fontSize: tConfig.fontSize }}>
            <div className="text-center border-b-2 pb-6 mb-6" style={{ borderColor: tConfig.accentColor }}>
                <h1 className="font-bold tracking-tight mb-2" style={{ fontSize: '2.5em', color: tConfig.accentColor }}>{data.fullName || 'Your Name'}</h1>
                <div className="flex justify-center gap-4 italic items-center flex-wrap" style={{ fontSize: '1em' }}>
                    <span>{data.email}</span> • <span>{data.phone}</span>
                </div>
                <div className="flex justify-center gap-4 mt-2 text-gray-600" style={{ fontSize: '0.85em' }}>
                    {data.linkedin && <span>LinkedIn: {data.linkedin.replace('https://www.linkedin.com/in/', '').replace('www.', '')}</span>}
                    {data.github && <span>GitHub: {data.github.replace('https://github.com/', '').replace('www.', '')}</span>}
                </div>
                {data.address && <p className="text-gray-500 mt-2" style={{ fontSize: '0.85em' }}>{data.address}</p>}
            </div>

            {data.summary && (
               <div className="mb-6">
                   <h3 className="font-bold uppercase mb-2 border-b border-gray-300 pb-1" style={{ fontSize: '1em', color: tConfig.accentColor }}>Profile</h3>
                   <p className="leading-relaxed" style={{ fontSize: '1em' }} dangerouslySetInnerHTML={{ __html: data.summary }}></p>
               </div>
            )}

            {data.experience[0].company && (
                <div className="mb-6">
                    <h3 className="font-bold uppercase border-b border-gray-300 mb-3 pb-1" style={{ fontSize: '1em', color: tConfig.accentColor }}>Experience</h3>
                    {data.experience.map((exp, i) => (
                        <div key={i} className="mb-4">
                            <div className="flex justify-between font-bold" style={{ fontSize: '1em' }}>
                                <span>{exp.company}</span>
                                <span>{exp.duration}</span>
                            </div>
                            <div className="italic mb-1" style={{ fontSize: '1em' }}>{exp.role}</div>
                            <p className="text-gray-700 whitespace-pre-line" style={{ fontSize: '1em' }} dangerouslySetInnerHTML={{ __html: exp.description }}></p>
                        </div>
                    ))}
                </div>
            )}

            {data.projects[0].title && (
                <div className="mb-6">
                    <h3 className="font-bold uppercase border-b border-gray-300 mb-3 pb-1" style={{ fontSize: '1em', color: tConfig.accentColor }}>Projects</h3>
                    {data.projects.map((proj, i) => (
                        <div key={i} className="mb-3">
                            <div className="flex justify-between font-bold" style={{ fontSize: '1em' }}>
                                <span>{proj.title}</span>
                            </div>
                            <p className="italic text-gray-500 mb-1" style={{ fontSize: '0.85em' }}>{proj.techs}</p>
                            <p className="text-gray-700 whitespace-pre-line" style={{ fontSize: '1em' }} dangerouslySetInnerHTML={{ __html: proj.description }}></p>
                        </div>
                    ))}
                </div>
            )}

            {data.education[0].school && (
                <div className="mb-6">
                    <h3 className="font-bold uppercase border-b border-gray-300 mb-3 pb-1" style={{ fontSize: '1em', color: tConfig.accentColor }}>Education</h3>
                    {data.education.map((edu, i) => (
                        <div key={i} className="mb-2 flex justify-between" style={{ fontSize: '1em' }}>
                            <div>
                                <span className="font-bold">{edu.school}</span>, <span className="italic">{edu.degree}</span>
                            </div>
                            <span>{edu.year}</span>
                        </div>
                    ))}
                </div>
            )}

            {data.skills && (
                <div>
                     <h3 className="font-bold uppercase border-b border-gray-300 mb-3 pb-1" style={{ fontSize: '1em', color: tConfig.accentColor }}>Skills</h3>
                     <p className="" style={{ fontSize: '1em' }} dangerouslySetInnerHTML={{ __html: data.skills }}></p>
                </div>
            )}
        </div>
    );

    const MinimalTemplate = ({ data, tConfig }) => (
        <div className="bg-white text-gray-900 p-12 h-full shadow-xl min-h-[850px] resume-document" style={{ fontFamily: tConfig.fontFamily, fontSize: tConfig.fontSize }}>
            <div className="border-b-[3px] pb-6 mb-8" style={{ borderColor: tConfig.accentColor }}>
                <h1 className="font-black tracking-tight mb-3 uppercase" style={{ fontSize: '3em' }}>{data.fullName || 'User Name'}</h1>
                <div className="flex flex-wrap gap-x-6 gap-y-2 font-bold tracking-wider uppercase" style={{ fontSize: '0.85em', color: tConfig.accentColor }}>
                    {data.email && <span>{data.email}</span>}
                    {data.phone && <span>{data.phone}</span>}
                    {data.linkedin && <span>{data.linkedin.replace('https://www.linkedin.com/in/', '').replace('www.', '')}</span>}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-10">
                <div className="col-span-1 border-r border-gray-200 pr-8">
                    {data.skills && (
                        <div className="mb-8">
                            <h3 className="font-black uppercase tracking-widest text-gray-400 mb-4" style={{ fontSize: '0.85em' }}>Core Competencies</h3>
                            <div className="flex flex-col gap-2">
                                {data.skills.split(',').filter(s=>s.trim()).map((s, i) => (
                                    <span key={i} className="font-bold text-gray-800" style={{ fontSize: '1em' }} dangerouslySetInnerHTML={{ __html: s.trim() }}></span >
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {data.education[0].school && (
                        <div className="mb-8">
                            <h3 className="font-black uppercase tracking-widest text-gray-400 mb-4" style={{ fontSize: '0.85em' }}>Education</h3>
                            {data.education.map((edu, i) => (
                                <div key={i} className="mb-5">
                                    <p className="font-bold text-gray-900 leading-tight mb-1" style={{ fontSize: '1em' }}>{edu.degree}</p>
                                    <p className="text-gray-600 mb-1" style={{ fontSize: '0.85em' }}>{edu.school}</p>
                                    <p className="font-bold tracking-wider" style={{ fontSize: '0.85em', color: tConfig.accentColor }}>{edu.year}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="col-span-2">
                    {data.summary && (
                        <div className="mb-10">
                           <p className="leading-relaxed text-gray-700 font-medium" style={{ fontSize: '1em' }} dangerouslySetInnerHTML={{ __html: data.summary }}></p>
                        </div>
                    )}

                    {data.experience[0].company && (
                        <div className="mb-10">
                            <h3 className="font-black uppercase tracking-widest text-gray-400 mb-6" style={{ fontSize: '0.85em' }}>Experience</h3>
                            {data.experience.map((exp, i) => (
                                <div key={i} className="mb-8">
                                    <div className="flex justify-between items-baseline mb-2">
                                        <h4 className="font-bold text-gray-900" style={{ fontSize: '1.25em' }}>{exp.role}</h4>
                                        <span className="font-bold text-gray-400 tracking-wider uppercase" style={{ fontSize: '0.85em' }}>{exp.duration}</span>
                                    </div>
                                    <div className="font-bold mb-3" style={{ fontSize: '1em', color: tConfig.accentColor }}>{exp.company}</div>
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-line" style={{ fontSize: '1em' }} dangerouslySetInnerHTML={{ __html: exp.description }}></p>
                                </div>
                            ))}
                        </div>
                    )}

                    {data.projects[0].title && (
                        <div className="mb-8">
                            <h3 className="font-black uppercase tracking-widest text-gray-400 mb-6" style={{ fontSize: '0.85em' }}>Featured Projects</h3>
                            {data.projects.map((proj, i) => (
                                <div key={i} className="mb-6">
                                    <h4 className="font-bold text-gray-900 mb-1" style={{ fontSize: '1em' }}>{proj.title} <span className="text-gray-400 tracking-wide font-normal ml-2" style={{ fontSize: '0.85em' }}>{proj.techs}</span></h4>
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-line" style={{ fontSize: '1em' }} dangerouslySetInnerHTML={{ __html: proj.description }}></p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const FaangTemplate = ({ data, tConfig }) => (
        <div className="bg-white text-black p-10 h-full shadow-xl min-h-[850px] resume-document leading-snug" style={{ fontFamily: tConfig.fontFamily, fontSize: tConfig.fontSize }}>
            <div className="text-center mb-4">
                <h1 className="font-bold tracking-tight mb-1" style={{ fontSize: '2em' }}>{data.fullName || 'First Last'}</h1>
                <div className="flex justify-center gap-2 items-center flex-wrap text-gray-800" style={{ fontSize: '0.85em' }}>
                    {data.email && <span className="hover:underline" style={{ color: tConfig.accentColor }}>{data.email}</span>}
                    {data.phone && <><span>|</span> <span>{data.phone}</span></>}
                    {data.linkedin && <><span>|</span> <span className="hover:underline" style={{ color: tConfig.accentColor }}>{data.linkedin.replace('https://www.linkedin.com/in/', '').replace('www.', '')}</span></>}
                    {data.github && <><span>|</span> <span className="hover:underline" style={{ color: tConfig.accentColor }}>{data.github.replace('https://github.com/', '').replace('www.', '')}</span></>}
                </div>
            </div>

            {data.education[0]?.school && (
                <div className="mb-4">
                    <h3 className="font-bold uppercase border-b-[1.5px] border-black mb-2 pb-0.5 tracking-wider" style={{ fontSize: '0.85em' }}>Education</h3>
                    {data.education.map((edu, i) => (
                        <div key={i} className="mb-1 flex justify-between" style={{ fontSize: '0.85em' }}>
                            <div>
                                <span className="font-bold">{edu.school}</span>
                                {edu.degree && <span> — {edu.degree}</span>}
                            </div>
                            <span className="italic">{edu.year}</span>
                        </div>
                    ))}
                </div>
            )}

            {data.skills && (
                <div className="mb-4">
                     <h3 className="font-bold uppercase border-b-[1.5px] border-black mb-2 pb-0.5 tracking-wider" style={{ fontSize: '0.85em' }}>Skills</h3>
                     <p className="leading-relaxed" style={{ fontSize: '0.85em' }}><span className="font-bold">Technologies:</span> <span dangerouslySetInnerHTML={{ __html: data.skills }} /></p>
                </div>
            )}

            {data.experience[0]?.company && (
                <div className="mb-4">
                    <h3 className="font-bold uppercase border-b-[1.5px] border-black mb-2 pb-0.5 tracking-wider" style={{ fontSize: '0.85em' }}>Experience</h3>
                    {data.experience.map((exp, i) => (
                        <div key={i} className="mb-3">
                            <div className="flex justify-between font-bold" style={{ fontSize: '0.85em' }}>
                                <span>{exp.role}</span>
                                <span>{exp.duration}</span>
                            </div>
                            <div className="italic mb-1" style={{ fontSize: '0.85em' }}>{exp.company}</div>
                            <ul className="list-disc pl-5 space-y-1" style={{ fontSize: '0.85em' }}>
                                {exp.description.split('\n').map(l => l.replace('•','').trim()).filter(l => l).map((line, j) => (
                                    <li key={j} dangerouslySetInnerHTML={{ __html: line }}></li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {data.projects[0]?.title && (
                <div className="mb-4">
                    <h3 className="font-bold uppercase border-b-[1.5px] border-black mb-2 pb-0.5 tracking-wider" style={{ fontSize: '0.85em' }}>Projects</h3>
                    {data.projects.map((proj, i) => (
                        <div key={i} className="mb-3">
                            <div className="flex justify-between font-bold" style={{ fontSize: '0.85em' }}>
                                <span>{proj.title} <span className="font-normal italic">| {proj.techs}</span></span>
                            </div>
                            <ul className="list-disc pl-5 space-y-1 mt-1" style={{ fontSize: '0.85em' }}>
                                {proj.description.split('\n').map(l => l.replace('•','').trim()).filter(l => l).map((line, j) => (
                                    <li key={j} dangerouslySetInnerHTML={{ __html: line }}></li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const ExecutiveTemplate = ({ data, tConfig }) => (
        <div className="bg-white text-gray-800 px-12 py-10 h-full shadow-xl min-h-[850px] resume-document border-t-[14px]" style={{ fontFamily: tConfig.fontFamily, fontSize: tConfig.fontSize, borderColor: tConfig.accentColor }}>
            {/* Header */}
            <div className="flex justify-between items-end mb-6 border-b border-gray-300 pb-5">
                <div>
                    <h1 className="font-bold tracking-tight mb-2 uppercase" style={{ fontSize: '2.5em', color: tConfig.accentColor }}>{data.fullName || 'Executive Name'}</h1>
                    <p className="text-gray-500 font-bold tracking-wider uppercase" style={{ fontSize: '1.1em' }}>{data.experience[0]?.role || 'Professional Leader'}</p>
                </div>
                <div className="text-right text-gray-600 flex flex-col gap-1" style={{ fontSize: '0.85em' }}>
                    {data.email && <span>{data.email}</span>}
                    {data.phone && <span>{data.phone}</span>}
                    {data.linkedin && <span>{data.linkedin.replace('https://www.linkedin.com/in/', '').replace('www.', '')}</span>}
                </div>
            </div>

            {/* Summary */}
            {data.summary && (
               <div className="mb-6 pl-4 border-l-[3px] bg-gray-50 p-4 shadow-sm" style={{ borderColor: tConfig.accentColor }}>
                   <p className="text-gray-700 leading-relaxed italic" style={{ fontSize: '1em' }} dangerouslySetInnerHTML={{ __html: data.summary }}></p>
               </div>
            )}

            {/* Professional Experience */}
            {data.experience[0]?.company && (
                <div className="mb-8">
                    <h3 className="font-bold uppercase mb-3 tracking-widest border-b border-gray-100 pb-1" style={{ fontSize: '1em', color: tConfig.accentColor }}>Professional Experience</h3>
                    {data.experience.map((exp, i) => (
                        <div key={i} className="mb-5">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h4 className="font-bold text-gray-900" style={{ fontSize: '1.2em' }}>{exp.role}</h4>
                                <span className="font-bold text-gray-500" style={{ fontSize: '0.85em' }}>{exp.duration}</span>
                            </div>
                            <div className="font-bold mb-2" style={{ fontSize: '1em', color: tConfig.accentColor }}>{exp.company}</div>
                            <ul className="list-square pl-5 text-gray-700 leading-relaxed space-y-1" style={{ fontSize: '1em' }}>
                                {exp.description.split('\n').map(l => l.replace('•','').trim()).filter(l => l).map((line, j) => (
                                    <li key={j} dangerouslySetInnerHTML={{ __html: line }}></li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            <div className="grid grid-cols-2 gap-8 mb-6">
                {data.education[0]?.school && (
                    <div>
                        <h3 className="font-bold uppercase mb-3 tracking-widest border-b border-gray-100 pb-1" style={{ fontSize: '1em', color: tConfig.accentColor }}>Education</h3>
                        {data.education.map((edu, i) => (
                            <div key={i} className="mb-2">
                                <p className="font-bold text-gray-900" style={{ fontSize: '1em' }}>{edu.degree}</p>
                                <p className="text-gray-600" style={{ fontSize: '0.85em' }}>{edu.school}</p>
                                <p className="text-gray-500 italic mt-0.5" style={{ fontSize: '0.85em' }}>{edu.year}</p>
                            </div>
                        ))}
                    </div>
                )}
                {data.skills && (
                    <div>
                         <h3 className="font-bold uppercase mb-3 tracking-widest border-b border-gray-100 pb-1" style={{ fontSize: '1em', color: tConfig.accentColor }}>Core Competencies</h3>
                         <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                            {data.skills.split(',').filter(s=>s.trim()).map((s, i) => (
                                <span key={i} className="font-bold text-gray-700 flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded" style={{ fontSize: '0.85em' }}>
                                    <span className="w-1.5 h-1.5 rounded-sm" style={{ backgroundColor: tConfig.accentColor }}></span><span dangerouslySetInnerHTML={{ __html: s.trim() }} />
                                </span>
                            ))}
                         </div>
                    </div>
                )}
            </div>
            
             {data.projects[0]?.title && (
                <div className="mb-6">
                    <h3 className="font-bold uppercase mb-3 tracking-widest border-b border-gray-100 pb-1" style={{ fontSize: '1em', color: tConfig.accentColor }}>Key Initiatives & Projects</h3>
                    {data.projects.map((proj, i) => (
                        <div key={i} className="mb-3">
                            <div className="font-bold text-gray-900 mb-0.5" style={{ fontSize: '1em' }}>
                                {proj.title} {proj.techs && <span className="font-normal italic text-gray-500 px-1">| {proj.techs}</span>}
                            </div>
                            <p className="text-gray-600 whitespace-pre-line leading-relaxed" style={{ fontSize: '0.85em' }} dangerouslySetInnerHTML={{ __html: proj.description }}></p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen pt-24 px-4 md:px-8 max-w-full mx-auto pb-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background relative overflow-hidden">
            
            {/* Ambient Background Orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-pulse no-print pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse no-print pointer-events-none" style={{ animationDelay: '2s' }}></div>

            {/* Header (Hidden in Print) */}
            <div className="text-center mb-10 no-print relative z-10">
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} 
                    className="text-4xl md:text-5xl font-display font-black mb-3 flex items-center justify-center gap-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-gray-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                >
                    <Sparkles className="text-primary animate-pulse" size={36} /> AI Resume Studio
                </motion.h1>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Live split-screen editing. Guaranteed ATS-friendly vector PDF export.
                </motion.p>
            </div>

            {/* Split Screen Container */}
            <div className="flex flex-col xl:flex-row gap-8 items-start h-full max-w-[1700px] mx-auto relative z-10">
                
                {/* LEFT PANEL : WIZARD */}
                <div className={`w-full xl:w-[45%] xl:sticky xl:top-24 no-print flex-col xl:h-[calc(100vh-140px)] glass-panel p-5 transition-all duration-500 ${mobileView === 'preview' ? 'hidden xl:flex' : 'flex'}`}>
                    
                    {/* Navigation Steps */}
                    <div className="flex justify-between items-center mb-8 relative px-2 shrink-0">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-black/10 dark:bg-white/10 -z-10 rounded-full"></div>
                        <div className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-primary to-purple-500 -z-10 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}></div>
                        
                        {steps.map((s) => (
                            <div key={s.id} onClick={() => setStep(s.id)} className="flex flex-col items-center gap-2 cursor-pointer group">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${step === s.id ? 'bg-primary border-primary text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] scale-110' : step > s.id ? 'bg-indigo-900 border-primary text-primary' : 'bg-surface border-black/20 dark:border-white/20 text-muted group-hover:bg-black/5 dark:group-hover:bg-white/10'}`}>
                                    <s.icon size={16} />
                                </div>
                                <span className={`text-[10px] uppercase tracking-wider font-bold ${step === s.id ? 'text-text' : 'text-transparent md:text-muted'}`}>{s.title}</span>
                            </div>
                        ))}
                    </div>

                    {/* Scrollable Form Content */}
                    <div className="flex-grow overflow-y-auto px-1 pb-20 custom-scrollbar style-scroll">
                        <AnimatePresence mode="wait">
                            {/* STEP 1: TEMPLATE */}
                            {step === 1 && (
                                <motion.div key="step1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                                    <h2 className="text-2xl font-bold mb-4">Select Template</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {templates.map((t) => (
                                            <div 
                                                key={t.id}
                                                onClick={() => setSelectedTemplate(t.id)}
                                                className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                                                    selectedTemplate === t.id 
                                                    ? 'border-primary shadow-[0_0_20px_rgba(99,102,241,0.2)]' 
                                                    : 'border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/30'
                                                }`}
                                            >
                                                <div className={`h-24 bg-gradient-to-br ${t.color} flex items-center justify-center relative`}>
                                                    <t.icon size={32} className="text-white drop-shadow-md" />
                                                    {selectedTemplate === t.id && <CheckCircle className="absolute top-2 right-2 text-white/90" size={20} />}
                                                </div>
                                                <div className="p-4 bg-surface">
                                                    <h3 className="font-bold mb-1">{t.name}</h3>
                                                    <p className="text-muted text-xs leading-relaxed">{t.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 2: PERSONAL */}
                            {step === 2 && (
                                <motion.div key="step2" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                                    <h2 className="text-2xl font-bold mb-6">Personal Details</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <FormInput label="Full Name" value={formData.fullName} onChange={(val) => handleInputChange({ target: { value: val } }, 'fullName')} placeholder="Jane Doe" />
                                        <FormInput label="Email Address" value={formData.email} onChange={(val) => handleInputChange({ target: { value: val } }, 'email')} placeholder="jane@example.com" />
                                        <FormInput label="Phone Number" value={formData.phone} onChange={(val) => handleInputChange({ target: { value: val } }, 'phone')} placeholder="+1 555 000 0000" />
                                        <FormInput label="Location" value={formData.address} onChange={(val) => handleInputChange({ target: { value: val } }, 'address')} placeholder="San Francisco, CA" />
                                        <FormInput label="LinkedIn URL" value={formData.linkedin} onChange={(val) => handleInputChange({ target: { value: val } }, 'linkedin')} placeholder="linkedin.com/in/jane" />
                                        <FormInput label="GitHub URL" value={formData.github} onChange={(val) => handleInputChange({ target: { value: val } }, 'github')} placeholder="github.com/jane" />
                                        
                                        <div className="md:col-span-2 mt-2">
                                            <label htmlFor="summary" className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">Professional Summary</label>
                                            <textarea 
                                                id="summary"
                                                name="summary"
                                                value={formData.summary} 
                                                onChange={(e) => handleInputChange(e, 'summary')}
                                                data-field="summary"
                                                className="w-full h-32 bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-lg p-3 text-text focus:ring-1 focus:ring-primary outline-none transition-all focus:bg-black/10 dark:focus:bg-black/40 resize-y"
                                                placeholder="Briefly describe your experience and career goals..."
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 3: EXPERIENCE */}
                            {step === 3 && (
                                <motion.div key="step3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                                     <h2 className="text-2xl font-bold mb-6 flex items-center justify-between">
                                        Work Experience
                                        <button onClick={() => addArrayItem('experience')} className="text-sm bg-primary/20 text-primary px-3 py-1 rounded-full font-bold hover:bg-primary hover:text-white transition-colors">+ Add</button>
                                     </h2>
                                     
                                     {formData.experience.map((exp, index) => (
                                        <div key={index} className="mb-6 p-5 bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10 relative group">
                                            {index > 0 && <button onClick={() => removeArrayItem(index, 'experience')} className="absolute top-4 right-4 text-red-500 dark:text-red-400 text-xs font-bold hover:text-red-600 dark:hover:text-red-300">Remove</button>}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormInput label="Job Title" value={exp.role} onChange={(val) => handleArrayChange(index, 'role', val, 'experience')} placeholder="Senior Engineer" />
                                                <FormInput label="Company" value={exp.company} onChange={(val) => handleArrayChange(index, 'company', val, 'experience')} placeholder="Tech Corp Inc." />
                                                <div className="md:col-span-2">
                                                    <FormInput label="Duration" value={exp.duration} onChange={(val) => handleArrayChange(index, 'duration', val, 'experience')} placeholder="Jan 2020 - Present" />
                                                </div>
                                                <div className="md:col-span-2 mt-1">
                                                    <label htmlFor={`experience-desc-${index}`} className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">Description & Achievements</label>
                                                    <textarea 
                                                        id={`experience-desc-${index}`}
                                                        name={`experience-desc-${index}`}
                                                        value={exp.description} 
                                                        onChange={(e) => handleArrayChange(index, 'description', e.target.value, 'experience')}
                                                        data-field="description" data-index={index} data-type="experience"
                                                        className="w-full h-28 bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary outline-none text-text transition-all focus:bg-black/10 dark:focus:bg-black/40 resize-y"
                                                        placeholder="• Architected a highly scalable microservices platform...&#10;• Increased rendering performance by 40%..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                             {/* STEP 4: PROJECTS */}
                             {step === 4 && (
                                <motion.div key="step4" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                                     <h2 className="text-2xl font-bold mb-6 flex items-center justify-between">
                                        Technical Projects
                                        <button onClick={() => addArrayItem('projects')} className="text-sm bg-primary/20 text-primary px-3 py-1 rounded-full font-bold hover:bg-primary hover:text-white transition-colors">+ Add</button>
                                     </h2>
                                     
                                     {formData.projects.map((proj, index) => (
                                        <div key={index} className="mb-6 p-5 bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10 relative">
                                            {index > 0 && <button onClick={() => removeArrayItem(index, 'projects')} className="absolute top-4 right-4 text-red-500 dark:text-red-400 font-bold text-xs hover:text-red-600 dark:hover:text-red-300">Remove</button>}
                                            <div className="grid grid-cols-1 gap-4">
                                                <FormInput label="Project Title" value={proj.title} onChange={(val) => handleArrayChange(index, 'title', val, 'projects')} placeholder="E-commerce Analytics Dashboard" />
                                                <FormInput label="Technologies Used" value={proj.techs} onChange={(val) => handleArrayChange(index, 'techs', val, 'projects')} placeholder="React, Node.js, TimescaleDB" />
                                                <FormInput label="External Link" value={proj.link} onChange={(val) => handleArrayChange(index, 'link', val, 'projects')} placeholder="github.com/myproject" />
                                                
                                                <div className="mt-1">
                                                    <label htmlFor={`projects-desc-${index}`} className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">Project Summary</label>
                                                    <textarea 
                                                        id={`projects-desc-${index}`}
                                                        name={`projects-desc-${index}`}
                                                        value={proj.description} 
                                                        onChange={(e) => handleArrayChange(index, 'description', e.target.value, 'projects')}
                                                        data-field="description" data-index={index} data-type="projects"
                                                        className="w-full h-24 bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary outline-none text-text transition-all focus:bg-black/10 dark:focus:bg-black/40 resize-y"
                                                        placeholder="Built a real-time analytics dashboard tracking over 1 million daily events..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {/* STEP 5: EDUCATION */}
                            {step === 5 && (
                                <motion.div key="step5" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                                    <h2 className="text-2xl font-bold mb-6 flex items-center justify-between">
                                        Education
                                        <button onClick={() => addArrayItem('education')} className="text-sm bg-primary/20 text-primary px-3 py-1 rounded-full font-bold hover:bg-primary hover:text-white transition-colors">+ Add</button>
                                    </h2>
                                    {formData.education.map((edu, index) => (
                                        <div key={index} className="mb-4 p-5 bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10 relative">
                                            {index > 0 && <button onClick={() => removeArrayItem(index, 'education')} className="absolute top-4 right-4 text-red-500 dark:text-red-400 text-xs font-bold hover:text-red-600 dark:hover:text-red-300">Remove</button>}
                                            <div className="grid grid-cols-1 gap-4">
                                                <FormInput label="School / University" value={edu.school} onChange={(val) => handleArrayChange(index, 'school', val, 'education')} placeholder="State University" />
                                                <FormInput label="Degree / Major" value={edu.degree} onChange={(val) => handleArrayChange(index, 'degree', val, 'education')} placeholder="B.S. Computer Science" />
                                                <FormInput label="Graduation Year" value={edu.year} onChange={(val) => handleArrayChange(index, 'year', val, 'education')} placeholder="May 2024" />
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {/* STEP 6: SKILLS */}
                            {step === 6 && (
                                 <motion.div key="step6" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                                    <h2 className="text-2xl font-bold mb-6">Technical Skills</h2>
                                    <label htmlFor="skills" className="text-muted text-sm mb-4 block">List your technical skills separated by commas.</label>
                                    <textarea 
                                        id="skills"
                                        name="skills"
                                        value={formData.skills}
                                        onChange={(e) => handleInputChange(e, 'skills')}
                                        data-field="skills"
                                        className="w-full h-48 bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-xl p-6 text-lg text-text focus:ring-1 focus:ring-primary outline-none transition-all focus:bg-black/10 dark:focus:bg-black/40 resize-y"
                                        placeholder="e.g. JavaScript, React, Node.js, MongoDB, Git, AWS, System Architecture..."
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Left Actions Footer */}
                    <div className="pt-6 border-t border-black/10 dark:border-white/10 flex justify-between shrink-0">
                         <button 
                            onClick={prevStep} 
                            disabled={step === 1}
                            className={`flex items-center gap-2 font-bold transition-colors ${step === 1 ? 'opacity-0 cursor-default' : 'text-muted hover:text-text'}`}
                        >
                            <ChevronLeft size={20} /> Back
                        </button>
                        
                        {step < 6 && (
                            <button 
                                onClick={nextStep} 
                                className="bg-primary hover:bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg"
                            >
                                Next Step <ChevronRight size={18} />
                            </button>
                        )}
                    </div>
                </div>

                {/* RIGHT PANEL : LIVE PREVIEW & TOOLBAR */}
                <div className={`w-full xl:w-[55%] flex-col pt-4 xl:pt-0 pb-20 xl:pb-0 transition-opacity duration-500 ${mobileView === 'edit' ? 'hidden xl:flex' : 'flex'}`}>
                    {/* The Settings Toolbar */}
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-6 no-print gap-3 sm:gap-4 sticky top-[72px] z-30 bg-background/95 md:bg-background/80 xl:bg-transparent backdrop-blur-xl py-4 xl:static xl:pb-0 rounded-b-3xl md:rounded-none shadow-2xl xl:shadow-none border-b border-black/10 dark:border-white/10 xl:border-none px-2 xl:px-0">
                        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 bg-black/5 dark:bg-white/5 backdrop-blur-md p-2 border border-black/10 dark:border-white/10 rounded-2xl shadow-lg w-full md:w-auto">
                            
                            <div className="flex items-center gap-2 bg-black/5 dark:bg-black/20 px-3 py-1.5 rounded-full hover:bg-black/10 dark:hover:bg-black/40 transition-colors border border-black/5 dark:border-white/5">
                                <Palette size={14} className="text-primary hidden sm:block" />
                                <span className="text-xs text-muted font-bold hidden sm:block">Color:</span>
                                <input 
                                    type="color" 
                                    value={theme.accentColor}
                                    onChange={e => setTheme({...theme, accentColor: e.target.value})}
                                    className="w-5 h-5 rounded-full cursor-pointer border-0 bg-transparent outline-none p-0 overflow-hidden"
                                    title="Accent Color"
                                />
                            </div>
                            
                            <div className="flex items-center gap-2 bg-black/5 dark:bg-black/20 px-3 py-1.5 rounded-full hover:bg-black/10 dark:hover:bg-black/40 transition-colors border border-black/5 dark:border-white/5">
                                <Type size={14} className="text-primary hidden sm:block" />
                                <select 
                                    className="bg-transparent text-[11px] sm:text-xs text-text focus:outline-none cursor-pointer w-20 sm:w-auto font-medium"
                                    value={theme.fontFamily}
                                    onChange={e => setTheme({...theme, fontFamily: e.target.value})}
                                    title="Font Style"
                                >
                                    <option className="bg-surface" value='ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'>Modern Sans</option>
                                    <option className="bg-surface" value="Arial, Helvetica, sans-serif">Standard Arial</option>
                                    <option className="bg-surface" value="Verdana, Geneva, sans-serif">Wide Verdana</option>
                                    <option className="bg-surface" value="ui-serif, Georgia, serif">Classic Serif</option>
                                    <option className="bg-surface" value='"Times New Roman", Times, serif'>Times New Roman</option>
                                    <option className="bg-surface" value="Garamond, serif">Elegant Garamond</option>
                                    <option className="bg-surface" value="ui-monospace, Consolas, monospace">Technical Mono</option>
                                    <option className="bg-surface" value='"Courier New", Courier, monospace'>Courier New</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-2 bg-black/5 dark:bg-black/20 px-3 py-1.5 rounded-full hover:bg-black/10 dark:hover:bg-black/40 transition-colors border border-black/5 dark:border-white/5">
                                <ALargeSmall size={14} className="text-primary hidden sm:block" />
                                <select 
                                    className="bg-transparent text-[11px] sm:text-xs text-text focus:outline-none cursor-pointer w-[45px] sm:w-auto font-medium scrollbar-thin overflow-y-auto max-h-48"
                                    value={theme.fontSize}
                                    onChange={e => setTheme({...theme, fontSize: e.target.value})}
                                    title="Font Size"
                                >
                                    {Array.from({ length: 51 }, (_, i) => i * 2).map(size => (
                                        <option className="bg-surface" key={size} value={`${size}px`}>{size}px</option>
                                    ))}
                                </select>
                            </div>

                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-[90%] md:w-auto mx-auto md:mx-0 justify-center shrink-0">
                            <button 
                                onClick={analyzeATS} 
                                disabled={isAnalyzingATS}
                                className="bg-gradient-to-r w-full sm:w-auto from-emerald-500 to-teal-600 text-white px-6 py-2.5 rounded-full font-black flex justify-center items-center gap-2 hover:scale-105 transition-transform shadow-[0_0_15px_rgba(16,185,129,0.4)] shrink-0 disabled:opacity-50 disabled:hover:scale-100"
                            >
                                {isAnalyzingATS ? <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div> : <Sparkles size={18} />} Analyze ATS
                            </button>
                            <button 
                                onClick={downloadPDF} 
                                className="bg-gradient-to-r w-full sm:w-auto from-white to-gray-200 text-black px-6 py-2.5 rounded-full font-black flex justify-center items-center gap-2 hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.3)] shrink-0"
                            >
                                <Download size={18} /> Export PDF
                            </button>
                            <button 
                                onClick={exportWord} 
                                className="bg-gradient-to-r w-full sm:w-auto from-indigo-500 to-blue-600 text-white px-6 py-2.5 rounded-full font-black flex justify-center items-center gap-2 hover:scale-105 transition-transform shadow-[0_0_15px_rgba(99,102,241,0.4)] shrink-0"
                            >
                                <FileText size={18} /> Export Word
                            </button>
                        </div>
                    </div>
                    
                    {/* The Render Canvas */}
                    <div className="w-full relative shadow-2xl rounded-lg overflow-hidden bg-gray-100 dark:bg-[#eef2f6] p-2 md:p-4 border border-black/10 dark:border-white/10 flex justify-center">
                        <div 
                            className="bg-white w-[800px] mx-auto resume-print-container mobile-zoom"
                        >
                            {selectedTemplate === 'modern' && <ModernTemplate data={formData} tConfig={theme} />}
                            {selectedTemplate === 'classic' && <ClassicTemplate data={formData} tConfig={theme} />}
                            {selectedTemplate === 'minimal' && <MinimalTemplate data={formData} tConfig={theme} />}
                            {selectedTemplate === 'faang' && <FaangTemplate data={formData} tConfig={theme} />}
                            {selectedTemplate === 'executive' && <ExecutiveTemplate data={formData} tConfig={theme} />}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile View Toggle FAB */}
            <div className="fixed bottom-6 w-full left-0 flex justify-center xl:hidden z-50 no-print px-4">
                <div className="bg-surface border border-black/20 dark:border-white/20 p-1 rounded-full shadow-2xl flex items-center gap-1 backdrop-blur-lg">
                    <button 
                        onClick={() => setMobileView('edit')}
                        className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${mobileView === 'edit' ? 'bg-primary text-white shadow-lg' : 'text-muted hover:text-text'}`}
                    >
                        <LayoutTemplate size={16} /> Edit Form
                    </button>
                    <button 
                        onClick={() => setMobileView('preview')}
                        className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${mobileView === 'preview' ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg' : 'text-muted hover:text-text'}`}
                    >
                        <FileText size={16} /> Live Preview
                    </button>
                </div>
            </div>

            {/* Print Global Styles Setup */}
            <style>{`
                .style-scroll::-webkit-scrollbar {
                    width: 6px;
                }
                .style-scroll::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.1);
                    border-radius: 10px;
                }
                
                @media print {
                    /* Hide everything by default */
                    body * {
                        visibility: hidden;
                    }
                    /* Only show the resume container and its children */
                    .resume-print-container, 
                    .resume-print-container *,
                    .resume-document,
                    .resume-document * {
                        visibility: visible !important;
                    }
                    /* Position the resume perfectly for the printed page */
                    .resume-print-container {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100% !important;
                        min-width: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        background-color: white !important;
                    }
                    /* Ensure background colors render in PDF */
                    * {
                        -webkit-print-color-adjust: exact !important;
                        color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                    @page {
                        size: auto;
                        margin: 0mm;
                    }
                }

                @media screen and (max-width: 480px) {
                    .mobile-zoom {
                        zoom: 0.4;
                    }
                }
                @media screen and (min-width: 481px) and (max-width: 768px) {
                    .mobile-zoom {
                        zoom: 0.6;
                    }
                }
                @media screen and (min-width: 769px) and (max-width: 1279px) {
                    .mobile-zoom {
                        zoom: 0.8;
                    }
                }
            `}</style>
            
            <AnimatePresence>
                {showAtsModal && atsResult && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowAtsModal(false)}
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-[#1a1c23] border border-black/10 dark:border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-3xl overflow-y-auto max-h-[90vh] custom-scrollbar"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold flex items-center gap-3 text-text">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                        <Sparkles className="text-emerald-500" size={20} />
                                    </div>
                                    ATS Match Score
                                </h2>
                                <button onClick={() => setShowAtsModal(false)} className="text-muted hover:text-text transition-colors p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5">
                                    <X size={24} />
                                </button>
                            </div>
                            
                            <div className="flex flex-col md:flex-row gap-8 items-center justify-center md:justify-start mb-8 bg-black/5 dark:bg-white/5 p-8 rounded-2xl border border-black/5 dark:border-white/5">
                                <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
                                    <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                                        <path
                                            className="text-black/10 dark:text-white/10"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                        />
                                        <path
                                            className={`${atsResult.score >= 80 ? 'text-emerald-500' : atsResult.score >= 50 ? 'text-yellow-500' : 'text-red-500'}`}
                                            strokeDasharray={`${atsResult.score}, 100`}
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-5xl font-black text-text">{atsResult.score}</span>
                                        <span className="text-[11px] text-muted uppercase font-bold tracking-widest mt-1">/ 100</span>
                                    </div>
                                </div>
                                
                                <div className="text-center md:text-left">
                                    <h3 className="text-xl font-bold text-text mb-2">
                                        {atsResult.score >= 80 ? 'Outstanding Compatibility 🌟' : atsResult.score >= 50 ? 'Moderate Compatibility ⚡' : 'Needs Improvement ⚠️'}
                                    </h3>
                                    <p className="text-muted leading-relaxed">
                                        {atsResult.score >= 80 ? 'Your resume is highly optimized and easily parsed by ATS software. You have strong keyword density, action verbs, and well-structured sections.' : atsResult.score >= 50 ? 'Your resume is decently structured but might miss out on key parser metrics. Consider adding more quantifiable achievements and action verbs.' : 'Your resume geometry or content phrasing will likely struggle against automated tracking systems. Implement the feedback below to bypass the initial filters.'}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-6">
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5">
                                        <h3 className="font-bold text-emerald-600 dark:text-emerald-400 mb-4 flex items-center gap-2 text-lg"><CheckCircle size={20} /> Key Strengths</h3>
                                        <ul className="space-y-3">
                                            {atsResult.strengths?.map((s, i) => (
                                                <li key={i} className="flex gap-3 text-sm text-text/90 leading-relaxed">
                                                    <span className="text-emerald-500 mt-0.5">•</span>
                                                    <span>{s}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
                                        <h3 className="font-bold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2 text-lg"><X size={20} /> Weaknesses</h3>
                                        <ul className="space-y-3">
                                            {atsResult.weaknesses?.map((w, i) => (
                                                <li key={i} className="flex gap-3 text-sm text-text/90 leading-relaxed">
                                                    <span className="text-red-500 mt-0.5">•</span>
                                                    <span>{w}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 h-full">
                                    <h3 className="font-bold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2 text-lg"><GraduationCap size={20} /> Recommended Fixes</h3>
                                    <ul className="space-y-4">
                                        {atsResult.tips?.map((t, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-text/90 leading-relaxed bg-blue-500/5 p-3 rounded-lg border border-blue-500/10">
                                                <span className="text-blue-500 font-bold">{i + 1}.</span>
                                                <span>{t}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FormInput = ({ label, value, onChange, placeholder, name }) => {
    const defaultId = useId();
    const id = name || defaultId;
    return (
        <div className="space-y-1">
            <label htmlFor={id} className="text-xs font-semibold text-muted uppercase tracking-wider">{label}</label>
            <input 
                id={id}
                name={name || label.toLowerCase().replace(/\s+/g, '-')}
                type="text" 
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-lg p-3 text-text focus:ring-1 focus:ring-primary outline-none transition-all focus:bg-black/10 dark:focus:bg-black/40"
                placeholder={placeholder}
            />
        </div>
    );
};



export default ResumeBuilder;
