import React, { useEffect, useRef } from "react";
import { useAppContext } from "../context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const UploadAndAnalyzeSection: React.FC = () => {
	const {
		audioFile,
		setAudioFile,
		analysisResult,
		isAnalyzing,
		analyzeAudio,
		metronomeBpm,
		setMetronomeBpm,
		isMetronomePlaying,
		toggleMetronome,
	} = useAppContext();

	const audioContextRef = useRef<AudioContext | null>(null);
	const metronomeIntervalRef = useRef<number | null>(null);

	useEffect(() => {
		if (analysisResult) {
			setMetronomeBpm(Math.round(analysisResult.bpm));
		}
	}, [analysisResult, setMetronomeBpm]);

	useEffect(() => {
		if (isMetronomePlaying) {
			if (!audioContextRef.current) {
				audioContextRef.current = new (window.AudioContext ||
					(window as any).webkitAudioContext)();
			}
			const playTick = () => {
				if (!audioContextRef.current) return;
				const osc = audioContextRef.current.createOscillator();
				const gain = audioContextRef.current.createGain();
				osc.connect(gain);
				gain.connect(audioContextRef.current.destination);
				osc.type = "sine";
				osc.frequency.setValueAtTime(880, audioContextRef.current.currentTime);
				gain.gain.setValueAtTime(1, audioContextRef.current.currentTime);
				osc.start(audioContextRef.current.currentTime);
				gain.gain.exponentialRampToValueAtTime(
					0.00001,
					audioContextRef.current.currentTime + 0.05
				);
				osc.stop(audioContextRef.current.currentTime + 0.05);
			};
			playTick(); // Play immediately
			metronomeIntervalRef.current = window.setInterval(
				playTick,
				(60.0 / metronomeBpm) * 1000
			);
		} else {
			if (metronomeIntervalRef.current) {
				clearInterval(metronomeIntervalRef.current);
				metronomeIntervalRef.current = null;
			}
		}
		return () => {
			if (metronomeIntervalRef.current) {
				clearInterval(metronomeIntervalRef.current);
			}
		};
	}, [isMetronomePlaying, metronomeBpm]);

	const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			setAudioFile(event.target.files[0]);
		} else {
			setAudioFile(null);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<span className="bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center">
						1
					</span>
					Upload & Analyze
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid w-full max-w-sm items-center gap-1.5">
					<Label htmlFor="audio-upload">Audio File</Label>
					<Input
						id="audio-upload"
						type="file"
						accept="audio/*"
						onChange={handleAudioUpload}
					/>
					<p className="text-sm text-muted-foreground">
						{audioFile ? audioFile.name : "No file selected."}
					</p>
				</div>

				<div className="musicians-toolkit space-y-4">
					<h3 className="text-lg font-semibold">Musician's Toolkit</h3>
					<Button
						onClick={analyzeAudio}
						disabled={!audioFile || isAnalyzing}
						className="w-full"
					>
						{isAnalyzing ? "Analyzing..." : "Analyze Audio"}
					</Button>
					{isAnalyzing && <div className="loader-small mx-auto"></div>}
					{analysisResult && (
						<div className="analysis-result space-y-2">
							<div className="flex justify-between">
								<strong>BPM</strong>
								<span>{Math.round(analysisResult.bpm)}</span>
							</div>
							<div className="flex justify-between">
								<strong>Key</strong>
								<span>{analysisResult.key}</span>
							</div>
							<div className="flex justify-between">
								<strong>Chords</strong>
								<span>{analysisResult.chords.join(", ")}</span>
							</div>
							<div>
								<strong>Structure</strong>
								<div className="text-sm text-muted-foreground">
									{analysisResult.structure?.map((s, i) => (
										<div key={i} className="flex justify-between">
											<span>{s.part}</span>
											<span>
												{new Date(s.start * 1000).toISOString().substr(14, 5)} -{" "}
												{new Date(s.end * 1000).toISOString().substr(14, 5)}
											</span>
										</div>
									))}
								</div>
							</div>
						</div>
					)}
					<div className="metronome">
						<h4 className="font-semibold">Metronome</h4>
						<div className="flex items-center gap-2">
							<Input
								type="number"
								value={metronomeBpm}
								onChange={(e) => setMetronomeBpm(parseInt(e.target.value, 10))}
								min="40"
								max="240"
								className="w-20"
							/>
							<Button
								variant="outline"
								size="icon"
								onClick={toggleMetronome}
								className={isMetronomePlaying ? "active" : ""}
							>
								<i
									className={`fa-solid ${
										isMetronomePlaying ? "fa-pause" : "fa-play"
									}`}
								></i>
							</Button>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default UploadAndAnalyzeSection;
