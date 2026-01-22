import { sizes } from '@/constants/sizes';
import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

interface FavoritesIconProps extends SvgProps {
  isActive?: boolean;
  width?: number;
  height?: number;
}

const FavoritesIcon: React.FC<FavoritesIconProps> = ({
  isActive = false,
  width = sizes.TAB_ICON_SIZES,
  height = sizes.TAB_ICON_SIZES,
  ...props
}) => {
  // Determine the color based on the active state
  const strokeColor = isActive ? '#520FC1' : '#828282';

  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <Path
        d="M10.9998 3.05493C9.31534 3.24319 7.71821 3.90325 6.39229 4.95917C5.06637 6.01508 4.06554 7.42393 3.50499 9.02355C2.94444 10.6232 2.84696 12.3486 3.22376 14.0012C3.60056 15.6538 4.43632 17.1664 5.63487 18.3649C6.83341 19.5635 8.34603 20.3992 9.99861 20.776C11.6512 21.1528 13.3766 21.0553 14.9762 20.4948C16.5759 19.9342 17.9847 18.9334 19.0406 17.6075C20.0965 16.2816 20.7566 14.6844 20.9448 12.9999H10.9998V3.05493Z"
        stroke={strokeColor}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20.488 8.99996H15V3.51196C16.2654 3.96089 17.4147 4.6865 18.3641 5.6359C19.3135 6.5853 20.0391 7.73458 20.488 8.99996Z"
        stroke={strokeColor}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default FavoritesIcon;