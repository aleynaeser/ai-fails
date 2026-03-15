export declare global {
  type TIconProps = React.SVGProps<SVGSVGElement>;

  interface ILocaleLayout {
    children: React.ReactNode;
    params: Promise<{ locale: Locale }>;
  }

  type TMotionVariant = {
    [k: string]: VariantType;
  };

  interface IBaseDoc {
    id: string;
    created_at: string;
    updated_at: string;
  }

  export interface IFailCategory {
    id: string;
    name: string;
  }

  export interface IFailItem {
    id: string;
    title: string;
    description: string;
    categories: IFailCategory[];
    author: string;
    date: string;
    url: string;
  }

  declare module '*.svg' {
    import React from 'react';
    const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    export default ReactComponent;
  }
}
