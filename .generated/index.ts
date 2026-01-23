type BuildTuple<T, N extends number, R extends T[] = []> = R['length'] extends N
  ? R
  : BuildTuple<T, N, [...R, T]>;

type TuplePrefixes<T extends any[]> = T extends [any, ...infer Rest]
  ? T | TuplePrefixes<Rest extends any[] ? Rest : []>
  : [];

type MaxTuple<T, N extends number> = TuplePrefixes<BuildTuple<T, N>>;

export interface IPublishDetails {
  environment: string;
  locale: string;
  time: string;
  user: string;
}

export interface IFile {
  uid: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  content_type: string;
  file_size: string;
  tags: string[];
  filename: string;
  url: string;
  ACL: any[] | object;
  is_dir: boolean;
  parent_uid: string;
  _version: number;
  title: string;
  _metadata?: object;
  description?: string;
  dimension?: {
    height: number;
    width: number;
  };
  publish_details: IPublishDetails;
}

export interface ILink {
  title: string;
  href: string;
}

export interface ITaxonomy {
  taxonomy_uid: string;
  max_terms?: number;
  mandatory: boolean;
  non_localizable: boolean;
}

export type ITaxonomyEntry = ITaxonomy & { term_uid: string };

export interface CSLPAttribute {
  'data-cslp'?: string;
  'data-cslp-parent-field'?: string;
}
export type CSLPFieldMapping = CSLPAttribute | string;

export interface ISystemFields {
  uid?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  _content_type_uid?: string;
  tags?: string[];
  ACL?: any[];
  _version?: number;
  _in_progress?: boolean;
  locale?: string;
  publish_details?: IPublishDetails;
  title?: string;
}

export interface IAlignment {
  _version?: number;
  alignment_options?: ('Left' | 'Center' | 'Right') | null;
  $?: {
    alignment_options?: CSLPFieldMapping;
  };
}

export interface ITheme {
  _version?: number;
  theme_options?:
    | ('ThemesWhite' | 'ThemesLight' | 'ThemesDark' | 'ThemesBrandPrimary' | 'ThemesBrandSecondary')
    | null;
  $?: {
    theme_options?: CSLPFieldMapping;
  };
}

export interface IAccordionItem extends ISystemFields {
  _version?: number;
  title: string;
  content?: string;
  $?: {
    title?: CSLPFieldMapping;
    content?: CSLPFieldMapping;
  };
}

export interface IDictionaryItems extends ISystemFields {
  _version?: number;
  title: string;
  accordion_collapse_all_label?: string;
  accordion_expand_all_label?: string;
  back_to_top_label?: string;
  $?: {
    title?: CSLPFieldMapping;
    accordion_collapse_all_label?: CSLPFieldMapping;
    accordion_expand_all_label?: CSLPFieldMapping;
    back_to_top_label?: CSLPFieldMapping;
  };
}

export interface IRedirectMappings extends ISystemFields {
  _version?: number;
  title: string;
  mappings?: {
    source: string;
    destination: string;
    status?: ('Active' | 'Disabled') | null;
    $?: {
      source?: CSLPFieldMapping;
      destination?: CSLPFieldMapping;
      status?: CSLPFieldMapping;
    };
  }[];
  $?: {
    title?: CSLPFieldMapping;
    mappings?: CSLPFieldMapping;
  };
}

