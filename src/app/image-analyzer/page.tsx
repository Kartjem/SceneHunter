"use client";

import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { get, set } from 'idb-keyval';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useRouter } from 'next/navigation';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { ArrowLeft, Sparkles, Image as ImageIcon, Check, UploadCloud, Bot, TextCursorInput, Search, X, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// --- Interfaces ---
interface AnalysisResult {
    description?: string;
    altText?: string;
    similarQuery?: string;
    similarQueryLink?: string;
    error?: string;
}

interface ProcessedFile {
    id: string;
    name: string;
    base64: string;
    analysis: AnalysisResult;
}

type AnalysisType = keyof Omit<AnalysisResult, 'error' | 'similarQueryLink'>;

// --- Reusable UI Components ---
const Spinner: React.FC<{className?: string}> = ({ className }) => (
    <div className={cn("w-5 h-5 border-2 border-slate-300/50 border-t-blue-500 rounded-full animate-spin", className)} />
);

const EmptyState: React.FC<{ onClick: () => void }> = ({ onClick }) => (
     <div className="text-center text-slate-500 cursor-pointer" onClick={onClick}>
        <UploadCloud className="mx-auto h-16 w-16 mb-4"/>
        <h3 className="text-2xl font-bold">Drag & Drop Your Images Here</h3>
        <p>or click to browse</p>
    </div>
);

// --- Main Page Component ---
export default function ImageAnalyzerPage() {
    const [files, setFiles] = useState<ProcessedFile[]>([]);
    const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const isMobile = useIsMobile();
    
    useEffect(() => {
        get<ProcessedFile[]>('analyzer-images').then((storedFiles) => {
            if (storedFiles && Array.isArray(storedFiles)) {
                setFiles(storedFiles);
                if (storedFiles.length > 0 && !selectedFileId) {
                    setSelectedFileId(storedFiles[0].id);
                }
            }
        });
    }, [selectedFileId]);

    const selectedFile = useMemo(() => files.find(f => f.id === selectedFileId), [files, selectedFileId]);
    
    const updateFileInStore = (updatedFiles: ProcessedFile[]) => {
        setFiles(updatedFiles);
        set('analyzer-images', updatedFiles);
    };
    
    const removeFile = (idToRemove: string) => {
        const newFiles = files.filter(f => f.id !== idToRemove);
        updateFileInStore(newFiles);
        if (selectedFileId === idToRemove) {
            setSelectedFileId(newFiles.length > 0 ? newFiles[0].id : null);
        }
    };

    const processFiles = useCallback((fileList: FileList) => {
        if (!fileList || fileList.length === 0) return;

        const filesToProcess = Array.from(fileList).map(file => {
            const newFile: ProcessedFile = { 
                id: `file-${file.name}-${Date.now()}-${Math.random()}`, 
                name: file.name, 
                base64: '', 
                analysis: {}
            };
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setFiles(prev => {
                    const updatedFiles = prev.map(f => f.id === newFile.id ? { ...f, base64: result } : f);
                    set('analyzer-images', updatedFiles);
                    return updatedFiles;
                });
            };
            reader.readAsDataURL(file);
            return newFile;
        });

        const newFullFilesList = [...files, ...filesToProcess];
        updateFileInStore(newFullFilesList);

        if (!selectedFileId) {
            setSelectedFileId(filesToProcess[0].id);
        }
    }, [files, selectedFileId]);
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) processFiles(event.target.files);
    };

    const dragHandlers = {
        onDragEnter: (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); },
        onDragLeave: (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); },
        onDragOver: (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); },
        onDrop: (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault(); e.stopPropagation(); setIsDragging(false);
            if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
        }
    };

    if (isMobile) {
        return <MobileLayout {...{ files, removeFile, selectedFile, setSelectedFileId, fileInputRef, router, processFiles, setFiles }} />;
    }

    return (
        <div className="min-h-screen w-full flex bg-slate-100 dark:bg-slate-950">
            <aside className="w-72 flex-shrink-0 bg-white dark:bg-slate-900 border-r dark:border-slate-800 flex flex-col">
                <header className="p-4 border-b dark:border-slate-800 flex items-center justify-between h-16">
                    <div className="flex items-center gap-2">
                         <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="h-8 w-8"><ArrowLeft className="h-4 w-4" /></Button>
                        <h2 className="text-lg font-semibold">My Images</h2>
                    </div>
                    <ThemeToggle />
                </header>
                <ScrollArea className="flex-grow">
                    <div className="p-4 space-y-2">
                        {files.map(file => (
                            <Thumbnail 
                                key={file.id} 
                                file={file} 
                                isSelected={selectedFileId === file.id} 
                                onSelect={() => setSelectedFileId(file.id)}
                                onRemove={(e) => { e.stopPropagation(); removeFile(file.id); }}
                            />
                        ))}
                    </div>
                </ScrollArea>
                <footer className="p-4 border-t dark:border-slate-800">
                     <Button className="w-full" onClick={() => fileInputRef.current?.click()}><UploadCloud className="h-4 w-4 mr-2"/>Upload More</Button>
                </footer>
            </aside>

            <main className="flex-1 p-8 overflow-y-auto">
                <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                {files.length === 0 ? (
                     <div {...dragHandlers} className={cn("h-full w-full border-2 border-dashed rounded-2xl flex items-center justify-center transition-colors", isDragging && "border-blue-500 bg-blue-500/10")}>
                         <EmptyState onClick={() => fileInputRef.current?.click()} />
                     </div>
                ) : (
                    selectedFile ? <AnalysisPanel key={selectedFile.id} file={selectedFile} setFiles={setFiles} /> : 
                    <div className="h-full flex items-center justify-center text-slate-500"><p className="text-lg font-semibold">Select an image from the left panel.</p></div>
                )}
            </main>
        </div>
    );
}

