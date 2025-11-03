/* eslint-disable */
import type { SystemStyleObject, ConditionalValue } from '../types/index';
import type { Properties } from '../types/csstype';
import type { SystemProperties } from '../types/style-props';
import type { DistributiveOmit } from '../types/system-types';
import type { Tokens } from '../tokens/index';

export interface StatusCardProperties {
   status?: ConditionalValue<"success" | "error" | "info" | "warning">
}


interface StatusCardStyles extends StatusCardProperties, DistributiveOmit<SystemStyleObject, keyof StatusCardProperties > {}

interface StatusCardPatternFn {
  (styles?: StatusCardStyles): string
  raw: (styles?: StatusCardStyles) => SystemStyleObject
}

/**
 * Status card with icon


 */
export declare const statusCard: StatusCardPatternFn;
