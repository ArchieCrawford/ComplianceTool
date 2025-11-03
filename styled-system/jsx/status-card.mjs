import { createElement, forwardRef } from 'react'

import { splitProps } from '../helpers.mjs';
import { getStatusCardStyle } from '../patterns/status-card.mjs';
import { styled } from './factory.mjs';

export const StatusCard = /* @__PURE__ */ forwardRef(function StatusCard(props, ref) {
  const [patternProps, restProps] = splitProps(props, ["status"])

const styleProps = getStatusCardStyle(patternProps)
const mergedProps = { ref, ...styleProps, ...restProps }

return createElement(styled.div, mergedProps)
  })