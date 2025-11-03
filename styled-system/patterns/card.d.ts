/* eslint-disable */
import type { SystemStyleObject, ConditionalValue } from '../types/index';
import type { Properties } from '../types/csstype';
import type { SystemProperties } from '../types/style-props';
import type { DistributiveOmit } from '../types/system-types';
import type { Tokens } from '../tokens/index';

export interface CardProperties {
   variant?: ConditionalValue<"default" | "hover">
}


interface CardStyles extends CardProperties, DistributiveOmit<SystemStyleObject, keyof CardProperties > {}

interface CardPatternFn {
  (styles?: CardStyles): string
  raw: (styles?: CardStyles) => SystemStyleObject
}

/**
 * Dashboard card component


 */
export declare const card: CardPatternFn;
