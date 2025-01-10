export interface ResultAction {
  action_type: string;
  require_confirmation: boolean;
  copy_text_action: CopyTextAction | null;
  copy_image_action: CopyImageAction | null;
  open_link_action: OpenLinkAction | null;
  open_app_action: OpenAppAction | null;
  open_form_action: OpenFormAction | null;
  run_extension_action: RunExtensionAction | null;
}

export interface CopyTextAction {
  text: string;
}

export interface CopyImageAction {
  image_path: string;
}

export interface OpenLinkAction {
  link: string;
}

export interface OpenAppAction {
  path: string;
}

export interface OpenFormAction {
  extension_id: string;
  form_id: string;
  args: string[];
  title: string;
  fields: Field[];
  button_text: string;
}

export interface Field {
  field_type: string;
  id: string;
  args: string[];
  title: string;
  description: string;
  text_field: TextField | null;
  text_area_field: TextAreaField | null;
  select_field: SelectField | null;
  switch_field: SwitchField | null;
  slider_field: SliderField | null;
  file_system_field: FileSystemField | null;
}

export interface FieldValidation {
  only_numbers: boolean;
  not_empty: boolean;
  max_characters: number;
}

export interface TextField {
  value: string;
  placeholder: string | null;
  validation: FieldValidation | null;
}

export interface TextAreaField {
  value: string;
  placeholder: string | null;
  validation: FieldValidation | null;
}

export interface SelectField {
  value: string;
  values: SelectFieldValue[];
}

export interface SelectFieldValue {
  id: string;
  text: string;
}

export interface SwitchField {
  value: boolean;
}

export interface SliderField {
  value: number;
  min_value: number;
  max_value: number;
  step: number;
}

export interface FileSystemField {
  value: string;
  pick_directory: boolean;
  filters: string[] | null;
  validation: FieldValidation | null;
}

export interface RunExtensionAction {
  extension_id: string;
  extension_action: string;
  args: string[];
}
