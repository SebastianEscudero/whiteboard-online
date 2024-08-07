import { subscriptionPlans as plans } from "@/lib/subscriptionPlans";

export function getMaxBoards(org: any): number {
  const plan = org.subscriptionPlan;

  const planDetails = plans.find(subscriptionPlan => subscriptionPlan.label === plan);
  
  if (org.subscription) {
    if (new Date(org.subscription.mercadoPagoCurrentPeriodEnd).getTime() < new Date().getTime()) {
      return 1;
    }
  }

  return planDetails ? (planDetails.features.Boards === "Ilimitados" ? Infinity : Number(planDetails.features.Boards)) : 0;
}

export function getMaxCapas(org: any): number {
  const plan = org.subscriptionPlan;

  const planDetails = plans.find(subscriptionPlan => subscriptionPlan.label === plan);
  return planDetails ? (planDetails.features["Capas máximas"] === "Ilimitados" ? Infinity : Number(planDetails.features["Capas máximas"])) : 0;
}

export function getMaxOrganizations(user: any): number {
  let maxOrganizations = 1;
  for (const org of user.organizations) {
    const plan = org.subscriptionPlan;
    const planDetails = plans.find(subscriptionPlan => subscriptionPlan.label === plan);
    let planLimit = 1
    if (org.subscription) {
      if (new Date(org.subscription.mercadoPagoCurrentPeriodEnd).getTime() > new Date().getTime()) {
        planLimit = planDetails ? (planDetails.features["Teams"] === "Ilimitados" ? Infinity : Number(planDetails.features["Teams"])) : 0;
    }}
    maxOrganizations = Math.max(maxOrganizations, planLimit);
  }
  return maxOrganizations;
}

export function getMaxImageSize(org: any): number {
  const plan = org.subscriptionPlan;

  const planDetails = plans.find(subscriptionPlan => subscriptionPlan.label === plan);
  if (planDetails) {
    const imageSizeStr = planDetails.features["Imágenes"];
    const match = imageSizeStr.match(/\d+/); 
    return match ? Number(match[0]) : 0; 
  }
  return 0;
}