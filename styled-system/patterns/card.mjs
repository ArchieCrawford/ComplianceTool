import { getPatternStyles, patternFns } from '../helpers.mjs';
import { css } from '../css/index.mjs';

const cardConfig = {
transform(props) {
  const { variant = "default", ...rest } = props;
  return {
    bg: "bg.card",
    borderRadius: "card",
    shadow: variant === "hover" ? "xl" : "lg",
    p: "4",
    border: "1px solid token(colors.border.light)",
    transition: "all 0.3s ease",
    _hover: variant === "hover" ? {
      shadow: "xl",
      transform: "translateY(-2px)"
    } : {},
    ...rest
  };
},
defaultValues:{variant:'default'}}

export const getCardStyle = (styles = {}) => {
  const _styles = getPatternStyles(cardConfig, styles)
  return cardConfig.transform(_styles, patternFns)
}

export const card = (styles) => css(getCardStyle(styles))
card.raw = getCardStyle