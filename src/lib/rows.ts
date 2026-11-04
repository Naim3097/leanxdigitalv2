import type { Product } from '../data/products';
import type { Service } from '../data/services';
import type { CaseStudy } from '../data/work';

export interface Row {
  href: string;
  name: string;
  label: string;
  text: string;
}

export const productRows = (items: Product[]): Row[] =>
  items.map((p) => ({
    href: `/products/${p.slug}/`,
    name: p.name,
    label: p.category,
    text: p.summary,
  }));

export const serviceRows = (items: Service[]): Row[] =>
  items.map((s) => ({
    href: `/services/${s.slug}/`,
    name: s.name,
    label: s.category,
    text: s.summary,
  }));

export const workRows = (items: CaseStudy[]): Row[] =>
  items.map((c) => ({
    href: `/work/${c.slug}/`,
    name: c.client,
    label: c.industry,
    text: c.summary,
  }));
