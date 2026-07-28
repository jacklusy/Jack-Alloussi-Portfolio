import { education } from '@/content/education';
import { certifications } from '@/content/certifications';
import { Section } from '@/components/layout/Section';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { renderContentText } from '@/lib/content-text';
import { formatMonthYear } from '@/lib/utils';

export function EducationSection() {
  return (
    <Section
      id="education"
      eyebrow="Credentials"
      title="Education & certifications"
      description="Degree recognition matters for EU Blue Card eligibility — credentials are listed without invented dates."
    >
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-[length:var(--text-h3)]">Education</h3>
          <ul className="space-y-4">
            {education.map((item) => (
              <li key={item.id}>
                <Card>
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
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-[length:var(--text-h3)]">Certifications</h3>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {certifications.map((cert) => (
              <li key={cert.id}>
                <Card className="h-full">
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
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
