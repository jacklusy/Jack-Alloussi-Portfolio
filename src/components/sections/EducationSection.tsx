import { education } from '@/content/education';
import { certifications } from '@/content/certifications';
import { Section } from '@/components/layout/Section';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { renderContentText } from '@/lib/content-text';
import { formatMonthYear } from '@/lib/utils';
import { GraduationCap, Award } from 'lucide-react';

export function EducationSection() {
  return (
    <Section
      id="education"
      eyebrow="System.credentials_05"
      title="Architectural education"
      description="Formal credentials that matter for EU Blue Card degree recognition."
    >
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <h3 className="inline-flex items-center gap-2 text-[length:var(--text-h3)]">
            <GraduationCap className="h-5 w-5 text-[var(--color-brand)]" aria-hidden />
            Education
          </h3>
          <Stagger className="space-y-4" stagger={0.05}>
            {education.map((item) => (
              <StaggerItem key={item.id}>
                <Card interactive variant="panel">
                  <p className="font-mono-label text-[var(--color-text-subtle)]">
                    {formatMonthYear(item.startDate)} — {formatMonthYear(item.endDate)}
                    {item.status === 'expected' ? ' (expected)' : ''}
                  </p>
                  <h4 className="mt-2 font-[family-name:var(--font-syne)] text-lg font-semibold">
                    {item.degree} {item.field}
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
            ))}
          </Stagger>
        </div>

        <div className="space-y-4">
          <h3 className="inline-flex items-center gap-2 text-[length:var(--text-h3)]">
            <Award className="h-5 w-5 text-[var(--color-brand)]" aria-hidden />
            Certifications
          </h3>
          <Stagger className="grid auto-rows-fr gap-4 sm:grid-cols-2" stagger={0.05}>
            {certifications.map((cert) => (
              <StaggerItem key={cert.id} className="h-full">
                <Card interactive variant="panel" className="h-full">
                  <Badge tone={cert.status === 'in-progress' ? 'muted' : 'brand'}>
                    {cert.status === 'in-progress' ? 'In progress' : 'Earned'}
                  </Badge>
                  <h4 className="mt-3 font-[family-name:var(--font-syne)] text-base font-semibold">
                    {cert.name}
                  </h4>
                  <p className="mt-1 text-[var(--text-sm)] text-[var(--color-text-muted)]">
                    {cert.issuer}
                    {cert.issueDate ? ` · ${renderContentText(cert.issueDate)}` : null}
                  </p>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </Section>
  );
}
