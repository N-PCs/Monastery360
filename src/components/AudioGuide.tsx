import { Headphones, Loader2, Pause, Play, Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { audioLanguages, fetchNarrationUrl, type AudioLanguage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  text: string;
  cacheKey: string;
  className?: string;
}

/**
 * Multilingual audio guide.
 * Uses the Worker TTS endpoint when a backend is configured; otherwise falls
 * back to the browser speech engine so the guide still works offline.
 */
export function AudioGuide({ title, text, cacheKey, className }: Props) {
  const [language, setLanguage] = useState<AudioLanguage>("en");
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stop = () => {
    audioRef.current?.pause();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setPlaying(false);
  };

  const play = async () => {
    setLoading(true);
    try {
      const url = await fetchNarrationUrl(text, language, `${cacheKey}:${language}`);
      if (url) {
        const audio = audioRef.current ?? new Audio();
        audioRef.current = audio;
        audio.src = url;
        audio.onended = () => setPlaying(false);
        await audio.play();
        setPlaying(true);
        return;
      }
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language === "en" ? "en-IN" : language === "hi" ? "hi-IN" : "ne-NP";
        utterance.rate = 0.95;
        utterance.onend = () => setPlaying(false);
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
        setPlaying(true);
      } else {
        toast.error("Audio narration is not supported in this browser.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Narration could not be generated right now.");
    } finally {
      setLoading(false);
    }
  };

  const cacheOffline = () => {
    if (typeof window === "undefined") return;
    const key = "m360:offline-guides";
    const saved = JSON.parse(window.localStorage.getItem(key) ?? "{}") as Record<string, string>;
    saved[`${cacheKey}:${language}`] = text;
    window.localStorage.setItem(key, JSON.stringify(saved));
    toast.success("Guide saved for offline use");
  };

  return (
    <div className={cn("rounded-lg border border-border bg-card p-5", className)}>
      <div className="flex items-center gap-2 text-eyebrow text-muted-foreground">
        <Headphones className="size-3.5" />
        Smart audio guide
      </div>
      <p className="mt-2 font-display text-lg">{title}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {audioLanguages.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => {
              stop();
              setLanguage(lang.code);
            }}
            className={cn(
              "rounded-full border px-3 py-1 text-xs transition-colors",
              language === lang.code
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:border-primary/50",
            )}
          >
            {lang.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Button onClick={playing ? stop : play} disabled={loading} size="sm">
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : playing ? (
            <Pause className="size-4" />
          ) : (
            <Play className="size-4" />
          )}
          {playing ? "Pause narration" : "Play narration"}
        </Button>
        <Button variant="outline" size="sm" onClick={cacheOffline}>
          <Download className="size-4" />
          Save offline
        </Button>
      </div>

      <p className="mt-4 border-l-2 border-gold/60 pl-3 text-sm leading-relaxed text-muted-foreground">
        {text}
      </p>
    </div>
  );
}
