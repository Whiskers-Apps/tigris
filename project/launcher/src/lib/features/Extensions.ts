export interface Extension {
  id: string;
  name: string;
  description: string;
  creator_name: String;
  creator_link: String;
  repository_link: String;
  settings: Setting[];
}

export interface Setting {
  id: string;
  name: string;
  description: string;
  value: string;
  setting_type: string;
  min: number | null;
  max: number | null;
  step: number | null;
  select_values: SelectValue[];
  conditional_show: ConditionalShow[];
}

export interface SelectValue {
  id: string;
  text: string;
}

export interface ConditionalShow {
  setting_id: string;
  setting_value: string;
}
