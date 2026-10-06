'use client';

/** Toolkit detail view (bilingual). Shows toolkit items with distribution basis and
 *  an aggregated, public distribution summary - summary figures only, never
 *  beneficiary-level data (codex §4.3). */

import type { ToolkitDetail, ToolkitDistributionSummary } from '@/lib/types/content';
import { useLanguage } from '@/providers/language-provider';
import { pickText } from '@/utils/bilingual';
import { formatNumber, distributionBasisLabel } from '@/utils/format';
import { Badge } from '@/components/ui/badge';
import { BilingualTitle, BilingualLead, BilingualBody } from '@/components/content/bilingual';

export function ToolkitArticle({
  toolkit,
  summary,
}: {
  toolkit: ToolkitDetail;
  summary: ToolkitDistributionSummary | null;
}) {
  const { t, language } = useLanguage();

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {toolkit.commodity && (
          <Badge tone="primary">{pickText(toolkit.commodity.name_en, toolkit.commodity.name_hi, language)}</Badge>
        )}
        {toolkit.programme && (
          <Badge tone="neutral">{pickText(toolkit.programme.title_en, toolkit.programme.title_hi, language)}</Badge>
        )}
      </div>

      <BilingualTitle en={toolkit.title_en} hi={toolkit.title_hi} />
      <BilingualLead en={toolkit.summary_en} hi={toolkit.summary_hi} />
      <BilingualBody en={toolkit.description_en} hi={toolkit.description_hi} />

      {toolkit.items.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold text-foreground">{t('detail.toolkitItems')}</h2>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-2 font-medium">{t('reports.toolkit.col.item')}</th>
                  <th scope="col" className="px-4 py-2 font-medium">{t('detail.basis')}</th>
                  <th scope="col" className="px-4 py-2 font-medium">{t('detail.unit')}</th>
                  <th scope="col" className="px-4 py-2 font-medium">{t('detail.quantityPerUnit')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {toolkit.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2 font-medium text-foreground">
                      {pickText(item.name_en, item.name_hi, language)}
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">{distributionBasisLabel(item.distribution_basis, t)}</td>

                    <td className="px-4 py-2 text-muted-foreground">{item.unit ?? '-'}</td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {item.default_quantity_per_unit ?? '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {summary && summary.items.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-1 text-lg font-semibold text-foreground">{t('detail.distributionSummary')}</h2>
          {summary.total_participants_covered !== null && (
            <p className="mb-3 text-sm text-muted-foreground">
              {t('detail.participantsCovered')} <strong>{formatNumber(summary.total_participants_covered, language)}</strong>
            </p>
          )}
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-2 font-medium">{t('reports.toolkit.col.item')}</th>
                  <th scope="col" className="px-4 py-2 font-medium">{t('detail.unit')}</th>
                  <th scope="col" className="px-4 py-2 font-medium">{t('detail.totalDistributed')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {summary.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2 font-medium text-foreground">
                      {pickText(item.name_en, item.name_hi ?? null, language)}
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">{item.unit ?? '-'}</td>
                    <td className="px-4 py-2 text-muted-foreground">{formatNumber(item.total_quantity, language) || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}
