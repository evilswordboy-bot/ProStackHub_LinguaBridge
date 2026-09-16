import React, { useState } from 'react';
import { Briefcase, Plane, BookOpen, Coffee, ChevronRight } from 'lucide-react';

interface QuickPhrasesProps {
  onSelectPhrase: (text: string, targetLang?: string) => void;
}

interface PhraseCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  items: {
    title: string;
    text: string;
    suggestedTarget?: string;
  }[];
}

export const QuickPhrases: React.FC<QuickPhrasesProps> = ({ onSelectPhrase }) => {
  const [activeCategory, setActiveCategory] = useState<string>('work');

  const categories: PhraseCategory[] = [
    {
      id: 'work',
      name: 'Work & Email',
      icon: Briefcase,
      items: [
        {
          title: 'Project Milestone Status',
          text: `Dear Team,

Here is our sprint progress report:
1. Backend translation service completed.
2. Web Speech API integrated with multiple accents.
3. Local caching and history verified.

Please share your feedback by end of day.`,
          suggestedTarget: 'ta'
        },
        {
          title: 'Meeting Follow-up & Action Items',
          text: `Meeting Summary:
- Project kickoff scheduled for Monday at 10:00 AM.
- Architecture review sign-off completed.
- Security audit passed with zero vulnerabilities.`
        }
      ]
    },
    {
      id: 'travel',
      name: 'Travel & Dining',
      icon: Plane,
      items: [
        {
          title: 'Hotel Check-in & Requests',
          text: `Hello! I have a reservation under my name.
Could you please assist me with:
1. Room on a higher floor with a quiet view.
2. Luggage storage until 3:00 PM.
3. Directions to the nearest train station.`
        },
        {
          title: 'Restaurant Dietary Notice',
          text: `Good evening. I have severe food allergies:
* No peanuts or tree nuts
* Vegetarian friendly options only
Could you recommend dishes prepared separately?`
        }
      ]
    },
    {
      id: 'study',
      name: 'Study & Academics',
      icon: BookOpen,
      items: [
        {
          title: 'Assignment Inquiry',
          text: `Dear Professor,

I am writing regarding Assignment 1:
1. May we use external open-source libraries?
2. What is the expected test coverage percentage?

Thank you for your guidance.`
        }
      ]
    },
    {
      id: 'daily',
      name: 'Daily Conversation',
      icon: Coffee,
      items: [
        {
          title: 'Weekend Catch-up Invitation',
          text: `Hey! Are you free this Saturday afternoon?
Let's meet up for coffee around 4:00 PM and catch up on everything.`
        },
        {
          title: 'Congratulations & Well Wishes',
          text: `Huge congratulations on your new role!
Wishing you the very best of success and happiness in this next chapter.`
        }
      ]
    }
  ];

  const currentCat = categories.find((c) => c.id === activeCategory) || categories[0];

  return (
    <div className="mt-8 rounded-2xl glass-panel p-5 border border-white/10 dark:border-white/10 light:border-slate-300">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-200 dark:text-slate-200 light:text-slate-800 flex items-center gap-2">
            <span>📝</span>
            <span>Quick Structured Templates & Phrases</span>
          </h3>
          <p className="text-xs text-slate-400">
            Click any structured template to load it into the editor and test formatting preservation.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 bg-slate-900/60 dark:bg-slate-900/60 light:bg-slate-100 p-1 rounded-xl border border-white/5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = cat.id === activeCategory;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-violet text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Templates for Active Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {currentCat.items.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPhrase(item.text, item.suggestedTarget)}
            className="flex flex-col justify-between p-3 rounded-xl bg-slate-800/40 dark:bg-slate-800/40 light:bg-slate-50 hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-slate-200/80 border border-white/5 dark:border-white/5 light:border-slate-200 text-left transition-all group"
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-xs font-semibold text-brand-cyan group-hover:underline">
                {item.title}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-brand-cyan group-hover:translate-x-0.5 transition-transform" />
            </div>
            <p className="text-xs text-slate-300 dark:text-slate-300 light:text-slate-600 line-clamp-3 whitespace-pre-line font-mono text-[11px]">
              {item.text}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
