import { nanoid } from 'nanoid/non-secure';
import { useCoach } from '@/contexts/store';
import type { DailyPlan, DailyTask } from '@/contexts/store';

type GenInput = { date: string; tweak?: { minutes?: number; focus?: string } };

export async function generatePlan({ date, tweak }: GenInput): Promise<DailyPlan> {
  const { goals, settings } = useCoach.getState();
  const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/generate-plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stri0ngify({ goals, settings, tweak, date }),
  }).catch(() => null);

  // Fallback to local mock if API unavailable
  const data: { tasks: Array<{ text: string; at?: string }> } = res?.ok
    ? await res!.json()
    : {
      tasks: [
        { text: '10-min warm-up', at: '07:10' },
        { text: '20-min reading', at: '07:40' },
        { text: 'Deep work sprint', at: '09:00' },
      ],
    };

  const tasks: DailyTask[] = data.tasks.slice(0, 6).map(t => ({
    id: nanoid(),
    text: t.at ? `${t.text} (${t.at})` : t.text,
    at: t.at,
    done: false,
  }));

  return { id: nanoid(), date, tasks };
}


