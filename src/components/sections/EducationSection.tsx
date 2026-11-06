import { getFormatter, getTranslations } from 'next-intl/server';
import { Award, GraduationCap } from 'lucide-react';
import { getContent } from '@/content';
import type { Locale } from '@/i18n/config';
import { Section } from '@/components/layout/Section';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/Reveal';
import { renderContentText } from '@/lib/content-text';

export async function EducationSection({ locale }: { locale: Locale }) {
  const [t, tLabels, format, { education, certifications }] = await Promise.all([
    getTranslations({ locale, namespace: 'educationSection' }),
    getTranslations({ locale, namespace: 'labels' }),
    getFormatter({ locale }),
    getContent(locale),
  ]);
  const month = (value: string) => format.dateTime(new Date(`${value}-01T00:00:00`), 'monthYear');

  return (
    <Section id="education" eyebrow={t('eyebrow')} title={t('title')} description={t('description')}>
      <div className="grid gap-10 lg:grid-cols-2">
        <Reveal direction="start" distance={36} className="space-y-4">
          <h3 className="inline-flex items-center gap-2 text-[length:var(--text-h3)]">
            <GraduationCap className="h-5 w-5 text-[var(--color-brand)]" aria-hidden />
            {t('education')}
          </h3>
          <Stagger className="space-y-4" stagger={0.05}>
            {education.map((item) => {
              const start = month(item.startDate);
              const end = month(item.endDate);
              return (
                <StaggerItem key={item.id} direction="start" distance={18}>
                  <Card interactive variant="panel">
                    <p className="font-mono-label text-[var(--color-text-subtle)]">
                      {item.status === 'expected'
                        ? tLabels('dateRangeExpected', { start, end, expected: tLabels('expected') })
                        : tLabels('dateRange', { start, end })}
                    </p>
                    <h4 className="mt-2 font-[family-name:var(--font-syne)] text-lg font-semibold">
                      {[item.degree, item.field].filter(Boolean).join(' ')}
                    </h4>
                    <p className="mt-1 text-[var(--color-text-muted)]">
                      {item.institution} · {item.location}
                    </p>
                    {item.note ? (
                      <p className="mt-3 text-[var(--text-sm)] text-[var(--color-text-subtle)]">
                        {renderContentText(item.note)}
                      </p>
                    ) : null}
                  </Card>
                </StaggerItem>
              );
            })}
          </Stagger>
        </Reveal>

        <Reveal direction="end" distance={36} className="space-y-4">
          <h3 className="inline-flex items-center gap-2 text-[length:var(--text-h3)]">
            <Award className="h-5 w-5 text-[var(--color-brand)]" aria-hidden />
            {t('certifications')}
          </h3>
          <Stagger className="grid auto-rows-fr gap-4 sm:grid-cols-2" stagger={0.05}>
            {certifications.map((cert) => (
              <StaggerItem key={cert.id} className="h-full" direction="end" distance={18}>
                <Card interactive variant="panel" className="h-full">
                  <Badge tone={cert.status === 'in-progress' ? 'muted' : 'brand'}>
                    {cert.status === 'in-progress' ? tLabels('inProgress') : tLabels('earned')}
                  </Badge>
                  <h4 className="mt-3 font-[family-name:var(--font-syne)] text-base font-semibold">
                    {cert.name}
                  </h4>
                  <p className="mt-1 text-[var(--text-sm)] text-[var(--color-text-muted)]">
                    {cert.issuer}
                    {cert.issueDate ? (
                      <>
                        {' · '}
                        {month(cert.issueDate)}
                      </>
                    ) : null}
                  </p>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </Reveal>
      </div>
    </Section>
  );
}
