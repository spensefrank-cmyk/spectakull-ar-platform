'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square, SkipBack, SkipForward, Plus } from 'lucide-react';

interface AnimationPanelProps {
  selectedObjectId?: string;
}

export function AnimationPanel({ selectedObjectId }: AnimationPanelProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(5);
  const [keyframes, setKeyframes] = useState<Array<{time: number, type: string}>>([]);

  const addKeyframe = () => {
    const newKeyframe = {
      time: currentTime,
      type: 'position'
    };
    setKeyframes([...keyframes, newKeyframe].sort((a, b) => a.time - b.time));
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-white font-semibold text-lg">Animation Timeline</h3>

      {/* Timeline Controls */}
      <div className="flex items-center space-x-2">
        <Button size="sm" variant="outline" className="bg-white/5 border-white/20 text-white">
          <SkipBack className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          onClick={() => setIsPlaying(!isPlaying)}
          className={isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <Button size="sm" variant="outline" className="bg-white/5 border-white/20 text-white">
          <Square className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="outline" className="bg-white/5 border-white/20 text-white">
          <SkipForward className="w-4 h-4" />
        </Button>
      </div>

      {/* Timeline Scrubber */}
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <div className="relative h-8 bg-gray-700 rounded">
          <div
            className="absolute top-0 h-full bg-cyan-500 rounded"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
          <input
            type="range"
            min="0"
            max={duration}
            step="0.1"
            value={currentTime}
            onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
            className="absolute top-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <div className="flex justify-between text-white/60 text-sm mt-2">
          <span>{currentTime.toFixed(1)}s</span>
          <span>{duration}s</span>
        </div>
      </div>

      {/* Keyframes */}
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-white font-medium">Keyframes</h4>
          <Button size="sm" onClick={addKeyframe} className="bg-cyan-600 hover:bg-cyan-700">
            <Plus className="w-4 h-4 mr-1" />
            Add Keyframe
          </Button>
        </div>

        <div className="space-y-2">
          {keyframes.map((keyframe, index) => (
            <div key={index} className="flex items-center justify-between bg-white/5 rounded p-2">
              <span className="text-white text-sm">{keyframe.time.toFixed(1)}s - {keyframe.type}</span>
              <Button size="sm" variant="outline" className="text-red-400 border-red-400/20">
                Delete
              </Button>
            </div>
          ))}
          {keyframes.length === 0 && (
            <p className="text-white/60 text-sm text-center py-4">No keyframes added</p>
          )}
        </div>
      </div>

      {/* Animation Properties */}
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <h4 className="text-white font-medium mb-3">Animation Properties</h4>
        <div className="space-y-3">
          <div>
            <label className="text-white/80 text-sm block mb-1">Duration (seconds)</label>
            <input
              type="number"
              min="0.1"
              max="60"
              step="0.1"
              value={duration}
              onChange={(e) => setDuration(parseFloat(e.target.value))}
              className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="text-white/80 text-sm block mb-1">Easing</label>
            <select className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white">
              <option value="linear">Linear</option>
              <option value="ease-in">Ease In</option>
              <option value="ease-out">Ease Out</option>
              <option value="ease-in-out">Ease In-Out</option>
              <option value="bounce">Bounce</option>
              <option value="elastic">Elastic</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
