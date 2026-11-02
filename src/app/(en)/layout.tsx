import { DocumentLayout, baseMetadata } from '@/components/document-layout';

export const metadata = baseMetadata;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DocumentLayout language="en">{children}</DocumentLayout>;
}
