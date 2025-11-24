import clsx from 'clsx';
import type { ClassValue } from 'clsx';
import { createTailwindMerge, getDefaultConfig } from 'tailwind-merge';

const customTwMerge = createTailwindMerge(() => {
  const config = getDefaultConfig();

  return {
    ...config,
    classGroups: {
      ...config.classGroups,
      'font-size': [
        {
          text: [
            'heading-1-base',
            'heading-2-base',
            'heading-3-base',
            'heading-1',
            'heading-2',
            'heading-3',
            'display-1',
            'display-2',
            'display-3',
            'xl-bold',
            'xl-medium',
            'xl-regular',
            'lg-bold',
            'lg-medium',
            'lg-regular',
            'md-bold',
            'md-medium',
            'md-regular',
            'sm-bold',
            'sm-medium',
            'sm-regular',
            'xs-bold',
            'xs-medium',
            'xs-regular',
            'xxs-bold',
            'xxs-medium',
            'xxs-regular',
            'heading-1-fluid',
            'heading-2-fluid',
            'heading-3-fluid',
            'display-1-fluid',
            'display-2-fluid',
            'display-3-fluid',
            'xl-bold-fluid',
            'xl-medium-fluid',
            'xl-regular-fluid',
            'lg-bold-fluid',
            'lg-medium-fluid',
            'lg-regular-fluid',
            'md-bold-fluid',
            'md-medium-fluid',
            'md-regular-fluid',
            'sm-bold-fluid',
            'sm-medium-fluid',
            'sm-regular-fluid',
            'xs-bold-fluid',
            'xs-medium-fluid',
            'xs-regular-fluid',
            'xxs-bold-fluid',
            'xxs-medium-fluid',
            'xxs-regular-fluid',
            'big-1-base',
            'big-1',
            'big-1-fluid',
          ],
        },
      ],
    },
  };
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}
