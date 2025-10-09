"use client";
import { useEffect, useState, useCallback } from 'react';
import { View, Text, RefreshControl, Share, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useCoach } from '@/contexts/store';
import { generatePlan } from '@/services/ai';
import { ensureNotificationPermission, scheduleMorningPing } from '@/services/notifications';
import AdsBanner from '@/components/AdsBanner';
import { Feather } from '@expo/vector-icons';

const todayKey = () => new Date().toISOString().slice(0,10);

export default function Today() {
  const { hasGoals, plans, savePlan, toggleTask, settings } = useCoach();
  const [loading, setLoading] = useState(false);
  const date = todayKey();
  const plan = plans[date];

  const handleGenerate = useCallback(async () => {
    if (!hasGoals()) return;
    setLoading(true);
    const p = await generatePlan({ date });
    savePlan(p);
    setLoading(false);
  }, [hasGoals, date]);

  useEffect(() => {
    if (!plan && hasGoals()) handleGenerate();
  }, [plan, hasGoals, handleGenerate]);

  const onShare = async () => {
    const text = plan?.tasks.map(t => `• ${t.text}${t.done ? ' ✅' : ''}`).join('\n') ?? '';
    await Share.share({ message: `My plan for ${date}:\n${text}` });
  };

  const requestNotifications = async () => {
    if (!settings.notifications) return;
    const granted = await ensureNotificationPermission();
    if (granted) await scheduleMorningPing(9, 0);
  };

  useEffect(() => { requestNotifications(); }, [settings.notifications]);

  if (!hasGoals()) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Welcome to AI Daily Coach</Text>
        <Text style={styles.sub}>Add 1–3 goals in onboarding to get your plan.</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={handleGenerate} />
      }
    >
      <Text style={styles.heading}>Today</Text>

      {!plan ? (
        <Text style={styles.sub}>{loading ? 'Generating…' : 'No plan yet. Pull to generate.'}</Text>
      ) : (
        <View style={{ gap: 12 }}>
          {plan.tasks.map(t => (
            <TouchableOpacity key={t.id} style={styles.task} onPress={() => toggleTask(date, t.id)}>
              <Feather name={t.done ? 'check-circle' : 'circle'} size={18} />
              <Text style={[styles.taskText, t.done && styles.done]}>{t.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.row}>
        <TouchableOpacity onPress={handleGenerate} style={styles.ghost}><Feather name="refresh-cw" size={16} /><Text style={styles.ghostText}>Regenerate</Text></TouchableOpacity>
        <View style={{ width: 8 }} />
        <TouchableOpacity onPress={onShare} style={styles.secondary}><Feather name="share-2" size={16} color="#fff" /><Text style={styles.secondaryText}>Share</Text></TouchableOpacity>
      </View>

      <View style={{ marginTop: 16 }}>
        <AdsBanner />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 },
  heading: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '800' },
  sub: { color: '#8A8F98' },
  task: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  taskText: { fontSize: 16, flex: 1 },
  done: { textDecorationLine: 'line-through', opacity: 0.6 },
  row: { flexDirection: 'row', marginTop: 16 },
  ghost: { flexDirection: 'row', gap: 6, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, borderColor: '#ddd' },
  ghostText: { fontSize: 14 },
  secondary: { flexDirection: 'row', gap: 6, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, backgroundColor: '#1f9d55' },
  secondaryText: { color: '#fff', fontWeight: '600' },
});


