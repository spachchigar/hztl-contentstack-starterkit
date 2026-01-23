import { SiteName, Brands } from '@/helpers/Constants/Constant';

export const BRAND_MAPPING = {
  BrandBrandX: ['BrandX'],
  BrandHelloWorld: ['HelloWorld'],
  BrandNimbusGoods: ['Nimbus'],
};

export const getBrandForSiteName = (siteName: SiteName): Brands | undefined => {
  return Object.entries(BRAND_MAPPING).find(([, siteNames]) =>
    siteNames.includes(siteName)
  )?.[0] as Brands | undefined;
};
