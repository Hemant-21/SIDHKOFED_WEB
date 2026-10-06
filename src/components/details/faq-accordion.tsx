'use client';

/** FAQ accordion (bilingual, WCAG accordion). Questions/answers come from the API;
 *  answers may contain sanitized rich text. */

import type { Faq } from '@/lib/types/content';
import { useLanguage } from '@/providers/language-provider';
import { pickTextWithFallback } from '@/utils/bilingual';
import { Accordion, type AccordionItemData } from '@/components/ui/accordion';
import { RichText } from '@/components/content/rich-text';
import { BilingualFallbackText } from '@/components/content/bilingual-fallback-text';

export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const { language } = useLanguage();

  const items: AccordionItemData[] = faqs.map((faq) => {
    const { text: question, isFallback } = pickTextWithFallback(faq.question_en, faq.question_hi, language);
    return {
      id: faq.id,
      question: <BilingualFallbackText text={question} isFallback={isFallback} />,
      answer: <RichText html={language === 'hi' ? faq.answer_hi || faq.answer_en : faq.answer_en} lang={language} />,
    };
  });

  return <Accordion items={items} defaultOpenId={items[0]?.id} />;
}
