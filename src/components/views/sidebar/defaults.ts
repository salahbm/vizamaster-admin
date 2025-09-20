import z from 'zod';

import { Sidebar } from '@/generated/prisma';
import { TCreateSidebarDto, TUpdateSidebarDto } from '@/server/common/dto';

export const sidebarDefaultValues = (
  data?: TUpdateSidebarDto | Sidebar | null,
): TSidebarFormSchema => {
  if (!data) {
    return {
      labelEn: '',
      labelRu: '',
      href: '',
      icon: '',
      parentId: '',
      order: 0,
      independent: false,
      child: 'false',
      country: '',
      partner: '',
    };
  }
  // Extract the base properties that exist in both types
  const hrefFields = mapHrefIntoFields(data.href);

  return {
    labelEn: data.labelEn,
    labelRu: data.labelRu,
    href: hrefFields.href,
    icon: data.icon ?? '',
    parentId: data.parentId ?? '',
    order: z.number().or(z.string()).parse(data.order),
    independent: hrefFields.independent,
    child: hrefFields.child ? 'true' : 'false',
    country: hrefFields.country,
    partner: hrefFields.partner,
  };
};

const mapHrefIntoFields = (href: string | null) => {
  if (!href)
    return {
      href: '',
      country: '',
      partner: '',
      child: false,
      independent: false,
    };

  const segments = href.split('/');
  const isDependent = segments.includes('applicant');

  const country = isDependent ? segments[2] : '';
  const partner = isDependent ? segments[3] : '';
  const isChild = isDependent ? segments.length > 3 : segments.length > 2;

  return {
    href,
    country,
    partner,
    child: isChild,
    independent: !isDependent,
  };
};

export const sidebarFormSchema = z
  .object({
    labelEn: z.string().min(1),
    labelRu: z.string().min(1),
    href: z.string().optional(),
    icon: z.string().optional(),
    parentId: z.string().optional(),
    order: z.number().or(z.string()).optional(),
    independent: z.boolean(),
    child: z.string(),
    country: z.string().optional(),
    partner: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Independent routes have a standard href and can be nested
    if (data.independent) {
      if (!data.href) {
        ctx.addIssue({
          path: ['href'],
          code: 'custom',
          message: 'URL is required for independent routes',
        });
      }
      if (data.child === 'true' && !data.parentId) {
        ctx.addIssue({
          path: ['parentId'],
          code: 'custom',
          message: 'Parent is required for child routes',
        });
      }
    }

    // Dependent routes are dynamically generated from country and partner
    if (!data.independent) {
      if (!data.country) {
        ctx.addIssue({
          path: ['country'],
          code: 'custom',
          message: 'Country is required for dependent routes',
        });
      }
      if (data.child === 'true' && !data.partner) {
        ctx.addIssue({
          path: ['partner'],
          code: 'custom',
          message: 'Partner is required for dependent routes',
        });
      }
    }
  });

export type TSidebarFormSchema = z.infer<typeof sidebarFormSchema>;

export const mapFormIntoSubmitData = (
  data: TSidebarFormSchema,
): TCreateSidebarDto => {
  const mapHrefIntoSubmitData = (): string => {
    if (data.independent) return data.href!;
    return `${data.country}${data.partner ? `/${data.partner}` : ''}`;
  };
  return {
    labelEn: data.labelEn,
    labelRu: data.labelRu,
    href: mapHrefIntoSubmitData(),
    icon: data.icon!,
    parentId: data.parentId!,
    order: data.order!,
  };
};
