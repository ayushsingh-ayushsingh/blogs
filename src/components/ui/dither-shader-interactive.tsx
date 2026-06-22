import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DitherShader } from '@/components/ui/dither-shader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Download, Link as LinkIcon, RotateCcw, Upload } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

export default function DitherShaderInteractive() {
    const [imageSrc, setImageSrc] = useState<string>('/Ayush-Preview.jpg');
    const [urlInput, setUrlInput] = useState<string>('/Ayush-Preview.jpg');
    const [ditherMode, setDitherMode] = useState<'bayer' | 'halftone' | 'noise' | 'crosshatch'>('bayer');
    const [colorMode, setColorMode] = useState<'original' | 'grayscale' | 'duotone' | 'custom'>('duotone');
    const [gridSize, setGridSize] = useState(1);
    const [invert, setInvert] = useState(false);
    const [animated, setAnimated] = useState(false);
    const [threshold, setThreshold] = useState(0.5);
    const [primaryColor, setPrimaryColor] = useState('#162a2b');
    const [secondaryColor, setSecondaryColor] = useState('#d6e0e2');

    const [dragActive, setDragActive] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImageSrc(url);
            setUrlInput('');
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            const url = URL.createObjectURL(file);
            setImageSrc(url);
            setUrlInput('');
        }
    };

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = 'dithered-image.jpg';
        link.href = canvas.toDataURL('image/jpg');
        link.click();
    };

    const handleUrlSubmit = () => {
        if (urlInput.trim()) {
            setImageSrc(urlInput.trim());
        }
    };

    // Clean up object URL when imageSrc changes or on unmount
    useEffect(() => {
        return () => {
            if (imageSrc.startsWith('blob:')) {
                URL.revokeObjectURL(imageSrc);
            }
        };
    }, [imageSrc]);

    return (
        <div className="shadcn-root mx-auto max-w-6xl">
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="text-foreground text-3xl tracking-tight">Images</div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex w-full items-center gap-2 sm:w-auto">
                        <Input
                            type="url"
                            placeholder="Paste image URL..."
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleUrlSubmit();
                                }
                            }}
                            className="w-full sm:w-64"
                        />
                        <Button variant="outline" onClick={handleUrlSubmit} className="flex items-center gap-1">
                            <LinkIcon className="h-4 w-4" />
                            Load
                        </Button>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            Upload
                        </Button>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                        <Button variant="default" onClick={handleDownload} className="flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            Download
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex w-full flex-col gap-8">
                {/* Canvas Display Viewport */}
                <div className="flex w-full flex-col gap-4">
                    <div
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        className={`relative flex aspect-4/3 w-full items-center justify-center overflow-hidden rounded-2xl border border-dotted bg-neutral-100 transition-all duration-300 dark:bg-neutral-950 ${
                            dragActive ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-neutral-200 dark:border-neutral-800'
                        }`}
                    >
                        <DitherShader
                            canvasRef={canvasRef}
                            src={imageSrc}
                            gridSize={gridSize}
                            ditherMode={ditherMode}
                            colorMode={colorMode}
                            invert={invert}
                            animated={animated}
                            animationSpeed={0.025}
                            primaryColor={primaryColor}
                            secondaryColor={secondaryColor}
                            threshold={threshold}
                            className="absolute inset-0 h-full w-full object-contain"
                        />

                        {/* Drag and Drop Overlay */}
                        {dragActive && (
                            <div className="bg-background/80 absolute inset-0 z-10 flex flex-col items-center justify-center backdrop-blur-xs">
                                <Upload className="text-primary mb-2 h-12 w-12 animate-bounce" />
                                <p className="text-lg font-semibold">Drop your image here</p>
                                <p className="text-muted-foreground text-sm">Release to upload instantly</p>
                            </div>
                        )}
                    </div>

                    <div className="text-muted-foreground flex items-center justify-between px-1 text-xs">
                        <span>Drag & drop an image onto the canvas or use the Upload button</span>
                        {imageSrc !== '/Ayush-Preview.jpg' && (
                            <Button
                                variant="link"
                                size="xs"
                                onClick={() => {
                                    setImageSrc('/Ayush-Preview.jpg');
                                    setUrlInput('/Ayush-Preview.jpg');
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                                className="text-muted-foreground hover:text-foreground flex h-auto items-center gap-1 p-0"
                            >
                                <RotateCcw className="h-3 w-3" />
                                Reset to default image
                            </Button>
                        )}
                    </div>
                </div>

                {/* Controls below the canvas */}
                <div className="w-full">
                    <Card className="border-neutral-200 dark:border-neutral-800">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl">Shader Controls</CardTitle>
                            <CardDescription>Fine-tune the dithering matrices and color maps</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Pattern Selection */}
                                <div className="space-y-2">
                                    <Label htmlFor="dither-pattern">Pattern</Label>
                                    <Select value={ditherMode} onValueChange={(val) => setDitherMode(val as any)}>
                                        <SelectTrigger id="dither-pattern" className="w-full">
                                            <SelectValue placeholder="Select dither pattern" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-popover text-foreground rounded-md border shadow-md">
                                            <SelectItem value="bayer">Bayer Matrix (Classic)</SelectItem>
                                            <SelectItem value="halftone">Halftone Dots</SelectItem>
                                            <SelectItem value="noise">Dynamic Noise</SelectItem>
                                            <SelectItem value="crosshatch">Crosshatch Lines</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Color Mode Selection */}
                                <div className="space-y-2">
                                    <Label htmlFor="color-mode">Color Map</Label>
                                    <Select value={colorMode} onValueChange={(val) => setColorMode(val as any)}>
                                        <SelectTrigger id="color-mode" className="w-full">
                                            <SelectValue placeholder="Select color mapping" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-popover text-foreground rounded-md border shadow-md">
                                            <SelectItem value="duotone">Duotone (Custom Palette)</SelectItem>
                                            <SelectItem value="grayscale">Grayscale (1-bit)</SelectItem>
                                            <SelectItem value="original">Original Colors</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Duotone Color Inputs */}
                            {colorMode === 'duotone' && (
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="primary-color">Dark Tone</Label>
                                        <div className="flex items-center gap-2">
                                            <div className="border-input relative h-9 w-12 cursor-pointer overflow-hidden rounded-lg border">
                                                <input
                                                    type="color"
                                                    id="primary-color"
                                                    value={primaryColor}
                                                    onChange={(e) => setPrimaryColor(e.target.value)}
                                                    className="absolute -inset-2 h-14 w-16 cursor-pointer border-0 p-0"
                                                />
                                            </div>
                                            <span className="text-muted-foreground font-mono text-xs uppercase">{primaryColor}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="secondary-color">Light Tone</Label>
                                        <div className="flex items-center gap-2">
                                            <div className="border-input relative h-9 w-12 cursor-pointer overflow-hidden rounded-lg border">
                                                <input
                                                    type="color"
                                                    id="secondary-color"
                                                    value={secondaryColor}
                                                    onChange={(e) => setSecondaryColor(e.target.value)}
                                                    className="absolute -inset-2 h-14 w-16 cursor-pointer border-0 p-0"
                                                />
                                            </div>
                                            <span className="text-muted-foreground font-mono text-xs uppercase">{secondaryColor}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Grid Size Slider */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="grid-size">Pixel Size: {gridSize}px</Label>
                                    </div>
                                    <div className="pt-2">
                                        <Slider
                                            id="grid-size"
                                            value={[gridSize]}
                                            onValueChange={(val) => {
                                                const num = Array.isArray(val) ? val[0] : val;
                                                setGridSize(num);
                                            }}
                                            min={0.1}
                                            max={10}
                                            step={0.1}
                                        />
                                    </div>
                                </div>

                                {/* Threshold Slider */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="threshold">Contrast Threshold: {threshold.toFixed(2)}</Label>
                                    </div>
                                    <div className="pt-2">
                                        <Slider
                                            id="threshold"
                                            value={[threshold]}
                                            onValueChange={(val) => {
                                                const num = Array.isArray(val) ? val[0] : val;
                                                setThreshold(num);
                                            }}
                                            min={0}
                                            max={1}
                                            step={0.05}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Switch options & Reset Button */}
                            <div className="grid grid-cols-1 items-center gap-6 border-t border-neutral-100 pt-4 md:grid-cols-3 dark:border-neutral-800">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="invert-toggle" className="cursor-pointer text-sm">
                                        Invert Colors
                                    </Label>
                                    <Button
                                        id="invert-toggle"
                                        variant={invert ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setInvert(!invert)}
                                        className="h-8 px-4 text-xs font-medium"
                                    >
                                        {invert ? 'ON' : 'OFF'}
                                    </Button>
                                </div>

                                {ditherMode === 'noise' && (
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="animate-toggle" className="cursor-pointer text-sm">
                                            Animate Shader
                                        </Label>
                                        <Button
                                            id="animate-toggle"
                                            variant={animated ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setAnimated(!animated)}
                                            className="h-8 px-4 text-xs font-medium"
                                        >
                                            {animated ? 'ON' : 'OFF'}
                                        </Button>
                                    </div>
                                )}

                                <div className="pt-2 md:pt-0">
                                    <Button
                                        variant="outline"
                                        className="flex w-full items-center justify-center gap-2"
                                        onClick={() => {
                                            setDitherMode('bayer');
                                            setColorMode('duotone');
                                            setGridSize(1);
                                            setInvert(false);
                                            setAnimated(false);
                                            setThreshold(0.5);
                                            setPrimaryColor('#162a2b');
                                            setSecondaryColor('#d6e0e2');
                                        }}
                                    >
                                        <RotateCcw className="h-4 w-4" />
                                        Reset all controls
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