export interface IFields extends ISystemFields {
  input: {
    name: string;
    label?: string;
    placeholder_text?: string;
    validation?: string;
    required: boolean;
    input_type?: ('text' | 'password' | 'number' | 'email' | 'tel' | 'hidden' | 'date') | null;
    value?: string;
    $?: {
      name?: CSLPFieldMapping;
      label?: CSLPFieldMapping;
      placeholder_text?: CSLPFieldMapping;
      validation?: CSLPFieldMapping;
      required?: CSLPFieldMapping;
      input_type?: CSLPFieldMapping;
      value?: CSLPFieldMapping;
    };
  };
  text_area: {
    name: string;
    label?: string;
    palceholder_text?: string;
    required: boolean;
    max_length?: number | null;
    value?: string;
    $?: {
      name?: CSLPFieldMapping;
      label?: CSLPFieldMapping;
      palceholder_text?: CSLPFieldMapping;
      required?: CSLPFieldMapping;
      max_length?: CSLPFieldMapping;
      value?: CSLPFieldMapping;
    };
  };
  dropdown: {
    name: string;
    label?: string;
    placeholder_text?: string;
    required: boolean;
    options_group?: {
      value: string;
      text?: string;
      $?: {
        value?: CSLPFieldMapping;
        text?: CSLPFieldMapping;
      };
    }[];
    $?: {
      name?: CSLPFieldMapping;
      label?: CSLPFieldMapping;
      placeholder_text?: CSLPFieldMapping;
      required?: CSLPFieldMapping;
      options_group?: CSLPFieldMapping;
    };
  };
  radio_checkbox: {
    name: string;
    label?: string;
    type?: ('Radio' | 'Checkbox') | null;
    required: boolean;
    options_group?: {
      item_id: string;
      value: string;
      label?: string;
      checked: boolean;
      $?: {
        item_id?: CSLPFieldMapping;
        value?: CSLPFieldMapping;
        label?: CSLPFieldMapping;
        checked?: CSLPFieldMapping;
      };
    }[];
    $?: {
      name?: CSLPFieldMapping;
      label?: CSLPFieldMapping;
      type?: CSLPFieldMapping;
      required?: CSLPFieldMapping;
      options_group?: CSLPFieldMapping;
    };
  };
  disclaimer: {
    disclaimer_content?: string;
    $?: {
      disclaimer_content?: CSLPFieldMapping;
    };
  };
  submit: {
    submit_type?: ('Redirect' | 'Action') | null;
    redirect_link?: ILink;
    $?: {
      submit_type?: CSLPFieldMapping;
      redirect_link?: CSLPFieldMapping;
    };
  };
  range: {
    name: string;
    label?: string;
    min?: number | null;
    max?: number | null;
    value?: number | null;
    $?: {
      name?: CSLPFieldMapping;
      label?: CSLPFieldMapping;
      min?: CSLPFieldMapping;
      max?: CSLPFieldMapping;
      value?: CSLPFieldMapping;
    };
  };
}

export interface IForm extends ISystemFields {
  _version?: number;
  title: string;
  form_name:
    | 'Contactus'
    | 'Subscribe'
    | 'Leagues'
    | 'Lessons'
    | 'Membership'
    | 'LocationMembership'
    | 'EventsInquiry'
    | 'MembershipPreview'
    | 'EventsSurvey'
    | 'TrialMembership'
    | 'LeadSubmission';
  method?: ('post' | 'get' | 'dialog') | null;
  action?: ILink;
  enable_recaptcha: boolean;
  fields?: IFields[];
  $?: {
    title?: CSLPFieldMapping;
    form_name?: CSLPFieldMapping;
    method?: CSLPFieldMapping;
    action?: CSLPFieldMapping;
    enable_recaptcha?: CSLPFieldMapping;
    fields?: CSLPFieldMapping;
  };
}

export interface IAccordion extends ISystemFields {
  _version?: number;
  title: string;
  component_params?: {
    single_open_panel: boolean;
    open_by_default: boolean;
    scroll_to_open_panel: boolean;
    $?: {
      single_open_panel?: CSLPFieldMapping;
      open_by_default?: CSLPFieldMapping;
      scroll_to_open_panel?: CSLPFieldMapping;
    };
  };
  accordion_items?: IAccordionItem[];
  $?: {
    title?: CSLPFieldMapping;
    component_params?: CSLPFieldMapping;
    accordion_items?: CSLPFieldMapping;
  };
}

export interface IFooter extends ISystemFields {
  _version?: number;
  title: string;
  $?: {
    title?: CSLPFieldMapping;
  };
}

export interface IHeader extends ISystemFields {
  _version?: number;
  title: string;
  $?: {
    title?: CSLPFieldMapping;
  };
}

export interface IComponents extends ISystemFields {
  test_block: {
    block_title?: string;
    block_description?: string;
    $?: {
      block_title?: CSLPFieldMapping;
      block_description?: CSLPFieldMapping;
    };
  };
  accordion: {
    reference?: IAccordion[];
    $?: {
      reference?: CSLPFieldMapping;
    };
  };
  section: {
    title?: string;
    description?: string;
    section_items?: IAccordion[];
    styling_options?: {
      remove_padding_top: boolean;
      remove_padding_bottom: boolean;
      remove_padding_left_right: boolean;
      display_center_75: boolean;
      select_alignment?: IAlignment;
      select_theme?: ITheme;
      $?: {
        remove_padding_top?: CSLPFieldMapping;
        remove_padding_bottom?: CSLPFieldMapping;
        remove_padding_left_right?: CSLPFieldMapping;
        display_center_75?: CSLPFieldMapping;
        select_alignment?: CSLPFieldMapping;
        select_theme?: CSLPFieldMapping;
      };
    };
    $?: {
      title?: CSLPFieldMapping;
      description?: CSLPFieldMapping;
      section_items?: CSLPFieldMapping;
      styling_options?: CSLPFieldMapping;
    };
  };
}

export interface IPage extends ISystemFields {
  _version?: number;
  title: string;
  url?: string;
  components?: IComponents[];
  $?: {
    title?: CSLPFieldMapping;
    url?: CSLPFieldMapping;
    components?: CSLPFieldMapping;
  };
}
