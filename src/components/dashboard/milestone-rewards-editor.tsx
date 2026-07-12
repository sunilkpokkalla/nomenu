"use client";

import { useState } from "react";
import { Plus, Trash2, GripVertical, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface MilestoneReward {
  visits: number;
  reward: string;
}

interface MilestoneRewardsEditorProps {
  initialMilestones?: MilestoneReward[] | null;
}

export function MilestoneRewardsEditor({ initialMilestones }: MilestoneRewardsEditorProps) {
  const [milestones, setMilestones] = useState<MilestoneReward[]>(
    initialMilestones || []
  );

  const addMilestone = () => {
    setMilestones([...milestones, { visits: 100, reward: "" }]);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const updateMilestone = (index: number, field: keyof MilestoneReward, value: string | number) => {
    const newMilestones = [...milestones];
    newMilestones[index] = { ...newMilestones[index], [field]: value };
    setMilestones(newMilestones);
  };

  return (
    <div className="space-y-4">
      <input 
        type="hidden" 
        name="milestoneRewards" 
        value={JSON.stringify(milestones.filter(m => m.visits > 0 && m.reward.trim()))} 
      />
      
      {milestones.length === 0 ? (
        <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-xl bg-amber-50/50">
          <p className="text-amber-700 text-sm mb-4">
            You haven't defined any milestone rewards (e.g., 100 Visits = $50 Gift Card). Add one below!
          </p>
          <div className="flex gap-2 justify-center">
            <Button type="button" variant="outline" onClick={addMilestone} className="gap-2 border-amber-200 text-amber-700 hover:bg-amber-100">
              <Plus className="w-4 h-4" /> Add Milestone
            </Button>
            <Button type="button" onClick={() => setMilestones([{ visits: 100, reward: "Free $50 Gift Card" }])} className="gap-2 bg-amber-600 hover:bg-amber-700 text-white">
              Quick Setup 100-Visit Prize
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {milestones.map((milestone, index) => (
            <div key={index} className="flex gap-3 items-start bg-amber-50 p-4 rounded-xl border border-amber-200 group relative">
              <div className="mt-2 text-amber-300">
                <GripVertical className="w-4 h-4" />
              </div>
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <Label className="text-xs text-amber-900 mb-1.5 block font-bold">Required Visits</Label>
                    <Input 
                      type="number"
                      placeholder="e.g. 100" 
                      value={milestone.visits}
                      onChange={(e) => updateMilestone(index, "visits", parseInt(e.target.value) || 0)}
                      className="bg-white border-amber-200 focus-visible:ring-amber-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs text-amber-900 mb-1.5 block font-bold">Mega Reward Title</Label>
                    <Input 
                      placeholder="e.g. Free $50 Gift Card" 
                      value={milestone.reward}
                      onChange={(e) => updateMilestone(index, "reward", e.target.value)}
                      className="bg-white border-amber-200 focus-visible:ring-amber-500"
                    />
                  </div>
                </div>
                <p className="text-xs text-amber-700">
                  When a customer hits exactly {milestone.visits || 100} visits (stamps across all cycles), they will unlock this grand prize instead of the normal cycle reward.
                </p>
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={() => removeMilestone(index)}
                className="text-amber-400 hover:text-red-600 hover:bg-red-50 absolute right-2 top-2"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addMilestone} className="w-full mt-2 border-dashed border-amber-200 gap-2 text-amber-700 bg-transparent hover:bg-amber-50 hover:text-amber-800">
            <Plus className="w-4 h-4" /> Add Another Milestone
          </Button>
        </div>
      )}
    </div>
  );
}