const Thumbnail: React.FC<{file: ProcessedFile, isSelected: boolean, onSelect: () => void, onRemove: (e: React.MouseEvent) => void}> = ({ file, isSelected, onSelect, onRemove }) => {
    const isAnalyzing = Object.values(file.analysis).some(val => val === 'Analyzing...');
    return (
        <div onClick={onSelect} className={cn("w-full group rounded-lg border-2 p-1 transition-all duration-200 relative cursor-pointer", isSelected ? "border-blue-500 scale-105" : "border-transparent hover:border-slate-200 dark:hover:border-slate-700")}>
            <AspectRatio ratio={16/9} className="bg-slate-200 dark:bg-slate-800 rounded-md overflow-hidden">
                 {file.base64 ? <img src={file.base64} alt={file.name} className="object-cover w-full h-full"/> : <div className="flex items-center justify-center h-full"><Spinner className="border-t-blue-600"/></div>}
                 {isAnalyzing && (
                     <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                         <Spinner className="h-8 w-8 border-4" />
                     </div>
                 )}
            </AspectRatio>
             <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={onRemove}><X className="h-4 w-4"/></Button>
        </div>
    );
}

// --- Analysis Panel ---
const AnalysisPanel: React.FC<{file: ProcessedFile, setFiles: React.Dispatch<React.SetStateAction<ProcessedFile[]>>}> = ({ file, setFiles }) => {
    
    const [activeTab, setActiveTab] = useState<AnalysisType>('description');
    const [isAnalyzing, setIsAnalyzing] = useState<Partial<Record<AnalysisType, boolean>>>({});

    useEffect(() => {
        setIsAnalyzing({});
    }, [file.id]);

    const updateFileAnalysis = (id: string, newAnalysis: Partial<AnalysisResult>) => {
        setFiles(prevFiles => {
            const updatedFiles = prevFiles.map(f => f.id === id ? { ...f, analysis: { ...f.analysis, ...newAnalysis } } : f);
            set('analyzer-images', updatedFiles);
            return updatedFiles;
        });
    };
    
    const callBackendApi = async (type: AnalysisType, prompt: string) => {
        if (!file.base64 || file.analysis[type] || isAnalyzing[type]) return; 
        setActiveTab(type);
        setIsAnalyzing(prev => ({ ...prev, [type]: true }));
        
        try {
            const response = await fetch('/api/gemini', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ base64: file.base64, prompt }) });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Backend request failed');

            if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                const textResult = result.candidates[0].content.parts[0].text;
                let finalAnalysis: Partial<AnalysisResult> = { [type]: textResult, error: undefined };
                if (type === 'similarQuery') {
                    finalAnalysis.similarQueryLink = `https://unsplash.com/s/photos/${encodeURIComponent(textResult.trim())}`;
                }
                updateFileAnalysis(file.id, finalAnalysis);
            } else {
                 throw new Error(result?.promptFeedback?.blockReason || "Invalid API response.");
            }
        } catch (error: any) {
             updateFileAnalysis(file.id, { [type]: undefined, error: error.message });
        } finally {
            setIsAnalyzing(prev => ({ ...prev, [type]: false }));
        }
    };
    
    const analysisOptions = [
        { type: 'description', icon: Bot, title: 'Describe Scene', prompt: "Describe this image in detail for a movie scene. IMPORTANT: Do not include any introductory phrases or scene headings like 'EXT. ROAD - NIGHT'. Just provide the raw description of the scene itself.", description: 'Generate a detailed, cinematic scene description.' },
        { type: 'altText', icon: TextCursorInput, title: 'Create Alt Text', prompt: "Write a concise and descriptive alt text for this image. IMPORTANT: Do not include any introductory phrases like 'Here's the alt text:'. Just provide the alt text directly.", description: 'Create accessible alt text for screen readers.' },
        { type: 'similarQuery', icon: Search, title: 'Find Similar', prompt: "Based on this image's content, create a concise search query to find similar stock photos. Return only the query text, without any extra formatting or quotation marks.", description: 'Get a search query to find similar photos.' },
    ] as const;

    const hasAnyAnalysisStarted = Object.values(file.analysis).some(v => v);

    return (
        <div className="max-w-4xl mx-auto animate-fade-in-up">
            <Card className="overflow-hidden">
                <CardHeader className="p-0">
                    <Dialog>
                        <DialogTrigger asChild>
                             <AspectRatio ratio={16 / 9} className="bg-slate-200 dark:bg-slate-800 cursor-zoom-in">
                                {file.base64 ? <img src={file.base64} alt={file.name} className="object-cover w-full h-full"/> : <Spinner className="border-t-blue-600"/>}
                            </AspectRatio>
                        </DialogTrigger>
                        <DialogContent className="max-w-5xl p-0 border-0">
                             <DialogHeader className="sr-only"><DialogTitle>Image Preview: {file.name}</DialogTitle></DialogHeader>
                             <img src={file.base64} alt={file.name} className="w-full h-auto rounded-lg"/>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent className="p-6">
                    <CardTitle className="text-2xl mb-4">{file.name}</CardTitle>
                    {!hasAnyAnalysisStarted ? (
                         <Card className="bg-slate-50 dark:bg-slate-800/50">
                            <CardHeader>
                                <CardTitle>Start Your Analysis</CardTitle>
                                <CardDescription>Choose an option below to generate insights for this image.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {analysisOptions.map(opt => (
                                    <Button key={opt.type} variant="outline" className="w-full justify-start h-auto p-4" onClick={() => callBackendApi(opt.type, opt.prompt)}>
                                        <opt.icon className="h-6 w-6 mr-4 text-blue-500"/>
                                        <div className="text-left">
                                            <p className="font-semibold">{opt.title}</p>
                                            <p className="text-xs text-muted-foreground">{opt.description}</p>
                                        </div>
                                    </Button>
                                ))}
                            </CardContent>
                        </Card>
                    ) : (
                    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as AnalysisType)} className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            {analysisOptions.map(opt => (
                                <TabsTrigger key={opt.type} value={opt.type} disabled={isAnalyzing[opt.type]} onClick={() => callBackendApi(opt.type, opt.prompt)}>
                                    {isAnalyzing[opt.type] ? <Spinner/> : <><opt.icon className="h-4 w-4 mr-2"/>{opt.title}</>}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-900 rounded-md min-h-[150px] text-sm text-slate-800 dark:text-slate-200 prose dark:prose-invert">
                           <AnalysisContent active={activeTab === 'description'} isLoading={isAnalyzing.description} content={file.analysis.description} placeholder="Click 'Describe' tab to generate a detailed description." />
                           <AnalysisContent active={activeTab === 'altText'} isLoading={isAnalyzing.altText} content={file.analysis.altText} placeholder="Click 'Alt Text' tab to generate a descriptive alt text." />
                           <AnalysisContent active={activeTab === 'similarQuery'} isLoading={isAnalyzing.similarQuery} content={file.analysis.similarQuery} placeholder="Click 'Find Similar' tab to generate a search query." link={file.analysis.similarQueryLink}/>
                           {file.analysis.error && <p className="text-red-500 font-semibold">{file.analysis.error}</p>}
                        </div>
                    </Tabs>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

const AnalysisContent: React.FC<{active: boolean, isLoading?: boolean, content?: string, placeholder: string, link?: string}> = ({ active, isLoading, content, placeholder, link }) => {
    if (!active) return null;
    if (isLoading) return <div className="flex justify-center items-center h-full"><Spinner /></div>;
    
    if (content) {
        return (
            <div>
                <p>{content}</p>
                {link && (
                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline inline-flex items-center mt-2">
                        Search on Unsplash <ExternalLink className="h-4 w-4 ml-1"/>
                    </a>
                )}
            </div>
        )
    }
    
    return <span className="text-slate-500">{placeholder}</span>
}

// --- Mobile Layout Component ---
interface MobileLayoutProps {
    files: ProcessedFile[];
    removeFile: (id: string) => void;
    selectedFile: ProcessedFile | undefined;
    setSelectedFileId: (id: string) => void;
    processFiles: (files: FileList) => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
    router: ReturnType<typeof useRouter>; 
    setFiles: React.Dispatch<React.SetStateAction<ProcessedFile[]>>;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ files, removeFile, selectedFile, setSelectedFileId, processFiles, fileInputRef, router, setFiles }) => (
    <div className="p-4">
        <header className="fixed top-0 left-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-20 px-4 py-2 flex justify-between items-center border-b dark:border-slate-800">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="h-8 w-8"><ArrowLeft className="h-4 w-4" /></Button>
                 <h1 className="text-lg font-bold">AI Analyzer</h1>
            </div>
            <ThemeToggle />
        </header>

        <div className="pt-20">
            {files.length > 0 ? (
                <div className="mb-4">
                    <h2 className="text-sm font-semibold mb-2 text-slate-600 dark:text-slate-400">Your Images</h2>
                     <ScrollArea className="w-full whitespace-nowrap rounded-md">
                        <div className="flex w-max space-x-4 pb-4">
                             {files.map(file => <Thumbnail key={file.id} file={file} isSelected={selectedFile?.id === file.id} onSelect={() => setSelectedFileId(file.id)} onRemove={(e) => { e.stopPropagation(); removeFile(file.id); }}/>)}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>
            ) : null}

            {selectedFile ? <AnalysisPanel file={selectedFile} setFiles={setFiles} /> : <div className="text-center p-8 border-2 border-dashed rounded-lg" onClick={() => fileInputRef.current?.click()}><EmptyState onClick={() => fileInputRef.current?.click()}/></div>}
             <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => e.target.files && processFiles(e.target.files)} />
        </div>
    </div>
);