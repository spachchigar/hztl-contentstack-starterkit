/* prettier-ignore */
import { BrandBrandX } from './_BrandBrandX';
import { BrandHelloWorld } from './_BrandHelloWorld';
import { BrandNimbusGoods } from './_BrandNimbusGoods';

import { ThemesBrandPrimary } from './_ThemesBrandPrimary';
import { ThemesBrandSecondary } from './_ThemesBrandSecondary';
import { ThemesDark } from './_ThemesDark';
import { ThemesLight } from './_ThemesLight';
import { ThemesWhite } from './_ThemesWhite';

import { GlobalMode1 } from './_GlobalMode1';

export type BrandType = typeof BrandBrandX;
export type ThemeType = typeof ThemesBrandPrimary;
export type GlobalType = typeof GlobalMode1;

export const brandMap = {
  BrandBrandX: BrandBrandX,
  BrandHelloWorld: BrandHelloWorld,
  BrandNimbusGoods: BrandNimbusGoods,
};

export const themeMap = {
  ThemesBrandPrimary: ThemesBrandPrimary,
  ThemesBrandSecondary: ThemesBrandSecondary,
  ThemesDark: ThemesDark,
  ThemesLight: ThemesLight,
  ThemesWhite: ThemesWhite,
};

export const globalMap = {
  GlobalMode1: GlobalMode1,
};
