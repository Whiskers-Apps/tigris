use std::{process::Command, thread};

use tigris_rs::features::{
    actions::{
        FieldType::{FileSystem, Select, Slider, Switch, Text, TextArea},
        OpenFormAction,
    },
    api::{get_form, write_extension_request, ExtensionRequest, FormResult},
    extensions::get_extension_dir,
};

#[tauri::command()]
pub fn invoke_get_form() -> OpenFormAction {
    get_form()
}

#[tauri::command()]
pub fn invoke_complete_form(form: OpenFormAction) {
    let results: Vec<FormResult> = form
        .fields
        .iter()
        .map(|field| field.to_owned())
        .map(|field| FormResult {
            id: field.id.to_owned(),
            value: match field.field_type {
                Text => field.text_field.unwrap().value,
                TextArea => field.text_area_field.unwrap().value,
                Select => field.select_field.unwrap().value,
                Switch => field.switch_field.unwrap().value.to_string(),
                Slider => field.slider_field.unwrap().value.to_string(),
                FileSystem => field.file_system_field.unwrap().value,
            },
            args: field.args.to_owned(),
        })
        .map(|result| result.to_owned())
        .collect();

    let request = ExtensionRequest::new_form_results_request(&form.form_id, &results, &form.args);
    write_extension_request(&request);

    thread::spawn(move || {
        Command::new("sh")
            .arg("-c")
            .arg("./extension")
            .current_dir(get_extension_dir(&form.extension_id).unwrap())
            .output()
            .expect("Error running extension");
    });
}
