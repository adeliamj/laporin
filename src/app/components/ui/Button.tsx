import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary';
  mobileSize: 'xl' | 'lg' | 'md' | 'sm';
  desktopSize: 'xl' | 'lg' | 'md' | 'sm';
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  trailingIconClassName?: string;
  leadingIconClassName?: string;
  text?: string;
  textClassName?: string;
  className?: string;
}

const Button = ({
  className,
  variant,
  mobileSize,
  desktopSize,
  leadingIcon,
  trailingIcon,
  trailingIconClassName,
  leadingIconClassName,
  textClassName,
  text,
  ...props
}: ButtonProps) => {
  const baseClass =
    'flex h-fit w-fit items-center justify-center rounded-xl transition-all duration-500 ease-in-out';

  const variantClass =
    variant === 'primary'
      ? 'border border-blue-80 bg-transparent text-blue-80'
      : 'border-transparent bg-blue-80 text-white';

  const sizeClassMap: Record<string, string> = {
    xl: 'gap-8 px-32 py-16 text-normal-bold',
    lg: 'gap-8 px-32 py-16 text-normal-bold',
    md: 'gap-8 px-32 py-18 text-xs-medium',
    sm: 'gap-4 px-32 py-18 text-xxs-medium',
  };

  const mobileClass = sizeClassMap[mobileSize];
  const desktopClass = `md:${sizeClassMap[desktopSize]}`;

  return (
    <button
      className={`${baseClass} ${variantClass} ${mobileClass} ${desktopClass} ${className || ''}`}
      {...props}
    >
      {leadingIcon && (
        <ButtonIcon
          size={mobileSize}
          desktopSize={desktopSize}
          className={leadingIconClassName}
        >
          {leadingIcon}
        </ButtonIcon>
      )}
      <span className="whitespace-nowrap text-normal-bold">{text && <ButtonText className={textClassName}>{text}</ButtonText>}</span>
      {trailingIcon && (
        <ButtonIcon
          size={mobileSize}
          desktopSize={desktopSize}
          className={trailingIconClassName}
        >
          {trailingIcon}
        </ButtonIcon>
      )}
    </button>
  );
};

export type ButtonTextProps = React.HTMLAttributes<HTMLParagraphElement>;

const ButtonText: React.FC<ButtonTextProps> = ({ className, children }) => (
  <p className={`text-inherit ${className || ''}`}>{children}</p>
);

interface ButtonIconProps extends React.HTMLAttributes<HTMLDivElement> {
  size: 'xl' | 'lg' | 'md' | 'sm';
  desktopSize: 'xl' | 'lg' | 'md' | 'sm';
  className?: string;
}

const ButtonIcon: React.FC<ButtonIconProps> = ({ size, desktopSize, className, ...props }) => {
  const sizeMap: Record<string, string> = {
    xl: 'h-52 w-145',
    lg: 'h-52 w-145',
    md: 'h-16 w-16',
    sm: 'h-12 w-12',
  };

  const mobileSizeClass = sizeMap[size];
  const desktopSizeClass = `md:${sizeMap[desktopSize]}`;

  return (
    <div className={`${mobileSizeClass} ${desktopSizeClass} text-inherit ${className || ''}`} {...props} />
  );
};

export default Button;
