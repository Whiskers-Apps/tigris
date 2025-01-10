import type { SelectValue } from "$lib/features/Extensions";
import type { Field, OpenFormAction, SelectField } from "$lib/features/ResultAction";
import { Routes } from "$lib/features/Routes";
import { invoke } from "@tauri-apps/api/core";
import { get, writable } from "svelte/store";

export const state = writable({
  loading: true,
  form: {} as OpenFormAction,
  disableButton: false,
});

export async function load() {
  let newState = get(state);

  newState.loading = false;
  newState.form = await invoke("invoke_get_form");

  state.set(newState);

  validateForm();
}

export function onGoBack() {
  window.location.replace(Routes.SEARCH);
}

export function onSetFieldValue(fieldId: string, value: string) {
  let newState = get(state);
  newState.form.fields = newState.form.fields.map((field) => {
    if (field.id === fieldId) {
      let newField = field;

      if (newField.field_type === "Text") {
        newField.text_field!!.value = value;
        return newField;
      }

      if (newField.field_type === "TextArea") {
        newField.text_area_field!!.value = value;
        return newField;
      }

      if (newField.field_type === "Select") {
        newField.select_field!!.value = value;
        return newField;
      }

      if (newField.field_type === "Switch") {
        newField.switch_field!!.value = value === "true" ? true : false;
        return newField;
      }

      if (newField.field_type === "Slider") {
        newField.slider_field!!.value = +value;
        return newField;
      }

      if (newField.field_type === "FileSystem") {
        newField.file_system_field!!.value = value;
        return newField;
      }
    }

    return field;
  });

  state.set(newState);

  validateForm();
}

function validateForm() {
  let newState = get(state);

  for (const field of newState.form.fields) {
    if (!isValid(field)) {
      newState.disableButton = true;
      state.set(newState);
      return;
    }
  }

  newState.disableButton = false;
  state.set(newState);
}

export function getSelectValue(field: SelectField): SelectValue {
  let value = field.values.find((v) => v.id === field.value)!!;

  return {
    id: value.id,
    text: value.text,
  };
}

export function getSelectValues(field: SelectField): SelectValue[] {
  let values: SelectValue[] = field.values.map((v) => {
    return { id: v.id, text: v.text };
  });

  return values;
}

export async function onWriteForm() {
  await invoke("invoke_complete_form", { form: get(state).form });

  onGoBack();
}

function isValid(field: Field): boolean {
  if (field.field_type === "Text") {
    let validation = field.text_field!!.validation;

    if (validation === null) {
      return true;
    } else {
      let number_ok = validation.only_numbers ? isNumeric(field.text_field!!.value) : true;
      let not_empty_ok = validation.not_empty ? field.text_field!!.value.trim().length > 0 : true;

      return number_ok && not_empty_ok;
    }
  }

  if (field.field_type === "TextArea") {
    let validation = field.text_area_field!!.validation;
    return validation?.not_empty ? field.text_area_field!!.value.trim().length > 0 : true;
  }

  if (field.field_type === "FileSystem") {
    let validation = field.file_system_field!!.validation;
    return validation?.not_empty ? field.file_system_field!!.value.trim().length > 0 : true;
  }

  return true;
}

function isNumeric(value: string) {
  return /^\d+$/.test(value);
}
