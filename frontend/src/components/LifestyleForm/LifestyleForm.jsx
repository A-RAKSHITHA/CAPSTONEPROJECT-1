import React, { useState } from 'react';
import { Apple, Droplets, Footprints, Moon, Cigarette, Wine, CheckCircle2 } from 'lucide-react';

const LifestyleForm = ({ onSubmit, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    foodHabits: 'Mostly home-cooked food, low salt',
    waterIntake: '2–3 litres/day',
    physicalActivity: 'Brisk walking / agriculture activity',
    exerciseFrequency: '30 minutes/day',
    sleepDuration: '7 hours',
    smokingStatus: 'No',
    alcoholConsumption: 'No',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="font-bold text-slate-800 text-base">Record Daily Lifestyle Habits</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          These records help track personal habits and create a chronological history of your journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            <Apple className="w-4 h-4 text-emerald-600" />
            <span>Food Habits</span>
          </label>
          <input
            type="text"
            name="foodHabits"
            value={formData.foodHabits}
            onChange={handleChange}
            placeholder="e.g. Mostly home-cooked food"
            required
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            <Droplets className="w-4 h-4 text-blue-600" />
            <span>Water Intake</span>
          </label>
          <select
            name="waterIntake"
            value={formData.waterIntake}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          >
            <option value="Less than 1 litre/day">Less than 1 litre/day</option>
            <option value="1–2 litres/day">1–2 litres/day</option>
            <option value="2–3 litres/day">2–3 litres/day</option>
            <option value="3+ litres/day">3+ litres/day</option>
          </select>
        </div>

        <div>
          <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            <Footprints className="w-4 h-4 text-teal-600" />
            <span>Physical Activity</span>
          </label>
          <input
            type="text"
            name="physicalActivity"
            value={formData.physicalActivity}
            onChange={handleChange}
            placeholder="e.g. Walking / Farm labor"
            required
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            <span>Exercise Frequency</span>
          </label>
          <select
            name="exerciseFrequency"
            value={formData.exerciseFrequency}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          >
            <option value="Daily (30+ mins)">Daily (30+ mins)</option>
            <option value="3–4 times a week">3–4 times a week</option>
            <option value="1–2 times a week">1–2 times a week</option>
            <option value="Rare / None">Rare / None</option>
          </select>
        </div>

        <div>
          <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            <Moon className="w-4 h-4 text-indigo-600" />
            <span>Sleep Duration</span>
          </label>
          <select
            name="sleepDuration"
            value={formData.sleepDuration}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          >
            <option value="Less than 5 hours">Less than 5 hours</option>
            <option value="6 hours">6 hours</option>
            <option value="7 hours">7 hours</option>
            <option value="8+ hours">8+ hours</option>
          </select>
        </div>

        <div>
          <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            <Cigarette className="w-4 h-4 text-amber-600" />
            <span>Smoking Status</span>
          </label>
          <select
            name="smokingStatus"
            value={formData.smokingStatus}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          >
            <option value="No">No</option>
            <option value="Past Smoker (Quit)">Past Smoker (Quit)</option>
            <option value="Occasional">Occasional</option>
            <option value="Regular">Regular</option>
          </select>
        </div>

        <div>
          <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            <Wine className="w-4 h-4 text-rose-600" />
            <span>Alcohol Consumption</span>
          </label>
          <select
            name="alcoholConsumption"
            value={formData.alcoholConsumption}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
          >
            <option value="No">No</option>
            <option value="Rare / Occasional">Rare / Occasional</option>
            <option value="Regular">Regular</option>
          </select>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center space-x-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Save Lifestyle Record</span>
        </button>
      </div>
    </form>
  );
};

export default LifestyleForm;
