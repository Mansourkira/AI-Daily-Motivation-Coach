-- Seed goal suggestions for the existing schema
-- This adds suggestions for each focus area in the catalog

-- Health suggestions
INSERT INTO public.goal_suggestion_catalog (focus_area_key, text_en, text_fr, text_ar) VALUES
  ('health', 'Exercise 30 minutes daily', 'Faire 30 minutes d''exercice par jour', 'ممارسة الرياضة 30 دقيقة يوميًا'),
  ('health', 'Drink 8 glasses of water', 'Boire 8 verres d''eau', 'شرب 8 أكواب من الماء'),
  ('health', 'Get 8 hours of sleep', 'Dormir 8 heures', 'النوم 8 ساعات'),
  ('health', 'Eat 5 servings of fruits/vegetables', 'Manger 5 portions de fruits/légumes', 'تناول 5 حصص من الفواكه/الخضروات'),
  ('health', 'Meditate for 10 minutes', 'Méditer 10 minutes', 'التأمل لمدة 10 دقائق')
ON CONFLICT DO NOTHING;

-- Study suggestions
INSERT INTO public.goal_suggestion_catalog (focus_area_key, text_en, text_fr, text_ar) VALUES
  ('study', 'Read 1 chapter daily', 'Lire 1 chapitre par jour', 'قراءة فصل واحد يوميًا'),
  ('study', 'Learn a new skill', 'Apprendre une nouvelle compétence', 'تعلم مهارة جديدة'),
  ('study', 'Complete online course', 'Terminer un cours en ligne', 'إكمال دورة عبر الإنترنت'),
  ('study', 'Practice a language daily', 'Pratiquer une langue quotidiennement', 'ممارسة لغة يوميًا'),
  ('study', 'Watch educational content', 'Regarder du contenu éducatif', 'مشاهدة محتوى تعليمي')
ON CONFLICT DO NOTHING;

-- Work suggestions
INSERT INTO public.goal_suggestion_catalog (focus_area_key, text_en, text_fr, text_ar) VALUES
  ('work', 'Update resume', 'Mettre à jour le CV', 'تحديث السيرة الذاتية'),
  ('work', 'Network with 5 people', 'Réseauter avec 5 personnes', 'التواصل مع 5 أشخاص'),
  ('work', 'Complete project on time', 'Terminer le projet à temps', 'إكمال المشروع في الوقت المحدد'),
  ('work', 'Improve a work skill', 'Améliorer une compétence professionnelle', 'تحسين مهارة عمل'),
  ('work', 'Set career goals', 'Définir des objectifs de carrière', 'تحديد أهداف مهنية')
ON CONFLICT DO NOTHING;

-- Finance suggestions
INSERT INTO public.goal_suggestion_catalog (focus_area_key, text_en, text_fr, text_ar) VALUES
  ('finance', 'Save 20% of income', 'Économiser 20% des revenus', 'توفير 20% من الدخل'),
  ('finance', 'Create a budget', 'Créer un budget', 'إنشاء ميزانية'),
  ('finance', 'Pay off debt', 'Rembourser les dettes', 'سداد الديون'),
  ('finance', 'Track expenses daily', 'Suivre les dépenses quotidiennement', 'تتبع النفقات يوميًا'),
  ('finance', 'Invest in retirement', 'Investir pour la retraite', 'الاستثمار للتقاعد')
ON CONFLICT DO NOTHING;

-- Faith suggestions
INSERT INTO public.goal_suggestion_catalog (focus_area_key, text_en, text_fr, text_ar) VALUES
  ('faith', 'Pray/meditate daily', 'Prier/méditer quotidiennement', 'الصلاة/التأمل يوميًا'),
  ('faith', 'Read spiritual texts', 'Lire des textes spirituels', 'قراءة النصوص الروحية'),
  ('faith', 'Attend community service', 'Assister au service communautaire', 'حضور الخدمة المجتمعية'),
  ('faith', 'Practice mindfulness', 'Pratiquer la pleine conscience', 'ممارسة اليقظة الذهنية'),
  ('faith', 'Help someone in need', 'Aider quelqu''un dans le besoin', 'مساعدة شخص محتاج')
ON CONFLICT DO NOTHING;

-- Personal suggestions
INSERT INTO public.goal_suggestion_catalog (focus_area_key, text_en, text_fr, text_ar) VALUES
  ('personal', 'Journal daily', 'Tenir un journal quotidien', 'كتابة يوميات يومية'),
  ('personal', 'Practice gratitude', 'Pratiquer la gratitude', 'ممارسة الامتنان'),
  ('personal', 'Learn a hobby', 'Apprendre un passe-temps', 'تعلم هواية'),
  ('personal', 'Set personal boundaries', 'Définir des limites personnelles', 'تحديد حدود شخصية'),
  ('personal', 'Develop a morning routine', 'Développer une routine matinale', 'تطوير روتين صباحي')
ON CONFLICT DO NOTHING;

-- Relationships suggestions
INSERT INTO public.goal_suggestion_catalog (focus_area_key, text_en, text_fr, text_ar) VALUES
  ('relationships', 'Call a friend weekly', 'Appeler un ami chaque semaine', 'الاتصال بصديق أسبوعيًا'),
  ('relationships', 'Plan a date night', 'Planifier une soirée en amoureux', 'التخطيط لموعد ليلي'),
  ('relationships', 'Spend quality time with family', 'Passer du temps de qualité en famille', 'قضاء وقت ممتع مع العائلة'),
  ('relationships', 'Express appreciation', 'Exprimer de la reconnaissance', 'التعبير عن التقدير'),
  ('relationships', 'Resolve a conflict', 'Résoudre un conflit', 'حل نزاع')
ON CONFLICT DO NOTHING;

