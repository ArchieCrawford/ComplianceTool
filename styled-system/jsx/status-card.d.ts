/* eslint-disable */
import type { FunctionComponent } from 'react'
import type { StatusCardProperties } from '../patterns/status-card';
import type { HTMLStyledProps } from '../types/jsx';
import type { DistributiveOmit } from '../types/system-types';

export interface StatusCardProps extends StatusCardProperties, DistributiveOmit<HTMLStyledProps<'div'>, keyof StatusCardProperties > {}

/**
 * Status card with icon


 */
export declare const StatusCard: FunctionComponent<StatusCardProps>