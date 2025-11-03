import { getPatternStyles, patternFns } from '../helpers.mjs';
import { css } from '../css/index.mjs';

const statusCardConfig = {
transform(props) {
  const { status = "info", ...rest } = props;
  const statusStyles = {
    success: { iconBg: "green.100", iconColor: "green.600", textColor: "green.600" },
    error: { iconBg: "red.100", iconColor: "red.600", textColor: "red.600" },
    info: { iconBg: "blue.100", iconColor: "blue.600", textColor: "blue.600" },
    warning: { iconBg: "yellow.100", iconColor: "yellow.600", textColor: "yellow.600" }
  }[status];
  return {
    bg: "bg.card",
    borderRadius: "card",
    shadow: "lg",
    p: "4",
    border: "1px solid token(colors.border.light)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    transition: "all 0.3s ease",
    _hover: {
      shadow: "xl"
    },
    ...rest,
    "& .icon-container": {
      w: "12",
      h: "12",
      bg: statusStyles.iconBg,
      borderRadius: "xl",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: statusStyles.iconColor
    },
    "& .value": {
      fontSize: "3xl",
      fontWeight: "bold",
      color: statusStyles.textColor
    }
  };
},
defaultValues:{status:'info'}}

export const getStatusCardStyle = (styles = {}) => {
  const _styles = getPatternStyles(statusCardConfig, styles)
  return statusCardConfig.transform(_styles, patternFns)
}

export const statusCard = (styles) => css(getStatusCardStyle(styles))
statusCard.raw = getStatusCardStyle