import prisma from '@/utils/prisma'

export type FeatureType = 'invoice' | 'estimate' | 'client' | 'team_member';
export type FeatureFlag = 'WATERMARK_REMOVAL' | 'CUSTOM_DOMAIN' | 'ADVANCED_REPORTS';

/**
 * Checks if a company is allowed to create a new instance of a specific feature.
 * Returns { allowed: true } if the limit is not reached or if it's unlimited (null).
 */
export async function checkFeatureLimit(companyId: string, featureType: FeatureType): Promise<{ allowed: boolean, limit: number | null }> {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: { subscription: { include: { plan: true } } }
  });

  if (!company) return { allowed: false, limit: 0 };
  
  const plan = company.subscription?.plan;
  
  if (!plan) return { allowed: true, limit: null };
  
  let currentCount = 0;
  let limit: number | null = null;
  
  switch (featureType) {
    case 'invoice':
      limit = plan.invoiceLimits;
      if (limit !== null) {
        currentCount = await prisma.invoice.count({ 
          where: { companyId, invoiceType: { not: 'ESTIMATE' } } 
        });
      }
      break;
    case 'estimate':
      limit = plan.invoiceLimits;
      if (limit !== null) {
        currentCount = await prisma.invoice.count({ 
          where: { companyId, invoiceType: 'ESTIMATE' } 
        });
      }
      break;
    case 'client':
      limit = plan.clientLimits;
      if (limit !== null) {
        currentCount = await prisma.client.count({ where: { companyId } });
      }
      break;
    case 'team_member':
      limit = plan.userLimits;
      if (limit !== null) {
        const currentUserCount = await prisma.user.count({ where: { companyId } });
        const pendingInvites = await prisma.invitation.count({ where: { companyId, status: "PENDING" } });
        currentCount = currentUserCount + pendingInvites;
      }
      break;
  }
  
  if (limit === null) return { allowed: true, limit: null };
  
  return {
    allowed: currentCount < limit,
    limit
  };
}

/**
 * Checks if a company has access to a specific feature flag based on their plan.
 */
export async function hasFeatureAccess(companyId: string, flag: FeatureFlag): Promise<boolean> {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: { subscription: { include: { plan: true } } }
  });

  const plan = company?.subscription?.plan;
  if (!plan) return false;
  
  switch (flag) {
    case 'WATERMARK_REMOVAL':
      return plan.name.toLowerCase() !== 'free';
    case 'CUSTOM_DOMAIN':
    case 'ADVANCED_REPORTS':
      return plan.monthlyPrice > 0;
    default:
      return false;
  }
}
