import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getOneOrNull } from '@/lib/api/server';
import { PUBLIC_ENDPOINTS, detailPath } from '@/lib/api/endpoints';
import type { DocumentDetail } from '@/lib/types/content';
import { buildMetadata } from '@/lib/seo';
import { DetailLayout } from '@/components/content/detail-layout';
import { DocumentArticle, DocumentAside } from '@/components/details/document-detail';
import { BreadcrumbJsonLd, DocumentJsonLd } from '@/components/seo/json-ld';

export const revalidate = 300;

const load = (slug: string) => getOneOrNull<DocumentDetail>(detailPath(PUBLIC_ENDPOINTS.documents, slug));

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const document = await load(params.slug);
  if (!document) return { title: 'Document not found' };
  return buildMetadata({
    title: document.title_en,
    description: document.description_en,
    path: document.public_url,
  });
}

export default async function DocumentDetailPage({ params }: { params: { slug: string } }) {
  const document = await load(params.slug);
  if (!document) notFound();

  return (
    <>
      <DocumentJsonLd
        name={document.title_en}
        description={document.description_en}
        datePublished={document.publication_date ?? document.published_at}
        fileUrl={document.file?.file_url ?? null}
        mimeType={document.file?.mime_type ?? null}
        url={document.public_url}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Documents', url: '/documents' },
          { name: document.title_en, url: document.public_url },
        ]}
      />
      <DetailLayout
        crumbs={[{ labelKey: 'page.documents.title', href: '/documents' }, { labelEn: document.title_en, labelHi: document.title_hi }]}
        aside={<DocumentAside document={document} />}
      >
        <DocumentArticle document={document} />
      </DetailLayout>
    </>
  );
}
