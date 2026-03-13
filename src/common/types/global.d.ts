export declare global {
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
    deleted_at: string | null;
  }
}
