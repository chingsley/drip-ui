import { sizes } from '@/constants/sizes';
import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface RefreshIconProps extends SvgProps {
  isActive?: boolean;
  width?: number;
  height?: number;
}

const RefreshIcon: React.FC<RefreshIconProps> = ({
  isActive = false,
  width = sizes.TAB_ICON_SIZES,
  height = sizes.TAB_ICON_SIZES,
  ...props
}) => {
  const strokeColor = isActive ? '#7929FF' : '#828282';

  return (
    <Svg
      width={width}
      height={height}
      // I adjusted the viewBox to crop out the empty space and center the arrows
      viewBox="29 0 24 24"
      fill="none"
      {...props}
    >
      <Path
        d="M51.2134 12C51.2134 18 46.8234 22 41.4074 22C37.0054 22 33.4534 19.665 32.2134 16M31.2134 12C31.2134 6 35.6034 2 41.0204 2C45.4214 2 48.9714 4.335 50.2134 8"
        stroke={strokeColor}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M36.2134 17L32.2134 16L31.2134 20M46.2134 7L50.2134 8L51.2134 4"
        stroke={strokeColor}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default RefreshIcon;